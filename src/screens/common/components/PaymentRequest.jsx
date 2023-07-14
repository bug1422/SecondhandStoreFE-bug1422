import { useEffect, useState } from "react";
import { Container, Row, Col, ListGroup, Form, Card, Button } from 'react-bootstrap';
import FooterFE from "../../../components/FooterFE";
import HeaderFE from "../../../components/HeaderFE";
import QRCode from 'react-qr-code'
import axios from "axios";
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom'

const styles = {
  qr: {
    width: "142px",
    height: "142px",
    background: "#555",
  }
}

function PaymentSelection({ onPackageSelect }) {
  const [selectedValue, setSelectedValue] = useState("");
  function handlePointChange(event) {
    setSelectedValue(event.target.value);
  }

  function handlePackageSelect() {
    onPackageSelect(selectedValue);
  }

  return (
    <Col md={15}>
      <Card>
        <Card.Body>
          <h4>Choose Your Package</h4>
          <ListGroup>
            <ListGroup.Item>
              <Form.Check
                type="radio"
                name="pointRadio"
                id="pointRadio1"
                value="10"
                label="10,000 VND - Point × 10"
                onChange={handlePointChange}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Check
                type="radio"
                name="pointRadio"
                id="pointRadio2"
                value="20"
                label="20,000 VND - Point × 20"
                onChange={handlePointChange}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Check
                type="radio"
                name="pointRadio"
                id="pointRadio3"
                value="50"
                label="50,000 VND - Point × 50"
                onChange={handlePointChange}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Check
                type="radio"
                name="pointRadio"
                id="pointRadio4"
                value="100"
                label="100,000 VND - Point × 100"
                onChange={handlePointChange}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Check
                type="radio"
                name="pointRadio"
                id="pointRadio5"
                value="200"
                label="200,000 VND - Point × 200"
                onChange={handlePointChange}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Check
                type="radio"
                name="pointRadio"
                id="pointRadio6"
                value="500"
                label="500,000 VND - Point × 500"
                onChange={handlePointChange}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Check
                type="radio"
                name="pointRadio"
                id="pointRadio7"
                value="1000"
                label="1,000,000 VND - Point × 1000"
                onChange={handlePointChange}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Check
                type="radio"
                name="pointRadio"
                id="pointRadio8"
                value="2000"
                label="2,000,000 VND - Point × 2000"
                onChange={handlePointChange}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Check
                type="radio"
                name="pointRadio"
                id="pointRadio9"
                value="5000"
                label="5,000,000 VND - Point × 5000"
                onChange={handlePointChange}
              />
            </ListGroup.Item>
            <ListGroup.Item>
              <Form.Check
                type="radio"
                name="pointRadio"
                id="pointRadio10"
                value="10000"
                label="10,000,000 VND - Point × 10,000"
                onChange={handlePointChange}
              />
            </ListGroup.Item>
          </ListGroup>
          <Button variant="primary" onClick={handlePackageSelect} disabled={!selectedValue}>Confirm</Button>

        </Card.Body>
      </Card>
    </Col>
  );
}

function TransactionDetails({ selectedPackage }) {
  axios.defaults.baseURL = "https://localhost:7115"
  const cookies = new Cookies()
  const navigate = useNavigate()
  let VND = new Intl.NumberFormat('vn-VN', {
    style: 'currency',
    currency: 'VND',
  });
  const sendRequest = async () => {
    await axios.get("/topup/send-topup-order")
    .then((data)=>{alert("You have sent a request!")})
    .catch((e)=>{console.log(e)})
  }
  useEffect(() => {
    let cookie = cookies.get('jwt_authorization')
    if (cookie !== undefined) {
      axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie
    }
    else navigate('/auth/login', { replace: true })
  }, [])


  useEffect(() => { setIsConfirmed(false) }, [selectedPackage])
  const [isConfirmed, setIsConfirmed] = useState()
  return (
    <Col md={7}>
      <Card>
        <Card.Body>
          <div className="col-md-12">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">Your package is {VND.format(selectedPackage * 1000)}</h5>
                <div className="qr-code">
                  <p><small> Use the MoMo app to scan the QR code below.</small></p>
                  {/* <QRCode value={qrCodeValue} /> */}
                  {isConfirmed ?
                    <QRCode value={"2|99|0886647866|Nguyen Trung Tin||0|0|" + selectedPackage * 1000 + "||transfer_myqr|adf"} /> :
                    <>
                      <div className="col-md-12">
                        <div className="self-align-center" style={styles.qr} onClick={() => {
                          if (window.confirm("Are you sure to create a topup request?")) {
                            setIsConfirmed(true)
                            sendRequest()
                          }
                        }}>Click here to unlock QR code</div>
                      </div>
                    </>
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="card">
              <div className="card-body overflow-auto">
                <h5 className="card-title">Topup Instruction</h5>
                <div className="order-info">
                  <div>
                    <h5 className="font-weight-light">How to add point</h5>
                    <p className='font-weight-bold'>STEP 1:</p>
                    <p className='col-md-12'>Open Momo app and scan the QR code above.</p>
                    <p className='font-weight-bold'>STEP 2:</p>
                    <p className='col-md-12'>Finish your transaction and wait for an admin to confirm your purchase (est: 1 hour)</p>
                    <p className='col-md-12 font-italic'>*NOTE: Check if the payment is right. We are not responsible for any liability.</p>
                    <p>For more information, click this link bellow:</p>
                    <a href='https://momo.vn/huong-dan/huong-dan-thanh-toan-bang-hinh-thuc-quet-ma#article-guide' target="_blank">How to transfer money on Momo app</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
}

function PaymentRequest() {
  const [selectedPackage, setSelectedPackage] = useState(null);

  function handlePackageSelect(packageValue) {
    setSelectedPackage(packageValue);
  }

  return (
    <>
      <HeaderFE />
      <Container className="py-12 d-flex justify-content-center">
        <Row>
          <PaymentSelection onPackageSelect={handlePackageSelect} />
          {selectedPackage && <TransactionDetails selectedPackage={selectedPackage} />}
        </Row>
      </Container>
      <FooterFE />
    </>
  );
}

export default PaymentRequest;