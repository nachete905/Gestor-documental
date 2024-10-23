import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export default function PiePagina() {
    const navigate = useNavigate();
    const handleChat = () => {
        navigate('/chat');
    }

    return (
        <div className="container-fluid bg-dark text-light p-3">
            <div className="row">
                {/* Columna 1: Información */}
                <div className="col-md-4 mb-2">
                    <h6 className="small">Sobre nosotros</h6>
                    <p className="small m-0">Somos una empresa dedicada a la compra y venta de coches de ocasión,
                        ofreciendo las mejores ofertas y servicios para nuestros clientes.</p>
                </div>

                {/* Columna 2: Enlaces útiles */}
                <div className="col-md-4 mb-2">
                    <h6 className="small">Enlaces útiles</h6>
                    <ul className="list-unstyled small">
                        <li><a href="#a-que-nos-dedicamos" className="text-light">A qué nos dedicamos</a></li>
                        <li><a href="#coches-a-la-venta" className="text-light">Ver coches a la venta</a></li>
                        <li><a href="#buscar-coches" className="text-light">Buscar coches</a></li>
                        <li><a href="#como-funcionamos" className="text-light">Cómo funcionamos</a></li>
                    </ul>
                </div>

                {/* Columna 3: Contacto */}
                <div className="col-md-4 mb-2">
                    <h6 className="small">Contacto</h6>
                    <ul className="list-unstyled small">
                        <li><a href="mailto:contacto@tuempresa.com" className="text-light">contacto@tuempresa.com</a></li>
                        <li><a href="tel:+123456789" className="text-light">+1 (234) 567-89</a></li>
                        <li><a href="#chat" className="text-light" onClick={handleChat}>Chat en vivo</a></li>
                    </ul>
                </div>
            </div>
            <div className="text-center mt-3">
                <p className="small m-0">&copy; 2024 Tu Empresa. Todos los derechos reservados.</p>
            </div>
        </div>
    );
}
