import React, {useEffect, useState} from "react";

export function enviarIdEmpresa(id_empresa){
    fetch(`https://gestionocasion.com/api/eliminarEmpresa/${id_empresa}`, {
        method: 'POST',  // Cambia a 'DELETE' si lo deseas y has configurado esa ruta en el backend.
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
        // Si no necesitas enviar datos en el body, puedes omitir la propiedad 'body'
    })
        .then(response => {
            if (!response.ok) throw new Error('Error al eliminar la empresa');
            return response.json();
        })
        .then(responseData => {
            console.log('Respuesta de la API:', responseData);
            alert('Empresa dada de baja');
            window.location.reload();  // Recarga la página
        })
        .catch(error => {
            console.error('Error en la petición:', error);
        });
}

export default function DarBajaEmpresa (){
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [empresas, setEmpresas] = useState(null);

    useEffect(() => {
        fetch('https://gestionocasion.com/api/nombreEmpresas', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (!response.ok) throw new Error('Error fetching empresa data');
                return response.json();
            })
            .then(data => {
                // Convierte el objeto en un array usando Object.values
                const empresasArray = Object.values(data);
                setEmpresas(empresasArray);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Error fetching data');
                setLoading(false);
            });
    }, []);  // Dependencia vacía para que solo se ejecute una vez al montar el componente



    if (loading) {
        return <div className="text-center mt-5 fs-2 bg-dark text-white rounded p-3">Cargando coches...</div>;
    }

    if (error) {
        return <div className="text-center mt-5 fs-2 bg-dark text-danger rounded p-3">{error}</div>;
    }

    return(
        <div className="container mt-5º">
            <h2 className="text-center mb-4">Dar de baja a empresas</h2>
            <div className='row'>
                {empresas.map((empresa) => (
                    <div className="card ms-3" key={empresa.id} style={{width: '18rem'}}>
                        <div className="card-body">
                            <h5 className="card-title">{empresa.nombre}</h5>
                            <button className="card-link rounded" onClick={() =>enviarIdEmpresa(empresa.id)}>Dar de baja</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}