import toyota from '../fotos/toyota.jpg';
import dacia from '../fotos/dacia.jpg';
import volkswagen from '../fotos/volkswagen.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from "react";

export default function Carrusel() {
    return (
        <div className="contenido">
            {/* Carrusel para pantallas grandes */}
            <div
                id="carouselLg"
                className="carousel slide w-75 d-none d-lg-block mx-auto mt-5 border border-4 border-info"
                data-bs-ride="carousel"
            >
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img
                            className="d-block w-100 h-50 h-md-75"
                            src={toyota}
                            alt="Toyota Slide"
                        />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Toyota</h5>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img
                            className="d-block w-100 h-50 h-md-75"
                            src={dacia}
                            alt="Dacia Slide"
                        />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Dacia</h5>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img
                            className="d-block w-100 h-50 h-md-75"
                            src={volkswagen}
                            alt="Volkswagen Slide"
                        />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Volkswagen</h5>
                        </div>
                    </div>
                </div>
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselLg"
                    data-bs-slide="prev"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselLg"
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
            </div>

            {/* Carrusel para pantallas medianas y pequeñas */}
            <div
                id="carouselMd"
                className="carousel slide w-50 d-block d-lg-none w-100 mx-auto mt-5 border border-4 border-info"
                data-bs-ride="carousel"
            >
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img
                            className="d-block w-100 h-50 h-md-75"
                            src={toyota}
                            alt="Toyota Slide"
                        />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Toyota</h5>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img
                            className="d-block w-100 h-50 h-md-75"
                            src={dacia}
                            alt="Dacia Slide"
                        />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Dacia</h5>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img
                            className="d-block w-100 h-50 h-md-75"
                            src={volkswagen}
                            alt="Volkswagen Slide"
                        />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Volkswagen</h5>
                        </div>
                    </div>
                </div>
                <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselMd"
                    data-bs-slide="prev"
                >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselMd"
                    data-bs-slide="next"
                >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
            </div>
        </div>
    );
}
