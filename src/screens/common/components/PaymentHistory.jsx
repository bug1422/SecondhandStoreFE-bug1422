import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react'

import Cookies from 'universal-cookie'
import axios from "axios"
import { Pagination } from 'react-bootstrap';
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner';
import FooterFE from '../../../components/FooterFE';
import HeaderFE from '../../../components/HeaderFE';


let itemPerPage = 10

export const PaymentHistory = () => {
    const navigate = useNavigate()
    const cookies = new Cookies()
    const [topUps, setTopups] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [currentPage, setCurrentPage] = useState(NaN)

    const fetchData = async () => {
        await axios.get('/topup/user-history-transaction')
            .then((data) => {
                setTopups(data.data)
                setCurrentPage(1)
                setIsLoading(false)
            })
            .catch(e => setIsError(e))
    }

    useEffect(() => {
        let cookie = cookies.get('jwt_authorization')
        if (cookie === undefined) navigate('/', { replace: true })
        else {
            setIsLoading(true)
            axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie;
            fetchData()
        }
    }, [])

    const lastPage = Math.ceil(topUps.length / itemPerPage);
    const currTableData = useMemo(() => {
        let firstPageIndex = (currentPage - 1) * itemPerPage;
        let lastPageIndex = firstPageIndex + itemPerPage;
        return topUps.slice(firstPageIndex, lastPageIndex)
    }, [currentPage])

    const errorMessage = (
        <div className='grey-screen row g-3 mt-3'>Something went wrong. Check connection</div>
    )
    const renderTopUp = (
        <>
            {currTableData.length > 0 ? <>
                <table className="table custom-table">
                    <thead>
                        <tr className='mb-1'>
                            <th scope="col" className='text-center'>#</th>
                            <th scope="col">Status</th>
                            <th scope="col">Receipt No.</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Transaction Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currTableData.map((post) => (
                            <tr></tr>
                        ))}
                    </tbody>
                </table>
                <Pagination currentPage={currentPage} lastPage={lastPage} maxLength={7} setCurrentPage={setCurrentPage} />
            </> : <h5 className="text-dark m-3 text-capitalize">You haven't made any transaction!</h5>}
        </>
    )
    return (
        <>
            <HeaderFE />
            <div className='d-flex'>
                <div className='flex-1 container text-white bg-body-tertiary w-100 min-vh-100'>
                    {isError && errorMessage}
                    <h5 className='text-dark m-3'>My Payment History</h5>
                    {isLoading ? <LoadingSpinner /> : renderTopUp}
                </div>
            </div>
            <FooterFE />
        </>

    )
}
