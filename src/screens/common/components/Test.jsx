import { useState } from "react";
import { Container, Row, Col, ListGroup, Form, Card, Button } from 'react-bootstrap';
import FooterFE from "../../../components/FooterFE";
import HeaderFE from "../../../components/HeaderFE";
import QRCode from 'react-qr-code';

function Test() {
  const [selectedPackage, setSelectedPackage] = useState(null);

  function handlePackageSelect(packageValue) {
    setSelectedPackage(packageValue);
  }
  const t = (
    <div id="all">
      <div id="content">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6">
              <nav aria-label="breadcrumb">
              </nav>
            </div>
            <div className="col-lg-6">
              <div className="box">
                <h1>Login</h1>
                <hr />
                <form action="customer-orders.html" method="post">
                  <div className="form-group">
                    <label for="name">Name</label>
                    <input id="name" type="text" className="form-control" />
                  </div>
                  <div className="form-group">
                    <label for="password">Password</label>
                    <input id="password" type="password" className="form-control" />
                  </div>
                  <p className="text-muted">Don't have an account ? <a href="register.html">Register here</a></p>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary">
                      <a href="index.html" className="login-button">
                        <i className="fa fa-user-md"></i>Login
                      </a>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  return (
    <>
      {t}
    </>
  );
}

export default Test;