import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react'
import { LoadingSpinner } from "../../../components/loading/LoadingSpinner"
import Cookies from 'universal-cookie'
import jwt from 'jwt-decode'
import axios from "axios"

export const SignIn = () => {
    axios.defaults.baseURL = 'https://localhost:7115';

    const navigate = useNavigate();
    const cookies = new Cookies();
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [remem, setRemem] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
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

    const fetchData = async () => {
        await axios.post("/account/login", {
            email: email,
            password: password
        }).then((data) => {
            let token = data.data.token
            let expireTime = remem ? 60 * 60 * 24 * 365 : 60 * 60
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
        }).catch((error) => {
            if (!error.response) {
                // network error
                alert("Can't connect to server. Try again later!")
            } else {
                alert("Wrong email or password")
            }
            setIsLoading(false)
        })
    }

    const handleForm = () => {
        if (email === "" || password === "") {
            alert("Missing email or password")
        }
        else {
            setIsLoading(true)
            console.log('fetching ...')
            fetchData()
        }
    }
    const renderForm = (
        <form className="row m-3" onSubmit={(e) => {
            e.preventDefault()
            handleForm()
        }}>
            <div className="col-md-12 mb-3">
                <label for="email" className="form-label text-dark">Email</label>
                <input type="text" onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" />
            </div>
            <div className="col-md-12 mb-3">
                <label for="password" className="form-label text-dark">Password</label>
                <input type="password" onChange={(e) => setPassword(e.target.value)} className="form-control" id="password" />
                <a href="/auth/recovery-request" className="form-text link__color form__helper">
                    Forgot password?
                </a>
            </div>
            <div className="col-md-6 mb-3 form-check flex items-center">
                <div className="mx-3">
                    <input onChange={(e) => setRemem(e.target.value)} type="checkbox" className="form-check-input" id="policies" />
                    <label className="form-check-label text-bold" for="policies">Remember me</label>
                </div>
            </div>
            <div className="col-md-6 d-flex justify-content-end">
                <button type="submit" className="btn btn-dark">Login</button>
            </div>
            <div className="col-md-6 d-flex">
            </div>
        </form>
    )
    return (
        <div className="wrapper">
            <h1 className="form__heading my-3 text-capitalize">Login to second-hand web store</h1>
            {isLoading ? <LoadingSpinner /> :
                <>
                    {isSubmitted ? <div>User has successfully logged in, redirecting back to homepage...</div> : renderForm}
                </>}
            <a className="link__color my-3 col-md-auto d-flex justify-content-center" href="/auth/register">Don't have an account?</a>
        </div >
    );
}