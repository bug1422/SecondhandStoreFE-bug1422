import { useState, useEffect } from 'react'
import { VictoryBar } from 'victory'
import DashboardImage from "../../../assets/images/dashboard_img.png"
import axios from 'axios';
import Menu from '../Sidebar';
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner';
import Cookies from 'universal-cookie';
import cn from 'classnames'
export const AdminHome = () => {
    axios.defaults.baseURL = 'https://localhost:7115'
    const cookies = new Cookies()
    const [accounts, setAccount] = useState([])
    const [posts, setPosts] = useState([])
    const [revenues, setRevenues] = useState([])
    const [displayStyle, setDisplayStyle] = useState('none')

    let VND = new Intl.NumberFormat('vn-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const fetchAccount = async () => {
        await axios.get('/account/get-account-list')
            .then(data => {
                setAccount(data.data)
            })
            .catch((e) => {
                console.log("failed to fetch accounts")
            })
    }
    const fetchPost = async () => {
        await axios.get('/posts/get-post-list')
            .then(data => {
                setPosts(data.data)
            })
            .catch(e => {
                console.log("failed to fetch posts")
            })
    }
    const fetchRevenue = async () => {
        await axios.get("/topup/get-total-revenue")
            .then((data) => {
                setRevenues(data.data)

            })
            .catch((e) => {
                console.log("failed to fetch revenue")
            })
    }
    useEffect(() => {
        let cookie = cookies.get('jwt_authorization')
        axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie;
        fetchAccount()
        fetchPost()
        fetchRevenue()
    }, [])

    function openMenu(){
        setDisplayStyle('block')
    }

    const errorMessage = (
        <div className='grey-screen row g-3 mt-3'>Something went wrong. Check connection</div>
    )

    const page = (
        <div className='container'>
            <div className="d-flex row justify-content-center">
                <div className="col text-center text-dark rounded m-3" style={{ background: "#FF9E9E" }}>
                    <h5 className='m-3 row-md-3'>Total User</h5>
                    <h1 className='m-3'>{accounts.length}</h1>
                </div>
                <div className="col text-center text-dark rounded m-3" style={{ background: "#0DB5EA" }}>
                    <h5 className='m-3 row-md-3'>Total Post </h5>
                    <h1 className='m-3'>{posts.length}</h1>
                </div>
                <div className="col text-center text-dark rounded m-3" style={{ background: "#12e265" }}>
                    <h5 className='m-3 row-md-3'>Total Revenue</h5>
                    <h1 className='m-3'>{VND.format(revenues)}</h1>
                </div>
            </div>
            <div className="row d-flex justify-content-center ">
                <h5 className='col-12 text-uppercase text-dark text-center'>Revenue chart</h5>
                <div className='graph'></div>
            </div>
        </div>
    )
    return (
        <>
            <div className='d-flex'>
                <div className='flex-1 container text-white bg-body-tertiary w-100 min-vh-100'>
                    <div className="col text-dark rounded p-3 m-2 dashboard" style={{ background: "#FFDB58" }}>
                        <div className="row">
                            <div className="col">
                                <h5>Welcome to your dashboard!</h5>
                                <p>This is OSE system admin dashboard designed to reflect an overview of the most important events inside the team. Please add comments on what you want changed.</p>
                            </div>
                            <div className="d-flex justify-content-center">
                                <img className='w-100' src={DashboardImage} alt="" />
                            </div>
                            {page}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
