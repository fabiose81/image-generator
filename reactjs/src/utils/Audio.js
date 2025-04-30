export class Audio {

    audioPlayer = null;
    transcriptionAudio = null;
    recorder = null;
    blob = null;
    canRecord = false;
    isRecording = false;
    chuncks = [];

    SetupAudio() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                audio: true
            })
                .then((stream) => {
                    this.SetupStream(stream)
                })
                .catch(err => {
                    console.error(err)
                });
        }
    }

    SetupStream(stream) {
        this.audioPlayer = document.getElementById('audioPlayer');
        this.transcriptionAudio = document.getElementById('transcriptionAudio');
        this.recorder = new MediaRecorder(stream);

        this.recorder.ondataavailable = e => {
            this.chuncks.push(e.data);
        }

        this.recorder.onstop = e => {
            this.blob = new Blob(this.chuncks, { type: 'audio/wav' });
            this.chuncks = [];
            const audioURL = window.URL.createObjectURL(this.blob);

            this.audioPlayer.src = audioURL;
            this.audioPlayer.hidden = false;
        }

        this.canRecord = true;
    }

    ToggleMic() {
        if (!this.canRecord)
            return;

        this.isRecording = !this.isRecording;

        if (this.isRecording) {
            this.recorder.start();
            this.ClearAudio();
        } else {
            this.recorder.stop();
        }
    }

    ClearAudio() {
        this.blob = null;
        this.audioPlayer.src = null;
        this.audioPlayer.hidden = true;
        this.transcriptionAudio.hidden = true;
        this.transcriptionAudio.value = '';
    }
}