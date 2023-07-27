import { useState, useEffect } from 'react'
import HeaderFE from '../../../components/HeaderFE'
import FooterFE from '../../../components/FooterFE'
import axios from 'axios'
import cn from 'classnames'
import Cookies from 'universal-cookie'
import { useLocation, useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner'
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


export const PostEdit = () => {
    axios.defaults.baseURL = "https://localhost:7115"
    const cookies = new Cookies()
    const navigate = useNavigate()
    const location = useLocation()
    const postId = location.state
    const [price, setPrice] = useState(0)
    const [point, setPoint] = useState(20)
    const [prevPrice, setPrevPrice] = useState(price)
    const [prevPoint, setPrevPoint] = useState(point)
    const [maxPoint, setMaxPoint] = useState(0)
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDonating, setIsDonating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [post, setPost] = useState([]);
    const [productName, setProductName] = useState("")
    const [description, setDescription] = useState("")
    const [error, setError] = useState('')
    const [errorName, setErrorName] = useState('')
    const [errorCategory, setErrorCategory] = useState('')
    const [errorPrice, setErrorPrice] = useState('')
    const [errorType, setErrorType] = useState('')
    const [errorDescription, setErrorDescription] = useState('')
    const [success, setSuccess] = useState(false)

    let VND = new Intl.NumberFormat('vn-VN', {
        style: 'currency',
        currency: 'VND',
    });

    const getPost = async () => {
        await axios.get('/posts/get-post-by-id', { params: { id: postId } })
            .then((data) => {
                setPost(data.data)
                setProductName(data.data.productName)
                setPrice(data.data.price)
                setIsDonating(data.data.postStatusName === "Donate")
                setDescription(data.data.description)
            })
            .catch(e => console.log(e))
    }

    useEffect(() => {
        let cookie = cookies.get('jwt_authorization')
        if (cookie !== undefined) {
            axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie
            getPost()
        }
        else navigate('/auth/login', { replace: true })
    }, [])

    const handle_image = (e) => {
        console.log(e.target.files)
        const imgs = e.target.files
        setSelectedImage(imgs[0])
    }


    useEffect(() => {
        if (isDonating) {
            setPrevPrice(price)
            setPrevPoint(point)
            setPrice(0)
            setPoint(0)
        }
        else {
            setPrice(prevPrice)
            setPoint(prevPoint)
        }
    }, [isDonating])

    const onSubmit = async (e) => {
        setError('')
        e.preventDefault()
        // setIsLoading(true)
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData)
        setTimeout(async () => {
            if (selectedImage === null) {
                setError("Image is not selected")
                return
            }
            else {
                const response = await axios({
                    url: "posts/update-post?postId=" + postId,
                    data: {
                        ProductName: data.ProductName,
                        Description: data.Description,
                        Price: data.Price,
                        ImageUploadRequest: selectedImage === null ? null : data.ImageUploadRequest,
                    },
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    method: "put",
                }).then(() => {
                    setSuccess(true)
                    setTimeout(() => {
                        navigate('/post-detail?id=' + postId)
                    }, 2000)
                })
                    .catch((e) => {
                        setError("something went wrong!")
                        console.log(e)
                    })
            }
        }, 1000)
    }

    const handlePrice = (e) => {
        const n = e.target.value
        setPrice(parseInt(n))
    }

    const form = (
        <div id="all">
            <div id="content">
                <div className="container">
                    <div >
                        <div className="col-lg-3 col-md-12">
                            <nav aria-label="breadcrumb">
                            </nav>
                        </div>
                        <div className="">
                            <div className="box">
                                <h1 className='text-dark'>Post Editing</h1>
                                <hr />
                                <form className="container" onSubmit={onSubmit}>
                                    <div className='row'>
                                        <div className="form-group col-md-6 mb-3 form-check flex items-center">
                                            <label htmlFor="name" className="form-label form-split">Post name*</label><div className="text-danger">{errorName}</div>
                                            <input type="text" value={productName} placeholder='Enter your post name here' onBlur={() => {
                                                if (productName === '')
                                                    setErrorName(" This field is required")
                                                else
                                                    setErrorName('')
                                            }} onChange={(e) => {
                                                setProductName(e.target.value)
                                            }} id="ProductName" name="ProductName" className="form-control" />
                                        </div>
                                        <div className="form-group col-md-6 mb-3 form-check flex items-center">
                                            <div className="mb-3">
                                                <label htmlFor="price" className="form-label form-split">Price*</label><div className="text-danger">{errorPrice}</div>
                                                <div className="input-group">
                                                    <span className="input-group-text">VND</span>
                                                    <input type="number" value={price} placeholder='Enter your price here' onChange={(e) => { handlePrice(e) }} min="0" step="10"
                                                        id="Price" name="Price" className="form-control" onBlur={() => {
                                                            if (price < 1000)
                                                                setErrorPrice("Price has to be equal or greater than 1000₫")
                                                            else
                                                                setErrorPrice('')
                                                        }} />
                                                </div>
                                                <div>Total: {VND.format(isNaN(price) ? 0 : price)}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="form-group col-md-6 mb-3 form-check flex items-center">
                                            <div className='row'>
                                                <div className='col-md-6'>
                                                    <label htmlFor="category" className='form-label'>Choose a category</label><br />
                                                    <select name="CategoryId" id="CategoryId" className="form-select" disabled>
                                                        <option>{post.categoryName}</option>
                                                    </select>
                                                </div>
                                                <div className='col-md-6'>
                                                    <label htmlFor="PointCost" className="form-label">Point Cost</label>
                                                    <input type="number" value={point} id="PointCost" name="PointCost" className="form-control" disabled />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-6 mb-3 form-check flex items-center">
                                            <label htmlFor="type" className="form-label">Post type</label><br />
                                            <div className="form-check">
                                                <input type="radio" id="PostTypeId_1" disabled name="PostTypeId" checked={!isDonating} value="1" className="form-check-input" />
                                                <label htmlFor="PostTypeId_1" className="form-check-label">Selling</label>
                                            </div>
                                            <div className="form-check">
                                                <input type="radio" id="PostTypeId_2" disabled name="PostTypeId" checked={isDonating} value="2" className="form-check-input" />
                                                <label htmlFor="PostTypeId_2" className="form-check-label">Donating</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="form-group col-md-6 mb-3 form-check flex items-center">
                                            <div className="mb-3">
                                                <label htmlFor="image" className="form-label">Images*</label><br />
                                                <div className='col-md-12 form-image'>
                                                    {selectedImage && (
                                                        <div className='row'>
                                                            <div className='col-8 justify-content-md-center'>
                                                                <img
                                                                    className='col-5'
                                                                    alt="not found"
                                                                    width={"250px"}
                                                                    src={URL.createObjectURL(selectedImage)}
                                                                />
                                                            </div>
                                                            <div className='col-auto'>
                                                                <button className="btn btn-danger" onClick={() => {
                                                                    document.getElementById("ImageUploadRequest").value = "";
                                                                    setSelectedImage(null)
                                                                }}>Remove</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="input-group form-image">
                                                    <label htmlFor="" className="form-label col-md-12">New Image (Required):</label>
                                                    <input type="file" className="form-control" id="ImageUploadRequest" name="ImageUploadRequest" onChange={handle_image} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-6 mb-3 form-check flex items-center">
                                            <div className='row'>
                                                <label htmlFor="description" className="form-label">Description*</label><div className="text-danger">{errorPrice}</div>
                                                <textarea id="Description" name="Description" onBlur={() => {
                                                    if (description === '')
                                                        setErrorDescription("Price has to be equal or greater than 1000₫")
                                                    else
                                                        setErrorDescription('')
                                                }} placeholder='Enter the description of your product here.' maxLength='4000' value={description} onChange={(e) => { setDescription(e.target.value) }} className="form-control" rows="3"></textarea>
                                            </div>
                                            <div className='row'>
                                                {isDonating && <div>You don't have to pay point while donating. However, price is set to 0.</div>}
                                                <button type="submit" className={cn("btn btn-primary")}>Update Product</button>
                                                <p className="col-md-12 error">{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
    return (
        <>
            <HeaderFE />
            <div className='padding-40'>
                {success ? <div className='padding-40'>
                    <div className='create-post d-flex justify-content-center align-items-center'>
                        <div className=''>
                            <span className='col-12'><h1 className='text-success'>Post Updated <CheckCircleIcon /></h1>
                            </span>
                            <div className='col-12'>Redirecting to updated post...</div>
                        </div>
                    </div>
                </div> : <>
                    <div className='col-2 back-btn'>
                        <button onClick={() => { navigate(-1) }} type="button" className="btn btn-light fw-medium text-uppercase mb-5">
                            ←Back
                        </button>
                    </div>
                    {form}
                </>}
            </div>
            <FooterFE />
        </>

    )
}