import { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import './AudioGen.css'

const AudioGen = (props) => {

    const [image, setImage] = useState({
        src: "voice.png",
        recording: false
    });

    const record = () => {
        props.obj.ToggleMic();
        setImage({
            src: !image.recording ? "stop-button.png" :  "voice.png",
            recording: !image.recording
        })  
    }

    return (
        <>
            <Row>
                <Col>
                    <Button className="button" onClick={record}>
                        <Image src={image.src} style={{ width: "48px", height: "48px" }} ></Image>
                    </Button>
                    <Image className="blink" src="botao-rec.png" style={{ width: "41px", height: "41px" }} hidden={!image.recording}></Image>
                </Col>
            </Row>
            <Row>
                <Col>
                    <audio id="audioPlayer" controls hidden={true}></audio>
                </Col>
            </Row>
            <Row>
                <Col>
                <textarea id="transcriptionAudio" className="form-control" aria-label="With textarea"
                    rows={4}
                    cols={40}
                    style={{ resize: "none", fontFamily: "Verdana" }}
                    hidden={true}
                    readOnly={true}></textarea>
                </Col>
            </Row>
        </>
    )
}

export default AudioGen;