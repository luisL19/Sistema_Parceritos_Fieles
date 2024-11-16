import React, { useEffect, useState } from 'react';
import NavBar from '../../components/navBarGerente';
import Footer from '../../components/footer';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './actualizarMisDatosG.css';
import Swal from 'sweetalert2';

const ActualizarMisDatosG = () => {
  const [cliente, setCliente] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contraseña: '',
    celular: '',
    direccion: '',
    tipo_Documento: '',
    numero_Documento: ''
});
const [loading, setLoading] = useState(true);
const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
const userId = localStorage.getItem('usuarioId');

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/usuarios/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const clienteData = await response.json();
            setCliente(clienteData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, [userId]);


const handleChange = (e) => {
  const { name, value } = e.target;
  setCliente(prevState => ({
      ...prevState,
      [name]: value
  }));
};


const handleSubmit = async (e) => {
  e.preventDefault();
  
  console.log("Datos a enviar:", cliente); // Verificar los datos enviados

  const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizarlo'
  });
  
  if (result.isConfirmed) {
      try {
          const response = await fetch(`http://localhost:5000/api/usuarios/${userId}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(cliente),
          });
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          await Swal.fire({
              title: 'Actualizado!',
              text: 'Tus datos han sido actualizados.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
          });
      } catch (error) {
          console.error('Error updating data:', error);
          await Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudieron actualizar los datos. Inténtalo de nuevo más tarde.',
              confirmButtonText: 'Aceptar'
          });
      }
  }
};

  if (!cliente) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <NavBar />
      <div className="container-actualizar-datos">
        <div className="form-section-actualizar-datos">
          <h2>Actualizar Datos</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-container-actualizar-datos">
              <div className="form-group-actualizar-datos">
                <label htmlFor="nombre">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  defaultValue={cliente.nombre}
                  disabled
                />
              </div>
              <div className="form-group-actualizar-datos">
                <label htmlFor="apellido">Apellido:</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  defaultValue={cliente.apellido}
                  disabled
                />
              </div>
              <div className="form-group-actualizar-datos">
                <label htmlFor="correo">Correo:</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  defaultValue={cliente.correo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group-actualizar-datos password-container-actualizar-datos">
                <label htmlFor="contraseña">Contraseña:</label>
                <div className="password-container-actualizar-datos">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="contraseña"
                    name="contraseña"
                    defaultValue={cliente.contraseña}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="eye-icon-actualizar-datos"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <div className="form-group-actualizar-datos">
                <label htmlFor="celular">Celular:</label>
                <input
                  type="text"
                  id="celular"
                  name="celular"
                  defaultValue={cliente.celular}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group-actualizar-datos">
                <label htmlFor="direccion">Dirección:</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  defaultValue={cliente.direccion}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group-actualizar-datos">
                <label htmlFor="tipo_documento">Tipo documento:</label>
                <input
                  type="text"
                  id="tipo_documento"
                  name="tipo_documento"
                  defaultValue={cliente.tipo_Documento}
                  disabled
                />
              </div>
              <div className="form-group-actualizar-datos">
                <label htmlFor="numero_documento">Número Documento:</label>
                <input
                  type="text"
                  id="numero_documento"
                  name="numero_documento"
                  defaultValue={cliente.numero_Documento}
                  disabled
                />
              </div>
            </div>
            <center>
              <button type="submit" className="button-actualizar-datos">Guardar</button>
            </center>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ActualizarMisDatosG;
