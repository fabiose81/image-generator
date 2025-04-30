import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert';
import { AIService } from '../services/AIService'
import { Audio } from '../utils/Audio'
import ImageGen from './ImageGen'
import AudioGen from './AudioGen'
import './Home.css'

const Home = () => {

    const [showModal, setShowModal] = useState(false);
    const [audioSetup, setupAudioSetup] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [msgAlert, setMsgAlert] = useState('');
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

    const generate = () => {
        if (!validate()) {
            setMsgAlert('Fill prompt or record an audio!')
            return;
        }

        setShowModal(true)
        setMsgAlert('')

        AIService(params())
            .then(result => {
                setImage({
                    src: result.image_url,
                    hidden: false
                })
                if (text.hidden) {
                    audioObj.transcriptionAudio.value = 'Transcription :: '.concat(result.transcription)
                    audioObj.transcriptionAudio.hidden = false;
                }
                setShowModal(false)
            }).catch((error) => {
                setMsgAlert(error);
            });
    }

    const validate = () => {
        if (!text.hidden && prompt.trim().length === 0)
            return false;
      
        if (text.hidden && audioObj.blob === null)
            return false;
  
        return true;
    }

    const params = () => {
        let data;
        let service;
        let contentType;

        if (!text.hidden) {
            data = {
                data: prompt
            };
            service = 'image';
            contentType = 'application/json';
        } else {
            const formData = new FormData();
            const fileName = 'audio_' + Date.now() + '.webm';
            formData.append('file', audioObj.blob, fileName);
            data = formData;
            service = 'audio';
            contentType = 'application/octet-stream';
        }

        return {
            data: data,
            service: service,
            contentType: contentType
        };
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
        setMsgAlert('')
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
                    <Alert variant='danger' hidden={msgAlert.length === 0}>
                        {msgAlert}
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
            <Row className="row">
                <Col className="col">
                    <Image className="rounded img-fluid" src={image.src} hidden={image.hidden} style={{ width: "720px", height: "720px" }} alt="..."></Image>
                </Col>
            </Row>

            <Modal show={showModal} centered>
                <Modal.Body style={{ height: "205px" }}>
                    <div style={{ height: '200px' }}>
                        <div className="loader"></div>
                        <div className="blink" style={{ textAlign: "center", fontFamily: "Verdana" }}>
                            Generating image...
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </Container>
    )
}

export default Home;