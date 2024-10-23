import React from "react";
import { useNavigate } from 'react-router-dom';
export  default  function InformationSection (){
    const navigate = useNavigate();
    const handleTiendaRegisterClick = () => {
        navigate('/tiendaCoches');
    };
    return(
        <div>
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
                        Con años de experiencia en la gestión empresarial, ofrezco soluciones efectivas que abarcan
                        desde la administración financiera hasta la optimización de procesos. Mi enfoque se centra en
                        entender las particularidades de cada empresa y proponer estrategias que promuevan su desarrollo
                        sostenible.
                    </p>
                    <p className="text-center text-dark">
                        Trabajando juntos, podrás contar con un apoyo profesional que no solo se encargará de la parte
                        operativa, sino que también te ayudará a tomar decisiones informadas para el futuro de tu
                        empresa. Estoy aquí para ser el socio estratégico que necesitas para llevar tu negocio al
                        siguiente nivel.
                    </p>
                </div>

                <div
                    className="seccion-coches d-none d-lg-block mt-5 p-4 p-md-5 bg-light border border-info rounded w-75 mx-auto d-flex flex-column align-items-center"
                    id="coches-a-la-venta">
                    <h3 className="text-center text-info">Coches a la venta</h3>
                    <p className="text-center text-dark">
                        Aquí se guardarán los coches que registres en la aplicación. Esta sección te permite gestionar y
                        visualizar todos los vehículos que has añadido a nuestro sistema, para tener una sección
                        dedicada
                        a tienda online de compra de un coche.
                    </p>
                    <p className="text-center text-dark">
                        Cada coche registrado será revisado para garantizar su calidad y disponibilidad, facilitando a
                        los
                        usuarios encontrar rápidamente lo que buscan. ¡Comienza a añadir tus coches y optimiza tu
                        gestión
                        ahora!
                    </p>
                    <button type="submit" id="boton" className="btn btn-info w-100"
                            onClick={handleTiendaRegisterClick}>Llévate tu coche
                    </button>
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
                        Con años de experiencia en la gestión empresarial, ofrezco soluciones efectivas que abarcan
                        desde la administración financiera hasta la optimización de procesos. Mi enfoque se centra en
                        entender las particularidades de cada empresa y proponer estrategias que promuevan su desarrollo
                        sostenible.
                    </p>
                    <p className="text-center text-dark">
                        Trabajando juntos, podrás contar con un apoyo profesional que no solo se encargará de la parte
                        operativa, sino que también te ayudará a tomar decisiones informadas para el futuro de tu
                        empresa. Estoy aquí para ser el socio estratégico que necesitas para llevar tu negocio al
                        siguiente nivel.
                    </p>
                </div>

                <div
                    className="seccion-coches d-block d-lg-none mt-5 p-4 p-md-5 bg-light border border-info rounded w-100 w-md-75 mx-auto d-flex flex-column align-items-center"
                    id="coches-a-la-venta">
                    <h3 className="text-center text-info">Coches a la venta</h3>
                    <p className="text-center text-dark">
                        Aquí se guardarán los coches que registres en la aplicación. Esta sección te permite gestionar y
                        visualizar todos los vehículos que has añadido a nuestro sistema, para tener una sección
                        dedicada
                        a tienda online de compra de un coche.
                    </p>
                    <p className="text-center text-dark">
                        Cada coche registrado será revisado para garantizar su calidad y disponibilidad, facilitando a
                        los
                        usuarios encontrar rápidamente lo que buscan. ¡Comienza a añadir tus coches y optimiza tu
                        gestión
                        ahora!
                    </p>
                    <button type="submit" id="boton" className="btn btn-info w-100"
                            onClick={handleTiendaRegisterClick}>Llévate tu coche
                    </button>
            </div>

        </div>

    );
}