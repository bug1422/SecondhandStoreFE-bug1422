import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from 'react'
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner';
import { Pagination } from '../../../components/pagination/Pagination';
import Cookies from 'universal-cookie'
import axios from "axios"
import Menu from "../Sidebar";

let itemPerPage = 10
export const UserManagement = () => {
    axios.defaults.baseURL = 'https://localhost:7115'
    const cookies = new Cookies();
    const [accounts, setAccounts] = useState([])
    const [currentPage, setCurrentPage] = useState(NaN)

    const fetchData = async () => {
        await axios.get('/account/get-account-list')
            .then((data) => {
                setAccounts(data.data)
                setCurrentPage(1)
            })
            .catch((e)=>{console.log(e)})
    }


    useEffect(() => {
        let cookie = cookies.get('jwt_authorization')
        axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie;
        fetchData()
    }, [])

    const lastPage = Math.ceil(accounts.length / itemPerPage);
    const currTableData = useMemo(() => {
        let firstPageIndex = (currentPage - 1) * itemPerPage;
        let lastPageIndex = firstPageIndex + itemPerPage;
        return accounts.slice(firstPageIndex, lastPageIndex)
    }, [currentPage])


    const renderAccount = (
        <>
            {currTableData.length > 0 ? <>
                <table className="table custom-table">
                    <thead>
                        <tr className='mb-1'>
                            <th scope="col" className='text-center'>Account Id</th>
                            <th scope="col">Full name</th>
                            <th scope="col">Address</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone number</th>
                            <th scope="col">Credibility score</th>
                            <th scope="col">Status</th>
                            <th scope="col" style={{ textAlign: "center" }}>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currTableData.map((account) => (
                            <tr>
                                <td>{account.accountId}</td>
                                <td>{account.fullname}</td>
                                <td>{account.address}</td>
                                <td>{account.email}</td>
                                <td>{account.phoneNo}</td>
                                <td>{account.pointBalance}</td>
                                <td>{account.isActive ? <div>True</div> : <div>False</div>}</td>
                                <td className='text-center text-warning'>
                                    <Link to="/admin/user-detail" state={account.accountId}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                        </svg>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table >
                <Pagination currentPage={currentPage} lastPage={lastPage} maxLength={7} setCurrentPage={setCurrentPage} />
            </> : <h5 className="text-dark m-3 text-capitalize">There's no user!</h5>}
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
                    <input type="text" className="form-control border-0 rounded-pill bg-body-secondary" on placeholder="Search" aria-label="Search" aria-describedby="basic-addon1" />
                </div>
                <h5 className='text-dark m-3 text-capitalize'>Registered user list</h5>
                {renderAccount}
            </div>
        </div>
    )
}
