import { VictoryBar, VictoryTheme } from 'victory';
import { useState, useEffect, useMemo, useCallback } from 'react'
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner';
import { Pagination } from '../../../components/pagination/Pagination';
import Menu from '../Sidebar';
import Cookies from 'universal-cookie'
import axios from "axios"
let itemPerPage = 10

const styles = {
    height: {
        padding : "0",
        height: "30px",
    }
}

export const RevenueManagement = () => {
    axios.defaults.baseURL = 'https://localhost:7115';
    const cookies = new Cookies();
    const [revenues, setRevenues] = useState([])
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(NaN)

    const fetchData = async () => {
        await axios.get("/topup/get-all-topup-order")
            .then((data) => {
                setRevenues(data.data)
                setCurrentPage(1)
                setIsLoading(false)
            })
            .catch((e) => {
                setError(e)
                console.log(e)
            })
    }
    const handle_request = async (topupId) => {
        const response = await axios({
            url: "/topup/accept-topup",
            params: { id:  topupId},
            method: "put"
        })
        alert("Success")
        window.location.reload()
    }

    useEffect(() => {
        setIsLoading(true)
        let cookie = cookies.get('jwt_authorization')
        axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie;
        fetchData()
    }, [])

    const lastPage = Math.ceil(revenues.length / itemPerPage);
    const currTableData = useMemo(() => {
        let firstPageIndex = (currentPage - 1) * itemPerPage;
        let lastPageIndex = firstPageIndex + itemPerPage;
        return revenues.slice(firstPageIndex, lastPageIndex)
    }, [currentPage])

    const errorMessage = (
        <div className='grey-screen row g-3 mt-3'>Something went wrong. Check connection</div>
    )

    const renderRevenue = (
        <>
            {currTableData.length > 0 ? <>
                <table className="table custom-table">
                    <thead>
                        <tr className='mb-1'>
                            <th scope="col">Order Id</th>
                            <th scope="col">Account Id</th>
                            <th scope="col">Top-up Point</th>
                            <th scope="col">Price</th>
                            <th scope="col">Date</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currTableData.map((revenue) => (
                            <tr>
                                <td>{revenue.orderId}</td>
                                <td>{revenue.accountId}</td>
                                <td>{revenue.topUpPoint}</td>
                                <td>{revenue.price}</td>
                                <td className='text-secondary'>{revenue.topUpDate}</td>
                                <td className='align-self-start'>{revenue.topUpStatus === "Pending" ? 
                                <button className='btn btn-primary' onClick={()=>{
                                    if(window.confirm("Are you sure to switch this request to complete")){
                                        handle_request(revenue.orderId)
                                    }
                                }} style={styles.height}>Pending
                                </button> : <div>Completed</div>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table >
                <Pagination currentPage={currentPage} lastPage={lastPage} maxLength={7} setCurrentPage={setCurrentPage} />
            </> : <h5 className="text-dark m-3 text-capitalize">There's no revenue order!</h5>}
        </>

    )

    return (
        <div className='d-flex'>
            <Menu selected='revenue' />
            <div className='flex-1 container text-white bg-body-tertiary w-100 min-vh-100'>
                {error && errorMessage}
                {/* <div className="input-group col-3 border rounded-pill bg-body-secondary search-field my-3">
                    <span className="input-group-text bg-body-secondary border-0 rounded-pill" id="basic-addon1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>
                    </span>
                    <input type="text" className="form-control border-0 rounded-pill bg-body-secondary" placeholder="Search" aria-label="Search" aria-describedby="basic-addon1" />
                </div> */}
                <h5 className='text-dark m-3'>Revenue</h5>
                {isLoading ? <LoadingSpinner /> : renderRevenue}
                {/* <div className="row mt-5">
                    <div className="col">
                        <h5 className='text-uppercase text-dark text-center'>Revenue chart</h5>
                        <VictoryBar
                            style={{
                                data: { fill: "#0884F5" }
                            }}
                            data={[
                                { quarter: 1, earnings: 13000 },
                                { quarter: 2, earnings: 16500 },
                                { quarter: 3, earnings: 14250 },
                                { quarter: 4, earnings: 19000 }
                            ]}
                            x="quarter"
                            y="earnings" />
                    </div>
                    <div className="col d-flex justify-content-center flex-column align-items-center">
                        <div className="d-flex w-100 justify-content-center">
                            <button className='btn rounded-pill border button_hover-dark m-3 border-black revenue-btn'>Choose date</button>
                            <button className='btn rounded-pill border button_hover-dark m-3 border-black revenue-btn'>Choose date</button>
                        </div>
                        <div className="d-flex ">
                            <button className='btn rounded-pill bg-warning button_hover-dark revenue-btn'>Confirm</button>
                        </div>
                        <div className="container text-dark p-3 rounded m-3" style={{ background: "#12e265", width: "280px" }}>
                            <h5>Total Revenue</h5>
                            <h1>2,000</h1>
                            <p>↑ Since yesterday</p>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}
