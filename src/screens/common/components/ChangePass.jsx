import "bootstrap/dist/css/bootstrap.min.css";
import Avatar from "../../../assets/images/user.png"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie'
import { useState, useEffect } from "react";
import HeaderFE from "../../../components/HeaderFE";
import FooterFE from "../../../components/FooterFE";
import cn from 'classnames'

export const ChangePass = () => {
  axios.defaults.baseURL = 'https://localhost:7115'
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [cookie, setCookie] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [account, setAccount] = useState([])
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [error, setError] = useState('')
  const [visible, setVisible] = useState(false)

  const fetchData = async () => {
    await axios.get('/account/get-user-account')
      .then((data) => {
        setAccount(data.data)
        setIsLoading(false)
      })
      .catch((e) => {
        console.log(e)
        setIsError(true)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    let c = cookies.get('jwt_authorization')
    if (c !== undefined) {
      axios.defaults.headers.common['Authorization'] = 'bearer ' + c;
      setCookie(c)
      fetchData()
    }
    else {
      navigate('/', { replace: true })
    }
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (oldPass === '') {
      setError('Old Password is empty')
      return
    }
    if (newPass === '') {
      setError('New Password is empty')
      return
    }
    if (newPass < 5) {
      setError('Password must be equal or greater than 5 characters!')
      return
    }
    axios.post("/account/login", {
      email: account.email,
      password: oldPass
    }).then((data) => {
      if (data.data !== cookie) {
        setError("Old Password doesn't match")
        return
      }
    })
  }

  const profile = (
    <div className="row justify-content-center">
      <div className='row'>
        <div className='col-2 back-btn'>
          <button onClick={() => { navigate(-1) }} type="button" className="btn btn-light fw-medium text-uppercase mb-5">
            ←Back
          </button>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card-custom mt-5">
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
          <h1 className="pl-3 text-dark">Change Password</h1>
          <br />
          <div className="col-md-12 row">
            <form onSubmit={(e) => { e.preventDefault() }} className="pl-3 row mt-3">
              <div className="form-group col-md-12 text-left h5">
                <label for="password">Old Password*&emsp;
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
                  className={cn("form-control", oldPass !== '' && 'font-weight-bold')}
                  placeholder="Password must be at least 5 characters long"
                  value={oldPass} onChange={(e) => {
                    setError('')
                    setOldPass(e.target.value)
                  }}
                />
              </div>
              <div className="col-md-12 text-left h5">
                <label for="confirm-password">New Password*</label>
              </div>
              <div className="form-group col-md-12 mb-3 form-check flex items-center ">
                <input id="confirm-password" name="confirm-password"
                  type={cn(visible ? "text" : "password")}
                  className={cn("form-control", newPass !== '' && 'font-weight-bold')}
                  placeholder="Confirm your password"
                  value={newPass} onChange={(e) => {
                    setError('')
                    setNewPass(e.target.value)
                  }}
                />
                <div className="py-3 col-12 d-flex justify-content-end">
                  <div className='confirm-btn' onClick={() => {
                    handleSubmit()
                  }}>Submit
                  </div>
                </div>
                <p style={{ margin: 'auto', padding: '10px 0px 0px 0px' }} className="error">{error}</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
  return (
    <>
      <HeaderFE />
      <div className="padding-40">
        {profile}
      </div>
      <FooterFE />
    </>
  )
}