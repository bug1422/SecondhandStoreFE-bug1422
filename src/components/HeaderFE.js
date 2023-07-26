import { Link, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Form, Button } from 'react-bootstrap'
import Logo from "../assets/images/logo_transparent.png"
import Avatar from "../assets/images/user.png"
import { useState, useEffect } from "react"
import Cookies from "universal-cookie"
import axios from "axios"
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import jwt from 'jwt-decode'
import AddIcon from '@mui/icons-material/Add';

export default function HeaderFE() {
    const navigate = useNavigate()
    const cookies = new Cookies()
    axios.defaults.baseURL = "https://localhost:7115"
    const [isFetched, setIsFetched] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [post, setPost] = useState(0)
    const [request, setRequest] = useState(0)
    const [order, setOrder] = useState(0)
    const [purchased, setPurchased] = useState(0)
    const [account, setAccount] = useState([])
    const [error, setError] = useState('')
    const fetchData = async () => {
        await axios.get('/account/get-user-account')
            .then((data) => {
                setAccount(data.data)
                setIsFetched(true)
            })
            .catch(e => {
                setIsFetched(false)
                navigate('/server-down')
                console.log(e)
            })
    }
    const fetchNumber = () => {
        if (account["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] !== 'AD') {
            axios.get('/posts/get-user-posts').then((data) => { setPost(data.data.length) }).catch((e) => { console.log(e) })
            axios.get('/get-all-request-list').then((data) => { setRequest(data.data.length) }).catch((e) => { console.log(e) })
            axios.get('/get-all-order-list').then((data) => { setOrder(data.data.length) }).catch((e) => { console.log(e) })
            axios.get('/get-purchased-post').then((data) => { setPurchased(data.data.length) }).catch((e) => { console.log(e) })
        }
    }
    const logout = () => {
        cookies.remove('jwt_authorization', { path: '/' });
        alert("Successfully logged out!")
    }
    useEffect(() => {
        let cookie = cookies.get('jwt_authorization')
        if (cookie !== undefined) {
            axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie;
            if (jwt(cookie)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === 'AD') navigate('/admin/dashboard')
            else {
                fetchData()
                fetchNumber()
            }
        }
    }, [])

    const logged = (
        <>
            {/* <Nav className='contact-detail'>
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="28" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
            </Nav> */}
            <Nav className='dropdown contact-detail user-avt'>
                <button className='btn btn-default dropdown-toggle' type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img draggable='false' className='dropdown-toggle profile-avt' src={Avatar} alt="" />
                    <span class="caret"></span>
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {account.roleId == 'AD' ?
                        <a draggable='false' className="dropdown-item" href="/admin/dashboard">Admin Dashboard</a> :
                        <>
                            <Link draggable='false' className="dropdown-item" to={'/user-detail?id=' + account.accountId}>Profile</Link>
                            <Link draggable='false' className="dropdown-item" to="/post-list">My Posts ({post})</Link>
                            <Link draggable='false' className="dropdown-item" to="/people-order">People Orders ({order})</Link>
                            <Link draggable='false' className="dropdown-item" to="/my-request">My Requests ({request})</Link>
                            <Link draggable='false' className="dropdown-item" to="/my-purchase">My Purchases ({purchased})</Link>
                            <Link draggable='false' className="dropdown-item" to="/payment-history">Transaction History</Link>
                        </>
                    }
                    <a href='/' className="dropdown-item" onClick={() => { logout() }}>Log out</a>
                </div>
            </Nav>
            <Nav.Link href="/payment-request" className='contact-detail btn btn-outline-secondary'>
                <div className='d-flex justify-content-center '>
                    <AddIcon />
                    <span>Point: {account.pointBalance}</span>
                </div>
            </Nav.Link>
        </>
    )
    return (
        <>

            <Navbar className='header'>
                <Navbar.Brand draggable='false' href="/" className='logo-container'><img draggable='false' className='img-fluid' src={Logo} alt='SecondhandStore' /></Navbar.Brand>
                <Navbar.Toggle className='col-md-1' aria-controls="responsive-navbar-nav" />
                <div className='col-md-3 fixed'>
                </div>
                <Navbar id="col-md-auto align-self-end">
                    <Nav.Link href="/selling" className='contact-detail'>
                        <button type="button" className="btn btn-outline-info">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box2-heart-fill" viewBox="0 0 16 16">
                                <path d="M3.75 0a1 1 0 0 0-.8.4L.1 4.2a.5.5 0 0 0-.1.3V15a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4.5a.5.5 0 0 0-.1-.3L13.05.4a1 1 0 0 0-.8-.4h-8.5ZM15 4.667V5H1v-.333L1.5 4h6V1h1v3h6l.5.667Z" />
                            </svg>
                            <span>&nbsp;Selling product</span>
                        </button>
                    </Nav.Link>
                    <Nav.Link href="/donating" className='contact-detail'>
                        <button type="button" className="btn btn-outline-warning">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box2-heart-fill" viewBox="0 0 16 16">
                                <path d="M3.75 0a1 1 0 0 0-.8.4L.1 4.2a.5.5 0 0 0-.1.3V15a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4.5a.5.5 0 0 0-.1-.3L13.05.4a1 1 0 0 0-.8-.4h-8.5ZM8.5 4h6l.5.667V5H1v-.333L1.5 4h6V1h1v3ZM8 7.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132Z" />
                            </svg>
                            <span>&nbsp;Donated product</span>
                        </button>
                    </Nav.Link>
                    <Nav.Link href="/post-create" className='contact-detail'>
                        <button type="button" className="btn btn-outline-success">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-patch-plus-fill" viewBox="0 0 16 16">
                                <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zM8.5 6v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 1 0z" />
                            </svg>
                            <span>&nbsp;Post a product</span>
                        </button>
                    </Nav.Link>
                    {isFetched ? logged :
                        <>
                            <Nav.Link href="/auth/login" className='contact-detail font-weight-bold'>
                                <button type="button" className="btn btn-outline-dark">
                                    <span>
                                        <PersonOutlineIcon />&nbsp;Log In
                                    </span>
                                </button>
                            </Nav.Link>
                            <span className='seperator'></span>
                            <Nav.Link href="/auth/signup" className='contact-detail font-weight-bold'>
                                <button type="button" className="btn btn-outline-dark">
                                    <span>
                                        <PersonAddAltIcon />&nbsp;Sign Up
                                    </span>
                                </button>
                            </Nav.Link>
                        </>
                    }
                </Navbar>
            </Navbar>
        </>
    )
}
