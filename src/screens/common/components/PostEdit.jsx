import { useState, useEffect } from 'react'
import HeaderFE from '../../../components/HeaderFE'
import FooterFE from '../../../components/FooterFE'
import axios from 'axios'
import cn from 'classnames'
import Cookies from 'universal-cookie'
import { useLocation, useNavigate } from 'react-router-dom'
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner'

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
        e.preventDefault()
        // setIsLoading(true)
        const formData = new FormData(e.currentTarget)
        const data = Object.fromEntries(formData)
        console.log(data)
        setTimeout(async () => {
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
            })
            alert("success")
            navigate('/post-detail?id=' + postId)
            setIsLoading(false)
        }, 2000)
    }

    const handlePrice = (e) => {
        const n = e.target.value
        setPrice(parseInt(n))
    }

    const form = (
        <form className="row justify-content-center" onSubmit={onSubmit}>
            <div className="col-md-8">
                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Post name</label><br />
                            <input type="text" value={productName} onChange={(e) => { setProductName(e.target.value) }} id="ProductName" name="ProductName" className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="category">Choose a category:</label><br />
                            <select name="CategoryId" id="CategoryId" className="form-select" disabled>
                                <option>{post.categoryName}</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Photos</label><br />
                            <label htmlFor="" className="form-label">Previous Image:</label>
                            <img src={post.image} className='col-5'
                                alt="not found"
                                width={"250px"}></img>
                            <br />
                            <br />
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
                                <label htmlFor="" className="form-label">New Image (Optional):</label>
                                <input type="file" className="form-control" id="ImageUploadRequest" name="ImageUploadRequest" onChange={handle_image} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Price</label><br />
                            <div className="input-group">
                                <span className="input-group-text">VND</span>
                                <input type="number" value={price} placeholder='Enter your price here' onChange={(e) => { handlePrice(e) }} min="0" step="10" id="Price" name="Price" className="form-control" />
                            </div>
                            <div>Total: {VND.format(isNaN(price) ? 0 : price)}</div>
                        </div>
                        <div className="mb-3 text-end">
                            <div className="row">
                                <div className="col-md-12 mb-3">
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
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="description" className="form-label">Description</label><br />
                                    <textarea id="Description" name="Description" value={description} onChange={(e) => { setDescription(e.target.value) }} className="form-control" rows="3"></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3 text-end">
                            {isDonating && <div>You don't have to pay point while donating. However, price is set to 0.</div>}
                            <button type="submit" className={cn("btn btn-primary")}>Update Product</button>
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