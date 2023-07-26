import { useNavigate } from "react-router-dom"
import React, { useState, useEffect } from 'react'
import { LoadingSpinner } from "../../../components/loading/LoadingSpinner"
import Cookies from 'universal-cookie'
import jwt from 'jwt-decode'
import axios from "axios"
import '../styles/form.css'
import cn from 'classnames'

export const LogIn = () => {
    axios.defaults.baseURL = 'https://localhost:7115'

    const navigate = useNavigate()
    const cookies = new Cookies()
    const [remem, setRemem] = useState(false)
    const [visible, setVisible] = useState(false)
    const [error, setError] = useState('')
    useEffect(() => {
        let cookie = cookies.get('jwt_authorization')
        if (cookie !== undefined) {
            let decoded = jwt(cookie)
            if (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "US") {
                navigate('/', { replace: true })
            }
            else if (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "AD") {
                navigate('/admin/dashboard', { replace: true })
            }
        }
    }, [])

    const fetchData = async (email, password) => {
        await axios.post("/account/login", {
            email: email,
            password: password
        }).then((data) => {
            let token = data.data.token
            let expireTime = remem ? 60 * 60 * 24 * 365 : 60 * 60
            cookies.set("jwt_authorization", token, { path: '/', maxAge: expireTime })
            let decoded = jwt(token)
            if (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "US") {
                navigate('/', { replace: true })
            }
            else if (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "AD") {
                navigate('/admin/dashboard', { replace: true })
            }
        }).catch((error) => {
            if (!error.response) {
                // network error
                setError("Can't connect to server. Try again later!")
            } else {
                setError("Wrong email or password")
            }
        })
    }

    const onSubmit = (e) => {
        setError("")
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData)
        if (data.email === "" || data.password === "") {
            setError("Email or password is missing!")
        }
        else {
            fetchData(data.email, data.password)
        }
    }

    const renderForm = (
        <div style={{ width: "30%", margin: "auto" }} id="all">
            <div className="box">
                <h1 className="title">Log in</h1>
                <hr />
                <form onSubmit={(e) => { onSubmit(e) }} className="row mt-3">
                    <div className="col-md-12 text-left h5">
                        <label for="email">Email</label>
                    </div>
                    <div className="form-group col-md-12 mb-3 form-check flex items-center">
                        <input id="email" name="email" type="text" className="form-control" />
                    </div>
                    <div className="col-md-12 text-left h5">
                        <label for="password">Password&emsp;
                            <span className="checkbox text-bold h6">
                                <input type="checkbox" onChange={() => { setVisible(!visible) }} className="form-check-input" />
                                Show
                            </span>
                        </label>
                    </div>
                    <div className="form-group col-md-12 mb-3 form-check flex items-center">
                        <input id="password" name="password" type={cn(visible ? "text" : "password")} className="form-control" />
                    </div>
                    <div className="form-group col-md-12 mb-3 form-check flex items-center">
                        <div className="checkbox">
                            <input onChange={(e) => setRemem(e.target.value)} type="checkbox" className="form-check-input" id="policies" />
                            <label className="form-check-label text-bold" for="policies">&nbsp;Remember me</label>
                        </div>
                        <p className="text-muted mb-2">Don't have an account ? <a style={{ color: 'blue', fontWeight: 'bold' }} href="/auth/signup">Sign up here</a></p>
                    </div>
                    <div className="col-12 d-flex justify-content-end">
                        <button type="submit" className="btn auth-btn">
                            Login
                        </button>
                    </div>
                    <p style={{ margin: 'auto', padding: '10px 0px 0px 0px' }} className="error">{error}</p>
                </form>
            </div>
        </div>
    )

    return (
        <div className="padding-40">
            {renderForm}
        </div>
    )
}