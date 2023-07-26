import React, { useEffect, useState } from 'react';
import QRCode from "../../../assets/images/transaction.png"
// import QRCode from 'react-qr-code';
import HeaderFE from "../../../components/HeaderFE";
import FooterFE from "../../../components/FooterFE";
import '../styles/style.css'
import { useNavigate } from 'react-router-dom';

export const Topup = () => {
  // const [qrCodeValue, setQRCodeValue] = useState('');
  const navigate = useNavigate()
  return (
    <>
      <HeaderFE />
      <div className='qrpayment pb-4'>
        <div className="container">
          <button onClick={() => { navigate(-1) }} type="button" className=" col-md-1 btn btn-light fw-medium text-uppercase mb-5">
            ←Back
          </button>
          <div className="row">
            <div className="col-md-6">
              <div className="card-custom">
                <div className="card-body overflow-auto">
                  <h5 className="card-title">Topup Instruction</h5>
                  <div className="order-info">
                    <div>
                      <h5 className="font-weight-light">How to add point</h5>
                      <p className='font-weight-bold'>STEP 1:</p>
                      <p className='col-md-12'>Open your Momo app then choose 'scan QR' section.</p>
                      <p className='font-weight-bold'>STEP 2:</p>
                      <p className='col-md-12'>Scan the QR on the left then type in the money you need to transfer.</p>
                      <p className='col-md-12 font-italic'>*NOTE: The amount of money you transfer will be the amount of points you received on this ratio: 1.000 VND = 1 point.</p>
                      <p className='font-weight-bold'>STEP 3:</p>
                      <p className='col-md-12'>Transfer money with the message on this format: <br /> your_student_email </p>
                      <p className='col-md-12'>Ex: thanhnvse171234@fpt.edu.vn</p>
                      <p className='font-weight-bold'>STEP 4:</p>
                      <p className='col-md-12'>Continue your transaction and wait for an admin to confirm your purchase (est: 1 hour)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card-custom">
                <div className="card-body text-center">
                  <h5 className="card-title">Scan QR code to pay</h5>
                  <div className="qr-code">
                    <p><small> Use the MoMo app to scan the QR code</small></p>
                    <img className='w-50' src={QRCode} alt="transaction" />
                  </div>
                </div>
                <div className='col-md-12'>
                  <p>Send <a href='payment-request' className='font-weight-bold text-info'>transaction requests here</a></p>
                  <p>See your <a href='payment-history' className='font-weight-bold text-info'>full payment history here</a></p>
                  <p>For more information, click this link bellow:</p>
                  <p><a className='text-muted topup-link' href='https://momo.vn/chuyen-tien' target='_blank'>How to transfer money on Momo app</a></p>
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterFE />
    </>

  );
}
