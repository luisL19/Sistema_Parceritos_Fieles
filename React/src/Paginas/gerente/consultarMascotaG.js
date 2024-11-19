import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import Footer from '../../components/footer';
import NavBarGerente from '../../components/navBarGerente';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import './consultarMascotaG.css';

const ConsultarMascotG = () => {
  const tableRef = useRef(null);

  useEffect(() => {
    const obtenerMascotas = async () => {
      try {
        const respuesta = await axios.get('http://localhost:5000/api/empleados/consultar-mascotas');
        const mascotasData = respuesta.data;

        if (!Array.isArray(mascotasData)) {
          console.error('La respuesta del backend no es un array:', mascotasData);
          return;
        }

        // Destruir instancia previa de DataTable si existe
        if ($.fn.DataTable.isDataTable(tableRef.current)) {
          $(tableRef.current).DataTable().destroy();
        }

        // Inicializar DataTable con los datos obtenidos
        $(tableRef.current).DataTable({
          data: mascotasData,
          columns: [
            { title: 'Nombre', data: 'nombre_mascota' },
            { title: 'Raza', data: 'raza' },
            { title: 'Edad', data: 'edad', render: (data) => `${data} años` },
            { title: 'Sexo', data: 'sexo' },
            { title: 'Enfermedades', data: 'enfermedades' },
            { title: 'Peso', data: 'peso', render: (data) => `${data} Kg` },
            { title: 'Esterilizado', data: 'esterilizado', render: (data) => (data ? 'Sí' : 'No') },
            {
              title: 'Acción',
              data: 'id_Mascota',
              render: (data) =>
                `<button class="btn-ver-perfil" data-id="${data}">
                  Ver Perfil
                </button>`,
            },
          ],
          language: {
            url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json', // Traducción al español
          },
          responsive: true,
        });

        // Manejar eventos de botones personalizados
        $(tableRef.current).on('click', '.btn-ver-perfil', function () {
          const idMascota = $(this).data('id');
          verPerfil(idMascota);
        });
      } catch (error) {
        console.error('Error al obtener las mascotas:', error);
      }
    };

    obtenerMascotas();

    return () => {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
    };
  }, []);

  const verPerfil = (id) => {
    localStorage.setItem('mascotaId', id);
    window.location.href = '/verPerfilMascotaG';
  };

  return (
    <div className="page-container">
      <NavBarGerente />
      <main>
        <section className="container">
          <div className="content">
            <h2 className="fade-in">Consultar Mascotas</h2>
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

export default ConsultarMascotG;
