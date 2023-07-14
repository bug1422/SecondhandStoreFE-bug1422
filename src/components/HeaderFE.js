import { Link, useNavigate } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Form, Button } from 'react-bootstrap'
import Logo from "../assets/images/logo1.png"
import Avatar from "../assets/images/user.png"
import { useState, useEffect } from "react"
import Cookies from "universal-cookie"
import axios from "axios"
export default function HeaderFE() {
    const navigate = useNavigate()
    const cookies = new Cookies()
    axios.defaults.baseURL = "https://localhost:7115"
    const [isFetched, setIsFetched] = useState(false)
    const [account, setAccount] = useState([])
    const fetchData = async () => {
        await axios.get('/account/get-user-account')
            .then((data) => {
                setAccount(data.data)
            })
            .catch(e => console.log(e))
    }

    const logout = () => {
        cookies.remove('jwt_authorization', { path: '/' });
        alert("Successfully logged out!")
    }
    useEffect(() => {
        let cookie = cookies.get('jwt_authorization')
        if (cookie !== undefined) {
            axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie;
            fetchData()
            setIsFetched(true)
        }
    }, [])

    const logged = (
        <>
            <Nav.Link href="/payment-request" className='contact-detail'>
                <div className='d-flex justify-content-center btn'>
                    Point: {account.pointBalance}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z" />
                    </svg>
                </div>
            </Nav.Link>
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
                    <Link draggable='false' className="dropdown-item" to="/post-list">My Post</Link>
                    <Link draggable='false' className="dropdown-item" to="/exchange-request">My Request</Link>
                    <Link draggable='false' className="dropdown-item" to="/user-profile">Profile</Link>
                    <Link draggable='false' className="dropdown-item" to="/payment-history">Payment History</Link>
                    {account.roleId == 'AD' &&
                        <a draggable='false' className="dropdown-item" href="/admin/admin-home">Admin Dashboard</a>
                    }
                    <a href='/' className="dropdown-item" onClick={() => { logout() }}>Log out</a>
                </div>
            </Nav>
        </>
    )
    return (
        <>
            <Navbar className='header'>
                <Container>
                    <Navbar.Brand draggable='false' href="/" className='logo-container'><img draggable='false' className='logo_header' src={Logo} alt='SecondhandStore' /></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className='me-auto col-md-4'>
                            {/* {!window.location.pathname.includes('/search') && <Form className="d-flex w-100" onSubmit={handleForm}>
                                    <Form.Control
                                        name='searchText'
                                        type="search"
                                        placeholder="Search"
                                        className="me-2"
                                        aria-label="Search"
                                    />
                                    <Button variant="success" type='submit'><ion-icon name="search-outline"></ion-icon></Button>
                                </Form>} */}
                        </Nav>
                        <Nav className='col-md-10 contact'>
                            <Nav.Link href="/search" className='contact-detail'>
                                <button type="button" className="btn btn-info">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box2-heart-fill" viewBox="0 0 16 16">
                                        <path d="M3.75 0a1 1 0 0 0-.8.4L.1 4.2a.5.5 0 0 0-.1.3V15a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4.5a.5.5 0 0 0-.1-.3L13.05.4a1 1 0 0 0-.8-.4h-8.5ZM15 4.667V5H1v-.333L1.5 4h6V1h1v3h6l.5.667Z" />
                                    </svg>
                                    <span>All of our product</span>
                                </button>
                            </Nav.Link>
                            <Nav.Link href="/search" className='contact-detail'>
                                <button type="button" className="btn btn-warning">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box2-heart-fill" viewBox="0 0 16 16">
                                        <path d="M3.75 0a1 1 0 0 0-.8.4L.1 4.2a.5.5 0 0 0-.1.3V15a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4.5a.5.5 0 0 0-.1-.3L13.05.4a1 1 0 0 0-.8-.4h-8.5ZM8.5 4h6l.5.667V5H1v-.333L1.5 4h6V1h1v3ZM8 7.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132Z" />
                                    </svg>
                                    <span> Donated product</span>
                                </button>
                            </Nav.Link>
                            {isFetched ? logged :
                                <>
                                    <Nav.Link href="/auth/login" className='contact-detail font-weight-bold'>Login</Nav.Link>
                                    <Nav.Link href="/auth/register" className='contact-detail font-weight-bold'>Sign up</Nav.Link>
                                </>
                            }
                            <Nav.Link href="/post-create" className='contact-detail'>
                                <button type="button" className="btn btn-light"><span>
                                    Post a product
                                </span></button>
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}
