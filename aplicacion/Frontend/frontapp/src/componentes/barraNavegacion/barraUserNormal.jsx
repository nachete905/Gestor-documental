import React from "react";
import { useNavigate } from 'react-router-dom';
import logo from "../logo/Logo.webp";
import './menuResponsive/style.css';
export default function BarraUserNormal() {
    const navigate = useNavigate();

    const handleHome = () =>{
        navigate("/");
    }
    return (
        <nav className="cabecera w-100 d-flex justify-content-between align-items-center p-2 position-relative">
            <div className="d-flex align-items-center">
                <img src={logo} alt="Logo" className="logo me-3" style={{height: "50px"}} onClick={handleHome}/>
            </div>
        </nav>
    );

}