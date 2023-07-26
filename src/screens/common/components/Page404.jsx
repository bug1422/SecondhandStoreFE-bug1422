import FooterFE from "../../../components/FooterFE"
import HeaderFE from "../../../components/HeaderFE"
import ErrorIcon from '@mui/icons-material/Error';
export const Page404 = () => {
    return (
        <>
            <HeaderFE />
            <div style={{ height: '550px' }} className="text-center ">
                <div style={{ padding: '10% 0px' }}>
                    <div>
                        <strong style={{ fontSize: '132px', letterSpacing: '3px' }}>404</strong>
                    </div>
                    <strong style={{ fontSize: '55px', letterSpacing: '3px' }}>Page Not Found!</strong>
                </div>
            </div>
            <FooterFE />
        </>
    )
}