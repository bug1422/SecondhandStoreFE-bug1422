import { Container, Col, Row } from "react-bootstrap";
import Navbar from 'react-bootstrap/Navbar'
import Logo from "../assets/images/logo1.png"

export default function FooterFE() {

    return (
        <Container fluid className="footer">
            <Container>
                <Row>
                    <Col md={4} sm={12}>
                        <div className="footer-left">
                            <a href="/" className="font-weight-bold h1">FPT OSE Service</a>
                            {/* <Navbar.Brand href="/" className='logo-container'><img className="logo-footer" src={Logo} alt='SeconhandStore' /></Navbar.Brand> */}
                            <div className="left-content">

                            </div>
                        </div>
                    </Col>
                    <Col md={4} sm={12}>
                        <div className="footer-middle">
                            <div className="middle-title">Contact</div>
                            <div className="middle-content">
                                <p>
                                    <ion-icon name="location"></ion-icon>Đại học FPT
                                </p>
                                <p>
                                    <ion-icon name="call"></ion-icon>02345346456
                                </p>
                                <p>
                                    <ion-icon name="mail"></ion-icon>abc@fpt.edu.vn
                                </p>
                                <p>
                                    <ion-icon name="rocket"></ion-icon>Made by <span style={{ fontWeight: '700px' }}>Group 1 </span>
                                </p>
                            </div>

                        </div>
                    </Col>
                    <Col md={4} sm={12}>
                        <div className="footer-right">
                            {/* <div className="right-title">Follow us</div> */}
                            <div className="right-content">
                                <p><a href="#gt">Giới thiệu</a></p>
                                <p><a href="#gt">Chính sách quảng cáo</a></p>
                                <p><a href="#gt">Chính sách bảo mật</a></p>
                                <p><a href="#gt">Miễn trừ trách nhiệm</a></p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Container><div className="footer-footer">Copyright @ 2023 <span style={{ fontWeight: '700' }}>Group 1</span></div></Container>
        </Container>
    )
}
