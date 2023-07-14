import { Outlet } from "react-router-dom";
import HeaderFE from "../../components/HeaderFE";
import FooterFE from "../../components/FooterFE";
import "./styles/style.css";

export const Auth = () => {
    return (
        <>
            <HeaderFE/>
            <Outlet/>
            <FooterFE/>
        </>
    );
}