import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import logo from '../logo/Logo.webp';
import './home.css';
import Carrusel from "../homeComponents/Carrusel";
import InformationSection from "../homeComponents/InformationSection";
import PiePagina from "../homeComponents/PiePagina";
import './iconosGestion/iconoPersona/style.css'
import './iconosGestion/iconoCoche/style.css';
import './iconosGestion/iconoRegistro/style.css';


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
                    }else{
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
            <nav className="cabecera w-100 d-flex justify-content-between align-items-center p-2 position-relative">
                <div className="d-flex align-items-center">
                    <img src={logo} alt="Logo" className="logo me-3" style={{height: "50px"}}/>
                    <h1 className="mb-0 d-none d-md-block">Gestión de vehículos de ocasión</h1>
                </div>
                <div className="d-flex align-items-center">
                    <div className="d-flex">
                        <a href='#a-que-nos-dedicamos' className="btn btn-secondary bg-dark text-light me-2 flex-fill">A que nos dedicamos</a>
                        <a className="btn btn-secondary bg-dark text-light me-2 flex-fill" onClick={abrirPDF}>Guía de usuario</a>
                        <a href='#coches-a-la-venta' className="btn btn-secondary bg-dark text-light me-2 flex-fill">Ver coches</a>
                    </div>

                    <div className="dropdown me-2 d-none d-md-block">
                        <button className="btn btn-secondary dropdown-toggle bg-dark text-light" type="button"
                                id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                            ¿Qué quieres hacer?
                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
                            {userType === 1 && (
                                <>
                                    <li><a className="dropdown-item" href="" onClick={handleTablaCochesClick}>Ver
                                        información de los coches</a></li>
                                    <li><a className="dropdown-item" href="" onClick={hanleTablaPropietarios}>Ver
                                        información de los propietarios</a></li>
                                    <li><a className="dropdown-item" href="" onClick={handleRegistroCompraVenta}>Ver
                                        registro de compra-venta</a></li>
                                </>
                            )}
                        </ul>
                    </div>

                    <div className="dropdown me-2 d-none d-md-block">
                        <button className="btn btn-secondary dropdown-toggle bg-dark text-light" type="button"
                                id="dropdownMenuButton3" data-bs-toggle="dropdown" aria-expanded="false">
                            {isAuthenticated ? (
                                <>
                                    {(userType === 1 || userType === 3) ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" className="bi bi-person-fill-gear" viewBox="0 0 16 16">
                                            <path
                                                d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4m9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l-.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                            <path
                                                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                                        </svg>
                                    )}
                                </>
                            ) : "Iniciar sesión"}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton3">
                            {isAuthenticated ? (
                                <>
                                    <li><a className="dropdown-item" href="#" onClick={handleLogoutClick}>Cerrar
                                        sesión</a></li>
                                    {(userType === 1 || userType === 3) && (
                                        <>
                                            <li><a className="dropdown-item" href="" onClick={handleAdminRegisterClick}>Registrar
                                                usuarios</a></li>
                                            <li><a className="dropdown-item" href="" onClick={handleCocheRegisterClick}>Añadir
                                                coche a la venta</a></li>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <li><a className="dropdown-item" href="" onClick={handleLoginClick}>Iniciar
                                        sesión</a></li>
                                    <li><a className="dropdown-item" href=""
                                           onClick={handleRegisterClick}>Registrarse</a></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>


            <main className=''>
                <Carrusel></Carrusel>
                {isAuthenticated && userType === 1 && (
                    <div className="enlaces-adicionales mt-3 d-flex justify-content-around bg-light border border-info rounded w-75 mx-auto">
                        <div className="text-center d-flex flex-column align-items-center">
                            <a className="icon-person fs-1 text-decoration-none" onClick={hanleTablaPropietarios}></a>
                            <p className='text-info fs-4 mb-0' onClick={hanleTablaPropietarios}>Propietarios</p>
                        </div>
                        <div className="text-center d-flex flex-column align-items-center">
                            <a className="icon-info fs-1 text-decoration-none" onClick={handleRegistroCompraVenta}></a>
                            <p className='text-info fs-4 mb-0' onClick={handleRegistroCompraVenta}>Registro compra/venta</p>
                        </div>
                        <div className="text-center d-flex flex-column align-items-center">
                            <a className="icon-automobile fs-1 text-decoration-none" onClick={handleTablaCochesClick}></a>
                            <p className='text-info fs-4 mb-0' onClick={handleTablaCochesClick}>Coches</p>
                        </div>
                    </div>
                )}
                <InformationSection></InformationSection>

                {/* Super root Content Section */}
                {isAuthenticated ? (
                    <>
                        {userType === 3 ? (
                            <div
                                className="registroEmpresaUser mt-5 p-5 bg-light border border-info rounded w-75 mx-auto">
                                <h3 className="text-center text-info">Registrar empresa con usuario</h3>
                                <button type="submit" className="btn btn-info w-100"
                                        onClick={handleEmpresaRegisterClick}>Registrar
                                </button>

                            </div>
                        ) : null}
                    </>
                ) : null}

            </main>
            <footer className='mt-5'>
                <PiePagina></PiePagina>
            </footer>

        </div>
    );
}
