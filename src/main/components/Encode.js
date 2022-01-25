import React, { Component } from 'react'
import { string, file, any } from 'prop-types';
import { Alert, Form, Button, Header, Badge } from 'tabler-react'

class Encode extends Component {
    constructor(props) {
        super(props)
        this.state = {
            button: "Upload",
            navActive: 1,
            message: string,
            picture: file,
            showImage: false,
            callCount: 0,
            binaryMessage: string,
            messageImg: any,
            originalImg: any
        }
    }
    
    getMain = () => {
        const { showImage, binaryMessage, callCount, button } = this.state
        var download = function(){
            var link = document.createElement("a");
            link.download = 'filename.png';
            link.href = document.getElementById('canvas').toDataURL()
            link.click();
          }
        return(
            <div>
                <Alert type="info">
                    This Page allows you to Encode your Message into a Pic, this is a well known method called Stengeography. <br/> Simply enter your message, and select your image (JPG or PNG) and click on the button to Upload and Encode your message.
                </Alert>
                <Form>
                    <Form.Input name='message' label='Message' placeholder='Enter Your Message' onChange={this.handleChange} />
                    <Form.FileInput name='picture' label='Picture - Only JPG and PNG' accept="jpg, png" onChange={this.handleChange} />
                </Form>
                    {callCount>1 ?  
                        <div className="binary">
                            <Header.H5 >Binary Message</Header.H5>
                            <Badge style={{width:"834px"}} color="success">{callCount>2 ? binaryMessage : "Will calculate..."}</Badge>
                        </div>
                            : 
                        <div style={{width:"834px"}} ></div>
                    }
                <Button color="primary" value='Submit' onClick={this.showPicture} disabled={callCount>3}>{button}</Button>
                {/* <Button color="primary" value='Submit' onClick={this.encodeMessage}>Encode</Button> */}
                          
                {
                    showImage ? <div>
                                    <div>
                                        <Header.H3 >Original</Header.H3>
                                        <canvas style={{width:"50%", height:"50%"}} ref="originalC"></canvas>
                                    </div>
                                    <div>
                                        <Header.H3>Message</Header.H3>
                                        <canvas style={{width:"50%", height:"50%"}} id="canvas" ref="messageC"></canvas>
                                        <Button color="primary" value='Submit' onClick={download} > Download </Button>
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
        this.setState({showImage: true}, this.drawOriginalPicture())
        switch (callCount){
            case 0:
                this.setState({button: "Show Image"})
                break
            case 1:
                this.setState({button: "Encode"})
                break
            default: 
                this.setState({button: "Encode"})
        }
    }
    drawOriginalPicture = () => {
        const { picture, callCount } = this.state
        const img = new Image();
        this.setState({callCount: callCount+1})
        const canvas = this.refs.originalC
        img.src = picture
        if(callCount===1){
            const context = canvas.getContext('2d')
            canvas.width = img.width
            canvas.height = img.height
            img.onload = () => {
                context.drawImage(img, 0, 0);
                if(canvas.width > 0){
                    const imageData = context.getImageData(0,0,canvas.width,canvas.height);
                    this.setState({originalImg: imageData})
                }
            }
            this.callEncode()
        }
        if(callCount>1)
            this.callEncode()
    }
    callEncode = canvas =>{
        this.encodeMessage()
    }
    encodeMessage = () => {
        const { messageC } = this.refs
        const { message, originalImg } = this.state
        const messageContext = messageC.getContext("2d");

        const width = originalImg.width
        const height = originalImg.height
        console.log(originalImg)

        messageC.width =  width
        messageC.height = height
        let pixel = originalImg.data;
        if(originalImg.width > 0){
            for (let i = 0, n = pixel.length; i < n; i += 4) {
                for (let offset =0; offset < 3; offset ++) {
                    if(pixel[i + offset] %2 !== 0) {
                        pixel[i + offset]--;
                    }
                }
            }
            console.log(originalImg)
        }
        let binaryMessage = "";


        console.log(message)
        for (let i = 0; i < message.length; i++) {
            let binaryChar = message[i].charCodeAt(0).toString(2);
            console.log(binaryChar)
            while(binaryChar.length < 8) {
            binaryChar = "0" + binaryChar;
            }

            binaryMessage += binaryChar;


        }
        this.setState({binaryMessage: binaryMessage})
        if(originalImg.width > 0){
        const messageImg = originalImg
        pixel = messageImg.data;
        let counter = 0;
        for (var i = 0, n = pixel.length; i < n; i += 4) {
            for (var offset =0; offset < 3; offset ++) {
            if (counter < binaryMessage.length) {
                pixel[i + offset] += parseInt(binaryMessage[counter]);
                counter++;
            }
            else {
                break;
            }
            }
        }
        this.setState({messageImg: messageImg})
        messageContext.putImageData(messageImg, 0, 0)
        }
    }
    
    render() {
        return ( this.getMain() )
    }
}
export default Encode
