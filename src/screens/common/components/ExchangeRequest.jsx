import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from 'react'
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner';
import { Pagination } from '../../../components/pagination/Pagination';
import Cookies from 'universal-cookie'
import axios from "axios"
import HeaderFE from "../../../components/HeaderFE";
import FooterFE from "../../../components/FooterFE";
let itemPerPage = 10

export const ExchangeRequest = () => {
    axios.defaults.baseURL = 'https://localhost:7115'
    const navigate = useNavigate()
    const cookies = new Cookies()
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [currentPage, setCurrentPage] = useState(NaN)

    const fetchData = async () => {
        await axios.get('/get-all-request-list')
            .then((data) => {
                setPosts(data.data)
                setCurrentPage(1)
                setIsLoading(false)
            })
            .catch(e => setIsError(e))
    }

    useEffect(() => {
        let cookie = cookies.get('jwt_authorization')
        if (cookie === undefined) navigate('/', { replace: true })
        setIsLoading(true)
        axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie;
        fetchData()
    }, [])
    // const [type, setType] = useState("");

    // useEffect(() => {
    //     setItems(
    //         data.items.filter((item) => item.type.includes(type))
    //     )
    // }, [type])

    const lastPage = Math.ceil(posts.length / itemPerPage);
    const currTableData = useMemo(() => {
        let firstPageIndex = (currentPage - 1) * itemPerPage;
        let lastPageIndex = firstPageIndex + itemPerPage;
        return posts.slice(firstPageIndex, lastPageIndex)
    }, [currentPage])

    const errorMessage = (
        <div className='grey-screen row g-3 mt-3'>Something went wrong. Check connection</div>
    )

    const renderPost = (
        <>
            {currTableData.length > 0 ? <>
                <table className="table custom-table mx-auto">
                    <thead>
                        <tr class='text-center mb-1'>
                            <th scope="col">Order</th>
                            <th scope="col">Product</th>
                            <th scope="col">Seller</th>
                            <th scope="col">Phone Number</th>
                            <th scope="col">email</th>
                            <th scope="col">Time</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currTableData.map((post) => (
                            <tr>

                            </tr>
                        ))}

                    </tbody>
                </table>
                <Pagination currentPage={currentPage} lastPage={lastPage} maxLength={7} setCurrentPage={setCurrentPage} />
            </> : <h5 className="text-dark m-3 text-capitalize">You have no request!</h5>}
        </>
    )
    const table = (
        <div className='d-flex'>


            <div className='flex-1 container text-white bg-body-tertiary w-100 min-vh-100'>

                <div className="input-group col-3 border rounded-pill bg-body-secondary search-field my-3">
                    <span className="input-group-text bg-body-secondary border-0 rounded-pill" id="basic-addon1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>
                    </span>
                    <input type="text" className="form-control border-0 rounded-pill bg-body-secondary" placeholder="Search" aria-label="Search" aria-describedby="basic-addon1" />
                </div>
                <h5 class="text-dark m-4 text-center h3">Exchange Request List</h5>
                <div class="col-md-12">
                    <table className="table custom-table mx-auto">
                        <thead>
                            <tr class='text-center mb-1'>
                                <th scope="col">Order</th>
                                <th scope="col">Product</th>
                                <th scope="col">Seller</th>
                                <th scope="col">Phone Number</th>
                                <th scope="col">email</th>
                                <th scope="col">Time</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    )
    return (
        <>
            <HeaderFE />
            {table}
            <FooterFE />
        </>
    )
}
