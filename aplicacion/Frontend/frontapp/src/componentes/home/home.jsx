import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import logo from '../logo/Logo.webp';
import Carrusel from "../homeComponents/Carrusel";
import InformationSection from "../homeComponents/InformationSection";
import Information2 from "../homeComponents/Information2";
import PiePagina from "../homeComponents/PiePagina";
import './iconosGestion/iconoPersona/style.css'
import './iconosGestion/iconoCoche/style.css';
import './iconosGestion/iconoRegistro/style.css';
import './iconosGestion/iconoActualizar/style.css'
import './iconosGestion/iconoMail/style.css';
import './iconosUsuarios/iconoRoot/style.css';
import './iconosUsuarios/iconoUsuario/style.css';
import './home.css';




function handleTokenExpiry(navigate) {
    fetch('http://localhost:8000/api/refresh', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('token', data.token);
        } else {
            navigate('/login');
        }
    })
    .catch(error => {
        console.error('Error al renovar el token:', error);
    });

}
//funcion de ejemplo, hay que modificarla
function abrirPDF() {
    var url = '/guiaUsuario.pdf'; // Reemplaza 'ruta-al-archivo.pdf' con la ubicación de tu archivo PDF
    var win = window.open(url, '_blank');
    if (win) {
        // La ventana se abrió correctamente
        win.focus(); // Enfoca la nueva pestaña si ya existe
    } else {
        // Bloquea la apertura múltiple de ventanas emergentes
        alert('Por favor, habilita las ventanas emergentes en tu navegador.');
    }
}
export default function Home({ isAuthenticated, onLogout }) {
    const [userType, setUserType] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserType(decodedToken.tipoUser);

                fetch('http://localhost:8000/api/esAdmin', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    if (data.isAdmin) {
                        setUserType(1); // admin
                        localStorage.setItem('tipoUsuario', '1');
                    }else if(data.isSuperRoot){
                        setUserType(3); // super admin
                    }else if(data.esNormal){
                        setUserType(4);
                    }
                })
                .catch(error => {
                    console.error('Error al verificar si es admin:', error);
                });

            } catch (error) {
                console.error('Error decoding token:', error);
                handleTokenExpiry(navigate);
            }
        }
    }, [navigate]);

    const handleRegisterClick = () => {
        navigate('/registro');
    };

    const handleLoginClick = () => {
        navigate('/login');
    };
    const handleEmpresaRegisterClick = () => {
        navigate('/registroEmpresaUser');
    };

    const handleAdminRegisterClick = () => {
        navigate('/registroDeAdmin');
    };
    const handleCocheRegisterClick = () => {
        navigate('/formCoche');
    };
    const handleTablaCochesClick = ()  => {
        navigate('/coches');
    };
    const hanleTablaPropietarios = () => {
      navigate('/propietarios');
    };
    const handleRegistroCompraVenta = () =>{
        navigate('/registroCompraVenta');
    }
    const handleActualizarEstado = () =>{
        navigate('/actualizar');
    }
    const handleDarBajaEmpresa = () =>{
        navigate('/darBaja');
    }
    const handleBuzon = () =>{
        navigate('/buzon');
    }


    const handleLogoutClick = () => {
        fetch('http://localhost:8000/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({})
        })
        .then(response => {
            if (response.status === 401) {
                throw new Error('Token has expired');
            }
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(() => {
            localStorage.removeItem('token');
            localStorage.setItem('isLoggedIn', 'false');
            onLogout();
            navigate('/');
        })
        .catch(error => {
            console.error("Error:", error);
            if (error.message === 'Token has expired') {
                navigate('/login');
            }
        });
    };

    return (
        <div className="home">
            <nav className="cabecera navbar navbar-expand-lg navbar-dark w-100 p-2 position-relative">
                {/* Logo y título */}
                <div className="d-flex align-items-center">
                    <img src={logo} alt="Logo" className="logo me-3" style={{height: "50px"}}/>
                    <h1 className="mb-0 d-none d-lg-block text-light" id='titulo1'>Gestión de vehículos de ocasión</h1>
                </div>

                {/* Botón toggle para móviles */}
                <button className="navbar-toggler ms-auto bg-dark text-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation" style={{width: "20%", padding: "5px", marginRight:"10%"}}>
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Contenido colapsable */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="d-flex flex-column flex-lg-row align-items-lg-center ms-lg-auto w-100">
                        {/* Botones principales */}
                        <div className="d-flex flex-column flex-lg-row align-items-lg-center">
                            <a href="#a-que-nos-dedicamos" className="btn btn-secondary bg-dark text-light me-lg-2 mb-2 mb-lg-0 ">A que nos dedicamos</a>
                            <a className="btn btn-secondary bg-dark text-light me-lg-2 mb-2 mb-lg-0 flex-fill" onClick={abrirPDF}>Guía de usuario</a>
                            <a href="#coches-a-la-venta" className="btn btn-secondary bg-dark text-light me-lg-2 mb-2 mb-lg-0 ">Ver coches</a>
                        </div>

                        {userType === 1 && (
                            <a className="icon-envelop  fs-4 btn btn-secondary bg-dark text-light me-lg-2 mb-2 mb-lg-0" onClick={handleBuzon}></a>
                        )}

                        {/* Dropdown "¿Qué quieres hacer?" */}
                        <div className="dropdown mb-2 mb-lg-0">
                            <button className="btn btn-secondary dropdown-toggle bg-dark text-light w-100" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                                ¿Qué quieres hacer?
                            </button>
                            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
                                {userType === 1 && (
                                    <>
                                        <li><a className="dropdown-item" href="#" onClick={handleTablaCochesClick}>Ver información de los coches</a></li>
                                        <li><a className="dropdown-item" href="#" onClick={hanleTablaPropietarios}>Ver información de los propietarios</a></li>
                                        <li><a className="dropdown-item" href="#" onClick={handleRegistroCompraVenta}>Ver registro de compra-venta</a></li>
                                    </>
                                )}
                            </ul>
                        </div>

                        {/* Dropdown de sesión */}
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle bg-dark text-light w-100" type="button" id="dropdownMenuButton3" data-bs-toggle="dropdown" aria-expanded="false">
                                {isAuthenticated ? (
                                    <>
                                        {(userType === 1 || userType === 3) ? (
                                            <span className="icon-user-plus" style={{ fontSize: '16px', verticalAlign: 'middle' }}></span>
                                        ) : (
                                            <span className="icon-user" style={{ fontSize: '16px', verticalAlign: 'middle' }}></span>
                                        )}
                                    </>
                                ) : (
                                    "Iniciar sesión"
                                )}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="dropdownMenuButton3">
                                {isAuthenticated ? (
                                    <>
                                        <li><a className="dropdown-item" href="#" onClick={handleLogoutClick}>Cerrar sesión</a></li>
                                        {(userType === 1 || userType === 3) && (
                                            <>
                                                <li><a className="dropdown-item" href="#" onClick={handleAdminRegisterClick}>Registrar usuarios</a></li>
                                                <li><a className="dropdown-item" href="#" onClick={handleCocheRegisterClick}>Añadir coche a la venta</a></li>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <li><a className="dropdown-item" href="#" onClick={handleLoginClick}>Iniciar sesión</a></li>
                                        <li><a className="dropdown-item" href="#" onClick={handleRegisterClick}>Registrarse</a></li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>

            <main className=''>
                <Carrusel></Carrusel>
                {isAuthenticated && userType === 1 && (
                    <div
                        className="enlaces-adicionales mt-3 d-flex  flex-column bg-light border border-info rounded w-75 mx-auto">
                        <h3 className="text-center text-info">Gestión de coches</h3>
                        <div className="d-flex flex-wrap justify-content-around mt-5">
                            <div className="text-center d-flex flex-column align-items-center col-6 col-lg-auto mb-3">
                                <a className="icon-person fs-1 text-decoration-none" onClick={hanleTablaPropietarios}></a>
                                <p className="text-info fs-4 mb-0" onClick={hanleTablaPropietarios}>Propietarios</p>
                            </div>
                            <div className="text-center d-flex flex-column align-items-center col-6 col-lg-auto mb-3">
                                <a className="icon-info fs-1 text-decoration-none" onClick={handleRegistroCompraVenta}></a>
                                <p className="text-info fs-4 mb-0" onClick={handleRegistroCompraVenta}>Registro compra/venta</p>
                            </div>
                            <div className="text-center d-flex flex-column align-items-center col-6 col-lg-auto mb-3">
                                <a className="icon-automobile fs-1 text-decoration-none" onClick={handleTablaCochesClick}></a>
                                <p className="text-info fs-4 mb-0" onClick={handleTablaCochesClick}>Coches</p>
                            </div>
                            <div className="text-center d-flex flex-column align-items-center col-6 col-lg-auto mb-3">
                                <a className="icon-cog fs-1 text-decoration-none" onClick={handleActualizarEstado}></a>
                                <p className="text-info fs-4 mb-0" onClick={handleActualizarEstado}>Actualizar estado</p>
                            </div>
                        </div>
                        <div>
                            <InformationSection></InformationSection>
                        </div>

                    </div>

                )}
                {isAuthenticated && userType === 4 && (
                    <Information2></Information2>
                )}

                {/* Super root Content Section */}
                {isAuthenticated ? (
                    <>
                        {userType === 3 ? (
                            <div
                                className="registroEmpresaUser mt-5 p-5 bg-light border border-info rounded w-75 mx-auto">
                                <h3 className="text-center text-info">Gestión de empresas</h3>
                                <div className="container d-flex flex-column flex-lg-row justify-content-between mt-3">
                                    <button type="submit" className="btn btn-info w-100 w-lg-50 mb-2 mb-lg-0 me-lg-2"
                                            onClick={handleEmpresaRegisterClick}>Registrar empresa
                                    </button>
                                    <button type="submit" className="btn btn-info w-100 w-lg-50"
                                            onClick={handleDarBajaEmpresa}>Dar de baja
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </>
                ) : null}

            </main>
            <footer className='mt-5'><PiePagina></PiePagina></footer>
        </div>
    );
}
