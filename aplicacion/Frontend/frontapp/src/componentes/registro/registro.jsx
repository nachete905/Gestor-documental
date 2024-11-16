import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import photo from '../logo/Logo.webp';
import { validarNombre, validarApellido, validarEmail, validarTelefono, validarPassword } from './validacionesRegistro.js';
import './registro.css';  // Asegúrate de importar el archivo CSS personalizado

export function recogerDatos(event, navigate, onLogin, setErrorMessage) {
    event.preventDefault();
    // Recolectar los datos del formulario
    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let email = document.getElementById("email").value;
    let telefono = document.getElementById("telefono").value;
    let password = document.getElementById("password").value;

    let datos = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        telefono: telefono,
        password: password
    };

    // Enviar los datos de registro
    fetch('http://localhost:8000/api/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='))?.split('=')[1]
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
        console.log("Registro exitoso:", data);
        // Ahora, inicia sesión automáticamente
        return fetch('http://localhost:8000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='))?.split('=')[1]
            },
            body: JSON.stringify({ email: email, password: password }),
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert('Redirigiendo al home con la sesión iniciada')
        localStorage.setItem('token', data.token);  // Guarda el token en el almacenamiento local
        localStorage.setItem('isLoggedIn', 'true');
        onLogin();  // Actualiza el estado de autenticación
       window.location.href = '/';  // Redirige al usuario a la página de inicio
    })
    .catch(error => {
        console.error("Error:", error);
        setErrorMessage('Error en el registro o inicio de sesión. Por favor, intenta nuevamente.');
    });
    
}

export default function Registro({ onLogin }) {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = (event) => {
        recogerDatos(event, onLogin, navigate, setErrorMessage);
    };
    return (
        <div className="containerRegistro d-flex justify-content-center align-items-center">
            <div className="registro-container d-flex flex-column flex-md-row">
                <div className="registro-left d-flex flex-column align-items-center">
                    <img src={photo} alt="Logo" className="registro-logo"/>
                    <h2 className="text-center text-light mt-4">Registro</h2>
                </div>
                <div className="registro-right w-100">
                    <form method="POST" className="d-flex flex-column align-items-center w-100" onSubmit={handleSubmit}>
                        <div className="form-group w-100 text-light">
                            <label htmlFor="nombre">Nombre de usuario</label>
                            <input type="text" className="form-control w-100" id="nombre" placeholder="Nombre" onBlur={validarNombre}/>
                            <span id="nombre-error" className="text-danger" style={{display: 'none'}}>
                            El nombre no está bien escrito.
                        </span>
                        </div>
                        <div className="form-group w-100 text-light">
                            <label htmlFor="apellido">Apellido</label>
                            <input type="text" className="form-control w-100" id="apellido" placeholder="Apellido" onBlur={validarApellido}/>
                            <span id="apellido-error" className="text-danger" style={{display: 'none'}}>
                            El apellido no está bien escrito.
                        </span>
                        </div>
                        <div className="form-group w-100 text-light">
                            <label htmlFor="email">Email</label>
                            <input type="email" className="form-control w-100" id="email" placeholder="Email" onBlur={validarEmail}/>
                            <span id="email-error" className="text-danger" style={{display: 'none'}}>
                            El Email no está bien escrito.
                        </span>
                        </div>
                        <div className="form-group w-100 text-light">
                            <label htmlFor="telefono">Teléfono</label>
                            <input type="text" className="form-control w-100" id="telefono" placeholder="Teléfono" onBlur={validarTelefono}/>
                            <span id="telefono-error" className="text-danger" style={{display: 'none'}}>
                            El teléfono no está bien escrito.
                        </span>
                        </div>
                        <div className="form-group w-100 text-light">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control w-100" id="password" placeholder="Password" onChange={validarPassword}/>
                            <span id="contrasenna-error" className="text-danger" style={{display: 'none'}}>
                            La contraseña no cumple los requisitos
                        </span>
                            <ul id="password-requisitos" className="text-danger" style={{display: 'none'}}>
                                <li id="mayuscula">Mínimo una mayúscula</li>
                                <li id="numero">Mínimo un número</li>
                                <li id="especial">Mínimo un carácter especial</li>
                                <li id="longitud">Mínimo 8 caracteres</li>
                            </ul>
                        </div>
                        <div className="form-group w-100 text-light d-flex justify-content-center">
                            <button id="enviar" type="submit" className="btn btn-primary mt-2 w-100">Enviar</button>
                            <span id="submit-error" className="text-danger" style={{display: 'none'}}>
                            Falta algún campo por rellenar
                        </span>
                        </div>
                        {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
                    </form>
                </div>
            </div>
        </div>
    );


}

