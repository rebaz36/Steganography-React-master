import React, { Component } from 'react'
import { string, file, any } from 'prop-types';
import { Alert, Form, Button, Header, Badge, Card } from 'tabler-react'


class Decode extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             decodedMessage: string,
             button: "Upload",
             showImage: false,
             picture: file,
             messageImg: any,
             callCount: 0
        }
    }
    getMain = () => {
        const { decodedMessage, callCount, button, showImage } = this.state
        return(
            <div>
                <Alert type="info">
                    This page allows you to Decode the Image files you have previously Encoded <br/> Simply select and upload your image and let us do the magic
                </Alert>
                <Form>
                    <Form.FileInput name='picture' label='Picture - Only JPG and PNG' accept="jpg, png" onChange={this.handleChange} />
                </Form>
                    {callCount>1 ?  
                        <div className="binary">
                            <Card
                            title="Decoded Message"
                            statusColor="red"
                            className="card-Talker"
                            body={<Badge color="success">{callCount>2 ? decodedMessage : "Will calculate..."}</Badge>}
                            />
                           
                        </div>
                            : 
                        <div></div>
                    }
                <Button color="primary" value='Submit' onClick={this.showPicture} disabled={callCount>2}>{button}</Button>
                {/* <Button color="primary" value='Submit' onClick={this.encodeMessage}>Encode</Button> */}
                          
                {
                    showImage ? <div>
                                    <div>
                                        <Header.H3>Picture</Header.H3>
                                        <canvas style={{width:"888px", height:"auto"}} ref="messageC"></canvas>
                                    </div>
                                </div> : 
                                <div>
                                   
                                </div>
                }
            </div>
        )
    }
    handleChange = e => {
        if(e.target.files)
            this.setState({[e.target.name]: URL.createObjectURL(e.target.files[0])})
        else
            this.setState({[e.target.name]: e.target.value})
    }
    showPicture = () => {
        const { callCount } = this.state
        console.log(this.state)
        this.setState({showImage: true}, this.drawOriginalPicture())
        switch (callCount){
            case 0:
                this.setState({button: "Show Image"})
                break
            case 1:
                this.setState({button: "Decode"})
                break
            default: 
                this.setState({button: "Decode"})
        }
    }
    drawOriginalPicture = () => {
        const { picture, callCount } = this.state
        const img = new Image();
        this.setState({callCount: callCount+1})
        const canvas = this.refs.messageC
        img.src = picture
        if(callCount===1){
            const context = canvas.getContext('2d')
            canvas.width = img.width
            canvas.height = img.height
            img.onload = () => {
                context.drawImage(img, 0, 0);
                if(canvas.width > 0){
                    const imageData = context.getImageData(0,0,canvas.width,canvas.height);
                    this.setState({messageImg: imageData}, this.callDecode(imageData))
                }
            }
        }
    }
    callDecode = messageImg =>{
        this.decodeMessage(messageImg)
    }
    decodeMessage = (messageImg) => {
        const { messageC } = this.refs
        const messageContext = messageC.getContext("2d");
        console.log(messageImg)
        const width = messageImg.width
        const height = messageImg.height

        const original = messageContext.getImageData(0, 0, width, height);
        let binaryMessage = "";
        let pixel = original.data;
        for (let i = 0, n = pixel.length; i < n; i += 4) {
            for (var offset =0; offset < 3; offset ++) {
            let value = 0;
            if(pixel[i + offset] %2 !== 0) {
                value = 1;
            }

            binaryMessage += value;
            }
        }

        let output = "";
        for (let i = 0; i < binaryMessage.length; i += 8) {
            let c = 0;
            for (let j = 0; j < 8; j++) {
            c <<= 1;
            c |= parseInt(binaryMessage[i + j]);
            }
            output += String.fromCharCode(c);
        }
        this.setState({decodedMessage: output.substring(0, output.indexOf('\u0000'))})
    }

    render() {
        return ( this.getMain() )
    }
}
export default Decode
