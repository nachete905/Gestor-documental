import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; 
import toyota from '../fotos/toyota.jpg';
import dacia from '../fotos/dacia.jpg';
import volkswagen from '../fotos/volkswagen.jpg';
import logo from '../logo/Logo.webp'; 
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
                    }else if(data.isSuperRoot){
                        setUserType(3); // super admin
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

    const handleAdminRegisterClick = () => {
        navigate('/registroDeAdmin');
    };
    const handleCocheRegisterClick = () => {
        navigate('/formCoche');
    };

    const handleTiendaRegisterClick = () => {
        navigate('/tiendaCoches');
    };
    const handleTablaCochesClick = ()  => {
        navigate('/coches')
    };

    return (
        <div className="home">
            <div className="cabecera  w-100 d-flex justify-content-between align-items-center p-2 position-relative">
                <div className="d-flex align-items-center">
                    <img src={logo} alt="Logo" className="logo me-3" style={{ height: "50px" }} />
                    <h2 className="mb-0">Gestión ocasión</h2>
                </div>
                <div className="d-flex align-items-center">
                    <div className="dropdown me-2">
                        <button className="btn btn-secondary dropdown-toggle bg-dark" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            Información
                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton1">
                            <li><a className="dropdown-item active" href="#">Sobre nosotros</a></li>
                            <li><a className="dropdown-item" href="#a-que-nos-dedicamos">A qué nos dedicamos</a></li>
                            <li><a className="dropdown-item" href="#">Cómo funcionamos</a></li>
                            <li><a className="dropdown-item" href="#">Ver coches a la venta</a></li>
                        </ul>
                    </div>
                    <div className="dropdown me-2">
                        <button className="btn btn-secondary dropdown-toggle bg-dark text-light" type="button" id="dropdownMenuButton2" data-bs-toggle="dropdown" aria-expanded="false">
                            ¿Qué quieres hacer?
                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton2">
                            <li><a className="dropdown-item active" href="">Buscar coches</a></li>

                            {/* Condicional para mostrar la opción solo si el userType es 1 */}
                            {userType === 1 && (
                                <ul>
                                    <li><a className="dropdown-item" href="#">Ver información de los coches</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={handleTablaCochesClick}>Ver historial de un coche</a></li>    
                                </ul>
                               
                            )}
                        </ul>
                    </div>
                    <div className="dropdown me-2">
                        <button className="btn btn-secondary dropdown-toggle bg-dark" type="button" id="dropdownMenuButton3" data-bs-toggle="dropdown" aria-expanded="false">
                            {isAuthenticated ? (
                                <>
                                    {(userType === 1 || userType === 3) ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill-gear" viewBox="0 0 16 16">
                                        <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0m-9 8c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4m9.886-3.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0"/>
                                      </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                                        </svg>
                                    )}
                               </>
                            ) : "Iniciar sesión"}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton3">
                            {isAuthenticated ? (
                                <>
                                    <li><a className="dropdown-item" href="#" onClick={handleLogoutClick}>Cerrar sesión</a></li>
                                    {(userType === 1 || userType === 3) && (
                                        <>
                                        <li><a className="dropdown-item" href="" onClick={handleAdminRegisterClick}>Registrar usuarios</a></li>
                                        <li><a className="dropdown-item" href="" onClick={handleCocheRegisterClick}>Añadir coche a la venta</a></li>
                                        </>
                                        
                                    )}
                                </>
                            ) : (
                                <>
                                    <li><a className="dropdown-item" href="" onClick={handleLoginClick}>Iniciar sesión</a></li>
                                    <li><a className="dropdown-item" href="" onClick={handleRegisterClick}>Registrarse</a></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>

           
            {/* Content Section */}
            <div className="contenido">
                <div id="carouselExampleControls" className="carousel slide w-50 h-50 mx-auto mt-5 border border-4 border-info" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img className="d-block w-100 h-100" src={toyota} alt="Toyota Slide"/>
                            <div className="carousel-caption d-none d-md-block">
                                <h5>Toyota</h5>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-100 h-100" src={dacia} alt="Dacia Slide"/>
                            <div className="carousel-caption d-none d-md-block">
                                <h5>Dacia</h5>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-100 h-100" src={volkswagen} alt="Volkswagen Slide"/>
                            <div className="carousel-caption d-none d-md-block">
                                <h5>Volkswagen</h5>
                            </div>
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    </button>
                </div>
            </div>
             {/* Super root Content Section */}
             {isAuthenticated ? (
                <>
                {userType === 3 ? (
                    <div className="registroEmpresaUser mt-5 p-5 bg-light border border-info rounded w-75 mx-auto">
                        <h3 className="text-center text-info">Registrar empresa con usuario</h3>
                        <button type="submit" className="btn btn-info w-100" onClick={handleEmpresaRegisterClick}>Registrar</button>

                    </div>
                ) : null}
                </>
            ) : "pepe"}

            {/* Acerca de Section */}
            <div className="acerca-de-section mt-5 p-5 bg-light border border-info rounded w-75 mx-auto">
                <h3 className="text-center text-info">Acerca de nosotros</h3>
                <p className="text-center text-dark">
                    Somos una empresa dedicada a la venta de coches de ocasión, comprometidos con ofrecer la mejor calidad 
                    y servicio a nuestros clientes. Llevamos años en el mercado, ayudando a miles de personas a encontrar 
                    el coche perfecto para sus necesidades.
                </p>
            </div>
            {/*Coches a la venta*/}
            <div className="seccion-coches mt-5 p-5 bg-light border border-info rounded w-75 mx-auto d-flex flex-column align-items-center">
                <h3 className="text-center text-info">Coches a la venta</h3>
                <p className="text-center text-dark">
                        Descubre nuestra exclusiva selección de coches a la venta, donde encontrarás vehículos de alta calidad que se ajustan a todos los gustos y 
                        presupuestos. Ya sea que busques un modelo compacto, un sedán de lujo o un SUV versátil, aquí tenemos la opción perfecta para ti.
                        Todos nuestros coches están cuidadosamente revisados para garantizar un excelente rendimiento en cada viaje. 
                        ¡Explora ahora y encuentra el coche de tus sueños!
                </p>
                <button type="submit" id="boton" className="btn w-100" onClick={handleTiendaRegisterClick}>Llévate tu coche</button>
            </div>

            {/* Formulario de consultas */}
            <div className="consulta-section mt-5 p-5 bg-light border border-info rounded w-75 mx-auto">
                <h3 className="text-center text-info">Formulario de Consultas</h3>
                <form className="mt-3">
                    <div className="mb-3">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input type="text" className="form-control border border-info" id="nombre" placeholder="Ingresa tu nombre" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Correo Electrónico</label>
                        <input type="email" className="form-control border border-info" id="email" placeholder="Ingresa tu correo electrónico" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="consulta" className="form-label">Consulta</label>
                        <textarea className="form-control border border-info" id="consulta" rows="3" placeholder="Escribe tu consulta"></textarea>
                    </div>
                    <button type="submit" id="boton" className="btn btn-info w-100">Enviar</button>
                </form>
            </div>
        </div>
    );
}
