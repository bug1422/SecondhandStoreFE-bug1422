import React, { useEffect, useState } from 'react'
import FooterFE from '../../../components/FooterFE'
import HeaderFE from '../../../components/HeaderFE'
import ImageBanner from "../../../assets/images/banner_image.svg";
import ShirtMU from "../../../assets/images/shirt-mu.png";
import ShirtGame from "../../../assets/images/shirt-game.png";
import ShirtT1 from "../../../assets/images/shirt-t1.png";
import Headphone from "../../../assets/images/headphone.png";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import Carousel from 'react-bootstrap/Carousel';
import Alert from 'react-bootstrap/Alert';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { ListGroup } from 'react-bootstrap';
import { Nav, NavItem } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const data = {
    items: [
        {
            id: 1,
            type: "clothes",
            name: "MU Shirt",
            price: 10,
            thumbnail: ShirtMU
        },
        {
            id: 2,
            type: "clothes",
            name: "Game Shirt",
            price: 20,
            thumbnail: ShirtT1
        },
        {
            id: 3,
            type: "clothes",
            name: "Shirt Game",
            price: 30,
            thumbnail: ShirtGame
        },
        {
            id: 4,
            type: "electric",
            name: "Headphone 1",
            price: 40,
            thumbnail: Headphone
        },
        {
            id: 5,
            type: "clothes",
            name: "MU Shirt 1",
            price: 50,
            thumbnail: ShirtMU
        },
        {
            id: 6,
            type: "clothes",
            name: "Game Shirt 1",
            price: 60,
            thumbnail: ShirtT1
        },
        {
            id: 7,
            type: "clothes",
            name: "Shirt Game 2",
            price: 70,
            thumbnail: ShirtGame
        },
        {
            id: 8,
            type: "electric",
            name: "Headphone 2",
            price: 80,
            thumbnail: Headphone
        },
        {
            id: 9,
            type: "clothes",
            name: "MU Shirt 3",
            price: 90,
            thumbnail: ShirtMU
        },
        {
            id: 10,
            type: "clothes",
            name: "Game Shirt 4",
            price: 80,
            thumbnail: ShirtT1
        },
        {
            id: 11,
            type: "clothes",
            name: "Shirt Game 4",
            price: 70,
            thumbnail: ShirtGame
        },
        {
            id: 12,
            type: "electric",
            name: "Headphone 3",
            price: 60,
            thumbnail: Headphone
        }
    ]
}

export const UserHome = () => {
    axios.defaults.baseURL = "https://localhost:7115"
    const navigate = useNavigate()
    const [type, setType] = useState("");
    const [category, setCategory] = useState("");
    const [items, setItems] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    let VND = new Intl.NumberFormat('vn-VN', {
        style: 'currency',
        currency: 'VND',
    });
    useEffect(() => {
        setItems(
            data.items.filter((item) => item.type.includes(type))
        )
    }, [type])

    const fetchData = async () => {
        await axios.get("/posts/get-post-list")
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

    const handleSortType = (category) => {
        let sortedItems = [];

        switch (category) {
            case "nameAZ":
                sortedItems = items.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "nameZA":
                sortedItems = items.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "priceAZ":
                sortedItems = items.sort((a, b) => a.price - b.price);
                break;
            case "priceZA":
                sortedItems = items.sort((a, b) => b.price - a.price);
                break;
            default:
                sortedItems = items;
        }
        setItems([...sortedItems]);

    }
    const [paginatedItems, setPaginatedItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const paginate = (items, currentPage, itemsPerPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    }
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    useEffect(() => {
        setCurrentPage(1);
        setPaginatedItems(paginate(items, currentPage, itemsPerPage));
    }, [items])
    useEffect(() => {
        setPaginatedItems(paginate(items, currentPage, itemsPerPage));
    }, [currentPage])

    return (
        <>
            <HeaderFE />
            <div className="position-relative admin__home_banner">
                <h3 className="p-5 banner_title">
                    Second hand exchange where you can find amazing things
                </h3>
                <img className="admin__home_banner_image position-absolute top-0 end-0 h-100" src={ImageBanner} alt="" />
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                        <ul className="list-group">


                            <ul className="list-group">
                                <li className="list-group-item" onClick={() => { navigate('/search') }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                    <i className="fas fa-tshirt"></i> All
                                </li>
                                <li className="list-group-item" onClick={() => { navigate('/search', { state: "Clothes" }) }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                    <i className="fas fa-tshirt"></i> Clothes
                                </li>
                                <li className="list-group-item" onClick={() => { navigate('/search', { state: "Electrics" }) }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                    <i className="fas fa-bolt"></i> Electrics
                                </li>
                                <li className="list-group-item" onClick={() => { navigate('/search', { state: "Book" }) }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                    <i className="fas fa-book"></i> Books
                                </li>
                                <li className="list-group-item" onClick={() => { navigate('/search', { state: "Traditional Instruments" }) }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                    <i className="fas fa-guitar"></i> Traditional Instruments
                                </li>
                                <li className="list-group-item" onClick={() => { navigate('/search', { state: "Learning Tools" }) }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                    <i className="fas fa-pencil-ruler"></i> Learning Tools
                                </li>
                                <li className="list-group-item" onClick={() => { navigate('/search', { state: "Others" }) }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                    <i className="material-icons"></i> Others
                                </li>
                            </ul>
                        </ul>
                    </div>
                    <div className="col-md-9">
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
                {/* <Tabs
                    defaultActiveKey="profile"
                    id="justify-tab-example"
                    className="mb-8"
                >
                    <Tab onClick={() => { setType("") }} eventKey="all" title="all">
                    </Tab>
                    <Tab onClick={() => { setType("Donate") }} eventKey="donating" title="donating">
                    </Tab>
                </Tabs> */}

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
                            <a href={'/post-detail?id=' + item.postId}>
                                <img src={item.image} alt="" style={{ width: '100%' }} />
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
                            <div class="col-6 col-md-3">
                                <div class="card h-100 border-0 text-center">
                                    <img src={item['image']} class="card-img-top" alt="..." />
                                    <div class="card-body">
                                        <h1 class="card-title">{item['productName']}</h1>
                                        <h3 class="card-text">{VND.format(item['price'])}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div class="col-xs-12">
                <h1>
                </h1>
            </div>
            <FooterFE />
        </>
    )
}
