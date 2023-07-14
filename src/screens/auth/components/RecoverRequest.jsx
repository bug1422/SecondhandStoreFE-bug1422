export const RecoveryRequest = () => {
    return (
        <>
            <div className="wrapper col-md-8">
                <h1 className="form__heading my-3 text-capitalize">Recovering your account</h1>
                <div className="col-md-12 d-flex justify-content-start">
                        <a href="/auth/login" type="submit" className="btn btn-dark">←Back</a>
                    </div>
                <form className="row m-3 d-flex flex-row align-items-center">
                    <h3 className="title">Tell us some information about your account</h3>
                    <div className="col-md-12 mb-3">
                        <label for="email" className="form-label text-dark">Enter your email</label>
                        <input type="email" className="form-control" id="email" />
                    </div>

                    <div className="col-md-12 d-flex justify-content-end">
                        <button type="submit" className="btn btn-dark">Submit</button>
                    </div>
                </form>
            </div>
        </>
    );
}