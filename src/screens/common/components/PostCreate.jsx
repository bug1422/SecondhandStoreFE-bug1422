import { useState, useEffect } from 'react'
import HeaderFE from '../../../components/HeaderFE'
import FooterFE from '../../../components/FooterFE'
import axios from 'axios'
import cn from 'classnames'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export const PostCreate = () => {
    axios.defaults.baseURL = "https://localhost:7115"
    const cookies = new Cookies()
    const navigate = useNavigate()
    const [price, setPrice] = useState(0)
    const [point, setPoint] = useState(20)
    const [prevPrice, setPrevPrice] = useState(price)
    const [prevPoint, setPrevPoint] = useState(point)
    const [maxPoint, setMaxPoint] = useState(0)
    const [selectedImage, setSelectedImage] = useState(null);
    const [isDonating, setIsDonating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('')
    const [errorName, setErrorName] = useState('')
    const [errorCategory, setErrorCategory] = useState('')
    const [errorPrice, setErrorPrice] = useState('')
    const [errorType, setErrorType] = useState('')
    const [errorDescription, setErrorDescription] = useState('')
    const [success, setSuccess] = useState(false)
    let VND = new Intl.NumberFormat('vn-VN', {
        currency: 'VND',
    });

    const getPoint = async () => {
        await axios.get('/account/get-user-account')
            .then((data) => {
                setMaxPoint(data.data.pointBalance)
            })
            .catch((e) => { console.log(e) })
    }

    useEffect(() => {
        let cookie = cookies.get('jwt_authorization')
        if (cookie !== undefined) {
            axios.defaults.headers.common['Authorization'] = 'bearer ' + cookie
            getPoint()
        }
        else navigate('/auth/login', { replace: true })
    }, [])

    const handle_image = (e) => {
        const img = e.target.files
        setSelectedImage(img[0])
    }

    const handlePrice = (e) => {
        const n = e.target.value
        setPrice(parseInt(n))
    }

    const handleCategory = (e) => {
        switch (e.target.value) {
            case '1':
                setPoint(isDonating ? 0 : 20)
                break
            case '2':
                setPoint(isDonating ? 0 : 10)
                break
            case '3':
                setPoint(isDonating ? 0 : 70)
                break
            case '4':
                setPoint(isDonating ? 0 : 10)
                break
            case '5':
                setPoint(isDonating ? 0 : 30)
                break
            case '6':
                setPoint(isDonating ? 0 : 5)
                break
            case '7':
                setPoint(isDonating ? 0 : 10)
                break
        }
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

    useEffect(() => {
        setError('')
    }, [selectedImage, errorName, errorPrice, errorDescription])

    const onSubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData)
        if (selectedImage && data['ProductName'] !== '' && data['description'] !== '' && data['ProductName'] !== '') {
            setTimeout(() => {
                axios.post("/posts/create-new-post",
                    {
                        "ProductName": data['ProductName'],
                        "Description": data['description'],
                        "PointCost": point,
                        "CategoryId": data['CategoryId'],
                        "isDonated": isDonating,
                        "Price": data['Price'],
                        "ImageUploadRequest": selectedImage,
                    }, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }).then((data) => {
                    setSuccess(true)
                    setTimeout(() => {
                        navigate('/post-list')
                    }, 2000)
                })
                    .catch((e) => {
                        setError("something went wrong!")
                        console.log(e)
                    })
            }, 2000)
        }
        else {
            if (!selectedImage) setError('Image is not selected!')
            else setError('Please fill in all required fields')
        }

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
                                <h1 className='black-txt'>Post Publishing</h1>
                                <hr />
                                <form className="container" onSubmit={(e) => { onSubmit(e) }}>
                                    <div className='row'>
                                        <div className="form-group col-md-6 mb-3 form-check flex items-center">
                                            <label htmlFor="name" className="form-label form-split">Post name*</label><div className="text-danger">{errorName}</div>
                                            <input type="text" id='name' name="ProductName" placeholder='Enter your post name here' onBlur={() => {
                                                let productName = document.getElementById('name').value
                                                if (productName === '')
                                                    setErrorName(" This field is required")
                                                else
                                                    setErrorName('')
                                            }} className="form-control" />
                                        </div>
                                        <div className="form-group col-md-6 mb-3 form-check flex items-center">
                                            <div className="mb-3">
                                                <label htmlFor="price" className="form-label form-split">Price*</label><div className="text-danger">{errorPrice}</div>
                                                <div className="input-group">
                                                    <span className="input-group-text">VND</span>
                                                    <input type="number" value={Number(price).toString()} onWheel={() => document.activeElement.blur()} placeholder='Enter your price here' onChange={(e) => { if (!isDonating) setPrice(e.target.value) }} min="0" step="10"
                                                        id="Price" name="Price" className="form-control" onBlur={() => {
                                                            if (price < 1000 && !isDonating)
                                                                setErrorPrice("Price has to be equal or greater than 1000₫")
                                                            else
                                                                setErrorPrice('')
                                                        }} />
                                                </div>
                                                <div>Total: {VND.format(isNaN(price) ? 0 : price)} VND</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="form-group col-md-6 mb-3 form-check flex items-center">
                                            <div className='row'>
                                                <div className='col-md-6'>
                                                    <label htmlFor="category" className='form-label'>Choose a category</label><br />
                                                    <select name="CategoryId" id="CategoryId" className="form-select" onChange={(e) => { handleCategory(e) }}>
                                                        <option value='1'>Clothes</option>
                                                        <option value='2'>Accessories</option>
                                                        <option value='3'>Electronics</option>
                                                        <option value='4'>Books</option>
                                                        <option value='5'>Musical Instruments</option>
                                                        <option value='6'>School Supplies</option>
                                                        <option value='7'>Others</option>
                                                    </select>
                                                </div>
                                                <div className='col-md-6'>
                                                    <label htmlFor="PointCost" className="form-label">Point Cost</label>
                                                    <input type="number" value={point} id="PointCost" name="PointCost" className="form-control" disabled />
                                                </div>
                                                <div className='col-md-12 lead'>*Make sure your product is in right category or we won't accept it</div>

                                            </div>
                                        </div>
                                        <div className="form-group col-md-6 mb-3 form-check flex items-center">
                                            <label htmlFor="type" className="form-label">Post type</label><br />
                                            <div className="form-check">
                                                <input type="radio" id="PostTypeId_1" checked={!isDonating} onClick={() => { setIsDonating(false) }} name="PostTypeId" value="1" className="form-check-input" />
                                                <label htmlFor="PostTypeId_1" className="form-check-label">Selling</label>
                                            </div>
                                            <div className="form-check">
                                                <input type="radio" id="PostTypeId_2" checked={isDonating} onClick={() => { setIsDonating(true) }} name="PostTypeId" value="2" className="form-check-input" />
                                                <label htmlFor="PostTypeId_2" className="form-check-label">Donating</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className="form-group col-md-6 mb-3 form-check flex items-center">
                                            <div className="mb-3">
                                                <label htmlFor="image" className="form-label">Image*</label><br />
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
                                                <label htmlFor="description" className="form-label">Description*</label><div className="text-danger">{errorDescription}</div>
                                                <textarea id="description" name="description" placeholder='Enter the description of your product here.' onBlur={() => {
                                                    const description = document.getElementById('description').value
                                                    if (description === '')
                                                        setErrorDescription("This field is required")
                                                    else
                                                        setErrorDescription('')
                                                }} maxLength='4000' className="form-control" rows="3"></textarea>
                                            </div>
                                            <div className='row'>
                                                {isDonating && <div>You don't have to pay point while donating. However, price is set to 0 VND.</div>}
                                                <button type="submit" className={cn("btn btn-primary")}>Publish Post</button>
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
            {success ? <div className='padding-40'>
                <div className='create-post d-flex justify-content-center align-items-center'>
                    <div className=''>
                        <span className='col-12'><h1 className='text-success'>Post created <CheckCircleIcon /></h1>
                        </span>
                        <div className='col-12'>Redirecting to created post...</div>
                    </div>
                </div>
            </div> :
                form
            }
            <FooterFE />
        </>

    )
}