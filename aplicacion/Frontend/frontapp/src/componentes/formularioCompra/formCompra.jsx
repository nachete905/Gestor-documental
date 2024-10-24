import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './formCompra.css';
import photo from '../logo/Logo.webp';

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const [usuarios, setUsuarios] = useState([]);
    const [empresaId, setEmpresaId] = useState(null); 
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        dni: '',
        matricula: '',
        permisoCirculacion: null,
        fichaTecnica: null,
        fichaVerde: null,
        id_usuario: '',
        id_instalacion: '',
        marca: '',
        modelo: '',
        tipo_combustible: '',
        tipo_cambio: '',
        kilometraje: '',
        año_matriculacion: '',
        fotos: [],
        comprador: ''
    });
    
    const navigate = useNavigate();

    useEffect(() => {
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
                const idInstalacion = data.user.id_instalacion;

                setFormData(prevFormData => ({
                    ...prevFormData,
                    id_instalacion: idInstalacion,
                }));

                if (idEmpresa) {
                    setEmpresaId(idEmpresa);
                    return fetch(`http://localhost:8000/api/usuariosEmpresa/${idEmpresa}`);
                } else {
                    throw new Error('ID de la empresa no encontrado');
                }
            }
        })
        .then(usuariosResponse => {
            if (!usuariosResponse.ok) throw new Error('Error fetching usuarios');
            return usuariosResponse.json();
        })
        .then(usuariosData => {
            if (Array.isArray(usuariosData) && usuariosData.length > 0) {
                setUsuarios(usuariosData);
            } else {
                console.error('No se encontraron usuarios o la respuesta no es válida:', usuariosData);
            }
        })
        .catch(error => {
            console.error('Error al obtener id_empresa:', error);
        });
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const base64File = await toBase64(file);
                setFormData({ ...formData, [e.target.name]: base64File });
            } catch (error) {
                console.error('Error al convertir el archivo a Base64', error);
            }
        }
    };

    const handleMultipleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        const base64FilesPromises = files.map(file => toBase64(file));
        const base64Files = await Promise.all(base64FilesPromises);
        setFormData({ ...formData, fotos: base64Files });
    };

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const submitForm = async (e) => {
        e.preventDefault();

        // Prepare data for API submission
        const dataToSend = {
            ...formData,
            fotos: formData.fotos // The photos are already in Base64
        };

        
        try {
            const response = await fetch('http://localhost:8000/api/compraCoche', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });
        
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error en la solicitud:', errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }
        
            const result = await response.json();
            console.log(result);
            
            // Logging success message with car data excluding photos
            const { fotos, ...carData } = formData;
            
            
            // Navigate to the home page
            alert('Coche añadido correctamente');
            navigate('/');
        } catch (error) {
            console.error('Error al enviar el formulario', error);
        }
    };

    return (
        <div className="container mt-4 d-flex justify-content-center w-100">
            <div className="registro-container w-100">
                <div className="registro-left">
                    <img src={photo} alt="Logo" className="registro-logo" />
                    <h2>Registro de Coche</h2>
                </div>
                <div className="registro-right">
                    {step === 1 && (
                        <div className="p-4 rounded border border-info">
                            <h2 className="text-center text-light mb-4">Datos del Propietario</h2>
                            <form method="POST">
                                <div className="mb-3">
                                    <label htmlFor="nombre" className="form-label">Nombre:</label>
                                    <input type="text" id="nombre" name="nombre" className="form-control" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="apellido" className="form-label">Apellido:</label>
                                    <input type="text" id="apellido" name="apellido" className="form-control" placeholder="Apellido" value={formData.apellido} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email:</label>
                                    <input type="email" id="email" name="email" className="form-control" placeholder="Email" value={formData.email} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="telefono" className="form-label">Teléfono:</label>
                                    <input type="text" id="telefono" name="telefono" className="form-control" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="dni" className="form-label">DNI:</label>
                                    <input type="text" id="dni" name="telefono" className="form-control" placeholder="Teléfono" value={formData.DNI} onChange={handleChange}/>
                                </div>
                                <div className="text-center">
                                    <button type="button" className="btn btn-primary me-2"
                                            onClick={nextStep}>Siguiente
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="p-4 rounded border border-info">
                            <h2 className="text-center text-light mb-4">Documentación del Coche</h2>
                            <form method="POST">
                                <div className="mb-3">
                                    <label htmlFor="permisoCirculacion" className="form-label">Permiso de Circulación:</label>
                                    <input type="file" id="permisoCirculacion" name="permisoCirculacion" className="form-control" onChange={handleFileChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="fichaTecnica" className="form-label">Ficha Técnica:</label>
                                    <input type="file" id="fichaTecnica" name="fichaTecnica" className="form-control" onChange={handleFileChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="fichaVerde" className="form-label">Ficha Verde:</label>
                                    <input type="file" id="fichaVerde" name="fichaVerde" className="form-control" onChange={handleFileChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="comprador" className="form-label">Comprador:</label>
                                      <select
                                        id="comprador"
                                        name="comprador"
                                        className="form-select"
                                        value={formData.id_usuario || ""} 
                                        onChange={(e) => {
                                            const selectedUser = usuarios.find(user => user.id_usuario === parseInt(e.target.value)); // Asegúrate de comparar como enteros
                                            if (selectedUser) {
                                                setFormData(prevFormData => ({
                                                    ...prevFormData,
                                                    comprador: `${selectedUser.nombre} ${selectedUser.apellido}`,  // Nombre completo
                                                    id_usuario: selectedUser.id_usuario,  // ID del usuario
                                                }));
                                            } else {
                                                console.error('No se encontró el usuario seleccionado.');
                                            }
                                        }}
                                    >
                                        <option value="" disabled>Seleccione un Comprador</option>
                                        {usuarios.map(user => (
                                            <option key={user.id_usuario} value={user.id_usuario}>  {/* Valor del id_usuario */}
                                                {user.nombre} {user.apellido}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                          
                                <div className="text-center d-flex justify-content-between">
                                    <button type="button" className="btn btn-primary me-2" onClick={prevStep}>Atrás</button>
                                    <button type="button" className="btn btn-primary" onClick={nextStep}>Siguiente</button>
                                </div>
                            </form>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="p-4 rounded border border-info">
                            <h2 className="text-center text-light mb-4">Detalles del Coche</h2>
                            <form method="POST" onSubmit={submitForm}>
                                <div className="mb-3">
                                    <label htmlFor="matricula" className="form-label">Matrícula:</label>
                                    <input type="text" id="matricula" name="matricula" className="form-control" placeholder="Matrícula" value={formData.matricula} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="marca" className="form-label">Marca:</label>
                                    <input type="text" id="marca" name="marca" className="form-control" placeholder="Marca" value={formData.marca} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="modelo" className="form-label">Modelo:</label>
                                    <input type="text" id="modelo" name="modelo" className="form-control" placeholder="Modelo" value={formData.modelo} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tipo_combustible" className="form-label">Tipo de Combustible:</label>
                                    <input type="text" id="tipo_combustible" name="tipo_combustible" className="form-control" placeholder="Tipo de Combustible" value={formData.tipo_combustible} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="tipo_cambio" className="form-label">Tipo de Cambio:</label>
                                    <input type="text" id="tipo_cambio" name="tipo_cambio" className="form-control" placeholder="Tipo de Cambio" value={formData.tipo_cambio} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="kilometraje" className="form-label">Kilometraje:</label>
                                    <input type="text" id="kilometraje" name="kilometraje" className="form-control" placeholder="Kilometraje" value={formData.kilometraje} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="año_matriculacion" className="form-label">Año de Matriculación:</label>
                                    <input type="date" id="año_matriculacion" name="año_matriculacion" className="form-control" placeholder="Año de Matriculación" value={formData.año_matriculacion} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="fotos" className="form-label">Fotos del Coche:</label>
                                    <input type="file" id="fotos" name="fotos" className="form-control" multiple onChange={handleMultipleFileChange} />
                                </div>
                                <div className="text-center d-flex justify-content-between">
                                    <button type="button" className="btn btn-primary me-2" onClick={prevStep}>Atrás</button>
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

export default MultiStepForm;
