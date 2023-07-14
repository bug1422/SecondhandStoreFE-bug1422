import { useEffect, useState, useMemo, useCallback } from 'react'
import FooterFE from '../../../components/FooterFE'
import HeaderFE from '../../../components/HeaderFE'
import { Pagination } from '../../../components/pagination/Pagination';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from "axios"
import '../styles/search.css'


const styles = {
    footer: {
        position: "fixed",
        left: "0",
        bottom: "0",
        width: "100 %"
    }
}

export const Search = () => {
    axios.defaults.baseURL = 'https://localhost:7115'
    const navigate = useNavigate()
    const location = useLocation()
    const [filter, setFilter] = useState(location.state || "")
    const [query, setQuery] = useState('')
    const [items, setItems] = useState([]);
    const [filteredList, setFilteredList] = new useState([]);
    let VND = new Intl.NumberFormat('vn-VN', {
        style: 'currency',
        currency: 'VND',
    });


    const fetchData = async () => {
        await axios.get('/posts/get-post-list')
            .then((data) => {
                setItems(data.data.slice(0).reverse())
                setFilteredList(filter === "" ? data.data.slice(0).reverse() : data.data.slice(0).reverse().filter(p => p.categoryName == filter))
                setCurrentPage(1)
                console.log(filter)
                console.log(data.data)
                console.log(filteredList)
            })
            .catch(e => console.log(e))
    }

    useEffect(() => {
        fetchData()
    }, [])


    const filterBySearch = (e) => {
        // Access input value
        // Create copy of item list
        if (e.target.value === "") {
            setFilteredList(items)
        }
        else {
            setQuery(e.target.value)
            var updatedList = [...items];
            console.log(updatedList)
            // Include all elements which includes the search query
            updatedList = updatedList.filter((item) => {
                return item.productName.toLowerCase().indexOf((e.target.value || '').toLowerCase()) !== -1
            });
            // Trigger render with updated values
            setFilteredList(updatedList);
        }
    };

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
    const itemsPerPage = 6;
    const paginate = (filteredList, currentPage, itemsPerPage) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredList.slice(startIndex, startIndex + itemsPerPage);
    }
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    useEffect(() => {
        setFilteredList(filter === "" ? items : items.filter(p => p.categoryName == filter))
    }, [filter])
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
            <h1 className="fw-bold fs-1 m-5 text-center">{filteredList.length === 0 ? "No posts found" :
                query === null || query === "" ? "Result for all items (" + filteredList.length + " items)" :
                    "Result for " + query + "(" + filteredList.length + " items found)"
            }</h1>
            <div class="row justify-content-md-center">
                <div class="col-md-auto form-outline">
                    <input className='me-2 form-control' type='text' placeholder='type in your search here' onChange={(e) => { filterBySearch(e) }} ></input>
                </div>
            </div>
            <div className="container">
                <div className='d-flex'>
                    <div className="">
                        <ul className="list-group" style={{ width: "280px" }}>
                            <li className="list-group-item" onClick={() => { setFilter('') }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                <i className="fas fa-tshirt"></i> All
                            </li>
                            <li className="list-group-item" onClick={() => { setFilter('Clothes') }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                <i className="fas fa-tshirt"></i> Clothes
                            </li>
                            <li className="list-group-item" onClick={() => { setFilter('Electrics') }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                <i className="fas fa-bolt"></i> Electrics
                            </li>
                            <li className="list-group-item" onClick={() => { setFilter('Book') }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                <i className="fas fa-book"></i> Books
                            </li>
                            <li className="list-group-item" onClick={() => { setFilter('Traditional Instruments') }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                <i className="fas fa-guitar"></i> Traditional Instruments
                            </li>
                            <li className="list-group-item" onClick={() => { setFilter('Learning Tools') }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                <i className="fas fa-pencil-ruler"></i> Learning Tools
                            </li>
                            <li className="list-group-item" onClick={() => { setFilter('Others') }} style={{ background: "#FFDB58", cursor: "pointer" }}>
                                <i className="material-icons"></i> Others
                            </li>
                        </ul>
                    </div>
                    {paginatedItems.length === 0 ? <div className='md-3'></div> : <div className="">
                        {/* <div class="dropdown m-bottom-3 mx-5 d-flex justify-content-end">
                            <button class="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">
                                Sort by
                            </button>
                            <div class="dropdown-menu">
                                <p class="dropdown-item" onClick={() => handleSortType("nameAZ")} style={{ cursor: "pointer" }}>Name(a-z)</p>
                                <p class="dropdown-item" onClick={() => handleSortType("nameZA")} style={{ cursor: "pointer" }}>Name(z-a)</p>
                                <p class="dropdown-item" onClick={() => handleSortType("priceAZ")} style={{ cursor: "pointer" }}>Price(a-z)</p>
                                <p class="dropdown-item" onClick={() => handleSortType("priceZA")} style={{ cursor: "pointer" }}>Price(z-a)</p>
                            </div>
                        </div> */}
                        <div className="row row-cols-3 g-5 mx-5">
                            {paginatedItems.map((item) => (
                                <div key={item.postId} className="col p-3">
                                    <div>{item.postStatusName}</div>
                                    <div className="card h-100 border-0 text-center">
                                        <a href={"/post-detail?id=" + item.postId}>
                                            <img src={item.image} className="card-img-top" alt="..." />
                                            <div className="card-body">
                                                <h5 className="card-title">{item.productName}</h5>
                                                <p className="card-text">{VND.format(item.price)}</p>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            ))}
                            <div className='col-12 d-flex justify-content-center'>
                                <li class="page-item page-link" onClick={() => {
                                    if (currentPage != 1) {
                                        handlePageChange(currentPage - 1)
                                    }
                                }}>Previous</li>
                                <li class="page-item page-link" onClick={() => {
                                    if (currentPage != Math.round(items.length / 5)) {
                                        handlePageChange(currentPage + 1)
                                    }
                                }}>Next</li>
                            </div >
                        </div>
                    </div>}
                </div>
            </div>
            <br />
            <FooterFE />
        </>
    )
}
