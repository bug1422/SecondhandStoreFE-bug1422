import { useEffect, useState, useMemo, useCallback } from 'react'
import FooterFE from '../../../components/FooterFE'
import HeaderFE from '../../../components/HeaderFE'
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios"
import '../styles/search.css'
import { Card } from 'react-bootstrap';
import { Pagination, Stack } from '@mui/material';
import cn from 'classnames'
import { toLowerCaseNonAccentVietnamese } from '../../nonAccentVietnamese.js'
import { LoadingSpinner } from '../../../components/loading/LoadingSpinner';

const styles = {
    footer: {
        position: "fixed",
        left: "0",
        bottom: "0",
        width: "100 %"
    }
}
const itemsPerPage = 6;

export const SearchDonating = () => {
    axios.defaults.baseURL = 'https://localhost:7115'
    const navigate = useNavigate()
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState(location.state || "")
    const [query, setQuery] = useState('')
    const [items, setItems] = useState([]);
    const [all, setAll] = useState([]);
    const [clothes, setClothes] = useState([]);
    const [accessories, setAccessories] = useState([]);
    const [electronics, setElectronics] = useState([]);
    const [books, setBooks] = useState([]);
    const [music, setMusicalInstr] = useState([]);
    const [schools, setSchools] = useState([]);
    const [others, setOthers] = useState([]);

    const [filteredList, setFilteredList] = new useState([]);
    let VND = new Intl.NumberFormat('vn-VN', {
        currency: 'VND',
    });


    const fetchData = async () => {
        await axios.get('/posts/get-all-active-post-list')
            .then((data) => {
                const list = data.data.slice(0).reverse()
                    .filter((item) => { return item.isDonated == true })
                    .filter((item) => { return item.statusName === 'Accepted' || item.statusName === 'Completed' })
                    .filter((item) => { return new Date().getFullYear() - new Date(String(item.createdDate).substring(0, 10)).getFullYear() === 0 })
                console.log(list)
                setAll(list)
                setClothes(list.filter((item) => item.categoryName == 'Clothes'))
                setAccessories(list.filter((item) => item.categoryName == 'Accessories'))
                setElectronics(list.filter((item) => item.categoryName == 'Electronics'))
                setBooks(list.filter((item) => item.categoryName == 'Books'))
                setMusicalInstr(list.filter((item) => item.categoryName == 'Musical Instruments'))
                setSchools(list.filter((item) => item.categoryName == 'School Supplies'))
                setOthers(list.filter((item) => item.categoryName == 'Others'))
                setFilteredList(list)
                setCurrentPage(1)
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000)
            })
            .catch(e => console.log(e))
    }

    useEffect(() => {
        setQuery(location.state)
        fetchData()
    }, [])

    useEffect(() => {
        var updatedList;
        switch (filter) {
            case '':
                updatedList = [...all]
                break
            case 'Clothes':
                updatedList = [...clothes]
                break
            case 'Accessories':
                updatedList = [...accessories]
                break
            case 'Electronics':
                updatedList = [...electronics]
                break
            case 'Books':
                updatedList = [...books]
                break
            case 'Musical Instruments':
                updatedList = [...music]
                break
            case 'School Supplies':
                updatedList = [...schools]
                break
            case 'Others':
                updatedList = [...others]
                break
        }
        if (query !== '') {
            updatedList = updatedList.filter((item) => {
                let name = toLowerCaseNonAccentVietnamese(item.productName)
                let search = toLowerCaseNonAccentVietnamese(query)
                return name.indexOf((search || '')) !== -1
            });

        }
        setFilteredList(updatedList);
    }, [query])

    const handleSortType = (type) => {
        let sortedItems = [];

        switch (type) {
            case "nameAZ":
                sortedItems = items.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "nameZA":
                sortedItems = items.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "priceAZ":
                sortedItems = items.sort((a, b) => a.price - b.price);
                break;
            case "priceZA":
                sortedItems = items.sort((a, b) => b.price - a.price);
                break;
            default:
                sortedItems = items;
        }
        setItems([...sortedItems]);

    }

    const [paginatedItems, setPaginatedItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const paginate = (filteredList, currentPage, itemsPerPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredList.slice(startIndex, startIndex + itemsPerPage);
    }
    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };
    useEffect(() => {
        setCurrentPage(1);
        setPaginatedItems(paginate(filteredList, currentPage, itemsPerPage));
    }, [filteredList])
    useEffect(() => {
        setPaginatedItems(paginate(filteredList, currentPage, itemsPerPage));
    }, [currentPage])

    return (
        <>
            <HeaderFE />
            <div className='padding-40 search-body'>
                {isLoading ?
                    <LoadingSpinner /> :
                    <>
                        <div class="row justify-content-md-center">
                            <div class="col-md-auto form-outline">
                                <input id='search' className='me-2 form-control' value={query} type='text' placeholder='type in your search here' onChange={(e) => { setQuery(e.target.value) }} ></input>
                            </div>
                        </div>
                        <h1 className="text-center black-txt"><strong>{filteredList.length === 0 ? "No posts found" :
                            query === null || query === "" ? "Result for all items (" + filteredList.length + " items)" :
                                "Result for " + query + "(" + filteredList.length + " items found)"
                        }</strong></h1>
                        <div className="">
                            <div className='d-flex'>
                                <div className="pr-2">
                                    <ul className="list-group" style={{ width: "280px" }}>
                                        <li className={cn("list-group-item", filter === '' && 'category-active')} onClick={() => {
                                            setFilteredList(all)
                                            setFilter('')
                                        }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                            <i className="fas fa-tshirt"></i> All ({all.length})
                                        </li>
                                        <li className={cn("list-group-item", filter === 'Clothes' && 'category-active')} onClick={() => {
                                            setFilteredList(clothes)
                                            setFilter('Clothes')
                                        }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                            <i className="fas fa-tshirt"></i> Clothes ({clothes.length})
                                        </li>
                                        <li className={cn("list-group-item", filter === 'Accessories' && 'category-active')} onClick={() => {
                                            setFilteredList(accessories)
                                            setFilter('Accessories')
                                        }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                            <i className="fas fa-tshirt"></i> Accessories ({accessories.length})
                                        </li>
                                        <li className={cn("list-group-item", filter === 'Electronics' && 'category-active')} onClick={() => {
                                            setFilteredList(electronics)
                                            setFilter('Electronics')
                                        }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                            <i className="fas fa-bolt"></i> Electronics ({electronics.length})
                                        </li>
                                        <li className={cn("list-group-item", filter === 'Books' && 'category-active')} onClick={() => {
                                            setFilteredList(books)
                                            setFilter('Books')
                                        }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                            <i className="fas fa-book"></i> Books ({books.length})
                                        </li>
                                        <li className={cn("list-group-item", filter === 'Musical Instruments' && 'category-active')} onClick={() => {
                                            setFilteredList(music)
                                            setFilter('Musical Instruments')
                                        }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                            <i className="fas fa-guitar"></i> Musical Instruments ({music.length})
                                        </li>
                                        <li className={cn("list-group-item", filter === 'School Supplies' && 'category-active')} onClick={() => {
                                            setFilteredList(schools)
                                            setFilter('School Supplies')
                                        }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                            <i className="fas fa-pencil-ruler"></i> School Supplies ({schools.length})
                                        </li>
                                        <li className={cn("list-group-item", filter === 'Others' && 'category-active')} onClick={() => {
                                            setFilteredList(others)
                                            setFilter('Others')
                                        }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                            <i className="material-icons"></i> Others ({others.length})
                                        </li>
                                    </ul>
                                    <br />
                                    <ul className="list-group" style={{ width: "280px" }}>
                                        <li onClick={() => { navigate('/selling') }} className={cn("list-group-item")} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                            <i className="fas fa-tshirt"></i> Selling Section
                                        </li>
                                        <li className={cn("list-group-item category-active")} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                            <i className="fas fa-tshirt"></i> Donating Section
                                        </li>
                                    </ul>
                                    <br />
                                    <div className=''>
                                        <div className=''>
                                            <Stack alignItems="center">
                                                <Pagination sx={{}} count={Math.ceil(filteredList.length / itemsPerPage)} onChange={(e, p) => { handlePageChange(e, p) }} variant="outlined" shape="rounded" />
                                            </Stack>
                                        </div>
                                    </div>
                                </div>
                                {paginatedItems.length === 0 ? <div className='md-3'></div> : <div className="">
                                    <div className="row search-container">
                                        {paginatedItems.map((item) => (
                                            <div className='col-md-3 mx-5 px-5'>
                                                <div className='search-item'>
                                                    <a href={"/post-detail?id=" + item.postId} style={{ textDecoration: 'none' }}>
                                                        <Card.Img variant="top" className='img-fluid' src={item.image} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                                                        <Card.Body>
                                                            <div style={{ color: 'black' }}><strong>{item.images[0].ImageUrl}</strong></div>
                                                            <Card.Text>{String(item.createdDate).substring(0, 10)}</Card.Text>
                                                            <div style={{ color: 'orange', fontSize: '20px' }}>Donating</div>
                                                            <div className={cn(item.statusName === 'Completed' ? 'text-secondary' : 'text-success')}>{item.statusName === "Completed" ? "Taken" : 'Avaiable'}</div>
                                                        </Card.Body>
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>}
                            </div>
                        </div>
                        <br />
                    </>
                }
            </div>
            <FooterFE />
        </>
    )
}
