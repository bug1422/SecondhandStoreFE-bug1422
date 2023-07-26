import "./styles/style.css"
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import jwt from 'jwt-decode'
import Cookies from 'universal-cookie'
import { Menu } from "./Sidebar";
export const Admin = () => {
    const navigate = useNavigate();
    const cookies = new Cookies();
    const [isLogged, setIsLogged] = useState(false)
    useEffect(() => {
        let cookie = cookies.get('jwt_authorization')
        if (cookie !== undefined) {
            const decoded = jwt(cookie)
            if (decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === "AD") setIsLogged(true)
            else navigate('/auth/login', { replace: true })
        }
        else {
            navigate('/auth/login', { replace: true })
        }
    }, [])
    return (
        <>
            {isLogged && <>
                <Menu />
                <Outlet />
            </>}
        </>
    )
}