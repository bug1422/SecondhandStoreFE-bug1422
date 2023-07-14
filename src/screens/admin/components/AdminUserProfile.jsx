import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react'
import Modal from 'react-modal'
import { LoadingSpinner } from "../../../components/loading/LoadingSpinner"
import Avatar from "../../../assets/images/user.png"
import Cookies from 'universal-cookie'
import axios from "axios"

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

export const AdminUserProfile = () => {
    axios.defaults.baseURL = 'https://localhost:7115'
    const location = useLocation()
    const accountId = location.state
    const navigate = useNavigate();
    const cookies = new Cookies();
    const [isLoading, setIsLoading] = useState(true)
    const [account, setAccount] = useState([])
    const [modalIsOpen, setIsOpen] = useState(false);
    const fetchData = async () => {
        await axios.get('/account/get-account-by-id', { params: { id: accountId } })
            .then((data) => {
                setAccount(data.data)
                setIsLoading(false)
            })
            .catch(e => console.log(e))
    }
    const updateStatus = async () => {
        const response = await axios({
            url: '/account/toggle-account-status',
            params: { id: accountId },
            method: 'put'
        })
        if (response.data.body) alert("something went wrong")
        else alert("Successfully " + (account.isActive ? "deactivated" : "activated") + " this user")
    }
    useEffect(() => {
        let cookie = cookies.get('jwt_authorization')
        if (cookie !== undefined) {
            axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie;
            fetchData()
        }
        else {
            navigate('/auth/login', { replace: true })
        }
    }, [])

    function openModal() {
        setIsOpen(true)
    }

    function handleModal() {
        updateStatus()
        window.location.reload()
        setIsOpen(false)
    }
    function closeModal() {
        setIsOpen(false)
    }


    const profile = (
        <div className='p-5'>
            <button type="button" onClick={() => { navigate(-1) }} className="btn btn-light fw-medium text-uppercase mb-5">←Back</button>
            <div className="row g-3 px-5 h-100">
                <div className="col-md-6 flex-grow-1 overflow-auto">
                    <div className="col card h-100 bg-body-tertiary">
                        <div style={{ background: "#FEC401" }} className="card-body rounded text-uppercase card-main d-flex flex-column align-items-center">
                            <img className='profile-avt' src={Avatar} alt="" />
                            <h1 className='fs-medium text-center'>Username</h1>
                            <h5 className='text-center'>Role: {account.roleId}</h5>
                            <h5 className='text-center'>Account Id: {account.accountId}</h5>
                            {account.isActive ? <h5 className="text-primary">Active</h5> : <h5 className="text-secondary">Deactivated</h5>}
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
                    <div className="popup">
                        {account.isActive ?
                            <button type="button" className="btn btn-danger" onClick={openModal}>Deactive</button> :
                            <button type="button" className="btn btn-success" onClick={openModal}>Activate</button>
                        }
                        <Modal
                            isOpen={modalIsOpen}
                            // onAfterOpen={afterOpenModal}
                            onRequestClose={closeModal}
                            style={customStyles}
                            contentLabel="Example Modal"
                        >
                            <span>
                                <h2>Are you sure to {account.isActive ? "deactivate" : "activate"} this user</h2>
                            </span>
                            <button type="button" className="btn btn-success" onClick={handleModal}>Yes</button>
                            <button type="button" className="btn btn-danger" onClick={closeModal}>No</button>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    )
    return (
        <>
            {isLoading ? <LoadingSpinner /> : profile}
        </>
    )
}
