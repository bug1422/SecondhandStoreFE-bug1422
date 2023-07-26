import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from 'react'
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner';
import { Pagination } from '@mui/material';
import Cookies from 'universal-cookie'
import axios from "axios"
import { toLowerCaseNonAccentVietnamese } from '../../nonAccentVietnamese.js'
import { Dialog } from "@mui/material";
import { Stack } from "react-bootstrap";
import cn from 'classnames'

const itemsPerPage = 7;

export const ReportManagement = () => {
    axios.defaults.baseURL = 'https://localhost:7115'
    const cookies = new Cookies();
    const [all, setAll] = useState([])
    const [processing, setProcessing] = useState([])
    const [accepted, setAccepted] = useState([])
    const [rejected, setRejected] = useState([])
    const [filteredList, setFilteredList] = useState([])
    const [status, setStatus] = useState('All');
    const [error, setError] = useState('')
    const [selected, setSelected] = useState([])
    const [open, setOpen] = useState(false)
    const [choice, setChoice] = useState('')


    function handleOpen() {
        setOpen(true)
    }

    function handleAccept(id) {
        acceptPost(id)
        window.location.reload()
    }

    function handleReject(id) {
        rejectPost(id)
        window.location.reload()
    }


    function handleClose() {
        setOpen(false)
    }

    const acceptPost = async () => {
        const response = await axios({
            url: '/report/accept-report',
            params: { reportId: selected.reportId },
            method: 'put'
        }).catch(e => {
            setError('Something went wrong!')
            console.log(e)
        })
        if (error !== '') window.location.reload()
    }

    const rejectPost = async () => {
        const response = await axios({
            url: '/report/reject-report',
            params: { reportId: selected.reportId },
            method: 'put'
        }).catch(e => {
            setError('Something went wrong!')
            console.log(e)
        })
        if (error !== '') window.location.reload()
    }

    const fetchData = async () => {
        await axios.get('/report/get-report-list-in-admin-dashboard')
            .then((data) => {
                const list = data.data.slice(0).reverse()
                setAll(list)
                setProcessing(list.filter((item) => { return item.status === 'Processing' }))
                setAccepted(list.filter((item) => { return item.status === 'Accepted' }))
                setRejected(list.filter((item) => { return item.status === 'Rejected' }))
                setFilteredList(list)
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
            case 'Processing':
                updatedList = [...processing]
                break
            case 'Accepted':
                updatedList = [...accepted]
                break
            case 'Rejected':
                updatedList = [...rejected]
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

    const acceptDialog = (
        <>
            <h3>Are you sure to accept this report</h3>
            <h4>{selected.reportedUserName} ({selected.reportedUserEmail})</h4>
            <div className='col-md-12 text-center'>
                <button style={{ height: "70px" }} type="button" className="btn btn-info col-md-5 yes-btn" onClick={handleAccept}>Yes</button>
                <button style={{ height: "70px" }} type="button" className="btn btn-info col-md-5 no-btn" onClick={handleClose}>No</button>
            </div>
        </>
    )

    const rejectDialog = (
        <>
            <h3>Are you sure to reject this report</h3>
            <h4>{selected.reportedUserName} ({selected.reportedUserEmail})</h4>
            <div className='col-md-12 text-center'>
                <button style={{ height: "70px" }} type="button" className="btn btn-info col-md-5 yes-btn" onClick={handleReject}>Yes</button>
                <button style={{ height: "70px" }} type="button" className="btn btn-info col-md-5 no-btn" onClick={handleClose}>No</button>
            </div>
        </>
    )

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
                            setFilteredList(processing)
                            setStatus('Processing')
                        }} class={cn("nav-link ", status == 'Processing' && 'active')} id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected=''>Processing Post ({processing.length})</button>
                        <button onClick={() => {
                            setFilteredList(accepted)
                            setStatus('Accepted')
                        }} class={cn("nav-link ", status == 'Accepted' && 'active')} id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected=''>Accepted Post ({accepted.length})</button>
                        <button onClick={() => {
                            setFilteredList(rejected)
                            setStatus('Rejected')
                        }} class={cn("nav-link ", status == 'Rejected' && 'active')} id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected=''>Rejected Post ({rejected.length})</button>
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
                                        case 'Processing':
                                            setFilteredList(processing)
                                            break
                                        case 'Accepted':
                                            setFilteredList(accepted)
                                            break
                                        case 'Rejected':
                                            setFilteredList(rejected)
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
                        {filteredList.length > 0 ? <>
                            <table className="table custom-table">
                                <thead>
                                    <tr className='mb-1'>
                                        <th scope="col" className='text-center'>Report Id</th>
                                        <th scope="col" style={{ width: '50px' }}>Reported Account</th>
                                        <th scope="col">Reporter</th>
                                        <th scope="col">Reason</th>
                                        <th scope="col">Evidence</th>
                                        <th scope="col">Date Created</th>
                                        <th scope="col">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedItems.map((item) => (
                                        <tr>
                                            <td>{item.reportId}</td>
                                            <td className="text-danger">
                                                <div>{item.reportedUserName}</div>
                                                <div>{item.reportedUserEmail}</div>
                                            </td>
                                            <td>
                                                <div>{item.reporterName}</div>
                                                <div>{item.reporterEmail}</div>
                                            </td>
                                            <td>{item.reason}</td>
                                            <td>
                                                <a href={item.reportImages[0].ImageUrl} target='_blank'>
                                                    <img style={{ width: '100px', height: '100px' }} src={item.reportImages[0].ImageUrl}></img>
                                                </a>
                                            </td>
                                            <td>{String(item.reportDate).substring(0, 10)}</td>
                                            <td className='text-center'>
                                                {item.status === "Processing" ?
                                                    <div className="text-secondary">Processing</div> :
                                                    item.status === "Accepted" ? <div className="text-primary">Accepted</div> :
                                                        item.status === "Rejected" && <div className="text-danger">Rejected</div>}
                                                {item.status === 'Processing' &&
                                                    <>
                                                        <button type="button" style={{ marginTop: "0px", paddingTop: "0px" }} className="btn btn-info yes-btn" onClick={() => {
                                                            setChoice('accept')
                                                            setSelected(item)
                                                            handleOpen()
                                                        }}>Accept</button>
                                                        <button type="button" style={{ marginTop: "0px", paddingTop: "0px" }} className="btn btn-info no-btn" onClick={() => {
                                                            setChoice('reject')
                                                            setSelected(item)
                                                            handleOpen()
                                                        }}>Reject</button>
                                                    </>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table >
                        </> : <h5 className="text-dark m-3 text-capitalize">No Post Found!</h5>}
                    </div>
                </div>
            </div>
            <Dialog onClose={() => {
                handleClose()
            }} open={open}>
                <div style={{ height: "200px" }}>
                    {choice === 'accept' ? acceptDialog : rejectDialog}
                    {error}
                </div>
            </Dialog>
        </>
    )

    return (
        <div className='d-flex'>
            <div className='flex-1 container text-white bg-body-tertiary w-100 min-vh-100'>
                <h5 className='text-dark m-3'>Report List</h5>
                {renderPost}
            </div>
        </div>
    )
}
