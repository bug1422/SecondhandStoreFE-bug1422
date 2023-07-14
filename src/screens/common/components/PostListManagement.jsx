import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from 'react'
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner';
import { Pagination } from '../../../components/pagination/Pagination';
import Cookies from 'universal-cookie'
import axios from "axios"
import HeaderFE from "../../../components/HeaderFE";
import FooterFE from "../../../components/FooterFE";
let itemPerPage = 10

export const PostListManagement = () => {
    axios.defaults.baseURL = 'https://localhost:7115'
    const navigate = useNavigate()
    const cookies = new Cookies()
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [currentPage, setCurrentPage] = useState(NaN)

    let VND = new Intl.NumberFormat('vn-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const fetchData = async () => {
        await axios.get('/posts/get-own-posts')
            .then((data) => {
                setPosts(data.data)
                setCurrentPage(1)
                setIsLoading(false)
            })
            .catch(e => setIsError(e))
    }

    useEffect(() => {
        let cookie = cookies.get('jwt_authorization')
        if (cookie === undefined) navigate('/', { replace: true })
        setIsLoading(true)
        axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie;
        fetchData()
    }, [])
    // const [type, setType] = useState("");

    // useEffect(() => {
    //     setItems(
    //         data.items.filter((item) => item.type.includes(type))
    //     )
    // }, [type])
    
    const lastPage = Math.ceil(posts.length / itemPerPage);
    const currTableData = useMemo(() => {
        let firstPageIndex = (currentPage - 1) * itemPerPage;
        let lastPageIndex = firstPageIndex + itemPerPage;
        return posts.slice(firstPageIndex, lastPageIndex)
    }, [currentPage])

    const errorMessage = (
        <div className='grey-screen row g-3 mt-3'>Something went wrong. Check connection</div>
    )

    const renderPost = (
        <>
            {currTableData.length > 0 ? <>
                <table className="table custom-table">
                    <thead>
                        <tr className='mb-1'>
                            <th scope="col">Product name</th>
                            <th scope="col">Price</th>
                            <th scope="col">Post type</th>
                            <th scope="col">Category</th>
                            <th scope="col">Status</th>
                            <th scope="col">Priority score</th>
                            <th scope="col">Post date</th>
                            <th scope="col">Expire date</th>
                            <th scope="col">View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currTableData.map((post) => (
                            <tr>
                                <td>{post.productName}</td>
                                <td>{VND.format(post.price)}</td>
                                <td>{post.postTypeName}</td>
                                <td>{post.categoryName}</td>
                                <td>{post.postStatusName}</td>
                                <td>{post.postPriority}</td>
                                <td>{post.postDate}</td>
                                <td>{post.postExpiryDate}</td>
                                <td className='text-center text-warning'>
                                    <Link to={"/post-detail?id="+post.postId} >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
                                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                        </svg>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table >
                <Pagination currentPage={currentPage} lastPage={lastPage} maxLength={7} setCurrentPage={setCurrentPage} />
            </> : <h5 className="text-dark m-3 text-capitalize">You have no post!</h5>}
        </>
    )

    return (
        <>
            <HeaderFE />
            <div className='d-flex'>
                <div className='flex-1 container text-white bg-body-tertiary w-100 min-vh-100'>
                    <h5 className='text-dark m-3'>My Posts</h5>
                    {isLoading ? <LoadingSpinner /> : renderPost}
                </div>
            </div>
            <FooterFE />
        </>
    )
}
