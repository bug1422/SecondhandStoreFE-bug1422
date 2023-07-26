import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { LoadingSpinner } from "../../../components/loading/LoadingSpinner"
import Cookies from 'universal-cookie'
import jwt from 'jwt-decode'
import axios from "axios"
import cn from 'classnames'
import '../styles/style.css'
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';

export const SignUp = () => {
    axios.defaults.baseURL = 'https://localhost:7115';

    const navigate = useNavigate()
    const cookies = new Cookies()
    const [page, setPage] = useState(1)
    const [fName, setFirstName] = useState('')
    const [lName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [dob, setDob] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [pass, setPass] = useState('')
    const [rePass, setRePass] = useState('')
    const [error, setError] = useState('')
    const [visible, setVisible] = useState(false)
    const [aggreed, setAggreed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [completed, setCompleted] = useState(false)
    const validFPTedu = new RegExp("^[a-zA-Z0-9]+@fpt.edu.vn")
    const validFEedu = new RegExp("^[a-zA-Z0-9]+@fe.edu.vn")
    const validPhone = new RegExp('(0[3|5|7|8|9])+([0-9]{8})')

    useEffect(() => {
        let cookie = cookies.get('jwt_authorization')
        if (cookie !== undefined) {
            let decoded = jwt(cookie)
            if (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "US") {
                navigate('/', { replace: true })
            }
            else if (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "AD") {
                navigate('/admin/admin-home', { replace: true })
            }
        }
    }, [])
    const fetchToken = async (email, password) => {
        await axios.post("/account/login", {
            email: email,
            password: password
        }).then((data) => {
            setIsLoading(false)
            setCompleted(true)
            let token = data.data.token
            let expireTime = 60 * 60
            cookies.set("jwt_authorization", token, { path: '/', maxAge: expireTime })
            setTimeout(() => {
                let decoded = jwt(token)
                if (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "US") {
                    navigate('/', { replace: true })
                }
                else if (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "AD") {
                    navigate('/admin/admin-home', { replace: true })
                }
            }, 5000)
        }).catch(e => {
            setIsLoading(false)
            setError('Something went wrong. Try again later!')
            console.log(e)
        })
    }
    const fetchData = async (data) => {
        await axios.post("/account/create-new-account", {
            email: email,
            password: pass,
            fullname: fName + " " + lName,
            address: address,
            phoneNo: phone,
            dob: new Date(dob)
        }).then((data) => {
            setTimeout(() => {
                fetchToken(data.data.email, data.data.password)
            }, 2000)
        }).catch(e => {
            setIsLoading(false)
            setError('Something went wrong. Try again later!')
            console.log(e)
        })
    }


    function handleSubmit() {
        let isError = false
        var name = fName + ' ' + lName
        if (aggreed) console.log(aggreed)
        if (name === ' ') {
            setError('Name is empty!')
            isError = true
        }
        else if (email === '') {
            setError('Email is empty!')
            isError = true
        }
        else if (!validFEedu.test(email) && !validFPTedu.test(email)) {
            setError(email + ' is not an allowed email!')
            isError = true
        }
        if (isError) {
            setPage(1)
            return
        }
        // if(new Date().getFullYear() - new Date(dob).getFullYear() < 17)
        if (dob === '') {
            setError('Date of birth is empty!')
            isError = true
        }
        else if (phone === '') {
            setError('Phone number is empty!')
            isError = true
        }
        else if (!validPhone.test(phone)) {
            setError(phone + " is not a phone number!")
            isError = true
        }
        else if (address === '') {
            setError('Address is empty!')
            isError = true
        }
        if (isError) {
            setPage(2)
            return
        }
        if (pass === '') {
            setError('Password is empty')
            isError = true
        }
        else if (pass.length < 5) {
            setError('Password must be equal or greater than 5 characters!')
            isError = true
        }
        else if (rePass !== pass) {
            setError("Password confirmation doesn't match")
            isError = true
        }
        if (!aggreed) {
            setError("You haven't aggreed with our terms & conditions")
        }
        if (error === '' && aggreed) {
            setIsLoading(true)
            fetchData()
        }
    }

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        for (const value of formData.values()) {
            if (value === '') {
                setError("Please fill in the form!")
                return
            }
        }
        const data = Object.fromEntries(formData)
        fetchData(data)
    }

    const firstPage = (
        <>
            <div className="h5 row col-12">
                <span className="col-5 text-left pl-3">
                    <label for="firstName">First Name*</label>
                </span>
                <span className="col-6 pl-1">
                    <label for="lastName">Last Name*</label>
                </span>
            </div>
            <div className="form-group col-md-12 mb-3 form-check d-flex justify-content-between">
                <input value={fName} onChange={(e) => {
                    setError('')
                    setFirstName(e.target.value.toLocaleUpperCase())
                }} placeholder="NGUYEN VAN" id="firstName" name="firstName" type="text" className={cn("col-5 form-control", fName !== '' && 'font-weight-bold')} />
                <input value={lName} onChange={(e) => {
                    setError('')
                    setLastName(e.target.value.toLocaleUpperCase())
                }} placeholder="A" id="lastName" name="lastName" type="text" className={cn("col-6 form-control", lName !== '' && 'font-weight-bold')} />
            </div>
            <div className="col-md-12 text-left h5">
                <label for="email">Email*</label>
            </div>
            <div className="form-group col-md-12 mb-3 form-check">
                <input value={email} onChange={(e) => {
                    setError('')
                    setEmail(e.target.value)
                }} id="email" name="email" placeholder="Your fpt.edu.vn email" type="email" className={cn("form-control", email !== '' && 'font-weight-bold')} />
            </div>
        </>
    )
    const secondPage = (
        <>
            <div className="h5 row col-13">
                <div className="pl-3"></div>
                <span className="col-5 text-left pl-3">
                    <label for="dob">Birth*</label>
                </span>
                <span className="col-5 pl-1">
                    <label for="phone">Phone Number*</label>
                </span>
            </div>
            <div className="form-group col-md-12 mb-3 form-check d-flex justify-content-between">
                <input value={dob} onChange={(e) => {
                    setError('')
                    setDob(e.target.value)
                }} id="dob" name="dob" type="date" className={cn("col-5 form-control", dob !== '' && 'font-weight-bold')} />
                <div className="col-1"></div>
                <input value={phone} onChange={(e) => {
                    setError('')
                    setPhone(e.target.value)
                }} placeholder="0394567890" id="phone" name="phone" type="text" className={cn("col-6 form-control", phone !== '' && 'font-weight-bold')} />
            </div>
            <div className="col-md-12 text-left h5">
                <label for="email">Address*</label>
            </div>
            <div className="form-group col-md-15 mb-3 form-check text-left h4">
                <textarea value={address} onChange={(e) => {
                    setError('')
                    setAddress(e.target.value)
                }} placeholder="High-tech park Long Thạnh Mỹ Ward District, Hồ Chí Minh City" id="address" name="address" type="text" rows='2' className="form-control" />
            </div>
        </>
    )
    const thirdPage = (
        <>
            <div className="col-md-12 row">
                <div className="form-group col-md-12 text-left h5">
                    <label for="password">Password*&emsp;
                        <span className="checkbox text-bold h6">
                            <input type="checkbox" onChange={() => {
                                setError('')
                                setVisible(!visible)
                            }} className="form-check-input" />
                            Show
                        </span>
                    </label>
                </div>
                <div className="col-12 h4">
                    <input id="password" name="password"
                        type={cn(visible ? "text" : "password")}
                        className={cn("form-control", pass !== '' && 'font-weight-bold')}
                        placeholder="Password must be at least 5 characters long"
                        value={pass} onChange={(e) => {
                            setError('')
                            setPass(e.target.value)
                        }}
                    />
                </div>
                <div className="col-md-12 text-left h5">
                    <label for="confirm-password">Confirm Password*</label>
                </div>
                <div className="form-group col-md-12 mb-3 form-check flex items-center ">
                    <input id="confirm-password" name="confirm-password"
                        type={cn(visible ? "text" : "password")}
                        className={cn("form-control", rePass !== '' && 'font-weight-bold')}
                        placeholder="Confirm your password"
                        value={rePass} onChange={(e) => {
                            setError('')
                            setRePass(e.target.value)
                        }}
                    />
                </div>
            </div>
        </>
    )
    const renderForm = (
        <>
            <div style={{ width: "35%", margin: "auto" }} id="all">
                <div className="box">
                    <h1 className="title">Sign Up</h1>
                    <hr />
                    <h6>Page {page} of 3</h6>
                    <form onSubmit={(e) => { e.preventDefault() }} className="row mt-3">
                        <div style={{ height: '220px' }}>
                            {page === 1 ?
                                firstPage :
                                page === 2 ?
                                    secondPage :
                                    thirdPage
                            }
                        </div>
                        <div style={{ paddingLeft: '35px' }} className="col-md-12 text-left checkbox">
                            <input type="checkbox" id='aggreed' onChange={() => {
                                setError('')
                                setAggreed(!aggreed)
                            }} value='checked' className="form-check-input" />
                            <label className="form-check-label text-bold" for="policies">&nbsp;I agree with all <a href="/policy" target="_blank">terms & conditions</a>*</label>
                        </div>
                        <div className="col-md-6 text-left">
                            <p className="text-muted mb-2">Have an account? <a style={{ color: 'blue', fontWeight: 'bold' }} href="/auth/login">Log in here</a></p>
                        </div>
                        <div className="col-6 d-flex justify-content-end">
                            <div className={cn("auth-btn", page === 1 && 'disabled auth-btn-d')} onClick={() => { setPage(page - 1) }}>Back</div>
                            <div className={cn(page === 3 ? 'confirm-btn' : "auth-btn")} onClick={() => {
                                if (page !== 3) setPage(page + 1)
                                else handleSubmit()
                            }}>{page === 3 ? "Submit" : "Next"}</div>
                        </div>
                        <p style={{ margin: 'auto', padding: '10px 0px 0px 0px' }} className="error">{error}</p>
                    </form>
                </div>
            </div>
        </>
    )

    return (
        <div className="padding-40">
            <div style={{ height: '550px' }} className="text-center">

                {
                    completed ?
                        <div style={{ padding: '2% 0px' }}>
                            <div style={{ fontSize: '64px', color: 'green' }}>
                                ✔
                            </div>
                            <strong style={{ fontSize: '64px', letterSpacing: '3px' }}>Account created</strong>
                            <div style={{ fontSize: '25px' }}>Redirecting to homepage...</div>
                        </div>
                        : isLoading ? <LoadingSpinner /> : renderForm
                }
            </div>

        </div>
    );
}