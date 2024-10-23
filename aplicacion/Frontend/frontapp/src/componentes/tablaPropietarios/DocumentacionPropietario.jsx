import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../tablaCoches/documentacion.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';


const getPhotoUrl = (photoPath) => {
    const url = `http://localhost:8000/${photoPath}`;
    return url;
};

function DocumentacionPropietario(){
    const { dni } = useParams();
    const [documentacion, setDocumentacion] = useState(null);
    const [error, setError] = useState('');
    const [modalImageUrl, setModalImageUrl] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [DNI, setDNI] = useState(null);

    useEffect(() => {
        const dniGuardado = localStorage.getItem('DNI');
        setDNI(dniGuardado)
        if (dniGuardado) {

            // Hacer una solicitud POST para obtener la información usando el DNI en la URL
            fetch(`http://localhost:8000/api/documentacionPropietario/${dniGuardado}`, {
                method: 'POST', // Mantener el método POST
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                // No enviar cuerpo, ya que el DNI está en la URL
            })
                .then(response => {
                    if (!response.ok) throw new Error('Error al obtener la documentación del usuario');
                    return response.json();
                })
                .then(data => {
                    setDocumentacion(data);  // Almacenar la respuesta de la documentación
                })
                .catch(error => {
                    console.error('Error fetching user documentation:', error);
                    setError(error.message);  // Actualizar el estado de error
                });
        } else {
            setError('No se encontró el DNI en la sesión.');
        }
    }, []);

    const openModal = (imageUrl) => {
        console.log(imageUrl)
        setModalImageUrl(imageUrl); // Establecer la URL de la imagen para el modal
        setIsModalOpen(true);

    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalImageUrl(null);
    };
    let fotoNominas = documentacion?.documentacion?.nominas ? getPhotoUrl(documentacion.documentacion.nominas) : null;
    let fotoCarnet = documentacion?.documentacion?.carnet ? getPhotoUrl(documentacion.documentacion.carnet) : null;


    if (error) {
        return <p>{error}</p>;
    }

    if (!documentacion) {
        return <p>Cargando documentación...</p>;
    }
    return (
        <div>
            <div id="pdf-content">
                <div className='tituloDocumentacion'>
                    <h2>Documentación del propietario : {DNI} </h2>
                    <ul>
                        <li>Nombre: {documentacion.nombre}</li>
                        <li>Apellido: {documentacion.apellido}</li>
                        <li>email: {documentacion.email}</li>
                    </ul>
                </div>
                {/* Nueva sección para mostrar las fotos */}
                <div className='containerDocumentacion'>
                    <h3>Fotos de Documentación:</h3>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {documentacion.documentacion.nominas && (
                            <div onClick={() => openModal(fotoNominas)}
                                 style={{ cursor: 'pointer' }}>
                                <h4>Nómina</h4>
                                <img src={getPhotoUrl(documentacion.documentacion.nominas)}
                                     alt="Permiso de Circulación" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                            </div>
                        )}
                        {documentacion.documentacion.carnet && (
                            <div onClick={() => openModal(fotoCarnet)}
                                 style={{ cursor: 'pointer' }}>
                                <h4>Carnet de conducir</h4>
                                <img src={getPhotoUrl(documentacion.documentacion.carnet)}
                                     alt="Ficha Técnica" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className='modales'>
                {/* Modal de Bootstrap para mostrar la imagen ampliada */}
                {modalImageUrl && (
                    <div className="modal fade show" style={{ display: 'block' }} onClick={closeModal}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Imagen Ampliada</h5>
                                    <button type="button" className="btn-close" onClick={closeModal}></button>
                                </div>
                                <div className="modal-body">
                                    <img src={modalImageUrl} alt="Imagen Ampliada" style={{ width: '100%' }} />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
}

export default DocumentacionPropietario