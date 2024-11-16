import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BarraNavegacion from "../barraNavegacion/BarraNavegacion";
import './actualizaraEstado.css';

export function recogerDatos(event) {
    event.preventDefault();

    // Obtener todos los selectores con el atributo `data-matricula`
    const estados = Array.from(document.querySelectorAll('[data-matricula]')).map(select => ({
        matricula: select.getAttribute('data-matricula'), // Obtener la matrícula del coche
        estado: select.value // Obtener el valor seleccionado para ese coche
    }));

    const data = {
        estados: estados // Arreglo de objetos con matrícula y estado de cada coche
    };

    // Hacer la petición POST
    fetch('http://localhost:8000/api/actualizarCoche', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',  // Asegúrate de que la cabecera esté configurada
        },
        body: JSON.stringify(data)  // Asegúrate de enviar el JSON correctamente
    })
        .then(response => {
            if (!response.ok) throw new Error('Error al actualizar el estado de los coches');
            return response.json();
        })
        .then(responseData => {
            console.log('Respuesta de la API:', responseData);
            // Lógica adicional, como redireccionar o mostrar un mensaje de éxito
        })
        .catch(error => {
            console.log(data)
            console.error('Error en la petición:', error);
        });
}

export default function ActualizarEstado() {
    const [cochesActualizar, setCochesActualizar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [empresaId, setEmpresaId] = useState(null);
    const [estadoCoches, setEstadoCoches] = useState([]);
    const [dots, setDots] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots + 1) % 4);
        }, 300);
        return () => clearInterval(interval); // Limpiar intervalo al desmontar
    }, []);


    const puntosAnimados = ".".repeat(dots);

    useEffect(() => {
        // Primera petición para obtener los datos del usuario
        fetch('http://localhost:8000/api/getUserData', {
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
                        return fetch(`http://localhost:8000/api/tiendaCoches/${idEmpresa}`);
                    } else {
                        throw new Error('ID de la empresa no encontrado');
                    }
                }
            })
            .then(response => {
                if (!response.ok) throw new Error('Error fetching coches');
                return response.json();
            })
            .then(data => {
                setCochesActualizar(data);  // Guardamos los coches obtenidos en el estado
                setLoading(false);  // Indicamos que la carga ha terminado
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Error fetching data');  // Actualizamos el estado de error
                setLoading(false);  // Finalizamos la carga incluso si hay un error
            });
    }, []);

    useEffect(() => {
        if (empresaId) {
            // Nueva petición para obtener el estado de los coches
            fetch(`http://localhost:8000/api/estadoCoches/${empresaId}`)
                .then(response => {
                    if (!response.ok) throw new Error('Error fetching coche states');
                    return response.json();
                })
                .then(data => {
                    console.log(data)
                    setEstadoCoches(data); // Guardamos los estados de los coche
                })
                .catch(error => {
                    console.error('Error fetching coche states:', error);
                });
        }
    }, [empresaId]);
    const cochesDisponiblesActualizar = cochesActualizar.filter(
        coche => estadoCoches.includes(coche.estado) && (coche.estado === "disponible" || coche.estado === "en-reparacion")
    );

    if (loading) {
        return (
            <div className="containerActu d-flex vh-100 align-items-center justify-content-center">
                <div className="text-center fs-2 bg-dark text-white rounded p-3">
                    <div className="loading-circle">
                        <div>
                            Cargando<span>{puntosAnimados}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    // Si hay un error, mostrar el mensaje de error
    if (error) {
        return <div className="text-center mt-5 fs-2 bg-dark text-danger rounded p-3">{error}</div>;
    }


    return (
        <div className="containerActu mb-5">
            <BarraNavegacion></BarraNavegacion>
            <h2 className="text-center mt-5 mb-4">Estado de los coches</h2>
            {/* Form container */}
            <div className='d-flex justify-content-center'>
                <form className='formularioActu w-50 ' method='POST' onSubmit={recogerDatos}>
                    <div className="row">
                        {cochesDisponiblesActualizar.map((cocheActu) => (
                            <div key={cocheActu.matricula}
                                 className="d-flex align-items-center mb-4 p-3 border rounded shadow-sm bg-light">
                                <div className="col-6">
                                    <p className="mb-0 text-dark"><strong>{cocheActu.marca} {cocheActu.modelo}</strong>
                                    </p>
                                </div>
                                <div className="col-6">
                                    <select
                                        data-matricula={cocheActu.matricula} // Almacena la matrícula del coche
                                        className="form-select"
                                        aria-label="Estado del coche"
                                    >
                                        <option value="disponible">Disponible</option>
                                        <option value="en-reparacion">En reparación</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                    </div>
                </form>
            </div>

        </div>
    );
}

