import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react'
import { LoadingSpinner } from "../../../components/loading/LoadingSpinner"
import Cookies from 'universal-cookie'
import jwt from 'jwt-decode'
import axios from "axios"
import '../styles/login.css';

export const SignIn = () => {
    axios.defaults.baseURL = 'https://localhost:7115';

    const navigate = useNavigate();
    const cookies = new Cookies();
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [remem, setRemem] = useState(false)
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

    const fetchData = async (email, password) => {
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

    const onSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData)
        if (data.email === "" || data.password === "") {
            alert("Missing email or password")
        }
        else {
            setIsLoading(true)
            fetchData(data.email,data.password)
        }
    }
    const renderForm = (
        <div id="all">
            <div id="content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6">
                            <nav aria-label="breadcrumb">
                            </nav>
                        </div>
                        <div className="col-lg-6">
                            <div className="box">
                                <h1>Login</h1>
                                <hr />
                                <form onSubmit={(e)=>{onSubmit(e)}} className="row mt-3" action="customer-orders.html" method="post">
                                    <div className="form-group col-md-12 mb-3 form-check flex items-center">
                                        <label for="email">Email</label>
                                        <input id="email" name="email" type="text" className="form-control" />
                                    </div>
                                    <div className="form-group col-md-12 mb-3 form-check flex items-center">
                                        <label for="password">Password</label>
                                        <input id="password" name="password" type="password" className="form-control" />
                                    </div>
                                    <div className="col-md-12 mb-3 form-check flex items-center">
                                        <div className="mx-3">
                                            <input onChange={(e) => setRemem(e.target.value)} type="checkbox" className="form-check-input" id="policies" />
                                            <label className="form-check-label text-bold" for="policies">Remember me</label>
                                        </div>
                                    </div>
                                    <p className="text-muted col-md-8">Don't have an account ? <a href="/auth/register">Register here</a></p>
                                    <div className="col-md-1"></div>
                                    <button type="submit" className="btn btn-primary col-md-3">
                                        Login
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
    return (
        <div className="wrapper">
            {renderForm}
        </div >
    );
}