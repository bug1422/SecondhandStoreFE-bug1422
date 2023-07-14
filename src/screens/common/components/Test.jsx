import { useState } from "react";
import { Container, Row, Col, ListGroup, Form, Card, Button } from 'react-bootstrap';
import FooterFE from "../../../components/FooterFE";
import HeaderFE from "../../../components/HeaderFE";
import QRCode from 'react-qr-code';
import { SocketIO } from "../../../Socket.io";

function PaymentSelection({ onPackageSelect }) {
  const [selectedValue, setSelectedValue] = useState("");

  function handlePointChange(event) {
    setSelectedValue(event.target.value);
  }

  function transferMomo() {
    window.location.replace('https://developers.momo.vn/v3/checkout/')
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
          <a href="https://developers.momo.vn/v3/checkout/">go to Momo</a>
          <Button variant="primary" onClick={transferMomo} disabled={!selectedValue}>Confirm</Button>
        </Card.Body>
      </Card>
    </Col>
  );
}

function Test() {
  const [selectedPackage, setSelectedPackage] = useState(null);

  function handlePackageSelect(packageValue) {
    setSelectedPackage(packageValue);
  }
  return (
    <>
      <ul id="messages"></ul>
      <form id="form" action="">
        <input id="input" autocomplete="off" /><button>Send</button>
      </form>
      <h1>THIS IS TEST PAGE</h1>
      <QRCode value="2|99|0886647866|Nguyen Trung Tin||0|0|0||transfer_myqr|abc" />
      <Container className="py-12 d-flex justify-content-center">
        <Row>
          <PaymentSelection onPackageSelect={handlePackageSelect} />
        </Row>
      </Container>
    </>
  );
}

export default Test;