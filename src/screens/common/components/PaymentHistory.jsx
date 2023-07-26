import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from 'react'
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner';
import { Pagination } from '@mui/material';
import { toLowerCaseNonAccentVietnamese } from '../../nonAccentVietnamese.js'
import Cookies from 'universal-cookie'
import axios from "axios"
import cn from 'classnames'
import { Stack } from "react-bootstrap";
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Card from 'react-bootstrap/Card';
import FooterFE from '../../../components/FooterFE';
import HeaderFE from '../../../components/HeaderFE';


const itemsPerPage = 8;


export const PaymentHistory = () => {
    axios.defaults.baseURL = 'https://localhost:7115';
    const cookies = new Cookies()
    const [isError, setIsError] = useState(false)
    const [all, setAll] = useState([])
    const [pending, setPending] = useState([])
    const [completed, setCompleted] = useState([])
    const [filteredList, setFilteredList] = useState([])
    const [status, setStatus] = useState('All');
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    let VND = new Intl.NumberFormat('vn-VN', {
        currency: 'VND',
    });


    const fetchData = async () => {
        await axios.get('/topup/user-history-transaction')
            .then((data) => {
                const list = data.data.slice(0).reverse()
                setAll(list)
                setPending(list.filter((item) => { return item.topUpStatus === 'Pending' }))
                setCompleted(list.filter((item) => { return item.topUpStatus === 'Completed' }))
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
                                        <th scope="col">#</th>
                                        <th scope="col">Profile</th>
                                        <th scope="col">Point</th>
                                        <th scope="col">Date Created</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedItems.map((item) => (
                                        <tr>
                                            
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
        <>
            <HeaderFE />
            <div className='d-flex'>
                <div className='flex-1 container text-white bg-body-tertiary w-100 min-vh-100'>
                    <h5 className='text-dark m-3'>Admin Post List</h5>
                    {isLoading ? <LoadingSpinner /> : renderPost}
                </div>
            </div>
            <FooterFE />
        </>
    )
}
