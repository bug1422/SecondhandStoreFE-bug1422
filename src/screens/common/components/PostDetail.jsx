import React from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import axios from "axios"
import jwt from 'jwt-decode'
import HeaderFE from "../../../components/HeaderFE"
import FooterFE from "../../../components/FooterFE"
import { Card } from 'react-bootstrap'
import { Dialog, DialogTitle, List, ListItem } from '@mui/material'
import cn from 'classnames'
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner'
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

export const PostDetail = () => {
    axios.defaults.baseURL = 'https://localhost:7115'
    const queryParameter = new URLSearchParams(window.location.search)
    const postId = queryParameter.get("id")
    const navigate = useNavigate()
    const cookies = new Cookies()
    const [isLoading, setLoading] = useState(false)
    const [isLogged, setLogged] = useState(false)
    const [showDesc, setShowDesc] = useState(false)
    const [Owner, setOwner] = useState('')
    const [result, setResult] = useState('')
    const [error, setError] = useState('')
    const [request, setRequest] = useState('')
    const [post, setPost] = useState([])
    const [images, setImages] = useState([])
    let VND = new Intl.NumberFormat('vn-VN', {
        currency: 'VND',
    })
    const fetchData = async () => {
        await axios.get('/posts/get-post-by-id', { params: { id: postId } })
            .then((data) => {
                setPost(data.data)
                setImages(data.data.images)
                console.log(data.data)
            })
            .catch((e) => {
                console.log(e)
                setError('Something went wrong')
            })
        if (isLogged) {
            await axios.get('/get-all-request-list').then((data) => {
                data.data.map((item) => {
                    if (String(item.postId) === postId && request === '') setRequest(item.orderStatusName)
                })
            }).catch((e) => {
                console.log(e)
                setError('Something went wrong')
            })
        }
    }
    const sendRequest = async () => {
        await axios.post('/buyer-send-exchange-request', {
            'postId': postId,
        }).then((data) => {
            setResult(data.data)
        })
            .catch((e) => {
                console.log(e)
                setResult("Something went wrong, try again later!")
            })
        setLoading(false)
        setTimeout(() => {
            if (result.indexOf('Something') === -1) window.location.reload()
        }, 3000)
    }

    useEffect(() => {
        let cookie = cookies.get('jwt_authorization')
        if (cookie !== undefined) {
            axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie
            setOwner(jwt(cookie)['accountId'])
            setLogged(true)
        }
        fetchData()
    }, [])

    const [open, setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleReqComplete = () => {
        setLoading(true)
        sendRequest()
    }

    const handleClose = () => {
        setOpen(false)
    }


    const requestDialog = (
        <>
            <DialogTitle>Are you sure?</DialogTitle>
            <List>
                <ListItem>
                    <p className='col-md-12 dialog-p'>
                        You are about to create a request for this product. The seller can see your request and contact with you. Or you can try to contact them first.
                    </p>
                </ListItem>
                <ListItem>
                    <div className='col-md-12'>
                        <button className='btn btn-info col-md-3 yes-btn' onClick={() => { handleReqComplete() }}>Yes</button>
                        <button className='btn btn-info col-md-3 no-btn' onClick={() => { handleClose() }}>No</button>
                    </div>
                </ListItem>
            </List>
        </>
    )

    const renderPost = (
        <div style={{ height: '700px' }} className='post-detail padding-40'>
            <div className='row'>
                <div className='col-2 back-btn'>
                    <button onClick={() => { navigate(-1) }} type="button" className="btn btn-light fw-medium text-uppercase mb-5">
                        ←Back
                    </button>
                </div>
                <div className='col-auto'>
                    <a onClick={() => { navigate('/selling', { state: post.categoryName }) }} className='h3'><strong>{post.categoryName}</strong></a>
                </div>
                <div className='col-4'>
                    <h3 style={{ paddingTop: '7px' }} className='lead'>Last Modified: {String(post.createdDate).substring(0, 10)}</h3>
                </div>
            </div>
            <div className="row">
                <div className="col-md-5 text-right">
                    <div className="row col-md-12 d-flex justify-content-end">
                        <div className="row col-md-12 d-flex justify-content-end">
                            {images.length === 0 ? <div>No available picture</div> :
                                <a className='post-detail-card d-flex justify-content-center' href={images[0].ImageUrl} target='_blank'>
                                    <img style={{ width: '300px', height: '300px' }} className="img-fluid post-img" src={images[0].ImageUrl}></img>
                                </a>
                            }
                        </div>
                    </div>
                </div>
                <div className="col-md-7 px-5">
                    <div className='row'>
                        <h1 className='col-4 text-capitalize text-dark'>{post.productName}</h1>
                        <h3 className={cn('title col-8',
                            post.statusName == "Completed" || post.statusName == "Pending" && 'status-post-completed',
                            post.statusName == "Accepted" && 'status-post-accepted',
                            post.statusName == "Rejected" || post.statusName == "Inactive" && 'status-post-rejected',
                        )}>{post.statusName == "Accepted" ? "Available" : (post.statusName == "Rejected" || post.statusName == "Inactive" ? "Unavailable" : post.statusName)}</h3>
                        <h3 className="col-4"><strong>{VND.format(post.price)} VND</strong></h3>
                        <h4 className='col-md-auto'>
                            <strong>
                                Seller:&nbsp;
                                <div onClick={() => {
                                    if (isLogged) navigate('/user-detail?id='+post.accountId)
                                    else navigate('/auth/login')
                                }} className='to-user-profile'>
                                    <span className="post-detail">
                                        {post.accountId == Owner ? "You" : post.fullname}
                                    </span>
                                </div>
                            </strong>
                        </h4>
                    </div>
                    <div className="row">
                    </div>
                    <h4 className='text-dark'>Description <button onClick={() => { setShowDesc(true) }} style={{ height: '30px', paddingTop: '8px' }} className='h5 btn btn-outline-dark'>View All</button></h4>
                    <div className='col-md-12 h4 row pb-4'>
                        <div style={{ width: '80%', height: '150px', overflowY: 'scroll', border: '1px solid grey' }}>{post.description}
                        </div>
                    </div>
                    <div className='row col-md-12'>
                        {Owner == post.accountId && post.statusName === 'Accepted' ?
                            <div className='row'>
                                <div className='col-4'>
                                    <button style={{ width: '150px', borderRadius: '8px' }} onClick={() => { navigate('/post-edit', { state: post.postId }) }} className="post-detail-btn h3">Update Post</button>
                                </div>
                            </div>
                            :
                            <div className='row'>
                                {request === 'Cancelled' ?
                                    <div className='col-12 row'>
                                        <strong className='text-dark font-italic h4 text-center'>Your exchange order has been cancelled</strong>
                                    </div> :
                                    request === 'Pending' || request === 'Processing' ?
                                        <div className='col-12 row'>
                                            <div className='col-4'>
                                                <strong className='text-dark font-italic h4 text-center'>You've already requested this product</strong>
                                            </div>
                                            <div className='col-3'>
                                                <button style={{ width: '200px', height: '70px', borderRadius: '8px' }} onClick={() => { navigate('/my-request') }} className="post-detail-btn h3">See request list</button>
                                            </div>
                                        </div>
                                        :
                                        post.statusName === "Completed" ? <></> :
                                            <div className='col-4'>
                                                <button style={{ width: '250px', borderRadius: '8px' }} onClick={() => {
                                                    if (isLogged) handleClickOpen()
                                                    else navigate('/auth/login')
                                                }} className="post-detail-btn h3">Request this product</button>
                                            </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </div>
            <Dialog style={{ overflowY: 'auto' }} onClose={() => { setShowDesc(false) }} open={showDesc}>
                <DialogTitle style={{ width: '650px', height: '600px' }}>
                    {post.description}
                </DialogTitle>
                <button style={{ width: '100px' }} onClick={() => { setShowDesc(false) }} className='btn-black py-1'>Back</button>
            </Dialog>
            <Dialog onClose={() => {
                handleClose()
            }} open={open}>
                <div className='row dialog'>
                    {isLoading ? <LoadingSpinner /> :
                        result === '' ?
                            requestDialog :
                            <div style={{ width: '250px', height: '150px' }}>
                                <DialogTitle style={{ height: '80%' }} className='col-12'>
                                    <div className={cn(result.indexOf('Something') === -1 ? 'text-success' : 'text-danger')}>{result}</div>
                                </DialogTitle>
                                <button style={{ width: '100px' }} onClick={() => {
                                    handleClose()
                                }} className='col-4 btn-black py-1'>Back</button>
                            </div>
                    }
                </div>
            </Dialog>
        </div >
    )
    return (
        <>
            <HeaderFE />
            {error === '' ?
                renderPost :
                <div style={{ height: '700px' }} className="text-center">
                    The post is currently unavailable. Try again later!
                </div>
            }
            <FooterFE />
        </>
    )
}
