import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './TiendaCoches.css';
import { useNavigate } from 'react-router-dom';

// Función para obtener la URL completa de la foto
const getPhotoUrl = (photoPath) => {
    const url = `http://localhost:8000/${photoPath}`;
    return url;
};

export default function TiendaCoches() {
    const [coches, setCoches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [empresaId, setEmpresaId] = useState(null);
    const [estadoCoches, setEstadoCoches] = useState([]);
    const navigate = useNavigate();

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
                setCoches(data);  // Guardamos los coches obtenidos en el estado
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
                    setEstadoCoches(data); // Guardamos los estados de los coche
                })
                .catch(error => {
                    console.error('Error fetching coche states:', error);
                });
        }
    }, [empresaId]);

    // Filtramos coches por estado disponible
    const cochesDisponibles = coches.filter(coche => estadoCoches.includes(coche.estado) && coche.estado === "disponible");

    if (loading) {
        return <div className="text-center mt-5 fs-2 bg-dark text-white rounded p-3">Cargando coches...</div>;
    }

    if (error) {
        return <div className="text-center mt-5 fs-2 bg-dark text-danger rounded p-3">{error}</div>;
    }

    const handleReservaClick = () => {
        navigate('/registroVenta');
    };

    return (
        <div className="container mt-5 mb-5">
            <h2 className="text-center mb-4">Gestión de los coches</h2>
            <div className="row">
                {cochesDisponibles.map(coche => (
                    <div key={coche.matricula} className="col-md-4 mb-4">
                        <div className="card h-100 tienda-card border border-4 border-dark">
                            <div id={`carousel-${coche.matricula}`} className="carousel slide" data-bs-ride="carousel">
                                <div className="carousel-inner">
                                    {coche.fotos.map((foto, index) => (
                                        <div key={foto.id_foto} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                            <img
                                                src={getPhotoUrl(foto.foto)}
                                                className="d-block w-100 tienda-card-img"
                                                alt={`Foto de ${coche.matricula}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                                {coche.fotos.length > 1 && (
                                    <>
                                        <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${coche.matricula}`} data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon rounded-circle" aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${coche.matricula}`} data-bs-slide="next">
                                            <span className="carousel-control-next-icon rounded-circle" aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </>
                                )}
                            </div>
                            <div className="card-body text-center text-info ">
                                <h5 className="card-title ">{coche.marca} {coche.modelo}</h5>
                                <div className="row text-left text-info">
                                    <div className="col-6 text-start fw-bold">Matrícula:</div>
                                    <div className="col-6 text-end">{coche.matricula}</div>

                                    <div className="col-6 text-start fw-bold">Kilometraje:</div>
                                    <div className="col-6 text-end">{coche.kilometraje}</div>

                                    <div className="col-6 text-start fw-bold">Tipo combustible:</div>
                                    <div className="col-6 text-end">{coche.tipo_combustible}</div>

                                    <div className="col-6 text-start fw-bold">Tipo de cambio:</div>
                                    <div className="col-6 text-end">{coche.tipo_cambio}</div>

                                    <div className="col-6 text-start fw-bold">Año de matriculación:</div>
                                    <div className="col-6 text-end">{coche.año_matriculacion.split('T')[0]}</div>
                                </div>
                                <div className="buttom mt-3 d-flex justify-content-center">
                                    <button className="btn w-50 text-light" onClick={handleReservaClick}>Reservar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
