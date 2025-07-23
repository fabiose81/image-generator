import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert';
import { generateImageByAudio, generateImageByText, s3 } from '../services/Request'
import { Audio } from '../utils/Audio'
import ImageGen from './ImageGen'
import AudioGen from './AudioGen'
import '../dist/style.css'

const Home = () => {

    const [showModal, setShowModal] = useState(false);
    const [msgModal, setMsgModal] = useState('');
    const [audioSetup, setupAudioSetup] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [msgAlert, setMsgAlert] = useState({
        label: '',
        status: ''
    });
    const [audioObj] = useState(new Audio());

    const [image, setImage] = useState({
        src: null,
        hidden: true
    });
    const [text, setText] = useState({
        checked: true,
        hidden: false
    });
    const [voice, setVoice] = useState({
        checked: false,
        hidden: true
    });

    const changeAlertState = (status, label) => {
        return {
            status: status,
            label: label
        }
    }

    const uploadToS3 = () => {
        setMsgModal('Uploading image to S3...')
        setShowModal(true)
       
        const date = Date.now();
        const name = !text.hidden ? 'image_by_text_' + date + '.jpg' : 'image_by_audio_' + date + '.jpg'
        const payload = {
            name: name,
            data: image.src
        }

        s3(payload)
            .then(() => {
                setMsgAlert(() => changeAlertState('success', 'Image uploaded to S3'));
            })
            .catch((error) => {
                setMsgAlert(() => changeAlertState('danger', error));
            })
            .finally(() => {
                setShowModal(false);
            })
    }

    const generate = () => {
        if (!validate()) {
            setMsgAlert(() => changeAlertState('warning', 'Fill prompt or record an audio!'));
            return;
        }

        setMsgModal('Generating image...')
        setShowModal(true)

        if (!text.hidden) {
            generateImageByText({ data: prompt })
                .then(result => {
                    setImage({
                        src: result.image_url,
                        hidden: false
                    })
                })
                .catch((error) => {
                    setMsgAlert(() => changeAlertState('danger', error));
                })
                .finally(() => {
                    setShowModal(false);
                })
        } else {
            const formData = new FormData();
            const fileName = 'audio_' + Date.now() + '.webm';
            formData.append('file', audioObj.blob, fileName);

            generateImageByAudio(formData)
                .then(result => {
                    setImage({
                        src: result.image_url,
                        hidden: false
                    })
                    audioObj.transcriptionAudio.value = 'Transcription :: '.concat(result.transcription)
                    audioObj.transcriptionAudio.hidden = false;
                })
                .catch((error) => {
                    setMsgAlert(() => changeAlertState('danger', error));
                })
                .finally(() => {
                    setShowModal(false);
                })
        }
    }

    const validate = () => {
        if (!text.hidden && prompt.trim().length === 0)
            return false;

        if (text.hidden && audioObj.blob === null)
            return false;

        return true;
    }

    const clear = () => {
        if (!text.hidden) {
            setPrompt('');
        } else {
            audioObj.ClearAudio();
        }
        setImage({
            src: null,
            hidden: true
        })
        setMsgAlert(() => changeAlertState('', ''));
    }

    return (
        <Container className="body">
            <Row className="row">
                <Col className="col">
                    <div className="btn-group btn-group-body" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" className="btn-check" id="btnradioText" autoComplete="off" checked={text.checked} onChange={
                            () => {
                                setText({ hidden: false, checked: true })
                                setVoice({ hidden: true, checked: false })
                            }} />

                        <label className="btn btn-outline-primary" style={{ fontFamily: "Verdana" }} htmlFor="btnradioText">By Text</label>

                        <input type="radio" className="btn-check" id="btnradioVoice" autoComplete="off" checked={voice.checked} onChange={
                            () => {
                                setVoice({ hidden: false, checked: true })
                                setText({ hidden: true, checked: false })
                                if (!audioSetup) {
                                    setupAudioSetup(true);
                                    audioObj.SetupAudio();
                                }
                            }} />

                        <label className="btn btn-outline-primary" style={{ fontFamily: "Verdana" }} htmlFor="btnradioVoice">By Voice</label>
                    </div>
                </Col>
            </Row>

            <Row className="row">
                <Col className="col">
                    <Alert variant={msgAlert.status} hidden={msgAlert.label.length === 0}>
                        {msgAlert.label}
                    </Alert>
                </Col>
            </Row>
            <Row className="row">
                <Col className="col">
                    <div style={{ width: "1024px", height: "250px" }} hidden={text.hidden}>
                        <ImageGen func={setPrompt} val={prompt} />
                    </div>

                    <div style={{ height: "250px" }} hidden={voice.hidden}>
                        <AudioGen obj={audioObj} />
                    </div>
                </Col>
            </Row>

            <Row className="row">
                <Col className="col">
                    <Button className="btn-primary btn" style={{ width: "250px", fontFamily: "Verdana" }} onClick={clear}>Clear</Button>
                </Col>
                <Col className="col">
                    <Button className="btn-primary btn" style={{ width: "250px", fontFamily: "Verdana" }} onClick={generate}>Generate</Button><br />
                </Col>
            </Row>
            <Row>
                <Col className="col">
                    <Button className="btn-primary btn" style={{ width: "250px", fontFamily: "Verdana" }} hidden={image.hidden} onClick={uploadToS3}>Save in bucket S3</Button>
                </Col>
            </Row>
            <Row className="row">
                <Col className="col">
                    <Image className="rounded img-fluid" src={image.src} hidden={image.hidden} style={{ width: "720px", height: "720px" }} alt="..."></Image>
                </Col>
            </Row> 

            <Modal show={showModal} centered>
                <Modal.Body style={{ height: "205px" }}>
                    <div style={{ height: '200px' }}>
                        <div className="loader"></div>
                        <div className="blink-text" style={{ textAlign: "center", fontFamily: "Verdana" }}>
                            {msgModal}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </Container>
    )
}

export default Home;