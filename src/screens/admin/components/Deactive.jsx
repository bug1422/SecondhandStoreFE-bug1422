import React from 'react'

export const Deactive = () => {
    return (
        <div className='p-5'>
            <button type="button" className="btn btn-light fw-medium text-uppercase mb-5">←Back</button>
            <h1 className='text-center'>ARE YOU SURE TO DEACTIVATE USER WITH ID ??? </h1>
            <div className="d-flex justify-content-center">
                <button className='btn btn-success m-3'>Yes</button>
                <button className='btn btn-danger m-3'>No</button>
            </div>
        </div>
    )
}
