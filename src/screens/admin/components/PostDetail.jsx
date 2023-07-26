import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import Cookies from 'universal-cookie'
import axios from "axios"
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Card from 'react-bootstrap/Card';
import { Dialog, DialogTitle } from '@mui/material'

export const AdminPostDetail = () => {
    axios.defaults.baseURL = 'https://localhost:7115'
    const queryParameter = new URLSearchParams(window.location.search)
    const postId = queryParameter.get("id")
    const navigate = useNavigate();
    const cookies = new Cookies();
    const [error, setError] = useState('')
    const [showDesc, setShowDesc] = useState(false)
    const [post, setPost] = useState([])
    const [images, setImages] = useState([])
    let VND = new Intl.NumberFormat('vn-VN', {
        currency: 'VND',
    });

    const fetchData = async () => {
        await axios.get('/posts/get-post-by-id', { params: { id: postId } })
            .then((data) => {
                setPost(data.data)
                setImages(data.data.images)
            })
            .catch(e => setError(error))
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
    return (
        <>
            <div className='post-detail'>
                <div className='row'>
                    <div className='col-2 back-btn'>
                        <button onClick={() => { navigate(-1) }} type="button" className="btn btn-light fw-medium text-uppercase mb-5">
                            ←Back
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-5 text-right">
                        <div className="row col-md-12 d-flex justify-content-end">
                            {images.length === 0 ? <div>No available picture</div> :
                                <a className='post-detail-card d-flex justify-content-center' href={images[0].ImageUrl} target='_blank'>
                                    <img className="img-fluid post-img" src={images[0].ImageUrl}></img>
                                </a>
                            }
                            <div style={{ width: '70%' }} className="my-3">
                                <Swiper
                                    modules={[Navigation]}
                                    slidesPerView={3}
                                    spaceBetween={15}
                                    navigation
                                    grabCursor={true} // bật tính năng hiển thị con trỏ kéo chuột
                                    mousewheel={true} // bật tính năng kéo chuột bằng bánh xe
                                    onSlideChange={() => console.log('slide change')}
                                    onSwiper={(swiper) => console.log(swiper)}
                                >
                                    <>
                                        {images.slice(1).map((image) => (
                                            <SwiperSlide
                                                onMouseDown={(e) => e.preventDefault()} // ngăn chặn sự kiện mặc định khi nhấn chuột trái
                                                onMouseMove={(e) => e.preventDefault()} // ngăn chặn sự kiện mặc định khi di chuyển chuột
                                                onMouseUp={(e) => e.preventDefault()} // ngăn chặn sự kiện mặc định khi thả chuột trái
                                            >
                                                <a href={image.ImageUrl} target='_blank'>
                                                    <Card.Img variant="top" className='img-fluid' src={image.ImageUrl} style={{ width: '150px', height: '120px' }} />
                                                </a>
                                            </SwiperSlide>
                                        ))}
                                    </>
                                </Swiper>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-7 px-5">
                        <div className='row'>
                            <h1 className='col-4 text-capitalize text-dark'>{post.productName}</h1>
                            <h3 className='title col-8 status-post-accepted'>Available</h3>
                            <h3 className="col-4"><strong>{VND.format(post.price)} VND</strong></h3>
                            <h4 className='col-md-auto'>
                                <strong>
                                    Seller:&nbsp;
                                    <a className='to-user-profile' href={'/user-detail?id=' + post.accountId}>
                                        <span className="post-detail">
                                            {post.fullname}
                                        </span>
                                    </a>
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
                        
                    </div >
                </div>
            </div >
            <Dialog style={{ overflowY: 'auto' }} onClose={() => { setShowDesc(false) }} open={showDesc}>
                <DialogTitle style={{ width: '650px', height: '600px' }}>
                    {post.description}
                </DialogTitle>
                <button style={{ width: '100px' }} onClick={() => { setShowDesc(false) }} className='btn-black py-1'>Back</button>
            </Dialog>
        </>
    )
}
