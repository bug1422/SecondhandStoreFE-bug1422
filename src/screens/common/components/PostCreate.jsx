import { useState, useEffect } from 'react'
import HeaderFE from '../../../components/HeaderFE'
import FooterFE from '../../../components/FooterFE'
import axios from 'axios'
import cn from 'classnames'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner'

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

    let VND = new Intl.NumberFormat('vn-VN', {
        style: 'currency',
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
        console.log(e.target.files)
        const imgs = e.target.files
        setSelectedImage(imgs[0])
    }

    const handlePrice = (e) =>{
        const n = e.target.value
        setPrice(parseInt(n))
    }

    const handleCategory = (e) => {
        switch (e.target.value) {
            case '1':
                setPoint(isDonating ? 0 : 20)
                break
            case '2':
                setPoint(isDonating ? 0 : 70)
                break
            case '3':
                setPoint(isDonating ? 0 : 10)
                break
            case '4':
                setPoint(isDonating ? 0 : 20)
                break
            case '5':
                setPoint(isDonating ? 0 : 30)
                break
            case '6':
                setPoint(isDonating ? 0 : 40)
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
        else{
            setPrice(prevPrice)
            setPoint(prevPoint)
        }
    }, [isDonating])

    const onSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData)
        setTimeout(() => {
            axios.post("/posts/create-new-post", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }).then((data)=>{
                alert("success")
                navigate('/post-detail?id='+data.data)
            })
                .catch((e) => { alert(e) })
            setIsLoading(false)
        }, 2000)
    }

    const form = (
        <form className="row justify-content-center" onSubmit={onSubmit}>
            <div className="col-md-8">
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Post name</label><br />
                            <input type="text" id="ProductName" name="ProductName" className="form-control" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="category">Choose a category:</label><br />
                            <select name="CategoryId" id="CategoryId" className="form-select" onChange={(e) => { handleCategory(e) }}>
                                <option value="1">Clothes</option>
                                <option value="2">Electrics</option>
                                <option value="3">Book</option>
                                <option value="4">Traditional Instruments</option>
                                <option value="5">Learning Tools</option>
                                <option value="6">Others</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="PointCost" className="form-label">Priority Point</label><br />
                            <input  type="number" value={point} id="PointCost" name="PointCost" className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Photos</label><br />
                            {selectedImage && (
                                <div>
                                    <img
                                        className='col-5'
                                        alt="not found"
                                        width={"250px"}
                                        src={URL.createObjectURL(selectedImage)}
                                    />
                                    <button className="btn btn-danger col-5 mt-2" onClick={() => {
                                        document.getElementById("ImageUploadRequest").value = "";
                                        setSelectedImage(null)
                                    }}>Remove</button>
                                </div>
                            )}
                            <br />
                            <br />
                            <div className="input-group">
                                <input type="file" className="form-control" id="ImageUploadRequest" name="ImageUploadRequest" onChange={handle_image} required />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Price</label><br />
                            <div className="input-group">
                                <span className="input-group-text">VND</span>
                                <input type="number" value={price} placeholder='Enter your price here' onChange={(e)=>{handlePrice(e)}} min="0" step="10" id="Price" name="Price" className="form-control" required />
                            </div>
                            <div>Total: {VND.format(isNaN(price) ? 0 : price)}</div>
                        </div>
                        <div className="mb-3 text-end">
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="type" className="form-label">Post type</label><br />
                                    <div className="form-check">
                                        <input type="radio" id="PostTypeId_1" onClick={() => { setIsDonating(false) }} name="PostTypeId" value="1" className="form-check-input" required />
                                        <label htmlFor="PostTypeId_1" className="form-check-label">Selling</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" id="PostTypeId_2" onClick={() => { setIsDonating(true) }} name="PostTypeId" value="2" className="form-check-input" required />
                                        <label htmlFor="PostTypeId_2" className="form-check-label">Donating</label>
                                    </div>
                                </div>
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="description" className="form-label">Description</label><br />
                                    <textarea id="Description" name="Description" className="form-control" rows="3" required></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3 text-end">
                            {isDonating && <div>You don't have to pay point while donating. However, price is set to 0.</div>}
                            {maxPoint < point && <div>Your point balance is insufficient. Please add more!<a href='/payment-request'>Click here to add point!</a></div>}
                            <button type="submit" className={cn("btn btn-primary", { disabled: maxPoint < point })}>Add Product</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
    return (
        <>
            <div className="container"></div>
            <HeaderFE />
            {isLoading ? <LoadingSpinner /> : form}
            <FooterFE />
        </>

    )
}