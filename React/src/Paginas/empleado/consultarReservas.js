import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import NavBarEmpleado from '../../components/navBarEmpleado';
import Footer from '../../components/footer';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/jquery.dataTables.min.css';

const ConsultarReservas = () => {
  const tableRef = useRef(null);
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
    const obtenerReservas = async () => {
      try {
        const respuesta = await axios.get('http://localhost:5000/api/reservas');
        const reservasData = respuesta.data.reverse();
        setReservas(reservasData);

        inicializarDataTable(reservasData);
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
      }
    };

    obtenerReservas();

    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
    };
  }, []);

  const inicializarDataTable = (reservasData) => {
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    $(tableRef.current).DataTable({
      data: reservasData,
      columns: [
        {
          title: 'Fecha de Inicio',
          data: 'fecha_Inicio',
          render: (data) => new Date(data).toLocaleDateString(),
        },
        {
          title: 'Fecha de Final',
          data: 'fecha_Fin',
          render: (data) => new Date(data).toLocaleDateString(),
        },
        { title: 'Celular', data: 'celular' },
        { title: 'Correo', data: 'correo' },
        { title: 'Nombre del Dueño', data: 'nombre_dueño' },
        { title: 'Nombre de la Mascota', data: 'nombre_mascota' },
        { title: 'Tipo de Servicio', data: 'tipo_servicio' },
        { title: 'Estado', data: 'estado' },
        {
          title: 'Acciones',
          data: null,
          render: (data, type, row, meta) => {
            const confirmarDisabled = row.estado === 'Confirmado' || row.estado === 'Cancelado';
            return `
              <button class="btn-icon confirmar-btn" data-index="${meta.row}" ${confirmarDisabled ? 'disabled' : ''}>
                <i class="fas fa-check-circle icon-check"></i>
              </button>
              <button class="btn-icon cancelar-btn" data-index="${meta.row}" ${confirmarDisabled ? 'disabled' : ''}>
                <i class="fas fa-times-circle icon-cancel"></i>
              </button>`;
          },
        },
      ],
      language: {
        url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json',
      },
      responsive: true,
    });

    // Manejar eventos de botones personalizados
    $(tableRef.current).on('click', '.confirmar-btn', function () {
      const index = $(this).data('index');
      actualizarEstadoReserva(index, 'Confirmado');
    });

    $(tableRef.current).on('click', '.cancelar-btn', function () {
      const index = $(this).data('index');
      actualizarEstadoReserva(index, 'Cancelado');
    });
  };

  const actualizarEstadoReserva = async (index, nuevoEstado) => {
    const reserva = reservas[index];
    const nuevaReserva = { ...reserva, estado: nuevoEstado };

    Swal.fire({
      title: `¿Estás seguro de ${nuevoEstado === 'Confirmado' ? 'confirmar' : 'cancelar'} esta reserva?`,
      text: 'No podrás revertir esto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: nuevoEstado === 'Confirmado' ? 'Confirmar' : 'Cancelar',
      cancelButtonText: 'No',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`http://localhost:5000/api/reservas/${reserva.id_Reservas}/estado`, { estado: nuevoEstado });

          const nuevasReservas = reservas.map((res, i) =>
            i === index ? nuevaReserva : res
          );
          setReservas(nuevasReservas);
          inicializarDataTable(nuevasReservas);

          Swal.fire({
            title: nuevoEstado === 'Confirmado' ? '¡Confirmado!' : '¡Cancelado!',
            text: `La reserva ha sido ${nuevoEstado.toLowerCase()}.`,
            icon: 'success',
          });
        } catch (error) {
          console.error(`Error al ${nuevoEstado === 'Confirmado' ? 'confirmar' : 'cancelar'} la reserva:`, error);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo actualizar el estado de la reserva.',
            icon: 'error',
          });
        }
      }
    });
  };

  const styles = `
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
    background: linear-gradient(90deg, #1db954, #1ca54f);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .table-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 95%;
    margin: 20px auto;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 20px;
  }
  table.dataTable {
    width: 100% !important;
    font-size: 1.2rem;
  }
  .btn-icon {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 1.5rem;
    margin: 0 5px;
    transition: transform 0.2s ease, background-color 0.3s ease;
  }
  .btn-icon:hover {
    transform: scale(1.1);
    background-color: rgba(220, 220, 220, 0.3);
    border-radius: 50%;
  }
  .icon-check {
    color: #28a745;
  }
  .icon-cancel {
    color: #dc3545;
  }
  .btn-icon:disabled {
    opacity: 0.6;
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
              <h2 className="fade-in">Consultar Reservas</h2>
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

export default ConsultarReservas;
