import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Footer from '../../components/footer';
import NavBarGerente from '../../components/navBarGerente';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import Swal from 'sweetalert2';
import './consultarReservasG.css';

const ConsultarReservasG = () => {
  const [reservas, setReservas] = useState([]);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const respuesta = await axios.get('http://localhost:5000/api/reservas');
        const data = respuesta.data.reverse();
        setReservas(data);

        inicializarDataTable(data);
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
      }
    };

    fetchReservas();

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
          title: 'Fecha de inicio',
          data: 'fecha_Inicio',
          render: (data) => new Date(data).toLocaleDateString(), // Formatear fecha
        },
        {
          title: 'Fecha de final',
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
        url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json', // Traducción al español
      },
      responsive: true,
    });

    // Manejar eventos de botones personalizados
    $(tableRef.current).on('click', '.confirmar-btn', function () {
      const index = $(this).data('index');
      confirmarReserva(index);
    });

    $(tableRef.current).on('click', '.cancelar-btn', function () {
      const index = $(this).data('index');
      actualizarEstadoReserva(index, 'Cancelado');
    });
  };

  const confirmarReserva = async (index) => {
    const reserva = reservas[index];

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const nuevaReserva = { ...reserva, estado: 'Confirmado' };

        try {
          await axios.put(`http://localhost:5000/api/reservas/${reserva.id_Reservas}/estado`, { estado: 'Confirmado' });

          const nuevasReservas = reservas.map((res, i) =>
            i === index ? nuevaReserva : res
          );
          setReservas(nuevasReservas);
          inicializarDataTable(nuevasReservas);

          Swal.fire({
            title: '¡Confirmado!',
            text: 'La reserva ha sido confirmada.',
            icon: 'success',
          });
        } catch (error) {
          console.error('Error al confirmar la reserva:', error);
          Swal.fire({
            title: 'Error',
            text: 'Hubo un problema al confirmar la reserva.',
            icon: 'error',
          });
        }
      }
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
      confirmButtonText: `Sí, ${nuevoEstado === 'Confirmado' ? 'confirmar' : 'cancelar'}`,
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

  return (
    <div className="page-container">
      <NavBarGerente />
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
  );
};

export default ConsultarReservasG;
