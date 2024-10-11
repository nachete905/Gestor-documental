import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";

export default function Coches() {
    const [propietarios, setPropietarios] = useState([]);
    const [busqueda, setBusqueda] = useState(""); // Estado para la búsqueda
    const [error, setError] = useState(""); // Estado para los errores
    const [empresaId, setEmpresaId] = useState(null);

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
                            } else {
                                setPropietarios([]);
                            }
                            setError("");
                        })
                        .catch((error) => {
                            console.error("Error fetching data:", error);
                            setError("No se encontraron coches");
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
        setBusqueda(e.target.value); // Actualiza el estado de búsqueda
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        obtenerPropietario(busqueda); // Llama a obtenerPropietario con el valor de búsqueda
    };

    const mostrarTodosLosPropietarios = () => {
        setBusqueda("");
        obtenerPropietario(); // Llama a obtenerPropietario sin parámetros para mostrar todos
    };
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



    return (
        <div className='container'>
            <div className="tabla">
                <h2>Lista de propietarios</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="busqueda"
                        id="busqueda"
                        placeholder="Buscar por DNI"
                        value={busqueda}
                        onChange={handleBusqueda} // Actualiza el estado con cada cambio en el input
                    />
                    <button type="submit">Buscar</button>
                </form>
                <button onClick={mostrarTodosLosPropietarios} className="mt-3 rounded">
                    Mostrar Todos
                </button>
                {error && <p>{error}</p>} {/* Mostrar mensaje de error si hay */}
                <table>
                    <thead>
                    <tr>
                        <th>DNI</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Matricula</th>
                    </tr>
                    </thead>
                    <tbody>
                    {propietarios.length > 0 ? (
                        propietarios.map((propietario) => (
                            <tr key={propietario.DNI}>
                                <td>
                                    <a href={`/documentacionPropietario/${propietario.DNI}`}
                                       style={{textDecoration: 'none'}}>
                                        {propietario.DNI}
                                    </a>
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
                            <td colSpan="10">No se encontraron propietarios</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <button onClick={() => generarPDF(propietarios)} className="mt-3 rounded">
                    Generar PDF
                </button>
            </div>
        </div>
    );
}
