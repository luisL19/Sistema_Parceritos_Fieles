import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import NavBarEmpleado from '../../components/navBarEmpleado';
import Footer from '../../components/footer';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/jquery.dataTables.min.css';

const ConsultarQuejaE = () => {
  const tableRef = useRef(null);

  useEffect(() => {
    const obtenerQuejas = async () => {
      try {
        const respuesta = await axios.get('http://localhost:5000/api/empleado/quejas');
        const quejasData = respuesta.data;

        if (!Array.isArray(quejasData)) {
          console.error('La respuesta del backend no es un array:', quejasData);
          return;
        }

        // Destruir instancia previa de DataTable si existe
        if ($.fn.DataTable && $.fn.DataTable.isDataTable(tableRef.current)) {
          $(tableRef.current).DataTable().destroy();
        }

        // Inicializar DataTable con los datos obtenidos
        $(tableRef.current).DataTable({
          data: quejasData,
          columns: [
            {
              title: 'Fecha',
              data: 'fecha',
              render: (data) => {
                const date = new Date(data);
                return date.toISOString().split('T')[0]; // Formato: AAAA-MM-DD
              },
            },
            { title: 'Nombre', data: 'nombre_cliente' },
            { title: 'Apellido', data: 'apellido_cliente' },
            { title: 'Correo', data: 'correo' },
            {
              title: 'Acciones',
              data: 'id_Queja',
              render: (data) =>
                `<button class="btn-ver-contenido" data-id="${data}">
                  Ver Contenido
                </button>`,
            },
          ],
          language: {
            url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json',
          },
          responsive: true,
        });

        // Manejar eventos de botones personalizados
        $(tableRef.current).on('click', '.btn-ver-contenido', function () {
          const idQueja = $(this).data('id');
          verContenido(idQueja);
        });
      } catch (error) {
        console.error('Error al obtener las quejas:', error);
      }
    };

    obtenerQuejas();

    return () => {
      // Verificar si DataTable está inicializado antes de destruirlo
      if ($.fn.DataTable && $.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
    };
  }, []);

  const verContenido = (idQueja) => {
    Swal.fire({
      title: 'Contenido de la Queja',
      text: `Contenido de la queja con ID: ${idQueja}`,
      icon: 'info',
    });
  };

  const styles = `
    body {
      margin: 0;
      font-family: sans-serif;
      background-size: cover;
      background-position: center;
      color: white;
    }
    .page-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
      padding: 20px;
    }
    .content h2 {
      font-family: 'Poppins-SemiBold', sans-serif;
      color: #28a745;
      font-size: 3.5rem;
      font-weight: bold;
      text-align: center;
      margin-bottom: 30px;
      letter-spacing: 2px;
      background: linear-gradient(90deg, #1db954, #1ca54f);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .table-wrapper {
      width: 95%;
      margin: 20px auto;
      border-radius: 10px;
      background-color: #ffffff;
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
    }
    table.dataTable {
      width: 100% !important;
      max-width: 100%;
      margin: 20px 0;
      border-collapse: collapse;
      font-size: 1.2rem;
      text-align: center;
    }
    table.dataTable thead th {
      background-color: #28a745;
      color: white;
      font-weight: bold;
      padding: 15px;
      text-align: center;
    }
    table.dataTable tbody tr {
      background-color: #f9f9f9;
    }
    table.dataTable tbody tr:hover {
      background-color: #e6ffe6;
    }
    table.dataTable td,
    table.dataTable th {
      padding: 15px;
      text-align: center;
      color: black; /* Asegurar que el texto del cuerpo de la tabla sea negro */
    }
    .btn-ver-contenido {
      background-color: #28a745;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
    .btn-ver-contenido:hover {
      background-color: #218838;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="page-container">
        <NavBarEmpleado />
        <main>
          <section className="container">
            <div className="content">
              <h2>Consultar Quejas</h2>
              <div className="table-wrapper">
                <table ref={tableRef} className="display" style={{ width: '100%' }}></table>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ConsultarQuejaE;
