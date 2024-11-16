import React from "react";
import { useNavigate } from 'react-router-dom';
export default function Information2(){
    const navigate = useNavigate();
    const handleTiendaOnline = () =>{
        navigate('/tiendaComun');
    }
    return(

        <div>


            <div
                className="seccion-coches d-none d-lg-block mt-5 p-4 p-md-5 bg-light border border-info rounded w-75 mx-auto d-flex flex-column align-items-center"
                id="coches-a-la-venta">
                <h3 className="text-center text-info">Tienda</h3>
                <p className="text-center text-dark">
                    Bienvenido a la sección de coches. Aquí podrás explorar todos los vehículos disponibles para compra y descubrir el coche ideal que se ajuste a tus necesidades y preferencias.
                </p>

                <button type="submit" id="boton" className="btn btn-info w-100"
                     onClick={handleTiendaOnline}   >Llévate tu coche
                </button>

            </div>


            <div
                className="acerca-de-section d-none d-lg-block mt-5 p-4 p-md-5 bg-light border border-info rounded w-75 w-lg-50 mx-auto"
                id="a-que-nos-dedicamos">
                <h3 className="text-center text-info">Acerca de nosotros</h3>
                <p className="text-center text-dark">
                    Soy un gestor especializado en brindar servicios de gestión integral a empresas. Mi objetivo es
                    facilitar el crecimiento y la eficiencia operativa de tu negocio, ofreciendo un acompañamiento
                    personalizado que se adapte a tus necesidades específicas.
                </p>
                <p className="text-center text-dark">
                    Como usuario casual podrás acceder a la tienda online que ofrece la aplicación para ponerte en contacto con la empresa para comprar el coche
                </p>
            </div>
            <div
                className="acerca-de-section d-block d-lg-none  mt-5 p-4 p-md-5 bg-light border border-info rounded w-100 w-lg-50 mx-auto"
                id="a-que-nos-dedicamos">
                <h3 className="text-center text-info">Acerca de nosotros</h3>
                <p className="text-center text-dark">
                    Soy un gestor especializado en brindar servicios de gestión integral a empresas. Mi objetivo es
                    facilitar el crecimiento y la eficiencia operativa de tu negocio, ofreciendo un acompañamiento
                    personalizado que se adapte a tus necesidades específicas.
                </p>
                <p className="text-center text-dark">
                    Como usuario casual podrás acceder a la tienda online que ofrece la aplicación para ponerte en
                    contacto con la empresa para comprar el coche
                </p>
            </div>

            <div
                className="seccion-coches d-block d-lg-none mt-5 p-4 p-md-5 bg-light border border-info rounded w-100 w-md-75 mx-auto d-flex flex-column align-items-center"
                id="coches-a-la-venta">
                <p className="text-center text-dark">
                    Bienvenido a la sección de coches. Aquí podrás explorar todos los vehículos disponibles para compra y descubrir el coche ideal que se ajuste a tus necesidades y preferencias.
                </p>

                <button type="submit" id="coches-a-la-venta"className="btn btn-info w-100" onClick={handleTiendaOnline}
                >Llévate tu coche
                </button>
            </div>

        </div>

    );
}