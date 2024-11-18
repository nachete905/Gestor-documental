import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './buzon.css';
import data from "bootstrap/js/src/dom/data";


const ComponenteMensajes = () => {
    const [mensajes, setMensajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [empresaId, setEmpresaId] = useState([]);
    const [modalData, setModalData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [dots, setDots] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots + 1) % 4);
        }, 300);
        return () => clearInterval(interval); // Limpiar intervalo al desmontar
    }, []);


    const puntosAnimados = ".".repeat(dots);

    useEffect(() => {
        // Obtener datos del usuario para acceder a la empresa
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
                        let url = `https://gestionocasion.com/api/mail/${idEmpresa}`;

                        // Fetch de los mensajes de la empresa
                        fetch(url)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('No se encontraron datos');
                                }
                                return response.json();
                            })
                            .then(data => {
                                if (data) {
                                    const mensajesParsed = data.map((item) => ({
                                        ...item,
                                        mensaje: typeof item.mensaje === 'string' ? JSON.parse(item.mensaje) : item.mensaje
                                    }));
                                    setMensajes(mensajesParsed);
                                } else {
                                    setMensajes([]);
                                }
                                setLoading(false);
                                setError("");
                            })
                            .catch(error => {
                                console.error("Error fetching data:", error);
                                setError("No se encontraron mensajes");
                                setLoading(false);
                                setMensajes([]);
                            });
                    }
                }
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                setError("Error al obtener datos del usuario");
                setLoading(false);
            });
    }, []); // Array de dependencias vacío para ejecutar solo al montar el componente

    // Función para mostrar el mensaje completo en el modal
    const abrirModal = (mensajeObj) => {
        setModalData(mensajeObj);  // Guardar los datos del mensaje seleccionado
        setShowModal(true);  // Mostrar el modal
    };

    // Función para cerrar el modal
    const cerrarModal = () => {
        setModalData(null);  // Limpiar los datos del mensaje cuando se cierra el modal
        setShowModal(false);  // Ocultar el modal
    };

    if (loading) {
        return (
            <div className="d-flex vh-100 align-items-center justify-content-center">
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
        <div className='buzon'>
            <div className="containerBuzon mt-5">
                <h2 className="text-center mb-4">Mensajes</h2>
                <div className="row justify-content-center">
                    {mensajes.length > 0 ? (
                        mensajes.map((mensajeObj) => (
                            <div className="card" style={{width: '18rem'}} key={mensajeObj.id_mensaje}>
                                <div className="card-body">
                                    <p className="card-text"><strong>De:</strong> {mensajeObj.mensaje.nombre}</p>
                                    <p
                                        className="card-text"
                                        style={{cursor: 'pointer', color: 'blue'}}
                                        onClick={() => abrirModal(mensajeObj)}
                                    >
                                        <strong>Mensaje:</strong> {mensajeObj.mensaje.mensaje.slice(0, 20)}...
                                    </p>
                                    <button className='botonEliminar border rounded'
                                            onClick={() =>enviarMensajeBorrar(mensajeObj.id_mensaje)}>Eliminar mensaje
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No hay mensajes</p>
                    )}
                </div>

                {/* Modal Controlado */}
                {showModal && modalData && (
                    <div className="modal show d-block" tabIndex="-1" role="dialog"
                         style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title text-dark">Mensaje completo</h5>
                                    <button type="button" className="btn-close" onClick={cerrarModal}></button>
                                </div>
                                <div className="modal-body">
                                    {/* Asegúrate de que modalData y sus propiedades estén correctamente accesibles */}
                                    <p className='text-dark'><strong>Remitente:</strong> {modalData.mensaje.email}</p>
                                    <p className='text-dark'><strong>Mensaje:</strong> {modalData.mensaje.mensaje}</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={cerrarModal}>Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

    );
};
export function enviarMensajeBorrar(id_mensaje) {

    let id = id_mensaje;

    let dato = {
        id: id
    };
    fetch(`https://gestionocasion.com/api/eliminarMensaje`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dato),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'mensaje eliminado') {
                console.log('Mensaje eliminado correctamente');
                window.location.reload();
            } else {
                console.error('Error al eliminar el mensaje:', data.message);
            }
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}

export default ComponenteMensajes;
