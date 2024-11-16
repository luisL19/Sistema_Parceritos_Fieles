import React, { useEffect, useState } from 'react';
import NavBar from '../../components/navBarEmpleado';
import Footer from '../../components/footer';
import styled from 'styled-components';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Swal from 'sweetalert2';

const Container = styled.div`
  font-family: Arial, sans-serif;
  max-width: 80%;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh; /* Ensures the container takes at least the height of the viewport */
`;

const FormSection = styled.div`
  background: #f4f4f4;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px; /* Limits the maximum width of the form */
  display: flex;
  flex-direction: column;
  align-items: center; /* Centers the content horizontally */
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
  width: 100%; /* Ensure the form groups take the full width of their container */

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }

  input[disabled] {
    background: #e9ecef;
  }

  .password-container {
    position: relative;
    display: flex;
    align-items: center;
  }

  .password-container input {
    padding-right: 40px;
  }

  .password-container .eye-icon {
    position: absolute;
    right: 10px;
    cursor: pointer;
    font-size: 1.2em;
  }
`;

const Button = styled.button`
  background-color: #36bf18;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: block;
  width: 100%;
  max-width: 200px;
  margin: 20px auto 0; /* Center the button and add margin */
  
  &:hover {
    background-color: #28a10d;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  width: 100%;
`;

const ActualizarMisDatos = () => {
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
      <Container>
        <FormSection>
          <h2>Actualizar Datos</h2>
          <form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <label htmlFor="nombre">Nombre:</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={cliente.nombre}
                  disabled
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="apellido">Apellido:</label>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={cliente.apellido}
                  disabled
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="correo">Correo:</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  defaultValue={cliente.correo}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="contraseña">Contraseña:</label>
                <div className="password-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="contraseña"
                    name="contraseña"
                    defaultValue={cliente.contraseña}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </FormGroup>
              <FormGroup>
                <label htmlFor="celular">Celular:</label>
                <input
                  type="text"
                  id="celular"
                  name="celular"
                  defaultValue={cliente.celular}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="direccion">Dirección:</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  defaultValue={cliente.direccion}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="tipo_documento">Tipo documento:</label>
                <input
                  type="text"
                  id="tipo_documento"
                  name="tipo_documento"
                  defaultValue={cliente.tipo_Documento}
                  disabled
                />
              </FormGroup>
              <FormGroup>
                <label htmlFor="numero_documento">Número Documento:</label>
                <input
                  type="text"
                  id="numero_documento"
                  name="numero_documento"
                  defaultValue={cliente.numero_Documento}
                  disabled
                />
              </FormGroup>
            </FormGrid>
            <Button type="submit">Guardar</Button>
          </form>
        </FormSection>
      </Container>
      <Footer />
    </div>
  );
};

export default ActualizarMisDatos;
