import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from 'react'
import Menu from '../Sidebar'
import { Pagination } from '../../../components/pagination/Pagination';
import Cookies from 'universal-cookie'
import axios from "axios"
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner';
let itemPerPage = 10

export const ReportList = () => {
    axios.defaults.baseURL = 'https://localhost:7115';
    const cookies = new Cookies()
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [currentPage, setCurrentPage] = useState(NaN)

    const fetchData = async () => {
        await axios.get('/posts/get-post-list')
            .then((data) => {
                setPosts(data.data)
                setCurrentPage(1)
                setIsLoading(false)
            })
            .catch(e => setIsError(e))
    }

    useEffect(() => {
        //setIsLoading(true)
        let cookie = cookies.get('jwt_authorization')
        axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie;
        //fetchData()
    }, [])

    const lastPage = Math.ceil(posts.length / itemPerPage);
    const currTableData = useMemo(() => {
        let firstPageIndex = (currentPage - 1) * itemPerPage;
        let lastPageIndex = firstPageIndex + itemPerPage;
        console.log(firstPageIndex)
        console.log(lastPageIndex)
        console.log(posts.slice(firstPageIndex, lastPageIndex))
        return posts.slice(firstPageIndex, lastPageIndex)
    }, [currentPage])

    const errorMessage = (
        <div className='grey-screen row g-3 mt-3'>Something went wrong. Check connection</div>
    )

    const renderList = (
        <>
            {currTableData.length > 0 ? <>
                <table className="table custom-table">
                    <thead>
                        <tr className='mb-1'>
                            <th scope="col" className='text-center'>Report Id</th>
                            <th scope="col">Report user</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone number</th>
                            <th scope="col">Reason</th>
                            <th scope="col">Status</th>
                            <th scope="col" className='text-center'>Edit</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table >
                <Pagination currentPage={currentPage} lastPage={lastPage} maxLength={7} setCurrentPage={setCurrentPage} />

            </> : <h5 className="text-dark m-3 text-capitalize">There's no reported user!</h5>}
        </>
    )
    return (
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
                <h5 className='text-dark m-3 text-capitalize'>Report list</h5>
                {isLoading ? <LoadingSpinner /> : renderList}
            </div>
        </div>
    )
}
