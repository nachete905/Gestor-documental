import React, {useState, useEffect} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {useNavigate} from "react-router-dom";
import "./registro.css";
import photo from '../logo/Logo.webp';
import {validarNombre, validarApellido,validarEmail,validarTelefono,validarFotos,validarDNI,validarVendedor,validarMatricula,validarCoche} from "./validacionesRegistro";

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

const RegistroVenta = () => {
    const [step, setStep] = useState(1);
    const [coches, setCoches] = useState([]);
    const [empresaId, setEmpresaId] = useState(null);
    const [error, setError] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    const [propietarioData, setPropietarioData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        vendedor: null, // Aquí se mantiene como null
        coche: "",
        matricula: "",
        id_usuario: "",
    });

    const [documentacionData, setDocumentacionData] = useState({
        nominas: null,
        carnet: null,
        DNI: "",
    });

    const handlePropietarioChange = (e) => {
        const {name, value} = e.target;
        setPropietarioData({
            ...propietarioData,
            [name]: name === "vendedor" ? parseInt(value, 10) : value, // Convertir a entero si es vendedor
        });
    };

    const handleCocheChange = (e) => {
        const cocheSeleccionado = coches.find(
            (coche) => `${coche.marca} ${coche.modelo}` === e.target.value
        );

        setPropietarioData({
            ...propietarioData,
            coche: cocheSeleccionado
                ? `${cocheSeleccionado.marca} ${cocheSeleccionado.modelo}`
                : "",
            matricula: cocheSeleccionado ? cocheSeleccionado.matricula : "",
        });
    };

    const handleDocumentacionChange = (e) => {
        const {name, value, files} = e.target;
        const file = files && files.length > 0 ? files[0] : null;

        setDocumentacionData((prevState) => ({
            ...prevState,
            [name]: name === "DNI" ? value : file,
        }));
    };

    const handleNextStep = () => {
        setStep(step + 1);
    };

    const handlePrevStep = () => {
        setStep(step - 1);
    };

    const submitForm = async (e) => {
        e.preventDefault();

        // Convertir los archivos a Base64
        const nominasBase64 = documentacionData.nominas
            ? await toBase64(documentacionData.nominas)
            : null;
        const carnetBase64 = documentacionData.carnet
            ? await toBase64(documentacionData.carnet)
            : null;

        // Preparar datos para enviar a la API
        const dataToSend = {
            ...propietarioData,
            documentacion: {
                nominas: nominasBase64, // Documento de nómina en Base64
                carnet: carnetBase64, // Permiso de circulación en Base64
                DNI: documentacionData.DNI, // DNI como cadena de texto
            },
        };

        console.log("Datos que se envían:", dataToSend);

        try {
            const response = await fetch("https://gestionocasion.com/api/registroVenta", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(
                    `Error ${response.status}: ${
                        errorResponse.message || "Error desconocido"
                    }`
                );
            }

            const result = await response.json();
            console.log("Respuesta de la API:", result);
            alert('Coche reservado correctamente');
            navigate('/');
        } catch (error) {
            console.error("Error enviando datos:", error);
            setError("Error al enviar los datos");
        }
    };

    useEffect(() => {
        fetch("https://gestionocasion.com/api/getUserData", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) throw new Error("Error fetching user data");
                return response.json();
            })
            .then((data) => {
                const idEmpresa = data.user.id_empresa;
                const idUsuario = data.user.id_usuario; // Obtener el ID del usuario
                if (idEmpresa) {
                    setEmpresaId(idEmpresa);

                    // Almacenar el id_usuario en propietarioData
                    setPropietarioData((prevData) => ({
                        ...prevData,
                        id_usuario: idUsuario,
                    }));

                    // Obtener coches
                    return fetch(`https://gestionocasion.com/api/coches/${idEmpresa}`)
                        .then((response) => {
                            if (!response.ok) throw new Error("Error fetching coches");
                            return response.json();
                        })
                        .then((cochesData) => {
                            setCoches(cochesData);
                            // Obtener usuarios de la empresa
                            return fetch(
                                `https://gestionocasion.com/api/usuariosEmpresa/${idEmpresa}`
                            );
                        })
                        .then((response) => {
                            if (!response.ok) throw new Error("Error fetching usuarios");
                            return response.json();
                        })
                        .then((usuariosData) => {
                            setUsuarios(usuariosData);
                        });
                } else {
                    throw new Error("ID de la empresa no encontrado");
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setError("Error fetching data");
            });
    }, []);

    if (error) {
        return (
            <div className="text-center mt-5 fs-2 bg-dark text-danger rounded p-3">
                {error}
            </div>
        );
    }

    return (
        <div className="containerRegistro d-flex justify-content-center align-items-center vh-100">
            <div className="registro-container d-flex flex-column flex-lg-row w-75">
                <div className="registro-left text-center text-lg-start">
                    <img src={photo} alt="Logo" className="registro-logo mx-auto mx-lg-0" />
                    <h2 className="text-center text-light mt-4">Registro de venta</h2>
                </div>
                <div className="registro-right w-100 mt-4 mt-lg-0">
                    {step === 1 && (
                        <div className="p-4 rounded border border-info">
                            <h2 className="text-center text-light mb-4">Datos del Propietario</h2>
                            <form method="POST" className="d-flex flex-column align-items-center w-100">
                                <div className="mb-3 w-100">
                                    <label htmlFor="nombre" className="form-label">Nombre:</label>
                                    <input type="text" id="nombre" name="nombre" className="form-control" placeholder="Nombre" value={propietarioData.nombre} onChange={handlePropietarioChange} onBlur={validarNombre} />
                                    <span id="nombre-error" className="text-danger" style={{ display: 'none' }}>
                                    El nombre no está bien escrito.
                                </span>
                                </div>
                                <div className="mb-3 w-100">
                                    <label htmlFor="apellido" className="form-label">Apellido:</label>
                                    <input type="text" id="apellido" name="apellido" className="form-control" placeholder="Apellido" value={propietarioData.apellido} onChange={handlePropietarioChange} onBlur={validarApellido} />
                                    <span id="apellido-error" className="text-danger" style={{ display: 'none' }}>
                                    El apellido no está bien escrito.
                                </span>
                                </div>
                                <div className="mb-3 w-100">
                                    <label htmlFor="email" className="form-label">Email:</label>
                                    <input type="email" id="email" name="email" className="form-control" placeholder="Email" value={propietarioData.email} onChange={handlePropietarioChange} onBlur={validarEmail} />
                                    <span id="email-error" className="text-danger" style={{ display: 'none' }}>
                                    El Email no está bien escrito.
                                </span>
                                </div>
                                <div className="mb-3 w-100">
                                    <label htmlFor="telefono" className="form-label">Teléfono:</label>
                                    <input type="text" id="telefono" name="telefono" className="form-control" placeholder="Teléfono" value={propietarioData.telefono} onChange={handlePropietarioChange} onBlur={validarTelefono} />
                                    <span id="telefono-error" className="text-danger" style={{ display: 'none' }}>
                                    El teléfono no está bien escrito.
                                </span>
                                </div>
                                <div className="text-center">
                                    <button type="button" className="btn btn-primary me-2" onClick={handleNextStep}>Siguiente</button>
                                </div>
                            </form>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="p-4 rounded border border-info">
                            <h2 className="text-center text-light mb-4">Datos del comprador</h2>
                            <form method="POST" onSubmit={submitForm} className="d-flex flex-column align-items-center w-100">
                                <div className="mb-3 w-100">
                                    <label htmlFor="nominas" className="form-label">Nóminas (Archivo):</label>
                                    <input type="file" id="nominas" name="nominas" className="form-control" onChange={handleDocumentacionChange} onBlur={validarFotos} />
                                    <span id="foto1-error" className="text-danger" style={{ display: 'none' }}>No puede estar vacío.</span>
                                </div>
                                <div className="mb-3 w-100">
                                    <label htmlFor="carnet" className="form-label">Carnet (Archivo):</label>
                                    <input type="file" id="carnet" name="carnet" className="form-control" onChange={handleDocumentacionChange} onBlur={validarFotos} />
                                    <span id="foto2-error" className="text-danger" style={{ display: 'none' }}>No puede estar vacío.</span>
                                </div>
                                <div className="mb-3 w-100">
                                    <label htmlFor="dni" className="form-label">DNI:</label>
                                    <input type="text" id="dni" name="DNI" className="form-control" placeholder="DNI" value={documentacionData.DNI} onChange={handleDocumentacionChange} onBlur={validarDNI} />
                                    <span id="dni-error" className="text-danger" style={{ display: 'none' }}>El DNI no es válido.</span>
                                </div>
                                <div className="mb-3 w-100">
                                    <label htmlFor="coche" className="form-label">Coche:</label>
                                    <select id="coche" name="coche" className="form-control" value={propietarioData.coche} onChange={handleCocheChange}>
                                        <option value="">--Seleccione un coche--</option>
                                        {coches.map((coche) => (
                                            <option key={coche.matricula} className="text-dark" value={coche.marca_modelo}>
                                                {`${coche.marca} ${coche.modelo}`}
                                            </option>
                                        ))}
                                    </select>
                                    <span id="coche-error" className="text-danger" style={{ display: 'none' }}>El coche no puede estar vacío.</span>
                                </div>
                                <div className="mb-3 w-100">
                                    <label htmlFor="matricula" className="form-label">Matrícula:</label>
                                    <input type="text" id="matricula" name="matricula" className="form-control" placeholder="Matrícula" value={propietarioData.matricula} readOnly onBlur={validarMatricula} />
                                    <span id="matricula-error" className="text-danger" style={{ display: 'none' }}>La matrícula no está bien escrita.</span>
                                </div>
                                <div className="mb-3 w-100">
                                    <label htmlFor="vendedor" className="form-label">Vendedor:</label>
                                    <select id="vendedor" name="vendedor" className="form-control" value={propietarioData.vendedor} onChange={handlePropietarioChange} onBlur={validarVendedor}>
                                        <option value="">--Seleccione un vendedor--</option>
                                        {usuarios.map((usuario) => (
                                            <option key={usuario.id_usuario} className="text-dark" value={usuario.id_usuario}>
                                                {`${usuario.nombre} ${usuario.apellido}`}
                                            </option>
                                        ))}
                                    </select>
                                    <span id="vendedor-error" className="text-danger" style={{ display: 'none' }}>El vendedor no está bien escrito.</span>
                                </div>
                                <div className="text-center d-flex justify-content-between w-100">
                                    <button type="button" className="btn btn-primary me-2" onClick={handlePrevStep}>Atrás</button>
                                    <button type="submit" className="btn btn-primary">Enviar</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default RegistroVenta;
