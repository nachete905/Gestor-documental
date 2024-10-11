import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './documentacion.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const getPhotoUrl = (photoPath) => {
    const url = `http://localhost:8000/${photoPath}`;
    return url;
};

function Documentacion() {
    const { matricula } = useParams();
    const [documentacion, setDocumentacion] = useState(null);
    const [error, setError] = useState('');
    const [modalImageUrl, setModalImageUrl] = useState(null); // Estado para la imagen del modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal

    useEffect(() => {
        // Hacer una petición al backend para obtener la documentación del coche
        fetch(`http://localhost:8000/api/coche/documentacion/${matricula}`)
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener la documentación del coche');
                return response.json();
            })
            .then(data => {
                setDocumentacion(data);
            })
            .catch(error => {
                console.error('Error fetching coche states:', error);
                setError(error.message); // Actualizar el estado de error
            });
    }, [matricula]);

    const openModal = (imageUrl) => {
        setModalImageUrl(imageUrl); // Establecer la URL de la imagen para el modal
        setIsModalOpen(true); // Abrir el modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Cerrar el modal
        setModalImageUrl(null); // Limpiar la URL de la imagen
    };
    // Verificar si documentacion no es nula antes de intentar acceder a sus propiedades
    let fotoPermisoCirculacion = documentacion ? getPhotoUrl(documentacion.documentacion.permiso_circulacion) : null;
    let fotoFichaTecnica = documentacion ? getPhotoUrl(documentacion.documentacion.ficha_tecnica) : null;
    let fotoFichaVerde = documentacion ? getPhotoUrl(documentacion.documentacion.ficha_verde) : null;

    if (error) {
        return <p>{error}</p>;
    }

    if (!documentacion) {
        return <p>Cargando documentación...</p>;
    }

    return (
        <div>
            <div id="pdf-content"> {/* Contenedor para html2canvas */}
                <div className='tituloDocumentacion'>
                    <h2>Documentación del Coche con Matrícula: {matricula}</h2>
                    <ul>
                        <li>Coche: {documentacion.coche}</li>
                        <li>Año de Matriculación: {documentacion.año_matriculacion.split('T')[0]}</li>
                        <li>Fecha de Documentación: {documentacion.documentacion.fecha_documentacion}</li>
                    </ul>
                </div>
                {/* Nueva sección para mostrar las fotos */}
                <div className='containerDocumentacion'>
                    <h3>Fotos de Documentación:</h3>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {documentacion.documentacion.permiso_circulacion && (
                            <div onClick={() => openModal(fotoPermisoCirculacion)}
                                 style={{ cursor: 'pointer' }}>
                                <h4>Permiso de Circulación</h4>
                                <img src={getPhotoUrl(documentacion.documentacion.permiso_circulacion)}
                                     alt="Permiso de Circulación" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                            </div>
                        )}
                        {documentacion.documentacion.ficha_tecnica && (
                            <div onClick={() => openModal(fotoFichaTecnica)}
                                 style={{ cursor: 'pointer' }}>
                                <h4>Ficha Técnica</h4>
                                <img src={getPhotoUrl(documentacion.documentacion.ficha_tecnica)}
                                     alt="Ficha Técnica" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                            </div>
                        )}
                        {documentacion.documentacion.ficha_verde && (
                            <div onClick={() => openModal(fotoFichaVerde)}
                                 style={{ cursor: 'pointer' }}>
                                <h4>Ficha Verde</h4>
                                <img src={getPhotoUrl(documentacion.documentacion.ficha_verde)}
                                     alt="Ficha Verde" style={{ maxWidth: '200px', maxHeight: '200px' }} />
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

export default Documentacion;
