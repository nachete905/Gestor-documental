import React, { useEffect, useState } from "react";
import "./coches.css";

export default function Coches() {
    const [coches, setCoches] = useState([]);
    const [busqueda, setBusqueda] = useState(""); // Estado para la búsqueda
    const [error, setError] = useState(""); // Estado para los errores
    const [empresaId, setEmpresaId] = useState(null); 
  
    // Función para obtener los coches según la búsqueda
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
                if(idEmpresa){
                    setEmpresaId(idEmpresa)   
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
                            } else {
                                setCoches([]);
                            }
                            setError("");
                        })
                        .catch((error) => {
                            console.error("Error fetching data:", error);
                            setError("No se encontraron coches");
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
    }, []); // El array vacío hace que se ejecute solo al cargar el componente

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

    return (
        <div className="tabla">
            <h1>Lista de Coches</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="busqueda"
                    id="busqueda"
                    placeholder="Buscar por matrícula"
                    value={busqueda}
                    onChange={handleBusqueda}
                />
                <button type="submit">Buscar</button>
            </form>
            <button onClick={mostrarTodosLosCoches} className="mt-3 rounded">
                Mostrar Todos
            </button>
            {error && <p>{error}</p>} {/* Mostrar mensaje de error si hay */}
            <table>
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
                                <td>{coche.matricula}</td>
                                <td>{coche.marca}</td>
                                <td>{coche.modelo}</td>
                                <td>{coche.tipo_combustible}</td>
                                <td>{coche.tipo_cambio}</td>
                                <td>{coche.kilometraje}</td>
                                <td>{coche.año_matriculacion}</td>
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
    );
}
