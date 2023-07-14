import uploadImage from "../../../assets/images/upload.png";

export const RecoveryNotify = () => {
    return (
        <>
            <div className="wrapper col-md-8">
                <img className="img-thumbnail" src={uploadImage} alt="" />
                <h1 className="form__heading my-3 text-capitalize">verification from sent!</h1>
                <div className="row m-3 d-flex flex-row align-items-center">
                    <h3 className="title">Check your email</h3>
                    <h3 className="">We have sent a password changing div to abc@fpt.edu.vn </h3>
                    <ul>
                        <li>The form to change password will expire in 30 minutes.</li>
                        <li>If you don’t see any mail then go back and re-enter your email.</li>
                        <li>You can submit another form request if your form has expired. </li>
                        <li>Contact us for help if you can’t change your password.</li>
                    </ul>
                    <div className="col-md-12 d-flex justify-content-end">
                        <a href="/auth/recovery-request" className="btn btn-dark">←Back</a>
                    </div>
                </div>
            </div>
        </>
    );
}