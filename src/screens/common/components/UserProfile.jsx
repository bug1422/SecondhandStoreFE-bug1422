import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import { LoadingSpinner } from "../../../components/loading/LoadingSpinner"
import Avatar from "../../../assets/images/user.png"
import Cookies from 'universal-cookie'
import axios from "axios"
import HeaderFE from "../../../components/HeaderFE";
import FooterFE from "../../../components/FooterFE";

export const UserProfile = () => {
    axios.defaults.baseURL = 'https://localhost:7115'
    const navigate = useNavigate();
    const cookies = new Cookies();
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [account, setAccount] = useState([])

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
        let cookie = cookies.get('jwt_authorization')
        if (cookie !== undefined) {
            axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie;
            fetchData()
        }
        else {
            navigate('/', { replace: true })
        }
    }, [])
    const errorMessage = (
        <div className='grey-screen row g-3 mt-3'>Something went wrong. Check connection</div>
    )
    const profile = (
        <>
            {isError ? errorMessage : <div className='p-5'>
                <div className="row g-3 px-5 h-100">
                    <div className="col-md-6 flex-grow-1 overflow-auto">
                        <div className="col card h-100 bg-body-tertiary">
                            <div style={{ background: "#FEC401" }} className="card-body rounded text-uppercase card-main d-flex flex-column align-items-center">
                                <img className='profile-avt' src={Avatar} alt="" />
                                <h1 className='fs-medium text-center'>{account.fullname}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 px-5 flex-grow-1 overflow-auto">
                        <h3 className='title text-center'>User Information</h3>
                        <p className=''>NAME : {account.fullname}</p>
                        <p className=''>ADRESS : {account.address}</p>
                        <p className=''>PHONE NUMBER : {account.phoneNo}</p>
                        <p className=''>GMAIL : {account.email}</p>
                        {isNaN(account.reportReporters) && <p className=''>REASON: Scam, toxic, flake, unreal prices</p>}
                    </div>
                </div>
            </div>
            }
        </>
    )
    return (
        <>
            <HeaderFE />
            {isLoading ? <LoadingSpinner /> : profile}
            <FooterFE />
        </>
    )
}
