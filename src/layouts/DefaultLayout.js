import FooterFE from "../components/FooterFE";
import HeaderFE from "../components/HeaderFE";
import '../styles/defaultLayout.css';
export default function DefaultLayout({className,children}) {
    return (
        <>
            <HeaderFE />
            <div className= {className}>
                {children}
            </div>
            <FooterFE />
        </>
    )
}