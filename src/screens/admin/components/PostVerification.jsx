import React from 'react'

export const PostVerification = () => {
    return (
        <div className='p-5'>
            <button type="button" className="btn btn-light fw-medium text-uppercase mb-5">←Back</button>
            <div className="row g-3 px-5">
                <div className="col-md-6">
                    <div className="col card mb-5 bg-body-tertiary">
                        <div className="card-body text-uppercase card-main">
                            <h1 className='fs-medium text-center'>main photo</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col card m-3 bg-body-tertiary">
                            <div className="card-body text-uppercase card-sub">
                                <h3 className='fs-regular text-center'>sub-photo 1</h3>
                            </div>
                        </div>
                        <div className="col card m-3 bg-body-tertiary">
                            <div className="card-body text-uppercase card-sub">
                                <h3 className='fs-regular text-center'>sub-photo 2</h3>
                            </div>
                        </div>
                        <div className="col card m-3 bg-body-tertiary">
                            <div className="card-body text-uppercase card-sub">
                                <h3 className='fs-regular text-center'>sub-photo 3</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 px-5">
                    <h3 className='title'>Product name</h3>
                    <div className="row">
                        <h5 className="col">Price:_</h5>
                        <h5 className="col">Category:_</h5>
                    </div>
                    <h3 className='title'>Description</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <h3 className='text-danger'>Contact:_</h3>
                    <h3 className='text-danger'>Phone number:_</h3>
                    <h3 className='text-danger'>Email:_</h3>
                    <button type="button" className="btn btn-success text-uppercase mb-5 mt-5">accept this post</button>
                    <button type="button" className="btn btn-danger text-uppercase mb-5 ms-3 mt-5">delete this post</button>
                </div>
            </div>
        </div>
    )
}
