import FooterFE from "../../../components/FooterFE"
import HeaderFE from "../../../components/HeaderFE"
import ErrorIcon from '@mui/icons-material/Error';
export const ServerDown = () => {
    return (
        <>
            <HeaderFE />
            <div style={{ height: '550px' }} className="text-center ">
                <div style={{ padding: '10% 0px' }}>
                    <strong style={{ fontSize: '64px', letterSpacing: '3px' }}>Server is currently down. Please come back later!</strong>
                </div>
            </div>
            <FooterFE />
        </>
    )
}