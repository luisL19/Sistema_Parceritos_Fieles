import React, { useEffect, useState } from 'react';
import NavBar from '../../components/navBarGerente';
import Footer from '../../components/footer';
import Imagen from '../../assets/Imagenes/usuario.png';
import './MiPerfilG.css'

const MiPerfilG = () => {
  const [cliente, setcliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('usuarioId');

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/usuarios/${userId}/perfil`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setcliente(data);
        } catch (error) {
            console.error('Error al obtener datos del perfil:', error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, [userId]);

  if (!cliente) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="miPerfilG-container">
        <section className="miPerfilG-profileSection">
          <h1>Perfil Gerente</h1>
          <div className="miPerfilG-profilePic">
            <img src={Imagen} alt="Profile" />
          </div>
          <div className="miPerfilG-infoGrid">
            <div className="miPerfilG-infoItem">
              <i className="icon-user" />
              <p><strong>Nombre</strong><br />{cliente.nombre}</p>
            </div>
            <div className="miPerfilG-infoItem">
              <i className="icon-user" />
              <p><strong>Apellido</strong><br />{cliente.apellido}</p>
            </div>
            <div className="miPerfilG-infoItem">
              <i className="icon-email" />
              <p><strong>Correo</strong><br />{cliente.correo}</p>
            </div>
            <div className="miPerfilG-infoItem">
              <i className="icon-phone" />
              <p><strong>Celular</strong><br />{cliente.celular}</p>
            </div>
            <div className="miPerfilG-infoItem">
              <i className="icon-document" />
              <p><strong>Tipo documento</strong><br />{cliente.tipo_Documento}</p>
            </div>
            <div className="miPerfilG-infoItem">
              <i className="icon-lock" />
              <p><strong>Contraseña</strong><br />********</p>
            </div>
            <div className="miPerfilG-infoItem">
              <i className="icon-address" />
              <p><strong>Dirección</strong><br />{cliente.direccion}</p>
            </div>
            <div className="miPerfilG-infoItem">
              <i className="icon-document" />
              <p><strong>Numero documento</strong><br />{cliente.numero_Documento}</p>
            </div>
          </div>
          <br />
          <div style={{ textAlign: 'center' }}>
            <a className="miPerfilG-button" href="/actualizarDatosG">Actualizar Datos</a>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default MiPerfilG;
