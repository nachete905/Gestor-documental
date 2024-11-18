import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './TiendaCoches.css';
import { useNavigate } from 'react-router-dom';
import BarraNavegacion from "../barraNavegacion/BarraNavegacion";
import BarraUserNormal from "../barraNavegacion/barraUserNormal";

const getPhotoUrl = (photoPath) => {
    return `https://gestionocasion.com/${photoPath}`;
};

export default function TiendaComun() {
    const [coches, setCoches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [estadoCoches, setEstadoCoches] = useState([]);
    const navigate = useNavigate();
    const [dots, setDots] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots + 1) % 4);
        }, 300);
        return () => clearInterval(interval); // Limpiar intervalo al desmontar
    }, []);

    const puntosAnimados = ".".repeat(dots);

    useEffect(() => {
        setLoading(true); // Activamos loading
        fetch('https://gestionocasion.com/api/tiendaOnline')
            .then(response => {
                if (!response.ok) throw new Error('Error el obtener los coches');
                return response.json();
            })
            .then(data => {
                setCoches(data);
                setLoading(false); // Desactivamos loading
            })
            .catch(error => {
                setError('Error al obtener los coches');
                setLoading(false); // Desactivamos loading en caso de error
            });
    }, []);

    useEffect(() => {
        fetch(`https://gestionocasion.com/api/estados`)
            .then(response => {
                if (!response.ok) throw new Error('Error fetching coche states');
                return response.json();
            })
            .then(data => {
                setEstadoCoches(data);
            })
            .catch(error => {
                console.error('Error fetching coche states:', error);
            });
    }, []);

    const cochesDisponibles = coches.filter(coche => coche.estado === "disponible");

    if (loading) {
        return (
            <div className="containerTienda d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
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


    if (error) {
        return <div className="text-center mt-5 fs-2 bg-dark text-danger rounded p-3">{error}</div>;
    }

    const handleContacto = async (matricula) => {
        try {
            const response = await fetch(`http://localhost:8000/api/cocheEmpresa/${matricula}`);
            const empresa = await response.json();
            navigate("/contacto", { state: { id_empresa: empresa.id_empresa } });
        } catch (error) {
            console.error("Error al obtener la empresa:", error);
        }
    };


    return (
        <div className="containerTienda mb-5">
            <BarraUserNormal/>
            <h2 className="text-center mb-4 text-light">Tienda</h2>
            <div className="rowTienda">
                {cochesDisponibles.map(coche => (
                    <div key={coche.matricula} className="col-md-4 mb-4">
                        <div className="card h-100 tienda-card border border-4 border-dark bg-dark">
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
                                    <button className="btn w-50 text-light"  onClick={() => handleContacto(coche.matricula)}>Contactar Empresa</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
