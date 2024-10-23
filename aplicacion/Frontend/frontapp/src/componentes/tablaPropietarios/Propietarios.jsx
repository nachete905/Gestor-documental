import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";

export default function Coches() {
    const [propietarios, setPropietarios] = useState([]);
    const [busqueda, setBusqueda] = useState(""); // Estado para la búsqueda
    const [error, setError] = useState(""); // Estado para los errores
    const [empresaId, setEmpresaId] = useState(null);
    const [dots, setDots] = useState(0); // Estado para los puntos de la animación
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots + 1) % 4);
        }, 300);
        return () => clearInterval(interval); // Limpiar intervalo al desmontar
    }, []);


    const puntosAnimados = ".".repeat(dots);

    const obtenerPropietario = (query = "") => {
        fetch('http://localhost:8000/api/getUserData', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        }).then(response => {
            if (!response.ok) throw new Error('Error fetching user data');
            return response.json();
        }).then(data => {
            if (data.success) {
                let id_empresa = data.user.id_empresa;
                if (id_empresa) {
                    setEmpresaId(id_empresa);
                    let url = `http://localhost:8000/api/propietarios/${id_empresa}`;
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
                                setPropietarios(Array.isArray(data) ? data : [data]);
                                setLoading(false);
                            } else {
                                setPropietarios([]);
                            }
                            setError("");
                        })
                        .catch((error) => {
                            console.error("Error fetching data:", error);
                            setError("No se encontraron propietarios");
                            setLoading(false);
                            setPropietarios([]);
                        });
                }
            }
        })
            .catch(error => {
                console.error("Error fetching user data:", error);
                setError("Error al obtener datos del usuario");
            });
    }

    useEffect(() => {
        obtenerPropietario();
    }, [])

    const handleBusqueda = (e) => {
        setBusqueda(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        obtenerPropietario(busqueda); // Llama a obtenerPropietario con el valor de búsqueda
    };

    const mostrarTodosLosPropietarios = () => {
        setBusqueda("");
        obtenerPropietario(); // Llama a obtenerPropietario sin parámetros para mostrar todos
    };
    const  enviarDNI = (DNI) =>{
        localStorage.setItem('DNI', DNI);
        let DNIenviar = localStorage.getItem('DNI');
        navigate('/documentacionPropietario')
    }
    const generarPDF = (propietarios) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Lista de Propietarios", 14, 15);

        let startY = 30;

        propietarios.forEach(propietarios => {
            doc.setFontSize(12);
            // Añadir la información básica del coche (marca, modelo y matrícula)
            doc.text(`Propietario: ${propietarios.nombre} ${propietarios.apellido} con DNI: ${propietarios.DNI}`, 14, startY);
            startY += 10; // Incrementar la posición Y para la siguiente línea
            doc.setFontSize(10);

            doc.text(`- Email: ${propietarios.email}`, 14, startY);
            startY += 7;
            doc.text(`- Teléfono: ${propietarios.telefono}`, 14, startY);
            startY += 7;
            doc.text(`- Coche: ${propietarios.matricula}`, 14, startY);


            startY += 15; // Espacio extra entre coches
        });

        // Guardar el PDF
        doc.save("propietarios.pdf");
    };

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
        <div className='container'>
            <div className="tabla">
                <h2>Lista de propietarios</h2>
                <form onSubmit={handleSubmit} className="mb-3">
                    <input
                        type="text"
                        className='form-control mb-2'
                        name="busqueda"
                        id="busqueda"
                        placeholder="Buscar por DNI"
                        value={busqueda}
                        onChange={handleBusqueda}
                    />
                    <button type="submit" className='btn btn-primary w-100'>Buscar</button>
                </form>
                <button onClick={mostrarTodosLosPropietarios} className="btn btn-secondary mt-3 rounded w-100">
                    Mostrar Todos
                </button>
                <div className='table d-none d-lg-block'>
                    <table className='table mt-3'>
                        <thead>
                        <tr>
                            <th>DNI</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Matrícula</th>
                        </tr>
                        </thead>
                        <tbody>
                        {propietarios.length > 0 ? (
                            propietarios.map((propietario) => (
                                <tr key={propietario.DNI}>
                                    <td>
                                        <button
                                            onClick={() => enviarDNI(propietario.DNI)}
                                            className="btn btn-link p-0"
                                            style={{
                                                textDecoration: 'none',
                                                border: 'none',
                                                background: 'none',
                                                color: 'blue'
                                            }}
                                        >
                                            {propietario.DNI}
                                        </button>
                                    </td>
                                    <td>{propietario.nombre}</td>
                                    <td>{propietario.apellido}</td>
                                    <td>{propietario.email}</td>
                                    <td>{propietario.telefono}</td>
                                    <td>{propietario.matricula}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6">No se encontraron propietarios</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Formato de tarjeta para pantallas pequeñas */}
                <div className='d-block d-lg-none'>
                    {propietarios.length > 0 ? (
                        propietarios.map((propietario, index) => (
                            <div className="accordion mt-3" id={`accordion-${index}`} key={index}>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id={`heading-${index}`}>
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                                data-bs-target={`#collapse-${index}`} // Usamos el índice para hacer que sea único
                                                aria-expanded="false"
                                                aria-controls={`collapse-${index}`} // También aquí para hacerlo único
                                        >
                                            {propietario.DNI}
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
                                                <button
                                                    onClick={() => enviarDNI(propietario.DNI)} // Llama a la función con la matrícula
                                                    className="btn btn-link"
                                                    style={{textDecoration: 'underline', color: 'blue'}}
                                                >
                                                    Documentación del propietario
                                                </button>
                                            </div>
                                            <div><p><strong>Nombre:</strong> {propietario.nombre}</p></div>
                                            <div><p><strong>Apellido:</strong> {propietario.apellido}</p></div>
                                            <div><p><strong>Email:</strong> {propietario.email}</p></div>
                                            <div><p><strong>Matrícula:</strong> {propietario.matricula}</p></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>No se encontraron coches</div>
                    )}
                </div>
                <button onClick={() => generarPDF(propietarios)} className="btn btn-primary mt-3 rounded w-100">
                    Generar PDF
                </button>
            </div>
        </div>
    );
}
