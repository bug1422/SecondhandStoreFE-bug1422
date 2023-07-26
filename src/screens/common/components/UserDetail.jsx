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

const itemsPerPage = 8

export const UserDetail = () => {
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
    const createComment = async () => {
        await axios.post('/submit-review', {
            "reviewedId": accountId,
            "ratingStar": value,
            "description": description
        })
            .then(() => {
                window.location.reload()
            })
            .catch((e) => {
                console.log(e)
                setIsError(true)
                setIsLoading(false)
            })
    }

    const createReport = async () => {
        await axios.post('/report/sending-report-form', {
            "reportedAccountId": accountId,
            "Reason": reason,
            "ImageUploadRequest": selectedImage,
        }, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
            .then(() => {
                setResult("Successfully report this user")
                setIsLoading(false)
                setOpen(false)
                setTimeout(() => {
                    window.location.reload()
                }, 3000)
            })
            .catch((e) => {
                console.log(e)
                setIsError(true)
                setIsLoading(false)
            })
    }

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

    function submitComment(e) {
        e.preventDefault()
        setErrorComment('')
        if (description === '') setErrorComment("Description is empty!")
        else if (value === 0) setErrorComment("You must rate this user to comment!")
        else {
            setChoice('comment')
            handleOpen()
        }
    }

    function submitReport(e) {
        e.preventDefault()
        setErrorReport('')
        if (reason === '') setErrorReport("Reason is empty!")
        else if (selectedImage === null) setErrorReport("You must have evidence to report!")
        else {
            setChoice('report')
            handleOpen()
        }
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)

    }

    const handleComment = () => {
        createComment()
        setOpen(false)
    }

    const handleReport = () => {
        setIsLoading(true)
        createReport()
    }


    const handle_image = (e) => {
        const img = e.target.files
        setSelectedImage(img[0])
    }

    const commentDialog = (
        <>
            <List>
                <ListItem>
                    <p className='col-md-12 dialog-p'>
                        You are about to add a comment on this user. Please don't put anything negative or you'll be reported!
                    </p>
                </ListItem>
                <ListItem>
                    <div className='col-md-12'>
                        <button className='btn btn-info col-md-3 yes-btn' onClick={() => { handleComment() }}>Yes</button>
                        <button className='btn btn-info col-md-3 no-btn' onClick={() => { handleClose() }}>No</button>
                    </div>
                </ListItem>
            </List>
        </>
    )

    const reportDialog = (
        <>
            {result === '' ? (isLoading ? <LoadingSpinner /> : <List>
                <ListItem>
                    <p className='col-md-12 dialog-p'>
                        You are about to report this user. We will investigate this user shortly!
                    </p>
                </ListItem>
                <ListItem>
                    <div className='col-md-12'>
                        <button className='btn btn-info col-md-3 yes-btn' onClick={() => { handleReport() }}>Yes</button>
                        <button className='btn btn-info col-md-3 no-btn' onClick={() => { handleClose() }}>No</button>
                    </div>
                </ListItem>
            </List>) :
                result
            }
        </>
    )

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
                        {Owner === accountId ?
                            <>
                                <h3 className="py-2">Phone Number: {account.phoneNo}</h3>
                                <h3 className="py-2" style={{ wordBreak: "break-all" }}>Address: {account.Address}</h3>
                                <h3 className="py-2">Credibility Point: {account.credibilityPoint}</h3>
                                <h3 className="py-2">Point Balance: {account.pointBalance}</h3>
                                <div className="row col-12">
                                    <button onClick={() => { navigate('/user-edit') }} className="col-4 btn btn-primary">Edit Contact</button>
                                </div>
                            </> :
                            <>
                                <h3>You can only view this user contact via your exchange order with them!</h3>
                                <br />
                                {result === '' ? <>
                                    <h3 className="text-danger">Reporting this user</h3>
                                    <form className="pl-2" onSubmit={(e) => { submitReport(e) }}>
                                        <label className="col-12">Reason*</label>
                                        <textarea className="col-12" name="reason" value={reason} onChange={(e) => { setReason(e.target.value) }} placeholder="Write your reason here" rows={2} />
                                        <label className="col-12">Evidence* </label>
                                        {selectedImage &&
                                            <a href={URL.createObjectURL(selectedImage)} target='_blank'>
                                                <img
                                                    className='col-12'
                                                    alt="not found"
                                                    style={{ width: '170px', height: '170px' }}
                                                    src={URL.createObjectURL(selectedImage)}
                                                />
                                            </a>
                                        }
                                        <input type="file" className="form-control" id="ImageUploadRequest" name="ImageUploadRequest" accept="image/jpeg, image/png" onChange={handle_image} />
                                        <button className="btn btn-info no-btn" type="submit">Report this user</button> <span className="text-danger">{errorReport}</span>
                                    </form>
                                </> : <div>
                                    <h3 className="font-italic text-info">{result}</h3>
                                    <h5 className="font-italic text-info">We'll look into this soon!</h5>
                                </div>}
                            </>
                        }
                        <div></div>
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
                    {Owner !== accountId &&
                        <>
                            <Divider />
                            <div>
                                <form className="pl-2" onSubmit={(e) => { submitComment(e) }}>
                                    <label className="col-12">Rating:
                                        <Rating
                                            name="simple-controlled"
                                            value={value}
                                            onChange={(event, newValue) => {
                                                setValue(newValue);
                                            }}
                                        />
                                    </label>
                                    <label className="col-12">Comment*</label>
                                    <textarea className="col-12" name="description" value={description} onChange={(e) => { setDescription(e.target.value) }} placeholder="Write your comment here" rows={2} />
                                    <button type="submit">Submit</button> <span className="text-danger">{errorComment}</span>
                                </form>
                            </div>
                        </>
                    }
                </div>
                <Dialog style={{ overflowY: 'auto' }} onClose={() => { handleClose(false) }} open={isOpen}>
                    <DialogTitle style={{ width: '650px' }}>
                        {choice === 'comment' ? commentDialog : reportDialog}
                    </DialogTitle>
                </Dialog>
            </div>
        </div>
    )

    return (
        <>
            <HeaderFE />
            <div className="padding-40 px-5">
                {profile}
            </div>
            <FooterFE />
        </>
    )
}