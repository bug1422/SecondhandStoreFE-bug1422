import { VictoryBar, VictoryTheme } from 'victory';
import { useState, useEffect, useMemo, useCallback } from 'react'
import Menu from '../Sidebar';
import Cookies from 'universal-cookie'
import axios from "axios"
import { Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const styles = {
    height: {
        padding: "0",
        height: "30px",
    }
}

export const TransactionManagement = () => {
    axios.defaults.baseURL = 'https://localhost:7115';
    const cookies = new Cookies();
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [all, setAll] = useState([])
    const [pending, setPending] = useState([])
    const [completed, setCompleted] = useState([])
    const [userProcessingList, setUserProcessingList] = useState([])
    let VND = new Intl.NumberFormat('vn-VN', {
        currency: 'VND',
    });
    const acceptOrder = async (orderId) => {
        const response = await axios({
            url: '/topup/accept-topup',
            params: { id: orderId },
            method: 'put'
        }).catch(e => {
            setError('Something went wrong!')
            console.log(e)
        })
    }
    const fetchData = async () => {
        await axios.get("/topup/get-all-topup-order")
            .then((data) => {
                const list = data.data.slice(0).reverse()
                setAll(list)
                var accountList = []
                list.map((item) => {
                    if (accountList.indexOf(item.accountId) === -1 && item.topUpStatus === 'Pending') accountList = [...accountList, item.accountId]
                })
                setUserProcessingList(accountList.sort((a, b) => a - b))
                setCompleted(data.data.filter((item) => {
                    return item.topUpStatus === "Completed"
                }))
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

    function accept(id) {
        console.log(id)
        acceptOrder(id)
        fetchData()
    }

    function acceptAll(pending) {
        pending.map((item) => {
            acceptOrder(item.orderId)
        })
        fetchData()
    }

    const renderPending = (pending) => {
        return (
            <>
                <div className='d-flex row'>
                    <h5 className='text-dark m-3 col-9'>{pending[0].fullName} - {pending[0].email} - Total: {VND.format(pending.reduce((a, v) => a = a + v.Price, 0)).replaceAll(',', '.')} VND - Just Added: { }</h5>
                    <div className='col-auto row align-items-center'>
                        <button onClick={() => { navigate('/user-detail?id=' + pending[0].accountId) }} className='btn btn-info profile-btn'>See Profile</button>
                        <button onClick={() => { acceptAll(pending) }} className='btn btn-info accept-all'>Accept All</button>
                    </div>
                </div>
                <div className='pending-box'>
                    <table className="table custom-table">
                        <thead>
                            <tr className='mb-1'>
                                <th scope="col">Order Id</th>
                                <th scope="col">Price</th>
                                <th scope="col">Date Created</th>
                                <th scope="col">Status</th>
                                <th scope="col">Options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pending.map((item) => (
                                <tr>
                                    <td>{item.orderId}</td>
                                    <td>{VND.format(item.price).replaceAll(',', '.')} VND</td>
                                    <td>{String(item.topUpDate).substring(0, 10)}</td>
                                    <td>{item.topUpStatus}</td>
                                    <td><button onClick={() => { accept(item.orderId) }} className='btn btn-info '>Accept</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table >
                </div >
                <br />
            </>
        )
    }

    const renderComplete = () => {
        return (
            <>
                {completed.length > 0 ? <>
                    <div className='list-box'>
                        <table className="table custom-table">
                            <thead>
                                <tr className='mb-1'>
                                    <th scope="col">Order Id</th>
                                    <th scope="col">Profile</th>
                                    <th scope="col">Point</th>
                                    <th scope="col">Date Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {completed.map((item) => (
                                    <tr>
                                        <td>{item.orderId}</td>
                                        <td>
                                            <div>
                                                <td className='profile-row'>
                                                    <button onClick={() => { navigate('/user-detail?id=' + item.accountId) }} className=' btn btn-info'>View Profile</button>
                                                </td>
                                                <td className='profile-row'>
                                                    <span className=''>{item.fullName} - {item.email}</span>
                                                </td>
                                            </div>
                                        </td>
                                        <td>{item.topUpPoint}</td>
                                        <td>{String(item.topUpDate).substring(0, 10)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table >
                    </div>
                </> : <h5 className="text-dark m-3 text-capitalize">There's no pending order!</h5>}
                <br />
            </>
        )
    }
    return (
        <div className='d-flex'>
            <div className='flex-1 container text-white bg-body-tertiary w-100 min-vh-100'>
                <h1 className='text-capitalize order-admin-title teal'>Pending Order</h1>
                <Divider />
                {userProcessingList.length > 0 ? userProcessingList.map((id) => (
                    renderPending(all.filter((item) => {
                        return item.accountId === id && item.topUpStatus === 'Pending'
                    }))
                )) : < div className="h4 text-center text-dark m-3 text-capitalize" > There's no pending order!</div>}
                <br />
                < h1 className='text-capitalize order-admin-title teal'>Completed Order</h1>
                <Divider />
                {completed.length > 0 ? renderComplete() :
                    < div className="h4 text-center text-dark m-3 text-capitalize" > There's no completed order!</div>}
            </div>
        </div >
    )
}
