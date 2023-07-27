import React, { useEffect, useState } from 'react';
import HeaderFE from "../../../components/HeaderFE";
import FooterFE from "../../../components/FooterFE";
import Cookies from 'universal-cookie'
import axios from "axios"
import jwt from 'jwt-decode'
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, List, ListItem } from '@mui/material';
import cn from 'classnames'
import { toLowerCaseNonAccentVietnamese } from '../../nonAccentVietnamese.js'
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner';

export const Order = () => {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [all, setAll] = useState([])
  const [pending, setPending] = useState([])
  const [processing, setProcessing] = useState([])
  const [cancelled, setCancelled] = useState([])
  const [completed, setCompleted] = useState([])
  const [filteredList, setFilteredList] = useState([])
  const [selected, setSelected] = useState('')
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('All');
  const [choice, setChoice] = useState('');
  const [isLoading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  let VND = new Intl.NumberFormat('vn-VN', {
    currency: 'VND',
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleChoice = () => {
    setLoading(true)
    let urlParam = ''
    switch (choice) {
      case 'Accept':
        urlParam = "/seller-accept-request"
        break
      case 'Cancel':
        urlParam = "/seller-cancel-exchange"
        break
      case 'Complete':
        urlParam = "/confirm-finished"
        break
    }
    console.log(selected)
    const response = axios({
      url: urlParam,
      params: { orderId: selected },
      method: 'put'
    }).then((data) => {
      setResult(data.data)
    }).catch((e) => {
      setResult("Something went wrong, please try again later!")
      console.log(e)
    })
    setLoading(false)
    setTimeout(() => {
      if (result.indexOf('Something') === -1) window.location.reload()
      else {
        setTimeout(() => {
          setResult('')
        }, 2000)
      }
    }, 4000)
  };

  const handleClose = () => {
    setOpen(false);
  };


  const fetchData = async () => {
    await axios.get('/get-all-order-list')
      .then((data) => {
        if (data.data.length > 0) {
          const list = data.data.slice(0).reverse()
          setAll(list)
          setPending(list.filter((item) => { return item.orderStatusName === 'Pending' }))
          setProcessing(list.filter((item) => { return item.orderStatusName === 'Processing' }))
          setCancelled(list.filter((item) => { return item.orderStatusName === 'Cancelled' }))
          setCompleted(list.filter((item) => { return item.orderStatusName === 'Completed' }))
          setFilteredList(list)
        }
      })
      .catch(e => console.log(e))
  }

  useEffect(() => {
    let cookie = cookies.get('jwt_authorization')
    if (cookie !== undefined) {
      axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie;
      fetchData()
    }
    else {
      navigate('/auth/login', { replace: true })
    }
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    console.log(data)
    var updatedList
    switch (status) {
      case 'All':
        updatedList = [...all]
        break
      case 'Pending':
        updatedList = [...pending]
        break
      case 'Processing':
        updatedList = [...processing]
        break
      case 'Cancelled':
        updatedList = [...cancelled]
        break
      case 'Completed':
        updatedList = [...completed]
        break
    }
    if (data['keyword'] !== '') {
      updatedList = updatedList.filter((item) => {
        let pName = toLowerCaseNonAccentVietnamese(item.productName)
        let aName = toLowerCaseNonAccentVietnamese(item.buyerName)
        let query = toLowerCaseNonAccentVietnamese(data['keyword'])
        return pName.indexOf((query || '')) !== -1 || aName.indexOf((query || '')) !== -1
      });
    }
    if (data['date'] !== '') {
      updatedList = updatedList.filter((item) => {
        return new Date(item.orderDate).getTime() > new Date(data['date']).getTime()
      })
    }
    setFilteredList(updatedList)
  }

  const dialog = (
    <>
      <Dialog onClose={() => {
        handleClose()
      }} open={open}>
        <div className='row dialog'>
          <List>
            {isLoading ? <LoadingSpinner /> :
              result === '' ?
                <>
                  <DialogTitle>Do you want to cancel the request for <strong className='h3'>{selected.productName}</strong>?</DialogTitle>
                  <ListItem>
                    {choice === 'Complete' ?
                      <p className='col-md-12 dialog-p'>Once you have completed this request,
                        the requested post will be marked as 'completed'
                        and sold to the buyer
                      </p>
                      :
                      choice === 'Accept' ?
                        <p className='col-md-12 dialog-p'>Once you have accept this request,
                          this request will be marked as 'Processing' and all other request related to the product will be marked as 'Cancelled'
                          and your post will be hidden.
                        </p>
                        :
                        <p className='col-md-12 dialog-p'>Once you have cancel this request,
                          this request will be marked as 'Cancelled' and
                          the requested user won't be able to request this product anymore
                        </p>
                    }
                  </ListItem>
                  <ListItem>
                    <div className='col-md-12'>
                      <button className='btn btn-info col-md-3 yes-btn' onClick={() => { handleChoice() }}>Yes</button>
                      <button className='btn btn-info col-md-3 no-btn' onClick={() => { handleClose() }}>No</button>
                    </div>
                  </ListItem>
                </> :
                <div style={{ width: '250px', height: '150px' }}>
                  <DialogTitle style={{ height: '80%' }} className='col-12'>
                    <div className={cn(result.indexOf("Something") === -1 ? "text-success" : "text-danger")}>{result}</div>
                  </DialogTitle>
                  <button style={{ width: '100px' }} onClick={() => {
                    handleClose()
                  }} className='col-4 btn-black py-1'>Back</button>
                </div>
            }
          </List>
        </div>
      </Dialog>
    </>
  )
  return (
    <>
      <HeaderFE />
      <div className=''>
        {dialog}
        <div className="exchange-order-container" style={{ padding: '10px' }}>
          <section className="bg0 p-t-75 p-b-120" style={{ height: '600px', padding: '0 20%' }}>
            <h3 class="mb-12 Account_box__yr82T p-6 text-black-600 text-18 mb-12">
              <strong>
                People Order
              </strong>
              <h6>*People order sent to you!</h6></h3>
            <div class="mb-12 px-8 py-12 bg-white">
              <nav>
                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                  <button onClick={() => {
                    setFilteredList(all)
                    setStatus('All')
                  }} class={cn("nav-link ", status == 'All' && 'active')} id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="">All Request ({all.length})</button>
                  <button onClick={() => {
                    setFilteredList(pending)
                    setStatus('Pending')
                  }} class={cn("nav-link ", status == 'Pending' && 'active')} id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="">Pending Request ({pending.length})</button>
                  <button onClick={() => {
                    setFilteredList(processing)
                    setStatus('Processing')
                  }} class={cn("nav-link ", status == 'Processing' && 'active')} id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected=''>Processing Request ({processing.length})</button>
                  <button onClick={() => {
                    setFilteredList(cancelled)
                    setStatus('Cancelled')
                  }} class={cn("nav-link ", status == 'Cancelled' && 'active')} id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected=''>Cancelled Request ({cancelled.length})</button>
                  <button onClick={() => {
                    setFilteredList(completed)
                    setStatus('Completed')
                  }} class={cn("nav-link ", status == 'Completed' && 'active')} id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected=''>Completed Request ({completed.length})</button>
                  <div></div>
                </div>
              </nav>
              <form id="myForm" onSubmit={(e) => onSubmit(e)}>
                <div class="form-row align-items-center">
                  <div class="col-sm-3 my-1">
                    <input type="text" name='keyword' class="form-control" id="inlineFormInputName" placeholder="Enter product name here" />
                  </div>
                  <div class="col-sm-3 my-1">
                    <div class="input-group">
                      <input type="date" name='date' class="form-control" id="inlineFormInputGroupUsername" />
                    </div>
                  </div>
                  <div class="col-auto my-1">
                    <button onClick={() => {
                      document.getElementById("myForm").reset()
                      switch (status) {
                        case 'All':
                          setFilteredList(all)
                          break
                        case 'Pending':
                          setFilteredList(pending)
                          break
                        case 'Processing':
                          setFilteredList(processing)
                          break
                        case 'Cancelled':
                          setFilteredList(cancelled)
                          break
                        case 'Completed':
                          setFilteredList(completed)
                          break
                      }
                    }} style={{ marginTop: '1%' }} type="button" class="btn btn-primary">Clear
                    </button>
                    <button style={{ marginTop: '1%' }} type="submit" class="btn btn-primary">Search</button>
                  </div>
                </div>
              </form>
              {filteredList.length > 0 ?
                <div className='list-box'>
                  <table className="table custom-table">
                    <thead>
                      <tr className='mb-1'>
                        <th scope="col">Post</th>
                        <th scope="col">Buyer Contact</th>
                        <th scope="col">Created Date</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        filteredList.map((order, index) => (
                          <>
                            <tr>
                              <td className='text-left' style={{ width: '180px' }}>
                                <div>
                                  <div>{order.productName}</div>
                                  <div>{VND.format(order.price).replaceAll(',', '.')} VND</div>
                                  <button style={{ width: '120px', height: '40px' }} onClick={() => { navigate('/post-detail?id=' + order.postId) }} className='btn btn-info'>View Post</button>
                                </div>
                              </td>
                              <td className='text-left' style={{ width: '180px' }}>
                                <div>{order.buyerName}</div>
                                <div className='h5'>
                                  <div className='py-1'>{order.buyerPhoneNumber}</div>
                                  <div className='py-1'>{order.buyerEmail}</div>
                                  <div className='py-1'>{order.buyerAddress}</div>
                                </div>
                                <button style={{ width: '120px', height: '40px' }} onClick={() => { navigate('/user-detail?id=' + order.buyerId) }} className='btn btn-info'>View Profile</button>
                              </td>
                              <td>{String(order.orderDate).substring(0, 10)}</td>
                              <td className='mx-2'>
                                <div className='col-12'><strong style={{ fontSize: "32px" }}>{(order.orderStatusName === 'Pending' || order.orderStatusName === 'Processing') && order.orderStatusName}</strong></div>
                                {order.orderStatusName === 'Cancelled' || order.orderStatusName === 'Completed' ?
                                  <strong style={{ fontSize: "48px" }} className='text-muted lead'>{order.orderStatusName}</strong> :
                                  order.orderStatusName === 'Processing' ?
                                    <>
                                      <button style={{ width: '120px', height: '100px' }} onClick={() => {
                                        setSelected(order.orderId)
                                        setChoice('Complete')
                                        handleClickOpen()
                                      }} className='btn btn-success yes-btn text-center'><strong>Complete Order</strong></button>
                                      <button style={{ width: '120px', height: '100px' }} onClick={() => {
                                        setSelected(order.orderId)
                                        setChoice('Cancel')
                                        handleClickOpen()
                                      }} className='btn btn-success no-btn text-center'><strong>Cancel Order</strong></button>
                                    </> :
                                    <>
                                      <button style={{ width: '120px', height: '100px' }} onClick={() => {
                                        setSelected(order.orderId)
                                        setChoice('Accept')
                                        handleClickOpen()
                                      }} className='btn btn-success yes-btn text-center'><strong>Accept Order</strong></button>
                                      <button style={{ width: '120px', height: '100px' }} onClick={() => {
                                        setSelected(order.orderId)
                                        setChoice('Cancel')
                                        handleClickOpen()
                                      }} className='btn btn-success no-btn text-center'><strong>Cancel Order</strong></button>
                                    </>
                                }
                              </td>
                            </tr>
                          </>
                        ))}
                    </tbody>
                  </table>
                </div>
                :
                <strong>You haven't recieved any order yet!</strong>
              }
            </div>
          </section>
        </div>
        <br />
        <br />
      </div>
      <FooterFE />
    </>
  )
}