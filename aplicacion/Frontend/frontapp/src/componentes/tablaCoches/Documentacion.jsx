import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './documentacion.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import BarraNavegacion from "../barraNavegacion/BarraNavegacion";

const getPhotoUrl = (photoPath) => {
    const url = `https://gestionocasion.com/${photoPath}`;
    return url;
};

function Documentacion() {

    const [documentacion, setDocumentacion] = useState(null);
    const [error, setError] = useState('');
    const [modalImageUrl, setModalImageUrl] = useState(null); // Estado para la imagen del modal
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
    const [matricula, setMatricula] = useState(null);

    useEffect(() => {
        const matriculaGuardada = localStorage.getItem('matricula');
        if (matriculaGuardada) {

            // Hacer una solicitud POST para obtener la documentación usando la matrícula en la URL
            fetch(`https://gestionocasion.com/api/coche/documentacion/${matriculaGuardada}`, {
                method: 'POST', // Mantener el método POST
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                // No enviar cuerpo, ya que la matrícula está en la URL
            })
                .then(response => {
                    if (!response.ok) throw new Error('Error al obtener la documentación del coche');
                    return response.json();
                })
                .then(data => {
                    setDocumentacion(data);  // Almacenar la respuesta de la documentación
                })
                .catch(error => {
                    console.error('Error fetching coche documentation:', error);
                    setError(error.message);  // Actualizar el estado de error
                });
        } else {
            setError('No se encontró la matrícula en la sesión.');
        }
    }, []);

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
            <BarraNavegacion />
            <div className="doc-container d-flex justify-content-center align-items-center vh-100">
                <div className='mt-5'>
                    {/* Contenido visible solo en pantallas medianas (md) hacia abajo */}
                    <div id="pdf-content-md" className="container d-lg-none d-md-block">
                        <div className='tituloDocumentacion text-center'>
                            <h2 className='text-light'>Documentación del Coche</h2>
                            <ul className="list-unstyled">
                                <li>Coche: Renault Espace Initiale Paris</li>
                                <li>Año de Matriculación: 2018-09-10</li>
                                <li>Fecha de Documentación: 2024-10-02</li>
                            </ul>
                        </div>
                        <div className='containerDocumentacion'>
                            <h3>Fotos de Documentación:</h3>
                            <div className="row justify-content-center">
                                {documentacion.documentacion.permiso_circulacion && (
                                    <div className='col-12 col-md-6 text-dark mb-3' onClick={() => openModal(fotoPermisoCirculacion)} style={{cursor: 'pointer'}}>
                                        <h4 className="text-center">Permiso de Circulación</h4>
                                        <img src={getPhotoUrl(documentacion.documentacion.permiso_circulacion)} alt="Permiso de Circulación" className="img-fluid"/>
                                    </div>
                                )}
                                {documentacion.documentacion.ficha_tecnica && (
                                    <div className='col-12 col-md-6 text-dark mb-3' onClick={() => openModal(fotoFichaTecnica)} style={{cursor: 'pointer'}}>
                                        <h4 className="text-center">Ficha Técnica</h4>
                                        <img src={getPhotoUrl(documentacion.documentacion.ficha_tecnica)} alt="Ficha Técnica" className="img-fluid"/>
                                    </div>
                                )}
                                {documentacion.documentacion.ficha_verde && (
                                    <div className='col-12 col-md-6 text-dark mb-3' onClick={() => openModal(fotoFichaVerde)} style={{cursor: 'pointer'}}>
                                        <h4 className="text-center">Ficha Verde</h4>
                                        <img src={getPhotoUrl(documentacion.documentacion.ficha_verde)} alt="Ficha Verde" className="img-fluid"/>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contenido visible solo en pantallas grandes (lg) hacia arriba */}
                    <div id="pdf-content-lg" className="container d-none d-lg-block">
                        <div className='tituloDocumentacion text-center'>
                            <h2 className='text-light'>Documentación del Coche</h2>
                            <ul className="list-unstyled">
                                <li>Coche: Renault Espace Initiale Paris</li>
                                <li>Año de Matriculación: 2018-09-10</li>
                                <li>Fecha de Documentación: 2024-10-02</li>
                            </ul>
                        </div>
                        <div className='containerDocumentacion'>
                            <h3>Fotos de Documentación:</h3>
                            <div className="d-flex flex-wrap justify-content-center gap-3">
                                {documentacion.documentacion.permiso_circulacion && (
                                    <div className='text-dark' onClick={() => openModal(fotoPermisoCirculacion)} style={{cursor: 'pointer'}}>
                                        <h4 className="text-center">Permiso de Circulación</h4>
                                        <img src={getPhotoUrl(documentacion.documentacion.permiso_circulacion)} alt="Permiso de Circulación" style={{maxWidth: '200px', maxHeight: '200px'}}/>
                                    </div>
                                )}
                                {documentacion.documentacion.ficha_tecnica && (
                                    <div className='text-dark' onClick={() => openModal(fotoFichaTecnica)} style={{cursor: 'pointer'}}>
                                        <h4 className="text-center">Ficha Técnica</h4>
                                        <img src={getPhotoUrl(documentacion.documentacion.ficha_tecnica)} alt="Ficha Técnica" style={{maxWidth: '200px', maxHeight: '200px'}}/>
                                    </div>
                                )}
                                {documentacion.documentacion.ficha_verde && (
                                    <div className='text-dark' onClick={() => openModal(fotoFichaVerde)} style={{cursor: 'pointer'}}>
                                        <h4 className="text-center">Ficha Verde</h4>
                                        <img src={getPhotoUrl(documentacion.documentacion.ficha_verde)} alt="Ficha Verde" style={{maxWidth: '200px', maxHeight: '200px'}}/>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='modales'>
                        {/* Modal de Bootstrap para mostrar la imagen ampliada */}
                        {modalImageUrl && (
                            <div className="modal fade show" style={{display: 'block'}} onClick={closeModal}>
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Imagen Ampliada</h5>
                                            <button type="button" className="btn-close" onClick={closeModal}></button>
                                        </div>
                                        <div className="modal-body">
                                            <img src={modalImageUrl} alt="Imagen Ampliada" style={{width: '100%'}}/>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );


}

export default Documentacion;
