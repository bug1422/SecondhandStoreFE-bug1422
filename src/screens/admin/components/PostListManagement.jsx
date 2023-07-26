import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from 'react'
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner';
import { Pagination } from '@mui/material';
import { toLowerCaseNonAccentVietnamese } from '../../nonAccentVietnamese.js'
import Cookies from 'universal-cookie'
import axios from "axios"
import Menu from "../Sidebar";
import cn from 'classnames'
import { Stack } from "react-bootstrap";
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Card from 'react-bootstrap/Card';

const itemsPerPage = 8;


export const AdminPostListManagement = () => {
    axios.defaults.baseURL = 'https://localhost:7115';
    const cookies = new Cookies()
    const [isError, setIsError] = useState(false)
    const [all, setAll] = useState([])
    const [pending, setPending] = useState([])
    const [accepted, setAccepted] = useState([])
    const [rejected, setRejected] = useState([])
    const [completed, setCompleted] = useState([])
    const [filteredList, setFilteredList] = useState([])
    const [status, setStatus] = useState('All');
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    let VND = new Intl.NumberFormat('vn-VN', {
        currency: 'VND',
    });

    function handleAccept(id) {
        acceptPost(id)
        window.location.reload()
    }

    function handleReject(id) {
        rejectPost(id)
        window.location.reload()
    }
    const acceptPost = async (postId) => {
        const response = await axios({
            url: '/posts/accept-post',
            params: { id: postId },
            method: 'put'
        }).catch(e => {
            setError('Something went wrong!')
            console.log(e)
        })
    }

    const rejectPost = async (postId) => {
        const response = await axios({
            url: '/posts/reject-post',
            params: { id: postId },
            method: 'put'
        }).catch(e => {
            setError('Something went wrong!')
            console.log(e)
        })
    }

    const fetchData = async () => {
        await axios.get('/posts/get-post-list')
            .then((data) => {
                const list = data.data.slice(0).reverse()
                setAll(list)
                setPending(list.filter((item) => { return item.statusName === 'Pending' }))
                setAccepted(list.filter((item) => { return item.statusName === 'Accepted' }))
                setRejected(list.filter((item) => { return item.statusName === 'Rejected' }))
                setCompleted(list.filter((item) => { return item.statusName === 'Completed' }))
                setFilteredList(list)
                setIsLoading(false)
            })
            .catch((e) => {
                console.log(e)
            })
    }

    useEffect(() => {
        let cookie = cookies.get('jwt_authorization')
        axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie;
        fetchData()
    }, [])

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData)
        var updatedList
        switch (status) {
            case 'All':
                updatedList = [...all]
                break
            case 'Pending':
                updatedList = [...pending]
                break
            case 'Accepted':
                updatedList = [...accepted]
                break
            case 'Rejected':
                updatedList = [...rejected]
                break
            case 'Completed':
                updatedList = [...completed]
                break
        }
        if (data['keyword'] !== '') {
            updatedList = updatedList.filter((item) => {
                let name = toLowerCaseNonAccentVietnamese(item.productName)
                let query = toLowerCaseNonAccentVietnamese(data['keyword'])
                return name.indexOf((query || '')) !== -1
            });
        }
        if (data['date'] !== '') {
            updatedList = updatedList.filter((item) => {
                return new Date(item.orderDate).getTime() > new Date(data['date']).getTime()
            })
        }
        setFilteredList(updatedList)
    }

    const [paginatedItems, setPaginatedItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const paginate = (filteredList, currentPage, itemsPerPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredList.slice(startIndex, startIndex + itemsPerPage);
    }
    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };
    useEffect(() => {
        setCurrentPage(1);
        setPaginatedItems(paginate(filteredList, currentPage, itemsPerPage));
    }, [filteredList])
    useEffect(() => {
        setPaginatedItems(paginate(filteredList, currentPage, itemsPerPage));
    }, [currentPage])

    const renderPost = (
        <>
            <div className="mb-12 Account_box__yr82T p-6 text-black-600 text-18 mb-12" >
                <nav>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <button onClick={() => {
                            setFilteredList(all)
                            setStatus('All')
                        }} class={cn("nav-link ", status == 'All' && 'active')} id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="">All ({all.length})</button>
                        <button onClick={() => {
                            setFilteredList(pending)
                            setStatus('Pending')
                        }} class={cn("nav-link ", status == 'Pending' && 'active')} id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected=''>Pending Post ({pending.length})</button>
                        <button onClick={() => {
                            setFilteredList(accepted)
                            setStatus('Accepted')
                        }} class={cn("nav-link ", status == 'Accepted' && 'active')} id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected=''>Accepted Post ({accepted.length})</button>
                        <button onClick={() => {
                            setFilteredList(rejected)
                            setStatus('Rejected')
                        }} class={cn("nav-link ", status == 'Rejected' && 'active')} id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected=''>Rejected Post ({rejected.length})</button>
                        <button onClick={() => {
                            setFilteredList(completed)
                            setStatus('Completed')
                        }} class={cn("nav-link ", status == 'Completed' && 'active')} id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected=''>Completed Post ({completed.length})</button>
                        <div></div>
                    </div>
                </nav>
                <div className="">
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
                                        case 'Accepted':
                                            setFilteredList(accepted)
                                            break
                                        case 'Rejected':
                                            setFilteredList(rejected)
                                            break
                                        case 'Completed':
                                            setFilteredList(completed)
                                            break
                                    }
                                }} style={{ marginTop: '1%' }} type="button" class="btn btn-primary">Clear
                                </button>
                                <button style={{ marginTop: '1%' }} type="submit" class="btn btn-primary">Search</button>
                            </div>
                            <div className="col-auto my-1">
                                <Stack alignItems="center">
                                    <Pagination sx={{}} count={Math.ceil(filteredList.length / itemsPerPage)} onChange={(e, p) => { handlePageChange(e, p) }} variant="outlined" shape="rounded" />
                                </Stack>
                            </div>
                        </div>
                    </form>
                    <div className="list-box">
                        {paginatedItems.length > 0 ? <>
                            <table className="table custom-table">
                                <thead>
                                    <tr className='mb-1'>
                                        <th scope="col">Product Info</th>
                                        <th scope="col">Seller</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Options</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedItems.map((item) => (
                                        <tr>
                                            <td style={{ width: '400px' }}>
                                                <div className="row">
                                                    <div className="col-6 text-left">
                                                        <div>Post Id: {item.postId}</div>
                                                        <div>Name: {item.productName}</div>
                                                        <div>Price: {VND.format(item.price).replaceAll(',', '.')}</div>
                                                        <div>Category: {item.categoryName} </div>
                                                        <div>Point Taken: {item.categoryValue}</div>
                                                        <div>Created Date: {String(item.createdDate).substring(0, 10)}</div>
                                                        {item.isDonated ?
                                                            <h2 className="text-warning">Donating</h2> :
                                                            <h2 className="teal">Selling</h2>
                                                        }
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="row">
                                                            {item['images'].length === 0 ? <div>No available picture</div> :
                                                                <a href={item['images'][0].ImageUrl} target='_blank'>
                                                                    <img style={{ width: '150px', height: '170px' }} src={item['images'][0].ImageUrl}></img>
                                                                </a>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ width: '400px' }} className="row my-3">
                                                    <Swiper
                                                        modules={[Navigation]}
                                                        slidesPerView={2}
                                                        spaceBetween={15}
                                                        navigation
                                                        grabCursor={true} // bật tính năng hiển thị con trỏ kéo chuột
                                                        mousewheel={true} // bật tính năng kéo chuột bằng bánh xe
                                                        onSlideChange={() => console.log('slide change')}
                                                        onSwiper={(swiper) => console.log(swiper)}
                                                    >
                                                        <>
                                                            {item['images'].slice(1).map((image) => (
                                                                <SwiperSlide
                                                                    onMouseDown={(e) => e.preventDefault()} // ngăn chặn sự kiện mặc định khi nhấn chuột trái
                                                                    onMouseMove={(e) => e.preventDefault()} // ngăn chặn sự kiện mặc định khi di chuyển chuột
                                                                    onMouseUp={(e) => e.preventDefault()} // ngăn chặn sự kiện mặc định khi thả chuột trái
                                                                >
                                                                    <a href={image.ImageUrl} target='_blank'>
                                                                        <Card.Img variant="top" className='img-fluid' src={image.ImageUrl} style={{ width: '50px', height: '50px' }} />
                                                                    </a>
                                                                </SwiperSlide>
                                                            ))}
                                                        </>
                                                    </Swiper>
                                                </div>
                                            </td>
                                            <td style={{ width: '250px' }}>
                                                <div className="text-left">
                                                    <div>Account Id:{item.accountId}</div>
                                                    <div>Name: {item.fullname}</div>
                                                    <div>Email: {item.email}</div>
                                                    <div>Phone: {item.phoneNo}</div>
                                                    <div>Address: {item.address}</div>
                                                </div>
                                            </td>
                                            <td className="" style={{ padding: '50px 00px', width: '160px' }}>
                                                <div className={cn('h3',
                                                    item.statusName === 'Accepted' ? 'text-success' :
                                                        item.statusName === 'Rejected' ? 'text-danger' :
                                                            item.statusName === 'Completed' ? 'text-secondary' :
                                                                item.statusName === 'Pending' && 'text-dark'
                                                )}>{item.statusName}</div>
                                            </td>
                                            <td className=''>
                                                <div className="text-center">
                                                    <div className="text-left">
                                                        <div style={{ padding: '40px 0px' }}>Preview: &emsp;
                                                            <a className="btn btn-outline-dark" href={"/admin/post-detail?id=" + item.postId} style={{ textDecoration: 'none' }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                                                </svg>
                                                            </a>
                                                        </div>
                                                        <button onClick={() => { handleAccept(item.postId) }} className={cn(item.statusName === 'Pending' ? 'btn btn-info yes-btn' : 'btn btn-secondary disabled')}>Accept</button>
                                                        <button onClick={() => { handleReject(item.postId) }} className={cn(item.statusName === 'Pending' ? 'btn btn-info no-btn' : 'btn btn-secondary disabled')}>Reject</button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table >
                        </> : <h5 className="text-dark m-3 text-capitalize">No Post Found!</h5>}
                    </div>
                </div>
            </div>
        </>
    )

    return (
        <div className='d-flex'>
            <div className='flex-1 container text-white bg-body-tertiary w-100 min-vh-100'>
                <h5 className='text-dark m-3'>Admin Post List</h5>
                {isLoading ? <LoadingSpinner /> : renderPost}
            </div>
        </div>
    )
}
