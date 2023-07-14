import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { LoadingSpinner } from "../../../components/loading/LoadingSpinner"
import Cookies from 'universal-cookie'
import jwt from 'jwt-decode'
import axios from "axios"
import cn from 'classnames'
export const SignUp = () => {
    axios.defaults.baseURL = 'https://localhost:7115';

    const navigate = useNavigate()
    const cookies = new Cookies()
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [aggree, setAggree] = useState(false)

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
        setTimeout(() => { setIsLoading(false) }, 2000)
    }, [])
    const fetchToken = async (email, password) => {
        await axios.post("/account/login", {
            email: email,
            password: password
        }).then((data) => {
            let token = data.data.token
            let expireTime = 60 * 60
            cookies.set("jwt_authorization", token, { path: '/', maxAge: expireTime })
            setIsLoading(false)
            setIsSubmitted(true)
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
            console.log(e)
            alert("Wrong email or password")
            setIsLoading(false)
        })
    }
    const fetchData = async (data) => {
        await axios.post("/account/create-new-account", {
            email: data['email'],
            password: data['pass'],
            fullname: data['firstName'] + " " + data['lastName'],
            address: data['address'],
            phoneNo: data['phone']
        }).then((data) => {
            setTimeout(() => {
                fetchToken(data.data.email, data.data.password)
            }, 2000)
        }).catch(e => {
            console.log(e)
            alert(e)
            setIsLoading(false)
        })
    }


    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData)
        const keys = Object.keys(data)
        for (let i = 0; i < keys.length; i++) {
            if (data[keys[i]] === '') {
                alert("Failed to create an account\n" + keys[i] + " is empty.")
                return
            }
        }
        if (data['pass'] !== data['rePass']) {
            alert("Failed to create an account\nConfirm password doesn't match password.")
            return
        }
        setIsLoading(true)
        fetchData(data)
    }

    const renderForm = (
        <form className="form row m-3" onSubmit={onSubmit}>
            <div className="col-md-6 mb-3">
                <label for="firstName" className="form-label text-white">First name</label>
                <input type="text" className="form-control" name="firstName" required />
            </div>
            <div className="col-md-6 mb-3">
                <label for="lastName" className="form-label text-white">Last name</label>
                <input type="text" className="form-control" name="lastName" required />
            </div>
            <div className="col-md-6 mb-3">
                <label for="dob" className="form-label text-white">DoB</label>
                <input type="date" className="form-control" name="dob" required />
            </div>
            <div className="col-md-6 mb-3">
                <label for="phone" className="form-label text-white">Phone number</label>
                <input type="text" pattern="[0-9]*" placeholder="123456789" className="form-control" name="phone" required />
            </div>
            <div className="col-md-12 mb-3">
                <label for="email" className="form-label text-white">Email</label>
                <input type="email" placeholder="abc@fpt.edu.vn" className="form-control" name="email" required />
            </div>
            <div className="col-md-12 mb-3">
                <label for="address" className="form-label text-white">Address</label>
                <input type="text" className="form-control" name="address" required />
            </div>
            <div className="col-md-12 mb-3">
                <label for="pass" className="form-label text-white">Password</label>
                <input type="password" minlength="4" maxlength="8" size="8" className="form-control" name="pass" required />
            </div>
            <div className="col-md-12 mb-3">
                <label for="rePass" className="form-label text-white">Confirm password</label>
                <input type="password" minlength="4" maxlength="8" size="8" className="form-control" name="rePass" required />
            </div>
            <div className="col-md-12 mb-3 flex items-center">
                <input type="checkbox" className="form-check-input" id="policies" onChange={() => {
                    const t = aggree
                    setAggree(!t)
                    }} />
                <label className="form__check-label" for="policies">I am aggree with all</label>
                <a className="form-check-label text-warning" href="/policy"> policies</a>
            </div>
            <div className="col-md-12 d-flex justify-content-center">
                <button type="submit" className={cn("btn btn-dark", {disabled: !aggree})}>Sign up</button>
            </div>
        </form>
    )
    return (
        <div className="wrapper">
            <h1 className="form__heading my-3 text-capitalize">Join our community today!</h1>
            {isLoading ? <LoadingSpinner /> : <>
                {isSubmitted ? <div>User has successfully signed up, redirecting back to homepage...</div> : <div className="form-wrapper">
                    {renderForm}
                </div>}
            </>}
            <a className="link__color my-3 col-md-auto d-flex justify-content-center" href="/auth/login">Already have an account?</a>
        </div>
    );
}