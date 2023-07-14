import React from 'react'
import FooterFE from '../../../components/FooterFE'
import HeaderFE from '../../../components/HeaderFE'
import { Link } from 'react-router-dom';
import { VictoryBar } from 'victory';
import '../styles/style.css'



export const ExchangeOrder = () => {
    const table = (
        <div className='d-flex' style={{ border: '1px solid black' }}>


            <div className='flex-1 container text-white bg-body-tertiary w-100 min-vh-100'>

                <div className="input-group col-3 border rounded-pill bg-body-secondary search-field my-3">
                    <span className="input-group-text bg-body-secondary border-0 rounded-pill" id="basic-addon1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                        </svg>
                    </span>
                    <input type="text" className="form-control border-0 rounded-pill bg-body-secondary" placeholder="Search" aria-label="Search" aria-describedby="basic-addon1" />
                </div>
                <h5 class="text-dark m-4 text-center h3">Exchange Order List</h5>
                <div class="col-md-12">
                    <table className="table custom-table mx-auto">
                        <thead>

                            <tr class='text-center mb-1'>
                                <th scope="col">Order</th>
                                <th scope="col">Product</th>
                                <th scope="col">Buyer</th>
                                <th scope="col">Phone Number</th>
                                <th scope="col">email</th>
                                <th scope="col">Time</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
    return (
        <>
            <HeaderFE />
            {table}
            <FooterFE />
        </>
    )
}