import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './componentes/home/home.jsx';
import Registro from './componentes/registro/registro.jsx';
import Login from './componentes/login/login.jsx';
import MultiStepForm from './componentes/formularioCompra/formCompra.jsx';
import TiendaCoches from './componentes/tiendaCoches/tiendaCoches.jsx';
import RegistroEmpresaUser from './componentes/registro/registroEmpresaUser.jsx';
import RegistroDeAdmin from './componentes/registro/registroDeAdmin.jsx';
import RegistroVenta from './componentes/registro/registroVenta.jsx'
import Coches from './componentes/tablaCoches/coches.jsx';
import Documentacion from './componentes/tablaCoches/Documentacion.jsx';
import TablaPropietarios from './componentes/tablaPropietarios/Propietarios.jsx'
import DocumentacionPropietario from './componentes/tablaPropietarios/DocumentacionPropietario.jsx';
import RegistroCompraventa from "./componentes/registroCompraVenta/RegistroCompraventa";
import DarBajaEMpresa from "./componentes/darBaja/DarBajaEmpresa";
import ActualizarEstado from './componentes/ActualizarEstado/ActualizarEstado'
import TiendaComun from "./componentes/tiendaCoches/tiendaComun";
import FormularioContacto from "./componentes/formularioContacto/FormularioContacto";
import Buzon from "./componentes/Buzon/Buzon";
import CookieConsent from './componentes/cookies/cookies';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <CookieConsent />
            <Routes>
                <Route path="/" element={<Home isAuthenticated={isAuthenticated} onLogout={handleLogout} />} />
                <Route path="/registro" element={<Registro onLogin={handleLogin} />} />
                <Route path="/registroDeAdmin" element={<RegistroDeAdmin />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/formCoche" element={<MultiStepForm />} />
                <Route path="/tiendaCoches" element={<TiendaCoches />} />
                <Route path="/tiendaComun" element={<TiendaComun />} />
                <Route path="/registroEmpresaUser" element={<RegistroEmpresaUser />} />
                <Route path="/registroVenta" element={<RegistroVenta />} />
                <Route path="/coches" element={<Coches />} />
                <Route path="/Documentacion" element={<Documentacion />} />
                <Route path="/propietarios" element={<TablaPropietarios />} />
                <Route path="/documentacionPropietario" element={<DocumentacionPropietario />} />
                <Route path="/registroCompraVenta" element={<RegistroCompraventa />} />
                <Route path="/darBaja" element={<DarBajaEMpresa />} />
                <Route path="/actualizar" element={<ActualizarEstado />} />
                <Route path="/contacto" element={<FormularioContacto />} />
                <Route path="/buzon" element={<Buzon />} />
            </Routes>
    </Router> );
}

export default App;
