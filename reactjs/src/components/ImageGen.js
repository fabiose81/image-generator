const ImageGen = (props) => {
    return (
        <>
            <div className="input-group">
                <span className="input-group-text">Transcription</span>
                <textarea className="form-control" aria-label="With textarea"
                    value={props.val}
                    onChange={e => props.func(e.target.value)}
                    rows={10}
                    cols={40}
                    style={{ resize: "none", fontFamily: "Verdana" }}></textarea>
            </div>
        </>
    )
}

export default ImageGen;