import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import photo from '../logo/Logo.webp';
import { validarNombre, validarApellido, validarEmail, validarTelefono, validarPassword } from './validacionesRegistro.js';
import './registro.css';


export function recogerDatos(event, setErrorMessage, navigate, onLogin, id_instalacion, id_empresa) {
    event.preventDefault();

    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let email = document.getElementById("email").value;
    let telefono = document.getElementById("telefono").value;
    let password = document.getElementById("password").value;
    let tipoUser = document.getElementById("tipoUser").value;

    let datos = {
        nombre,
        apellido,
        email,
        telefono,
        password,
        tipoUser,
        id_instalacion,
        id_empresa
    }

    fetch('https://gestionocasion.com/api/registroAdmin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='))?.split('=')[1],
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(datos),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert("Registro exitoso:", data);
        onLogin();
        navigate('/');
    })
    .catch(error => {
        console.error("Error:", error);
        setErrorMessage('Error en el registro. Por favor, intenta nuevamente.');
    });
}



export default function RegistroDeAdmin({ onLogin }) {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [instalaciones, setInstalaciones] = useState([]);
    const [idEmpresa, setEmpresaId] = useState(null);

    useEffect(() => {
        fetch('https://gestionocasion.com/api/getUserData', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Error fetching user data');
            return response.json();
        })
        .then(data => {
            if (data.success) {
                const idEmpresa = data.user.id_empresa;
                if (idEmpresa) {
                    setEmpresaId(idEmpresa);
                    return fetch(`https://gestionocasion.com/api/instalaciones/${idEmpresa}`);
                } else {
                    throw new Error('ID de la empresa no encontrado');
                }
            } else {
                throw new Error('Usuario no encontrado');
            }
        })
        .then(instalacionesResponse => {
            if (!instalacionesResponse.ok) throw new Error('Error fetching instalaciones');
            return instalacionesResponse.json();
        })
        .then(instalacionesData => {
            setInstalaciones(instalacionesData.data); // Almacena las instalaciones
        })
        .catch(error => {
            console.error(error);
            setErrorMessage('Error al obtener los datos del usuario.');
        });
    }, []);
    const handleSubmit = (event) => {
        const instalacionId = document.getElementById("instalacion").value; 
        recogerDatos(event, onLogin, navigate, setErrorMessage, instalacionId, idEmpresa);
    };

    return (
        <div>
            <div className="containerRegistro d-flex justify-content-center align-items-center vh-100">
                <div className="registro-container d-flex flex-column flex-lg-row">
                    <div className="registro-left text-center text-lg-start">
                        <img src={photo} alt="Logo" className="registro-logo" />
                        <h2 className="text-center text-light mt-4">Registro de usuario</h2>
                    </div>
                    <div className="registro-right mt-4 mt-lg-0 w-100">
                        <form method="POST" className="d-flex flex-column align-items-center w-100" onSubmit={handleSubmit}>
                            <div className="form-group w-100 text-light">
                                <label htmlFor="nombre">Nombre de usuario</label>
                                <input type="text" className="form-control form-control-md w-100" id="nombre" placeholder="Nombre" onBlur={validarNombre} required />
                                <span id="nombre-error" className="text-danger" style={{ display: 'none' }}>
                                El nombre debe contener solo letras.
                            </span>
                            </div>
                            <div className="form-group w-100 text-light">
                                <label htmlFor="apellido">Apellido</label>
                                <input type="text" className="form-control form-control-md w-100" id="apellido" placeholder="Apellido" onBlur={validarApellido} required />
                                <span id="apellido-error" className="text-danger" style={{ display: 'none' }}>
                                El apellido debe contener solo letras.
                            </span>
                            </div>
                            <div className="form-group w-100 text-light">
                                <label htmlFor="email">Email</label>
                                <input type="email" className="form-control form-control-md w-100" id="email" placeholder="Email" onBlur={validarEmail} required />
                                <span id="email-error" className="text-danger" style={{ display: 'none' }}>
                                Ingresa un email válido.
                            </span>
                            </div>
                            <div className="form-group w-100 text-light">
                                <label htmlFor="telefono">Teléfono</label>
                                <input type="text" className="form-control form-control-md w-100" id="telefono" placeholder="Teléfono" onBlur={validarTelefono} required />
                                <span id="telefono-error" className="text-danger" style={{ display: 'none' }}>
                                    Ingresa un teléfono válido.
                                </span>
                            </div>
                            <div className="form-group w-100 text-light">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control form-control-md w-100" id="password" placeholder="Password" onBlur={validarPassword} required />
                                <span id="contrasenna-error" className="text-danger" style={{ display: 'none' }}>
                                La contraseña no cumple con los requisitos.
                            </span>
                                <ul id="password-requisitos" className="text-danger" style={{ display: 'none' }}>
                                    <li id="mayuscula">Mínimo una mayúscula</li>
                                    <li id="numero">Mínimo un número</li>
                                    <li id="especial">Mínimo un carácter especial</li>
                                    <li id="longitud">Mínimo 8 caracteres</li>
                                </ul>
                            </div>
                            <div className="form-group w-100 text-light">
                                <label htmlFor="tipoUser">Rol</label>
                                <select className="form-control form-control-md w-100" id="tipoUser" required>
                                    <option value="1">Administrador</option>
                                    <option value="2">No Administrador</option>
                                </select>
                            </div>
                            <div className="form-group w-100 text-light">
                                <label htmlFor="instalacion">Instalación</label>
                                <select id="instalacion" className="form-control form-control-md w-100" required>
                                    <option value="">Seleccione una instalación</option>
                                    {instalaciones.map(instalacion => (
                                        <option key={instalacion.id_instalacion} value={instalacion.id_instalacion}>
                                            {instalacion.ubicacion}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group w-100 text-light d-flex justify-content-center">
                                <button id="enviar" type="submit" className="btn btn-primary mt-2">Enviar</button>
                            </div>
                            {errorMessage && <p className="text-danger">{errorMessage}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );


}
