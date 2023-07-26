import { useEffect, useState } from "react";
import { Container, Row, Col, ListGroup, Form, Card, Button } from 'react-bootstrap';
import FooterFE from "../../../components/FooterFE";
import HeaderFE from "../../../components/HeaderFE";
import axios from "axios";
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom'
import '../styles/style.css'
import { Divider } from "@mui/material";
import QRCode from "../../../assets/images/transaction.png";
import cn from 'classnames'

export const PaymentRequest = () => {
  axios.defaults.baseURL = "https://localhost:7115"
  const cookies = new Cookies()
  const navigate = useNavigate()
  const [point, setPoint] = useState(0)
  const [pay, setPay] = useState(0)
  const [pending, setPending] = useState([])
  const [filtered, setFiltered] = useState([])
  const [selected, setSelected] = useState([])
  const [result, setResult] = useState('')
  const [resultCancel, setResultCancel] = useState('')
  let VND = new Intl.NumberFormat('vn-VN', {
    currency: 'VND',
  });
  const sendRequest = async (point) => {
    await axios.post("/topup/send-topup-order", {
      "topUpPoint": point
    })
      .then((data) => {
        getPending()
        setResult("Request Sent!")
      })
      .catch((e) => {
        setResult('Something went wrong')
        console.log(e)
      })
  }
  const cancelRequest = async (topUpId) => {
    const response = await axios({
      url: '/topup/cancel-topup',
      params: { id: topUpId },
      method: 'put'
    }).catch((e) => {
      setResultCancel('Something went wrong!')
      console.log(e)
    })
    if (resultCancel === '') {
      setResultCancel('Cancel successfully!')
      getPending()
    }
  }
  const getPending = async () => {
    await axios.get('/topup/user-history-transaction')
      .then((data) => {
        const list = data.data.slice(0).reverse().filter((item) => {
          return item.topUpStatus.includes("Pending")
        })
        console.log(list)
        setPay(list.reduce((a, v) => a = a + v.topUpPoint, 0))
        setPending(list)
        setFiltered(list)
        setSelected([])
      })

  }
  useEffect(() => {
    let cookie = cookies.get('jwt_authorization')
    if (cookie !== undefined) {
      axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie
      getPending()
    }
    else navigate('/auth/login', { replace: true })
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    setResult('')
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    if (point == 0 || point == '') {
      setResult('No point to add')
    }
    else {
      sendRequest(data['point'])
    }
  }

  const requestBoard = (
    <div className="request-board topup-custom">
      <div className="card-custom topup-board-l">
        <Card.Body>
          <h4 className="teal">Topup Request (max: 10.000 points/request)</h4>
          <Divider />
          <form className="row" onSubmit={(e) => onSubmit(e)}>
            <div className="form-group col-md-12 mb-3 form-check">
              <div className="row">
                <div className="form-group col-md-6 mb-3 form-check flex items-center">
                  <label for="point">Point to add*</label>
                  <input id="point" onChange={(e) => {
                    setResult('')
                    setPoint(e.target.value <= 10000 ? e.target.value : 10000)
                  }} name="point" placeholder="1 point equals 1.000 VND" type="number" min='0' value={Number(point).toString()} onWheel={() => document.activeElement.blur()} className="form-control" />
                </div>
                <div className="col-md-auto equal-sign items-center d-flex align-items-center">=</div>
                <div className="form-group col-md-auto mb-3 form-check flex items-center">
                  <p>Money to pay:</p>
                  <p>{VND.format(point * 1000).replaceAll(',', '.')} VND</p>
                </div>
              </div>
            </div>
            <div className="form-group col-md-12 mb-3 form-check align-self-end flex items-center ">
              <div className="row">
                <div className="col-md-6">
                  <strong className={cn(result.toLocaleLowerCase().includes('sent') ? 'text-success' : "text-danger")}>{result}</strong>
                </div>
                <div className="col-md-6 text-right">
                  <button type="submit" className="btn btn-success topup-btn">Add request</button>
                </div>
              </div>
            </div>
          </form>
        </Card.Body>
      </div>
    </div>
  )

  const onSubmitDate = (e) => {
    e.preventDefault()
    setSelected([])
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    console.log(data['date'])
    if (data['date'] !== '') {
      var updatedList = [...pending]
      updatedList = updatedList.filter((item) => {
        return new Date(item.topUpDate).getTime() > new Date(data['date']).getTime()
      })
      setFiltered(updatedList)
    }
    else setFiltered(pending)
  }

  const pendingList = (
    <div className="request-board topup-custom">
      <div className="card-custom topup-board-r">
        <Card.Body>
          <h4 className="teal">Pending Request</h4>
          <Divider />
          <form id="myForm" onSubmit={(e) => onSubmitDate(e)}>
            <div class="form-row align-items-center">
              <div class="input-group col-6">
                <input type="date" name='date' class="form-control" id="inlineFormInputGroupUsername" />
              </div>
              <div class="col-auto my-1">
                <button onClick={() => {
                  document.getElementById("myForm").reset()
                  setFiltered(pending)
                  setSelected([])
                }} style={{ marginTop: '1%' }} type="button" class="btn btn-primary">Clear
                </button>
                <button style={{ marginTop: '1%' }} type="submit" class="btn btn-primary">Search</button>
              </div>
            </div>
          </form>
          {filtered.length === 0 ? <strong>You have no pending request</strong> :
            <div className="pending-table">
              <table className="table custom-table ">
                <thead className="pending-table-head">
                  <tr className=''>
                    <th scope="col">#</th>
                    <th scope="col">Point</th>
                    <th scope="col">Price</th>
                    <th scope="col">Created Date</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody className="pending-table-body">
                  {filtered.map((item, index) => (
                    <tr className="pending-table-row" onClick={() => {
                      setResultCancel('')
                      setSelected(filtered[index])
                    }}>
                      <th>{index}</th>
                      <th>{item.topUpPoint}</th>
                      <th>{VND.format(item.price).replaceAll(',', '.')} VND</th>
                      <th>{String(item.topUpDate).substring(0, 10)}</th>
                      <th>{item.topUpStatus}</th>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
          <div className="row">
            <div className="col-md-4">
              <img className="topup-img" src={QRCode}></img>
            </div>
            <div className="col-md-auto">
              <p>See your full payment history <a href='payment-history' className='font-weight-bold text-info'>here</a></p>
              <p>Don't know how to add point? <a href='topup' className='font-weight-bold text-info'>click here</a></p>
            </div>
          </div>
        </Card.Body>
      </div>
    </div>
  )

  const pendingProfile = (
    <div className="">
      <div className="card-custom select-pending">
        <Card.Body>
          <h4 className="teal">Pending Point</h4>
          <Divider />
          {pay === 0 ? <div>No current transaction</div> : <div className="row">
            <div className="col-md-6 text-left"><h5 className="text-dark"><strong>Total point awaiting: {pay}</strong></h5></div>
            <div className="col-md-6 text-right"><h5 className="text-dark"><strong>Pending fee: {VND.format(pay).replaceAll(',', '.')} VND</strong></h5></div>
          </div>}
          <br />
          <div className={cn(resultCancel.includes('Something') ? 'text-danger' : 'text-success')}>
            {resultCancel}
          </div>
          {selected.length !== 0 &&
            <>
              <Divider />
              <div className="row d-flex align-items-center my-3">
                <div className="col-md">
                  Point: {selected.topUpPoint}
                </div>
                <div className="col-md">
                  Price: {selected.price}
                </div>
                <div className="col-md">
                  <div onClick={() => { cancelRequest(selected.orderId) }} className="btn btn-info no-btn">Cancel this request</div>
                </div>
              </div>
            </>}
        </Card.Body>
      </div>
    </div>
  )

  return (
    <>
      <HeaderFE />
      <div className="d-flex justify-content-center padding-40">

        <div className="col-md-5 topup">
          {requestBoard}
          {pendingProfile}
        </div>
        <div className="col-md-7">
          {pendingList}
        </div>
      </div>
      <FooterFE />
    </>
  );
}