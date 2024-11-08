import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import "./coches.css";
import { useNavigate } from 'react-router-dom';
export default function Coches() {
    const [coches, setCoches] = useState([]);
    const [busqueda, setBusqueda] = useState(""); // Estado para la búsqueda
    const [error, setError] = useState(""); // Estado para los errores
    const [empresaId, setEmpresaId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dots, setDots] = useState(0); // Estado para los puntos de la animación
    const navigate = useNavigate();

    // Animación de los puntos en el texto de carga
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots + 1) % 4);
        }, 300);
        return () => clearInterval(interval); // Limpiar intervalo al desmontar
    }, []);

    const puntosAnimados = ".".repeat(dots);


    // Función para obtener los coches según la empresa
    const obtenerCoches = (query = "") => {
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
                        let url = `http://localhost:8000/api/coches/${idEmpresa}`;
                        if (query) {
                            url += `/${query}`;
                        }
                        fetch(url)
                            .then((response) => {
                                if (!response.ok) {
                                    throw new Error('No se encontraron datos');
                                }
                                return response.json();
                            })
                            .then((data) => {
                                if (data) {
                                    setCoches(Array.isArray(data) ? data : [data]);
                                    setLoading(false);
                                } else {
                                    setCoches([]);
                                }
                                setError("");
                            })
                            .catch((error) => {
                                console.error("Error fetching data:", error);
                                setError("No se encontraron coches");
                                setLoading(false);
                                setCoches([]);
                            });
                    }
                }
            })
            .catch(error => {
                console.error("Error fetching user data:", error);
                setError("Error al obtener datos del usuario");
            });
    };

    // useEffect para cargar los coches al iniciar
    useEffect(() => {
        obtenerCoches();
    }, []);

    // Función que se ejecuta al cambiar la búsqueda
    const handleBusqueda = (e) => {
        setBusqueda(e.target.value);
    };

    // Función que se ejecuta al enviar el formulario de búsqueda
    const handleSubmit = (e) => {
        e.preventDefault();
        obtenerCoches(busqueda);
    };

    // Función para mostrar todos los coches
    const mostrarTodosLosCoches = () => {
        setBusqueda("");
        obtenerCoches();
    };

    const enviarMatricula = (matricula) =>{
            localStorage.setItem('matricula', matricula);
            let matriculaEnviar = localStorage.getItem('matricula');
            navigate('/Documentacion');
    }

    // Función para generar el PDF
    const generarPDF = (coches) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Lista de Coches", 14, 15);

        let startY = 30;

        coches.forEach(coche => {
            doc.setFontSize(12);
            doc.text(`Coche: ${coche.marca} ${coche.modelo} con matrícula: ${coche.matricula}`, 14, startY);
            startY += 10;
            doc.setFontSize(10);
            doc.text(`- Combustible: ${coche.tipo_combustible}`, 14, startY);
            startY += 7;
            doc.text(`- Transmisión: ${coche.tipo_cambio}`, 14, startY);
            startY += 7;
            doc.text(`- Kilometraje: ${coche.kilometraje}`, 14, startY);
            startY += 7;
            doc.text(`- Año de Matriculación: ${coche.año_matriculacion?.split('T')[0] || ""}`, 14, startY);
            startY += 7;
            doc.text(`- Año Documentación: ${coche.documentacion?.fecha_documentacion || ""}`, 14, startY);
            startY += 7;
            doc.text(`- Propietario: ${coche.propietario?.nombre || ""} ${coche.propietario?.apellido || ""}`, 14, startY);
            startY += 7;
            doc.text(`- Email Propietario: ${coche.propietario?.email || ""}`, 14, startY);
            startY += 15; // Espacio extra entre coches
        });

        // Guardar el PDF
        doc.save("coches.pdf");
    };

    // Si está cargando, mostrar la animación con puntos
    if (loading) {
        return (
            <div className="text-center mt-5 fs-2 bg-dark text-white rounded p-3">
                <div className="loading-circle">
                    <div>
                        Cargando<span>{puntosAnimados}</span>
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
        <div className="tabla">
            <h2 className='text-light text-center'>Lista de Coches</h2>
            <div className='container d-none d-lg-block'>
                <form onSubmit={handleSubmit} className="mb-3">
                    <input
                        type="text"
                        className='form-control mb-2'
                        name="busqueda"
                        id="busqueda"
                        placeholder="Buscar por matrícula"
                        value={busqueda}
                        onChange={handleBusqueda}
                    />
                    <button className='btn btn-primary w-100 mb-3' type="submit">Buscar</button>
                </form>
                <button onClick={mostrarTodosLosCoches} className="btn btn-secondary w-100 rounded mt-3">
                    Mostrar Todos
                </button>
            </div>

            <div className='d-block d-lg-none'>
                <form onSubmit={handleSubmit} className="mb-3 d-flex flex-column align-items-center">
                    <input
                        type="text"
                        className='w-75 mb-2'
                        name="busqueda"
                        id="busqueda"
                        placeholder="Buscar por matrícula"
                        value={busqueda}
                        onChange={handleBusqueda}
                    />
                    <button className='btn btn-primary w-75 mb-3' type="submit">Buscar</button>
                    <button onClick={mostrarTodosLosCoches} className="btn btn-secondary w-75 rounded">
                        Mostrar Todos
                    </button>
                </form>
            </div>

            <div className='container'>
                <div className='table d-none d-lg-block'>
                    <table className='table'>
                        <thead>
                        <tr>
                            <th>Matrícula</th>
                            <th>Marca</th>
                            <th>Modelo</th>
                            <th>Combustible</th>
                            <th>Transmisión</th>
                            <th>Kilometraje</th>
                            <th>Año de Matriculación</th>
                            <th>Año documentación</th>
                            <th>Propietario</th>
                            <th>Email Propietario</th>
                        </tr>
                        </thead>
                        <tbody>
                        {coches.length > 0 ? (
                            coches.map((coche) => (
                                <tr key={coche.matricula}>
                                    <td>
                                        <button
                                            onClick={() => enviarMatricula(coche.matricula)}
                                            className="btn btn-link p-0"
                                            style={{
                                                textDecoration: 'none',
                                                border: 'none',
                                                background: 'none',
                                                color: 'blue'
                                            }}
                                        >
                                            {coche.matricula}
                                        </button>
                                    </td>
                                    <td>{coche.marca}</td>
                                    <td>{coche.modelo}</td>
                                    <td>{coche.tipo_combustible}</td>
                                    <td>{coche.tipo_cambio}</td>
                                    <td>{coche.kilometraje}</td>
                                    <td>{coche.año_matriculacion.split('T')[0]}</td>
                                    <td>{coche.documentacion?.fecha_documentacion}</td>
                                    <td>{coche.propietario?.nombre} {coche.propietario?.apellido}</td>
                                    <td>{coche.propietario?.email}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10">No se encontraron coches</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                <div className='d-block d-lg-none'>
                    {coches.length > 0 ? (
                        coches.map((coche, index) => (
                            <div className="accordion mt-3" id={`accordion-${index}`} key={index}>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id={`heading-${index}`}>
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                                data-bs-target={`#collapse-${index}`} // Usamos el índice para hacer que sea único
                                                aria-expanded="false"
                                                aria-controls={`collapse-${index}`} // También aquí para hacerlo único
                                        >
                                            {coche.matricula}
                                        </button>
                                    </h2>
                                    <div
                                        id={`collapse-${index}`} // Identificador único
                                        className="accordion-collapse collapse"
                                        aria-labelledby={`heading-${index}`}
                                        data-bs-parent={`#accordion-${index}`}
                                    >
                                        <div className="accordion-body">
                                            <div>
                                                {/* Botón para enviar matrícula */}
                                                <button
                                                      onClick={() => enviarMatricula(coche.matricula)} // Llama a la función con la matrícula
                                                    className="btn btn-link"
                                                    style={{textDecoration: 'underline', color: 'blue'}}
                                                >
                                                    Documentación del coche
                                                </button>
                                            </div>
                                            <div><p><strong>Marca:</strong> {coche.marca}</p></div>
                                            <div><p><strong>Modelo:</strong> {coche.modelo}</p></div>
                                            <div><p><strong>Combustible:</strong> {coche.tipo_combustible}</p></div>
                                            <div><p><strong>Transmisión:</strong> {coche.tipo_cambio}</p></div>
                                            <div><p><strong>Kilometraje:</strong> {coche.kilometraje}</p></div>
                                            <div><p><strong>Año de
                                                Matriculación:</strong> {coche.año_matriculacion.split('T')[0]}</p>
                                            </div>
                                            <div><p>
                                                <strong>Propietario:</strong> {coche.propietario?.nombre} {coche.propietario?.apellido}
                                            </p></div>
                                            <div><p><strong>Email Propietario:</strong> {coche.propietario?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>No se encontraron coches</div>
                    )}
                </div>
                {/* Botón para generar PDF */}
                <div className='d-none d-lg-block'>
                    <button onClick={() => generarPDF(coches)} className="mt-3 rounded">
                        Generar PDF
                    </button>
                </div>
                <div className='d-block d-lg-none d-flex flex-column align-items-center'>
                    <button onClick={() => generarPDF(coches)} className="mt-3 rounded w-50">
                        Generar PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
