import React, { useEffect, useState } from 'react'
import FooterFE from '../../../components/FooterFE'
import HeaderFE from '../../../components/HeaderFE'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export const UserHome = () => {
    axios.defaults.baseURL = "https://localhost:7115"
    const navigate = useNavigate()
    const [type, setType] = useState("");
    const [category, setCategory] = useState("");
    const [items, setItems] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    let VND = new Intl.NumberFormat('vn-VN', {
        currency: 'VND',
    });

    const fetchData = async () => {
        await axios.get("/posts/get-all-active-post-list")
            .then((data) => {
                setItems(data.data.slice(0).reverse())
                setFilteredList(data.data.slice(0).reverse())

            })
            .catch((e) => { console.log(e) })
    }

    useEffect(() => {

        fetchData()
    }, [])

    useEffect(() => {
        var updatedList = [...filteredList]
        if (type === 'Donate') updatedList = updatedList.filter(p => p.postTypeName === type)
        else updatedList = items
        setFilteredList(updatedList)
    }, [type])

    const oldOne = (
        <div className='padding-40'>
            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                        <ul className="list-group">
                            <ul className="list-group">
                                <li className="list-group-item" onClick={() => { navigate('/selling') }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                    <i className="fas fa-tshirt"></i> All
                                </li>
                                <li className="list-group-item" onClick={() => { navigate('/selling', { state: "Clothes" }) }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                    <i className="fas fa-tshirt"></i> Clothes
                                </li>
                                <li className="list-group-item" onClick={() => { navigate('/selling', { state: "Accessories" }) }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                    <i className="fas fa-tshirt"></i> Accessories
                                </li>
                                <li className="list-group-item" onClick={() => { navigate('/selling', { state: "Electronics" }) }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                    <i className="fas fa-bolt"></i> Electronics
                                </li>
                                <li className="list-group-item" onClick={() => { navigate('/selling', { state: "Books" }) }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                    <i className="fas fa-book"></i> Books
                                </li>
                                <li className="list-group-item" onClick={() => { navigate('/selling', { state: "Musical Instruments" }) }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                    <i className="fas fa-guitar"></i> Musical Instruments
                                </li>
                                <li className="list-group-item" onClick={() => { navigate('/selling', { state: "School Supplies" }) }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                    <i className="fas fa-pencil-ruler"></i> School Supplies
                                </li>
                                <li className="list-group-item" onClick={() => { navigate('/selling', { state: "Others" }) }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                    <i className="material-icons"></i> Others
                                </li>
                            </ul>
                        </ul>
                    </div>
                    <div className="col-md-9 mh-100 padding-40">
                        <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel" data-interval="3000">
                            <ol className="carousel-indicators">
                                <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                                <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                                <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                            </ol>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <img className="d-block w-100" src="https://i.imgur.com/i6L2jGh.jpg" alt="First slide" />
                                </div>
                                <div className="carousel-item">
                                    <img className="d-block w-100" src="https://i.imgur.com/RA2DI5N.jpg" alt="Second slide" />
                                </div>
                                <div className="carousel-item">
                                    <img className="d-block w-100" src="https://i.imgur.com/n5F6gPa.jpg" alt="Third slide" />
                                </div>
                            </div>
                            <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="sr-only">Previous</span>
                            </a>
                            <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="sr-only">Next</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container my-3">
                <Swiper
                    modules={[Navigation]}
                    slidesPerView={4}
                    spaceBetween={15}
                    navigation
                    grabCursor={true} // bật tính năng hiển thị con trỏ kéo chuột
                    mousewheel={true} // bật tính năng kéo chuột bằng bánh xe
                    onSlideChange={() => console.log('slide change')}
                    onSwiper={(swiper) => console.log(swiper)}
                >
                    {filteredList.length === 0 ? <div>No available product</div> : filteredList.slice(0).reverse().map((item) => (
                        <SwiperSlide
                            onMouseDown={(e) => e.preventDefault()} // ngăn chặn sự kiện mặc định khi nhấn chuột trái
                            onMouseMove={(e) => e.preventDefault()} // ngăn chặn sự kiện mặc định khi di chuyển chuột
                            onMouseUp={(e) => e.preventDefault()} // ngăn chặn sự kiện mặc định khi thả chuột trái
                        >
                            <a className='post-image' href={'/post-detail?id=' + item.postId}>
                                <Card.Img variant="top" className='img-fluid' src={item.images[0].ImageUrl} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className="container border">
                <div className="">
                    {[
                        'dark',
                    ].map((variant) => (
                        <Alert key={variant} variant={variant}>
                            Newest Posts
                        </Alert>
                    ))}
                </div>
                <div class="container">
                    <div class="row mx-auto">
                        {filteredList.slice(0, 8).map((item) => (
                            <>
                                <div class="col-6 col-md-3 post-padding">
                                    <a href={"/post-detail?id=" + item.postId} style={{ textDecoration: 'none' }}>
                                        <Card style={{ width: '16rem' }}>
                                            <Card.Img variant="top" className='img-fluid' src={item.images[0].ImageUrl} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                                            <Card.Body>
                                                <Card.Title style={{ color: 'black' }}>{item.productName}</Card.Title>
                                            </Card.Body>
                                            <Card.Body>
                                                <a href={'/post-detail?id=' + item.postId} style={{ textDecoration: 'none' }}>
                                                    <Card.Link style={{ color: 'orange', fontSize: '20px' }}>{item.isDonated ? "Donating" : VND.format(item.price).replaceAll(',', '.') + " VND"}</Card.Link>
                                                </a>
                                            </Card.Body>
                                        </Card>
                                    </a>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <>
            <HeaderFE />
            {oldOne}
            <FooterFE />
        </>
    )
}
