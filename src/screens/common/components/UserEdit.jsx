import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from "../../../assets/images/user.png"
import Cookies from "universal-cookie"
import axios from "axios"
import jwt from "jwt-decode"
import { useEffect } from 'react'

export const UserEdit = () => {
    const navigate = useNavigate()
    const cookies = new Cookies()
    axios.defaults.baseURL = "https://localhost:7115"

    useEffect(() => {
        let cookie = cookies.get('jwt_authorization')
        if (cookie === undefined) {
            navigate('/', { replace: true })
        }
    }, [])
    return (
        <div className='p-5'>
            <button type="button" className="btn btn-light fw-medium text-uppercase mb-5">
            <Link to="/user-detail">←Back</Link>
            </button>
            <div className="row g-4 px-5 h-100">
                <div className="col-md-4 flex-grow-1 overflow-auto">
                    <div className="col card h-100 bg-body-tertiary">
                        <div style={{ background: "#FEC401" }} className="card-body rounded text-uppercase card-main d-flex flex-column align-items-center">
                            <img className='profile-avt' src={Avatar} alt="" />
                            <h1 className='fs-medium text-center'>Username</h1>
                            <h5 className='text-center'>Role: Customer</h5>
                            <h5 className='text-center'>Account Id: 1</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-8 px-5 flex-grow-1 overflow-auto">
                    <h3 className='title text-center'>Profile Setting</h3>
                    <div className="col-md-12 mb-3">
                    <label for="username" className="form-label text-dark">Full name</label>
                    <input type="text" className="form-control" id="username" />
                </div>

                <div className="col-md-12 mb-3">
                    <label for="address" className="form-label text-dark">Password</label>
                    <input type="text" className="form-control" id="password" />                   
                </div>
                <div className="col-md-12 mb-3">
                    <label for="address" className="form-label text-dark">Phone Number</label>
                    <input type="text" className="form-control" id="number" />                   
                </div>
                   <div className="col-md-12 mb-3">
                    <label for="address" className="form-label text-dark">Address</label>
                    <input type="text" className="form-control" id="address" />                   
                </div>
                </div>
            </div>
            
            <div className="col-md-11 d-flex justify-content-end">
                    <button type="submit" className="btn btn-success text-uppercase mb-5 mt-1">
                    <Link to="/user-detail">Save</Link>
                    </button>     
        </div>
        </div>
    )
}
