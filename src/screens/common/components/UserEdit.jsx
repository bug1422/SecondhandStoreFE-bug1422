import "bootstrap/dist/css/bootstrap.min.css";
import Avatar from "../../../assets/images/user.png"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie'
import { useState, useEffect } from "react";
import HeaderFE from "../../../components/HeaderFE";
import FooterFE from "../../../components/FooterFE";

export const UserEdit = () => {
  axios.defaults.baseURL = 'https://localhost:7115'
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [account, setAccount] = useState([])
  const [phone, setPhone] = useState()
  const [address, setAddress] = useState()
  const [error, setError] = useState('')
  const validPhone = new RegExp('(0[3|5|7|8|9])+([0-9]{8})')

  const fetchData = async () => {
    await axios.get('/account/get-user-account')
      .then((data) => {
        setAccount(data.data)
        setIsLoading(false)
        setPhone(data.data.phoneNo)
        setAddress(data.data.address)
      })
      .catch((e) => {
        console.log(e)
        setIsError(true)
        setIsLoading(false)
      })
  }
  const updateAccount = async () => {
    const response = await axios({
      url: '/account/update-account',
      data: {
        "address": address,
        "phoneNo": phone
      },
      method: 'put'
    }).catch(e => {
      setError('Something went wrong!')
      console.log(e)
    })
    if (error === '') navigate('/user-detail?id=' + account.accountId)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (address === '') {
      setError('Address is empty')
      return
    }
    if (phone === '') {
      setError('Phone number is empty')
      return
    }
    if (!validPhone.test(phone)) {
      setError('Phone number is not in correct format')
      return
    }
    if (error === '') {
      updateAccount()
    }
  }

  useEffect(() => {
    let cookie = cookies.get('jwt_authorization')
    if (cookie !== undefined) {
      axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie;
      fetchData()
    }
    else {
      navigate('/', { replace: true })
    }
  }, [])


  const profile = (
    <div className="row justify-content-center">
      <div className="col-4"></div>
      <div style={{ width: '60%' }}>
        <div className="col-md-6 justify-content-center">
          <div className="card-custom mt-5">
            <div className='row back-btn'>
              <button onClick={() => { navigate(-1) }} type="button" className="btn btn-light fw-medium text-uppercase">
                ←Back
              </button>
            </div>
            <div className="row card-body d-flex align-items-center">

              <div className="row col-12 align-items-center">
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
            </div>
            <h1 className="text-dark">Update contact</h1>
            <h5 className="font-italic">*Only you and buyer that you have accepted request can see this information</h5>
            <form onSubmit={(e) => { handleSubmit(e) }} style={{ width: '70%' }} className="mx-2 justify-content-center">
              <label className="col-12">Phone Number</label>
              <input value={phone} onChange={(e) => {
                setError('')
                setPhone(e.target.value)
              }} className="col-12" id="phone" name="phone" type="text" />
              <label className="col-12">Address</label>
              <textarea value={address} onChange={(e) => {
                setError('')
                setAddress(e.target.value)
              }} className="col-12" rows={2}></textarea>
              <div className="py-3 col-12 d-flex justify-content-end">
                <button type="submit" className='confirm-btn' >Submit
                </button>
              </div>
              <p style={{ margin: 'auto', padding: '10px 0px 0px 0px' }} className="error">{error}</p>
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