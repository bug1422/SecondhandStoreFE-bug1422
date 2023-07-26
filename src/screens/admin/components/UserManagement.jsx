import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from 'react'
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner';
import { Pagination } from '@mui/material';
import Cookies from 'universal-cookie'
import axios from "axios"
import { toLowerCaseNonAccentVietnamese } from '../../nonAccentVietnamese.js'
import { Dialog } from "@mui/material";
import { Stack } from "react-bootstrap";

const itemsPerPage = 7;

export const UserManagement = () => {
    axios.defaults.baseURL = 'https://localhost:7115'
    const cookies = new Cookies();
    const [all, setAll] = useState([])
    const [filteredList, setFilteredList] = useState([])
    const [selected, setSelected] = useState([])
    const [query, setQuery] = useState('')
    const [open, setOpen] = useState(false)
    const [choice, setChoice] = useState('')
    const [point, setPoint] = useState(0)

    const fetchData = async () => {
        await axios.get('/account/get-account-list')
            .then((data) => {
                const list = data.data.slice(0).reverse()
                setAll(list)
                setFilteredList(list)
            })
            .catch((e) => { console.log(e) })
    }
    const updatePoint = async (point) => {
        const response = await axios({
            url: '/account/edit-user',
            data: {
                accountId: selected.accountId,
                credibilityPoint: point
            },
            method: 'put'
        })
    }

    const updateStatus = async () => {
        const response = await axios({
            url: '/account/toggle-account-status',
            params: { id: selected.accountId },
            method: 'put'
        })
    }
    function handleOpen() {
        setOpen(true)
    }

    function handleAdd() {
        updatePoint(point)
        window.location.reload()
        setOpen(false)
    }

    function handleSub() {
        updatePoint(selected.credibilityPoint - 10)
        window.location.reload()
        setOpen(false)
    }

    function handleStatus() {
        updateStatus()
        window.location.reload()
        setOpen(false)
    }

    function handleClose() {
        setOpen(false)
    }

    const addDialog = (
        <>
            <h3>Type in the ammount of point to add for this user</h3>
            <h4>{selected.fullName} ({selected.email})</h4>
            <br />
            <input id="point" onChange={(e) => {
                setPoint(e.target.value <= 50 ? e.target.value : 50)
            }} name="point" placeholder="1 point equals 1.000 VND" type="number" min='0' value={Number(point).toString()} onWheel={() => document.activeElement.blur()} className="form-control" />
            <br />
            <div className='col-md-12 text-center'>
                <button style={{ height: "70px" }} type="button" className="btn btn-info col-md-5 yes-btn" onClick={handleAdd}>Yes</button>
                <button style={{ height: "70px" }} type="button" className="btn btn-info col-md-5 no-btn" onClick={handleClose}>No</button>
            </div>
        </>
    )

    const subDialog = (
        <>
            <h3>Are you sure to remove 10 point from this user's creadibility point</h3>
            <h4>{selected.fullName} ({selected.email})</h4>
            <div className='col-md-12 text-center'>
                <button style={{ height: "70px" }} type="button" className="btn btn-info col-md-5 yes-btn" onClick={handleSub}>Yes</button>
                <button style={{ height: "70px" }} type="button" className="btn btn-info col-md-5 no-btn" onClick={handleClose}>No</button>
            </div>
        </>
    )

    const statusDialog = (
        <>
            <h3>Are you sure to {selected.isActive ? "deactivate" : "activate"} this user</h3>
            <h4>{selected.fullName} ({selected.email})</h4>
            <div className='col-md-12 text-center'>
                <button style={{ height: "70px" }} type="button" className="btn btn-info col-md-5 yes-btn" onClick={handleStatus}>Yes</button>
                <button style={{ height: "70px" }} type="button" className="btn btn-info col-md-5 no-btn" onClick={handleClose}>No</button>
            </div>
        </>
    )

    useEffect(() => {
        var updatedList = all;
        if (query !== '') {
            updatedList = updatedList.filter((item) => {
                let address = item.address.toLowerCase()
                let email = item.email.toLowerCase()
                let phoneNo = item.phoneNo.toLowerCase()
                let name = toLowerCaseNonAccentVietnamese(item.fullName)
                let search = toLowerCaseNonAccentVietnamese(query)
                return name.indexOf((search || '')) !== -1 ||
                    email.indexOf((search || '')) !== -1 ||
                    phoneNo.indexOf((search || '')) !== -1 ||
                    address.indexOf((search || '')) !== -1
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
            <div class="col-sm-7 my-1">
                <input value={query} onChange={(e) => { setQuery(e.target.value) }} type="text" name='keyword' class="form-control" id="inlineFormInputName" placeholder="Search for an account here" />
            </div>
            <div className="col-auto my-1">
                <Stack alignItems="center">
                    <Pagination sx={{}} count={Math.ceil(filteredList.length / itemsPerPage)} onChange={(e, p) => { handlePageChange(e, p) }} variant="outlined" shape="rounded" />
                </Stack>
            </div>
            {
                filteredList.length > 0 ?
                    <div className="list-box">
                        <table className="table custom-table">
                            <thead>
                                <tr className='mb-1'>
                                    <th scope="col" className='text-center'>Account Id</th>
                                    <th scope="col">Full name</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone number</th>
                                    <th scope="col">Credibility score</th>
                                    <th scope="col">Point Balance</th>
                                    <th scope="col">Status</th>
                                    <th scope="col" style={{ textAlign: "center" }}>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedItems.map((account) => (
                                    <tr>
                                        <td>{account.accountId}</td>
                                        <td>{account.fullName}</td>
                                        <td>{account.address}</td>
                                        <td>{account.email}</td>
                                        <td>{account.phoneNo}</td>
                                        <td style={{ width: "10px" }}>{account.credibilityPoint}</td>
                                        <td>{account.pointBalance}</td>
                                        <td>{account.isActive ? <div className="text-primary">Active</div> : <div className="text-danger">Inactive</div>}</td>
                                        <td className='text-center'>
                                            {account.credibilityPoint <= 0 ?
                                                <button type="button" style={{ width: '100px', height: '50px', marginBottom: '10px', marginTop: "0px", paddingTop: "0px" }} className="btn btn-info yes-btn" onClick={() => {
                                                    setChoice('add')
                                                    setSelected(account)
                                                    handleOpen()
                                                }}>Add Point</button> :
                                                <button type="button" style={{ width: '100px', height: '50px', marginBottom: '10px', marginTop: "0px", paddingTop: "0px" }} className="btn btn-info no-btn" onClick={() => {
                                                    setChoice('sub')
                                                    setSelected(account)
                                                    handleOpen()
                                                }}>Subtract Point</button>
                                            }
                                            {account.isActive ?
                                                <button type="button" style={{ width: '100px', height: '50px', marginBottom: '10px', marginTop: "0px", paddingTop: "0px" }} className="btn btn-info no-btn" onClick={() => {
                                                    setChoice('status')
                                                    setSelected(account)
                                                    handleOpen()
                                                }}>Deactive</button> :
                                                <button type="button" style={{ width: '100px', height: '50px', marginBottom: '10px', marginTop: "0px", paddingTop: "0px" }} className="btn btn-info yes-btn" onClick={() => {
                                                    setChoice('status')
                                                    setSelected(account)
                                                    handleOpen()
                                                }}>Activate</button>
                                            }
                                            <Dialog onClose={() => {
                                                handleClose()
                                            }} open={open}>
                                                <div style={{ height: "300px" }}>
                                                    {
                                                        choice === 'add' ? addDialog :
                                                            choice === 'sub' ? subDialog :
                                                                choice === 'status' && statusDialog
                                                    }
                                                </div>
                                            </Dialog>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table >
                    </div > :
                    <strong className="text-dark">No Account Found!</strong>
            }
        </>
    )

    return (
        <div className='d-flex'>
            <div className='flex-1 container text-white bg-body-tertiary w-100 min-vh-100'>
                <h5 className='text-dark m-3 text-capitalize'>Admin User list</h5>
                {renderAccount}
            </div>
        </div>
    )
}
