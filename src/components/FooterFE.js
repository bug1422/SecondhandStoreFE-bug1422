import { Container, Col, Row } from "react-bootstrap";
import Navbar from 'react-bootstrap/Navbar'
import Logo from "../assets/images/logo_transparent.png"

export default function FooterFE() {

    return (
        <Container fluid className="footer">
            <Container>
                <Row>
                    <Col md={4} sm={12}>
                        <div className="footer-left">
                            <Navbar.Brand draggable='false' href="/" className='logo-container'><img draggable='false' className='img-fluid' src={Logo} alt='SecondhandStore' /></Navbar.Brand>
                        </div>
                    </Col>
                    <Col md={4} sm={12}>
                        <div className="footer-middle">
                            <div className="middle-title">Contact</div>
                            <div className="middle-content">
                                <p>
                                    <ion-icon name="call"></ion-icon>0886647866
                                </p>
                                <p>
                                    <ion-icon name="mail"></ion-icon>
                                    fptoseservice@gmail.com
                                </p>
                                <p>
                                    <ion-icon name="rocket"></ion-icon>Made by <span style={{ fontWeight: '700px' }}>Group 6 SE1738 </span>
                                </p>
                            </div>

                        </div>
                    </Col>
                    <Col md={4} sm={12}>
                        <div className="footer-right">
                            {/* <div className="right-title">Follow us</div> */}
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container><div className="footer-footer">Copyright @ 2023 <span style={{ fontWeight: '700' }}>Group 6 SE1738</span></div></Container>
        </Container>
    )
}
