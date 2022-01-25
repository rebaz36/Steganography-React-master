import React, { Component } from 'react'
import { Container, Page, Nav, Grid, Card } from 'tabler-react'
import "tabler-react/dist/Tabler.css";
import './MainPage.css'
import Encode from './components/Encode';
import Decode from './components/Decode';
class MainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            navActive: 1
        }
    }
    render() {
        const { navActive } = this.state
        return (
            <Container>
                <Page>
                    <Page.Header
                        title="Steganography - Cryptography Project"
                        subTitle="Created by: Rebaz Farid - Ahmed safaa"
                    />
                    <Nav>
                        <Nav.Item icon="globe" active={navActive===1} onClick={()=>this.setState({navActive: 1})}>Encode</Nav.Item>
                        <Nav.Item icon="map" active={navActive===2} onClick={()=>this.setState({navActive: 2})}>Decode</Nav.Item>
                    </Nav>
                    <Grid.Row cards deck>
                        <Grid.Col md={10} offset={1} className="column">
                            {navActive===1 ? 
                                <Card 
                                title="Encode Message"
                                className="card"
                                body={<Encode/>}
                                />
                                :
                                <Card 
                                title="Decode Message"
                                className="card"
                                body={<Decode/>}
                                />
                        }
                        </Grid.Col>
                    </Grid.Row>
                </Page>
            </Container>
        )
    }
}
export default MainPage
