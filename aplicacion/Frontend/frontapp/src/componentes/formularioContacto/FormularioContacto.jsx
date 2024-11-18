import photo from "../logo/Logo.webp";
import { validarEmail, validarNombre } from "../registro/validacionesRegistro";
import React from "react";
import {useLocation, useNavigate} from "react-router-dom";
import './formularioContacto.css';
import {validarTextArea} from "./validarTextArea";

export default function FormularioContacto() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id_empresa } = location.state || {};

    const recogerDatos = async (e) => {
        e.preventDefault(); // Para prevenir el envío del formulario y manejarlo con JavaScript

        // Obtener los valores del formulario
        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const mensaje = document.getElementById("mensaje").value;

        // Asegúrate de que los campos no estén vacíos
        if (!nombre || !email || !mensaje) {
            // Mostrar un mensaje de error si algún campo está vacío
            console.error("Todos los campos son requeridos.");
            return;
        }

        // Crear el objeto con los datos del formulario
        const mensajeData = [{
            nombre: nombre,
            email: email,
            mensaje: mensaje
        }];

        try {
            // Enviar el mensaje como JSON al backend
            const response = await fetch("https://gestionocasion.com/api/contactar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id_empresa: id_empresa,
                    mensaje: mensajeData, // El mensaje se envía como un array con un objeto
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                console.error("Error al enviar mensaje:", result.error);
            } else {

                alert('Mensaje enviado correctamente, regresando al home...');
                navigate("/");
            }
        } catch (error) {
            console.error("Error de red al enviar mensaje:", error);
        }
    };

    return (
        <div className="containerContact d-flex justify-content-center align-items-center">
            <div className="registro-container row flex-column flex-lg-row">
                <div className="registro-leftContact col-12 col-lg-6 d-flex flex-column align-items-center">
                    <img src={photo} alt="Logo" className="registro-logo" />
                    <h2 className="text-center text-light mt-4">Contáctanos</h2>
                </div>
                <div className="registro-rightContact col-12 col-lg-6 d-flex justify-content-center align-items-center">
                    <form method="POST" className="w-100" onSubmit={recogerDatos}>
                        <div className="form-groupContact w-100 text-light">
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                type="text"
                                className="form-controlContact w-100"
                                id="nombre"
                                placeholder="Nombre"
                                onBlur={validarNombre}
                            />
                            <span id="nombre-error" className="text-danger" style={{display: 'none'}}>
                            El nombre no está bien escrito.
                        </span>
                        </div>

                        <div className="form-groupContact w-100 text-light mt-3">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                className="form-controlContact w-100"
                                id="email"
                                placeholder="Email"
                                onBlur={validarEmail}
                            />
                            <span id="email-error" className="text-danger" style={{display: 'none'}}>
                            El Email no está bien escrito.
                        </span>
                        </div>

                        <div className="form-groupContact w-100 text-light mt-3">
                            <label htmlFor="mensaje">Mensaje</label>
                            <textarea id="mensaje" name="mensaje" rows="10" maxLength="3000" placeholder="Escribe aquí tu mensaje..." className="form-control w-100" onBlur={validarTextArea}></textarea>
                            <div id="charCount">0 caracteres</div>
                            <span id="texto-error" className="text-danger" style={{display: 'none'}}> Supera el límite de caracteres </span>
                        </div>

                        <div className="form-groupContact w-100 text-light mt-3">
                            <button id="enviar" type="submit" className="btn btn-primary w-100">
                                Enviar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );


}
