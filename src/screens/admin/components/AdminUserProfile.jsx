import "bootstrap/dist/css/bootstrap.min.css"
import Avatar from "../../../assets/images/user.png"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Cookies from 'universal-cookie'
import { useState, useEffect } from "react"
import HeaderFE from "../../../components/HeaderFE"
import FooterFE from "../../../components/FooterFE"
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import { Card } from "react-bootstrap"
import jwt from 'jwt-decode'
import { Divider, Rating, Dialog, DialogTitle, List, ListItem } from "@mui/material"
import { LoadingSpinner } from "../../../components/loading/LoadingSpinner"


export const AdminUserProfile = () => {
    axios.defaults.baseURL = 'https://localhost:7115'
    const queryParameter = new URLSearchParams(window.location.search)
    const accountId = queryParameter.get("id")
    const navigate = useNavigate()
    const cookies = new Cookies()
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [errorComment, setErrorComment] = useState('')
    const [errorReport, setErrorReport] = useState('')
    const [Owner, setOwner] = useState('')
    const [account, setAccount] = useState([])
    const [review, setReview] = useState([])
    const [posts, setPosts] = useState([])
    const [value, setValue] = useState(0);
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [choice, setChoice] = useState('')
    const [isOpen, setOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null);
    const [result, setResult] = useState('')

    const fetchData = async () => {
        await axios.get('/account/get-account-by-id?id=' + accountId)
            .then((data) => {
                if (data.data.accountId === 1) navigate(-1)
                else {
                    setAccount(data.data)
                    setIsLoading(false)
                }
            })
            .catch((e) => {
                console.log(e)
                setIsError(true)
                setIsLoading(false)
            })
    }

    const fetchReview = async () => {
        await axios.get('/account/get-all-review-for-a-particular-user?userId=' + accountId)
            .then((data) => {
                setReview(data.data.slice(0).reverse())
                setIsLoading(false)
            })
            .catch((e) => {
                console.log(e)
                setIsError(true)
                setIsLoading(false)
            })
    }

    useEffect(() => {
        let cookie = cookies.get('jwt_authorization')
        if (cookie !== undefined) {
            axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie
            setOwner(jwt(cookie)['accountId'])
            fetchData()
            fetchReview()
        }
        else {
            navigate('/', { replace: true })
        }
    }, [])

    const profile = (
        <div className="row justify-content-center">
            <div className='row'>
                <div className='col-2 back-btn'>
                    <button onClick={() => { navigate(-1) }} type="button" className="btn btn-light fw-medium text-uppercase mb-5">
                        ←Back
                    </button>
                </div>
            </div>
            <div className="col-md-4">
                <div className="card-custom mt-5" style={{ overflowY: "scroll" }}>
                    <div className="card-body d-flex align-items-center">
                        <img
                            src={Avatar}
                            alt="User Avatar"
                            className="rounded-circle mr-3"
                        />
                        <div>
                            <h5 className="card-title mb-0">{account.fullName}</h5>
                            <p className="card-text">{account.email}</p>
                        </div>
                    </div>
                    <div className="card-body d-flex flex-column">
                        <h3 className="py-2">Phone Number: {account.phoneNo}</h3>
                        <h3 className="py-2" style={{ wordBreak: "break-all" }}>Address: {account.Address}</h3>
                        <h3 className="py-2">Credibility Point: {account.credibilityPoint}</h3>
                        <h3 className="py-2">Point Balance: {account.pointBalance}</h3>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card-custom mt-5">
                    <div style={{ height: '400px', overflowY: 'scroll' }}>
                        {review.length === 0 ? <div className="h1 text-center">{Owner === accountId ? "You have no review" : "This user has no review"}</div> :
                            <div>
                                <div className="h1 text-center">Review</div>
                                {review.map((item) => (
                                    <div className="row mx-auto">
                                        <span className="col-12 ">
                                            <a href={"/user-detail?id=" + item.reviewId} className="h6 text-left">{item.reviewerName} ({item.reviewerEmail})</a>
                                            <Rating
                                                name="simple-controlled"
                                                value={item.ratingStar}
                                                readOnly
                                            /> -&ensp;
                                            <span className="lead">{String(item.createdDate).substring(0, 10)}</span>
                                        </span>
                                        <div className="col-12">{item.description}</div>
                                    </div>
                                ))}
                            </div>}
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <>
            <div className="padding-40 px-5">
                {profile}
            </div>
        </>
    )
}