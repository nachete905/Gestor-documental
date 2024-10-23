import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './registro.css';
import photo from "../logo/Logo.webp";
const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [instalacionesCount, setInstalacionesCount] = useState('');
  const [selectedInstalacion, setSelectedInstalacion] = useState(null);
  const [formData, setFormData] = useState({
    nombreEmpresa: '',
    contacto: '',
    CIF: '',
    instalaciones: [],
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    tipoUser: 1,
    selectedInstalacion: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInstalacionChange = (index, field, value) => {
    const instalaciones = [...formData.instalaciones];

    if (field === 'principal' && value) {
      instalaciones.forEach((instalacion, idx) => {
        if (idx !== index) {
          instalacion.principal = false;
        }
      });
    }

    instalaciones[index] = { ...instalaciones[index], [field]: value };
    setFormData({ ...formData, instalaciones });
  };

  const handleInstalacionesCountChange = (e) => {
    const value = e.target.value;
  
    if (value === '' || (!isNaN(value) && Number(value) >= 0)) {
      setInstalacionesCount(value);

      const numValue = parseInt(value, 10);
      if (!isNaN(numValue)) {
        const newInstalaciones = Array(numValue)
          .fill(null)
          .map((_, index) => formData.instalaciones[index] || { ubicacion: '', telefono: '', localidad: '', principal: false });
  
        setFormData({ ...formData, instalaciones: newInstalaciones });
      } else {
        setFormData({ ...formData, instalaciones: [] });
      }
    }
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      instalaciones: formData.instalaciones,
      selectedInstalacion
    };

    try {
      console.log(data)
        const response = await fetch('http://localhost:8000/api/registroEmpresa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
   
      
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error en la solicitud:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log(result);
      alert('Empresa añadida correctamente');
      navigate('/');
    } catch (error) {
      console.error('Error al enviar el formulario', error);
  
    }
  };

  
  return (
    <div className="container mt-4 d-flex justify-content-center w-100">
      <div className="registro-container d-flex w-100">
        <div className="registro-left">
          <img src={photo} alt="Logo" className="registro-logo"/>
          <h2 className="text-center text-light mt-4">Registro de Empresa</h2>
        </div>
        <div className="registro-right">
          {step === 1 && (
            <div className="bg-dark text-light p-4 rounded border border-info">
              <form>
                <div className="mb-3">
                  <label htmlFor="nombreEmpresa" className="form-label">Nombre de la Empresa:</label>
                  <input type="text" id="nombreEmpresa" name="nombreEmpresa" className="form-control form-control-lg" placeholder="Nombre Empresa" value={formData.nombreEmpresa} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="contacto" className="form-label">Contacto:</label>
                  <input type="text" id="contacto" name="contacto" className="form-control form-control-lg" placeholder="Contacto" value={formData.contacto} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="CIF" className="form-label">CIF:</label>
                  <input type="text" id="CIF" name="CIF" className="form-control form-control-lg" placeholder="CIF" value={formData.CIF} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="instalacionesCount" className="form-label">Número de Instalaciones:</label>
                  <input type="text" id="instalacionesCount" name="instalacionesCount" className="form-control form-control-lg" value={instalacionesCount} onChange={handleInstalacionesCountChange} />
                </div>
                <div className="text-center">
                  <button type="button" className="btn btn-primary btn-lg" onClick={nextStep}>Siguiente</button>
                </div>
              </form>
            </div>
          )}
          {step === 2 && instalacionesCount > 0 && (
            <div className="bg-dark text-light p-4 rounded border border-info">
              <h2 className="text-center mb-4">Datos de las Instalaciones</h2>
              <div className="row">
                {formData.instalaciones.map((_, index) => (
                  <div className="col-md-6 mb-3" key={index}>
                    <h4>Instalación {index + 1}</h4>
                    <div className="mb-3">
                      <label htmlFor={`ubicacion_${index}`} className="form-label">Ubicación:</label>
                      <input type="text" id={`ubicacion_${index}`} className="form-control form-control-lg" placeholder="Ubicación" value={formData.instalaciones[index]?.ubicacion || ''} onChange={(e) => handleInstalacionChange(index, 'ubicacion', e.target.value)} style={{ backgroundColor: '#343a40', color: 'white' }} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor={`telefono_${index}`} className="form-label">Teléfono:</label>
                      <input type="text" id={`telefono_${index}`} className="form-control form-control-lg" placeholder="Teléfono" value={formData.instalaciones[index]?.telefono || ''} onChange={(e) => handleInstalacionChange(index, 'telefono', e.target.value)} style={{ backgroundColor: '#343a40', color: 'white' }} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor={`localidad_${index}`} className="form-label">Localidad:</label>
                      <input type="text" id={`localidad_${index}`} className="form-control form-control-lg" placeholder="Localidad" value={formData.instalaciones[index]?.localidad || ''} onChange={(e) => handleInstalacionChange(index, 'localidad', e.target.value)} style={{ backgroundColor: '#343a40', color: 'white' }} />
                    </div>
                    <div className="mb-3">
                      <label htmlFor={`principal_${index}`} className="form-label">¿Es la instalación principal?</label>
                      <input type="checkbox" id={`principal_${index}`} className="form-check-input" checked={formData.instalaciones[index]?.principal || false} onChange={(e) => handleInstalacionChange(index, 'principal', e.target.checked)} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center  d-flex justify-content-between">
                <button type="button" className="btn btn-primary me-2" onClick={prevStep}>Atrás</button>
                <button type="button" className="btn btn-primary" onClick={nextStep}>Siguiente</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="bg-dark text-light p-4 rounded border border-info">
              <h2 className="text-center mb-4">Datos del Usuario Root</h2>
              <form onSubmit={submitForm}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre:</label>
                  <input type="text" id="nombre" name="nombre" className="form-control form-control-lg" placeholder="Nombre" value={formData.nombre} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="apellido" className="form-label">Apellido:</label>
                  <input type="text" id="apellido" name="apellido" className="form-control form-control-lg" placeholder="Apellido" value={formData.apellido} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email:</label>
                  <input type="email" id="email" name="email" className="form-control form-control-lg" placeholder="Email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label">Teléfono:</label>
                  <input type="text" id="telefono" name="telefono" className="form-control form-control-lg" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña:</label>
                  <input type="password" id="password" name="password" className="form-control form-control-lg" placeholder="Contraseña" value={formData.password} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label htmlFor="selectedInstalacion" className="form-label">Selecciona la Instalación Principal:</label>
                  <select 
                    id="selectedInstalacion" 
                    className="form-select form-select-lg" 
                    onChange={(e) => setSelectedInstalacion(e.target.value)} 
                    value={selectedInstalacion || ''}
                  >
                    <option value="" disabled>Selecciona una instalación</option>
                    {formData.instalaciones.map((instalacion, index) => (
                      <option key={index} value={index}>
                        {instalacion.ubicacion} - {instalacion.localidad}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-center  d-flex justify-content-between ">
                  <button type="button" className="btn btn-primary me-2" onClick={prevStep}>Atrás</button>
                  <button type="submit" className="btn btn-primary">Registrar</button>
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
