import React from "react";
import { useNavigate } from 'react-router-dom';
import logo from "../logo/Logo.webp";
import './menuResponsive/style.css';
export default function BarraNavegacion () {
    const navigate = useNavigate();

    const handleHome = () =>{
        navigate("/");
    }
    const handleTablaCochesClick = () => {
        navigate('/coches');
    };
    const hanleTablaPropietarios = () => {
        navigate('/propietarios');
    };
    const handleRegistroCompraVenta = () => {
        navigate('/registroCompraVenta');
    }
    const handleActualizarEstado = () => {
        navigate('/actualizar');
    }
    return (
        <nav className="cabecera w-100 d-flex justify-content-between align-items-center p-2 position-relative">
            <div className="d-flex align-items-center">
                <img src={logo} alt="Logo" className="logo me-3" style={{height: "50px"}} onClick={handleHome}/>
            </div>
            <button className="navbar-toggler d-lg-none ms-auto" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                    aria-label="Toggle navigation">
                <span className="icon-menu position-absolute top-0 end-0 mt-2"></span>
            </button>
            <div className="collapse navbar-collapse d-lg-flex position-absolute top-0 end-0 mt-2" id="navbarNav">
                <div className="d-flex flex-column flex-lg-row">
                    <a className="btn btn-secondary bg-dark text-light me-2 flex-fill" onClick={handleTablaCochesClick}>
                        Información de los coches
                    </a>
                    <a className="btn btn-secondary bg-dark text-light me-2 flex-fill" onClick={hanleTablaPropietarios}>
                        Información de los propietarios
                    </a>
                    <a className="btn btn-secondary bg-dark text-light me-2 flex-fill"
                       onClick={handleRegistroCompraVenta}>
                        Registro de compra-venta
                    </a>
                    <a className="btn btn-secondary bg-dark text-light me-2 flex-fill" onClick={handleActualizarEstado}>
                        Actualizar estado
                    </a>
                </div>
            </div>
        </nav>
    );

}