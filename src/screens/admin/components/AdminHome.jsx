import { useState, useEffect } from 'react'
import { VictoryBar } from 'victory'
import DashboardImage from "../../../assets/images/dashboard_img.png"
import axios from 'axios';
import Menu from '../Sidebar';
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner';
import Cookies from 'universal-cookie';
const data = [
    { quarter: 1, earnings: 13000 },
    { quarter: 2, earnings: 16500 },
    { quarter: 3, earnings: 14250 },
    { quarter: 4, earnings: 19000 }
];

export const AdminHome = () => {
    axios.defaults.baseURL = 'https://localhost:7115'
    const cookies = new Cookies()
    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [accounts, setAccount] = useState([])
    const [posts, setPosts] = useState([])
    const [revenues, setRevenues] = useState([])
    
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
                setIsError(true)
            })
    }
    const fetchPost = async () => {
        await axios.get('/posts/get-post-list')
            .then(data => {
                setPosts(data.data)
            })
            .catch(e => {
                console.log("failed to fetch posts")
                setIsError(true)
            })
    }
    const fetchRevenue = async () => {
        await axios.get("/topup/get-total-revenue")
            .then((data) => {
                setRevenues(data.data)

            })
            .catch((e) => {
                console.log("failed to fetch revenue")
                setIsError(true)
            })
    }
    useEffect(() => {
        setIsLoading(true)
        let cookie = cookies.get('jwt_authorization')
        axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie;
        fetchAccount()
        fetchPost()
        fetchRevenue()
        setIsLoading(false)
    }, [])

    const errorMessage = (
        <div className='grey-screen row g-3 mt-3'>Something went wrong. Check connection</div>
    )

    const page = (
        <>
            <div className="row g-3 mt-3">
                <div className="col text-dark rounded m-3" style={{ background: "#FF9E9E" }}>
                    <h5 className='m-3'>Total User</h5>
                    <h1 className='m-3'>{accounts.length}</h1>
                </div>
                <div className="col text-dark rounded m-3" style={{ background: "#0DB5EA" }}>
                    <h5 className='m-3'>Total Post </h5>
                    <h1 className='m-3'>{posts.length}</h1>
                </div>
                <div className="col text-dark rounded m-3" style={{ background: "#12e265" }}>
                    <h5 className='m-3'>Total Revenue</h5>
                    <h1 className='m-3'>{VND.format(revenues)}</h1>
                </div>
            </div>

            <div className="w-50 mx-auto">
                <h5 className='text-uppercase text-dark text-center'>Revenue chart</h5>
                <VictoryBar
                    style={{
                        data: { fill: "#0884F5" }
                    }}
                    data={data}
                    x="quarter"
                    y="earnings" />
            </div>
        </>
    )
    return (
        <>
            <div className='d-flex'>
                <Menu selected='overview' />
                <div className='flex-1 container text-white bg-body-tertiary w-100 min-vh-100'>
                    {isError && errorMessage}
                    <div className="col text-dark rounded p-3 m-2" style={{ background: "#FFDB58" }}>
                        <div className="row">
                            <div className="col">
                                <h5>Welcome to your dashboard!</h5>
                                <p>This is OSE system admin dashboard designed to reflect an overview of the most important events inside the team. Please add comments on what you want changed.</p>
                            </div>
                            <div className="col d-flex justify-content-center">
                                <img className='w-100' src={DashboardImage} alt="" />
                            </div>
                            {isLoading ? <LoadingSpinner /> : page}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
