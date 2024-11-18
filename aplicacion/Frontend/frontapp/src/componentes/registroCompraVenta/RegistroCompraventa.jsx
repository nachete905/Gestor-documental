import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import data from "bootstrap/js/src/dom/data";
import BarraNavegacion from "../barraNavegacion/BarraNavegacion";


export default function RegistroCompraventa(){
    const [empresaId, setEmpresaId] = useState(null);
    const [coches, setCoches] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dots, setDots] = useState(0);
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prevDots) => (prevDots + 1) % 4);
        }, 300);
        return () => clearInterval(interval); // Limpiar intervalo al desmontar
    }, []);


    const puntosAnimados = ".".repeat(dots);



    const obtenerDatos = (query = "") =>{
        fetch('https://gestionocasion.com/api/getUserData', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        }).then(response => {
            if (!response.ok) throw new Error('Error fetching user data');
            return response.json();
        }).then(data =>{
            if(data.success){
                let id_empresa = data.user.id_empresa;
                if(id_empresa){
                    setEmpresaId(id_empresa);
                    let url = `https://gestionocasion.com/api/registroCompraVenta/${id_empresa}`
                    if (query) {
                        url += `/${query}`;
                    }
                    fetch(url)
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error('No se encontraron datos');
                            }
                            return response.json();
                        }).then(data =>{
                            if(data){
                                setCoches(Array.isArray(data) ? data : [])
                                setLoading(false);
                            }else {
                                setCoches([]);
                            }
                            setError("");
                    }) .catch((error) => {
                        console.error("Error fetching data:", error);
                        setError("No se encontraron registros");
                        setLoading(false);
                        setCoches([]);
                    });

                }
            }
        })  .catch(error => {
            console.error("Error fetching user data:", error);
            setError("Error al obtener datos del registro");
        });
    }

    useEffect(() =>{
        obtenerDatos();
    },[])
    const handleBusqueda = (e) => {
        setBusqueda(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const sanitizedBusqueda = busqueda.toLowerCase().trim();
        obtenerDatos(sanitizedBusqueda);
    };
    const mostrarTodoElRegistro = () => {
        setBusqueda("");
        obtenerDatos(); // Llama a obtenerPropietario sin parámetros para mostrar todos
    };
    const generarPDF = (coches) =>{
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Registro de compra-venta", 14, 15);

        let startY = 30;

        coches.forEach(coche =>{
            doc.setFontSize(12);
            doc.text(`Coche: ${coche.coche} con matrícula: ${coche.matricula} `, 14, startY)
            startY += 10;
            doc.setFontSize(10);

            doc.text(`- Acción realizada: ${coche.accion_realizada}`, 14, startY);
            startY += 7;

            doc.text(`- Comprador: ${coche.comprador}`, 14, startY);
            startY += 7;

            doc.text(`- Fecha: ${coche.fecha}`, 14, startY);
            startY += 7;

            doc.text(`- Vendedor: ${coche.vendedor}`, 14, startY);
            startY += 7;
        })

        doc.save('registro-compraVenta.pdf');
    }


    if (loading) {
        return (
            <div className="tabla d-flex vh-100 align-items-center justify-content-center">
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
        <div className="tabla">
            <BarraNavegacion></BarraNavegacion>
            <h2 className="text-light text-center">Registro de compra venta</h2>
            <div className="container d-none d-lg-block">
                <form onSubmit={handleSubmit} className="mb-3">
                    <input
                        type="text"
                        className="form-control mb-2"
                        name="busqueda"
                        id="busqueda"
                        placeholder="Buscar por matrícula"
                        value={busqueda}
                        onChange={handleBusqueda}
                    />
                    <button className="btn btn-primary w-100 mb-3" type="submit">Buscar</button>
                </form>
                <button onClick={mostrarTodoElRegistro} className="btn btn-secondary w-100 rounded mt-3">
                    Mostrar Todos
                </button>
            </div>

            <div className="d-block d-lg-none">
                <form onSubmit={handleSubmit} className="mb-3 d-flex flex-column align-items-center">
                    <input
                        type="text"
                        className="w-75 mb-2"
                        name="busqueda"
                        id="busqueda"
                        placeholder="Buscar por matrícula"
                        value={busqueda}
                        onChange={handleBusqueda}
                    />
                    <button className="btn btn-primary w-75 mb-3" type="submit">Buscar</button>
                    <button onClick={mostrarTodoElRegistro} className="btn btn-secondary w-75 rounded">
                        Mostrar Todos
                    </button>
                </form>
            </div>

            <div className="container">
                <div className="table d-none d-lg-block">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Acción realizada</th>
                            <th>Coche</th>
                            <th>Comprador</th>
                            <th>Fecha</th>
                            <th>Matrícula</th>
                            <th>Vendedor</th>
                        </tr>
                        </thead>
                        <tbody>
                        {coches.length > 0 ? (
                            coches.map((coche) => (
                                <tr key={coche.id_compraVenta}>
                                    <td>{coche.accion_realizada}</td>
                                    <td>{coche.coche}</td>
                                    <td>{coche.comprador}</td>
                                    <td>{coche.fecha}</td>
                                    <td>{coche.matricula}</td>
                                    <td>{coche.vendedor}</td>
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

                <div className="d-block d-lg-none">
                    {coches.length > 0 ? (
                        coches.map((coche, index) => (
                            <div className="accordion mt-3" id={`accordion-${index}`} key={index}>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id={`heading-${index}`}>
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse"
                                                data-bs-target={`#collapse-${index}`}
                                                aria-expanded="false"
                                                aria-controls={`collapse-${index}`}>
                                            {coche.matricula}
                                        </button>
                                    </h2>
                                    <div id={`collapse-${index}`} className="accordion-collapse collapse"
                                         aria-labelledby={`heading-${index}`}
                                         data-bs-parent={`#accordion-${index}`}>
                                        <div className="accordion-body">
                                            <div><p><strong>Acción realizada:</strong> {coche.accion_realizada}</p></div>
                                            <div><p><strong>Coche:</strong> {coche.coche}</p></div>
                                            <div><p><strong>Comprador:</strong> {coche.comprador}</p></div>
                                            <div><p><strong>Fecha:</strong> {coche.fecha}</p></div>
                                            <div><p><strong>Matrícula:</strong> {coche.matricula}</p></div>
                                            <div><p><strong>Vendedor:</strong> {coche.vendedor}</p></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>No se encontraron coches</div>
                    )}
                </div>
                <div className="d-none d-lg-block">
                    <button onClick={() => generarPDF(coches)} className="mt-3 rounded">
                        Generar PDF
                    </button>
                </div>
                <div className="d-block d-lg-none d-flex flex-column align-items-center">
                    <button onClick={() => generarPDF(coches)} className="mt-3 rounded w-50">
                        Generar PDF
                    </button>
                </div>
            </div>
        </div>
    );

}