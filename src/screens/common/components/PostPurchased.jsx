import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from 'react'
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner';
import Cookies from 'universal-cookie'
import axios from "axios"
import HeaderFE from "../../../components/HeaderFE";
import FooterFE from "../../../components/FooterFE";
import { Dialog, DialogTitle, List, ListItem, Pagination } from '@mui/material';
import { toLowerCaseNonAccentVietnamese } from '../../nonAccentVietnamese.js'
import cn from 'classnames'
import { Card, Stack } from "react-bootstrap";

const itemsPerPage = 8;

export const PostPurchasedManagement = () => {
    axios.defaults.baseURL = 'https://localhost:7115'
    const navigate = useNavigate()
    const cookies = new Cookies()
    const [all, setAll] = useState([])
    const [isError, setIsError] = useState(false)
    const [filteredList, setFilteredList] = useState([])
    const [status, setStatus] = useState('All');

    let VND = new Intl.NumberFormat('vn-VN', {
        currency: 'VND',
    });

    const fetchData = async () => {
        await axios.get('/get-purchased-post')
            .then((data) => {
                const list = data.data.slice(0).reverse()
                setAll(list)
                setFilteredList(list)
            })
            .catch(e => setIsError(e))
    }

    useEffect(() => {
        let cookie = cookies.get('jwt_authorization')
        if (cookie === undefined) navigate('/auth/login', { replace: true })
        axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie;
        fetchData()
    }, [])

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData)
        console.log(data)
        var updatedList = [...all]
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
        <div className="mb-12 Account_box__yr82T p-6 text-black-600 text-18 mb-12" >
            <nav>
                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                    <button onClick={() => {
                        setFilteredList(all)
                        setStatus('All')
                    }} class={cn("nav-link ", status == 'All' && 'active')} id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="">All ({all.length})</button>
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
                    {filteredList.length === 0 ? <h5 className="text-dark m-3 text-capitalize">You haven't complete any purchase :/, go buy some</h5> : <>
                        <div className="row mx-auto">
                            {paginatedItems.map((item) => (
                                <div class="col-md-3">
                                    <div className="post-list-card">
                                        <a href={"/post-detail?id=" + item.postId} style={{ textDecoration: 'none' }}>
                                            <Card.Img variant="top" className='img-fluid' src={item.image} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                            <Card.Body>
                                                <div style={{ color: 'black' }}><strong>{item.productName}</strong></div>
                                                <div style={{ color: 'black' }}>{String(item.createdDate).substring(0, 10)}</div>
                                                <div style={{ color: 'orange', fontSize: '20px' }}>{VND.format(item.price).replaceAll(',', '.')} VND</div>
                                                <div className={cn(item.statusName === 'Completed' ? 'text-secondary' : 'text-success')}>{item.statusName}</div>
                                            </Card.Body>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>}
                </div>
            </div>
        </div>
    )

    return (
        <>
            <HeaderFE />
            <div className='d-flex padding-bot'>
                <div className='flex-1 container text-white bg-body-tertiary w-100 min-vh-100'>
                    <h5 className='text-dark m-3'>Purchased Posts</h5>
                    {filteredList.length === 0 ?
                        <div className='create-post d-flex justify-content-center align-items-center'>
                            <div className=''>
                                <span className='col-12'><h5 className='text-dark'>You haven't purchased anything, go buy some :/</h5>
                                </span>
                                <div className='col-12 text-dark d-flex justify-content-center'><button onClick={() => {navigate('/selling')}} className="btn btn-info">Go to Selling List</button><button onClick={() => {navigate('/donating')}} className="btn btn-warning">Go to Donating List</button></div>
                            </div>
                        </div> : renderPost}
                </div>
            </div>
            <FooterFE />
        </>
    )
}
