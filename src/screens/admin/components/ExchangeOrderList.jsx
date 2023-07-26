import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from 'react'
import Cookies from 'universal-cookie'
import axios from "axios"
import Menu from "../Sidebar";
import { toLowerCaseNonAccentVietnamese } from '../../nonAccentVietnamese.js'
import { Pagination } from '@mui/material';
import { Stack } from "react-bootstrap";

const itemsPerPage = 8;

export const ExchangeOrderList = () => {
    axios.defaults.baseURL = 'https://localhost:7115'
    const cookies = new Cookies();
    const [all, setAll] = useState([])
    const [filteredList, setFilteredList] = useState([])
    const [query, setQuery] = useState('')
    let VND = new Intl.NumberFormat('vn-VN', {
        currency: 'VND',
    });
    const fetchData = async () => {
        await axios.get('/get-all-exchange-for-admin')
            .then((data) => {
                const list = data.data.slice(0).reverse()
                console.log(list)
                setAll(list)
                setFilteredList(list)
            })
            .catch((e) => { console.log(e) })
    }

    useEffect(() => {
        var updatedList = all;
        if (query !== '') {
            updatedList = updatedList.filter((item) => {
                let buyerName = toLowerCaseNonAccentVietnamese(item.buyerName)
                let buyerEmail = toLowerCaseNonAccentVietnamese(item.buyerEmail)
                let sellerName = toLowerCaseNonAccentVietnamese(item.sellerName)
                let sellerEmail = toLowerCaseNonAccentVietnamese(item.sellerEmail)
                let productName = toLowerCaseNonAccentVietnamese(item.productName)
                let search = toLowerCaseNonAccentVietnamese(query)
                return buyerName.indexOf((search || '')) !== -1 ||
                    buyerEmail.indexOf((search || '')) !== -1 ||
                    sellerName.indexOf((search || '')) !== -1 ||
                    sellerEmail.indexOf((search || '')) !== -1 ||
                    productName.indexOf((search || '')) !== -1
            });

        }
        setFilteredList(updatedList);
    }, [query])

    useEffect(() => {
        let cookie = cookies.get('jwt_authorization')
        axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie;
        fetchData()
    }, [])

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

    const renderAccount = (
        <>
            <div className="row">
                <div class="col-sm-7 my-1">
                    <input value={query} onChange={(e) => { setQuery(e.target.value) }} type="text" name='keyword' class="form-control" id="inlineFormInputName" placeholder="Search for an order here" />
                </div>
                <div className="col-auto my-1">
                    <Stack alignItems="center">
                        <Pagination sx={{}} count={Math.ceil(filteredList.length / itemsPerPage)} onChange={(e, p) => { handlePageChange(e, p) }} variant="outlined" shape="rounded" />
                    </Stack>
                </div>
            </div>
            {
                filteredList.length > 0 ?
                    <div className="list-box">
                        <table className="table custom-table">
                            <thead>
                                <tr className='mb-1'>
                                    <th scope="col" className='text-center'>Order Id</th>
                                    <th scope="col">Product</th>
                                    <th scope="col">Buyer</th>
                                    <th scope="col">Seller</th>
                                    <th scope="col">Created Date</th>
                                    <th scope="col">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedItems.map((item) => (
                                    <tr>
                                        <td>{item.orderId}</td>
                                        <td><div>{item.productName}</div><div>{VND.format(item.price).replaceAll(',', '.')}VND</div></td>
                                        <td>
                                            <div>{item.buyerName}</div>
                                            <div>({item.buyerEmail})</div>
                                        </td>
                                        <td>
                                            <div>{item.sellerName}</div>
                                            <div>({item.sellerEmail})</div>
                                        </td>
                                        <td>{String(item.orderDate).substring(0, 10)}</td>
                                        <td>{item.orderStatusName}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table >
                    </div> :
                    <strong className="text-dark">No Order Found!</strong>
            }
        </>
    )

    return (
        <div className='d-flex'>
            <div className='flex-1 container text-white bg-body-tertiary w-100 min-vh-100'>
                <h5 className='text-dark m-3 text-capitalize'>Exchange Order list</h5>
                {renderAccount}
            </div>
        </div>
    )
}
