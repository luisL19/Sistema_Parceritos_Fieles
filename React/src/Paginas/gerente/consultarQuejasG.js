import React, { useState, useEffect } from 'react';
import NavBar from '../../components/navBarGerente';
import Footer from '../../components/footer';
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import Swal from 'sweetalert2';
import './consultarQuejasG.css';

const ConsultarQuejasG = () => {
  const [quejas, setQuejas] = useState([]);
  const [mostrarQuejaIndex, setMostrarQuejaIndex] = useState(null);
  const [respuesta, setRespuesta] = useState('');

  useEffect(() => {
    const fetchQuejas = async () => {
      try {
        const response = await axios.get(
          'https://sistemainformacionbackend-production.up.railway.app/api/empleado/quejas'
        );
        const data = response.data.reverse(); // Últimos registros primero
        setQuejas(data);

        // Inicializar DataTable
        if ($.fn.DataTable.isDataTable('#quejas-table')) {
          $('#quejas-table').DataTable().destroy();
        }

        $('#quejas-table').DataTable({
          data: data,
          columns: [
            { title: 'Fecha', data: 'fecha' },
            { title: 'Nombre', data: 'nombre_cliente' },
            { title: 'Apellido', data: 'apellido_cliente' },
            { title: 'Correo', data: 'correo' },
            {
              title: 'Acción',
              data: null,
              render: (_, __, row, meta) =>
                `<button class="btn-ver-queja" data-index="${meta.row}">
                   <i class="fas fa-eye consultarQuejasG-icon"></i>
                 </button>`,
            },
          ],
          language: {
            url: '//cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json',
          },
          responsive: true,
        });

        // Evento para manejar el detalle de la queja
        $('#quejas-table').on('click', '.btn-ver-queja', function () {
          const index = $(this).data('index');
          toggleQueja(index);
        });
      } catch (error) {
        console.error('Error al obtener las quejas:', error);
      }
    };

    fetchQuejas();

    return () => {
      if ($.fn.DataTable.isDataTable('#quejas-table')) {
        $('#quejas-table').DataTable().destroy();
      }
    };
  }, []);

  const toggleQueja = (index) => {
    setMostrarQuejaIndex(mostrarQuejaIndex === index ? null : index); // Alternar entre mostrar y ocultar
    setRespuesta(''); // Reiniciar el campo de respuesta cuando se cierra
  };

  const handleEnviarRespuesta = async (queja) => {
    if (!respuesta) return;

    try {
      await axios.put(
        `https://sistemainformacionbackend-production.up.railway.app/api/empleado/quejas/${queja.id_Queja}`,
        { respuesta }
      );

      setQuejas((prevQuejas) =>
        prevQuejas.map((q) =>
          q.id_Queja === queja.id_Queja ? { ...q, respuesta } : q
        )
      );

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Tu respuesta ha sido enviada exitosamente',
        showConfirmButton: false,
        timer: 1500,
      });

      setRespuesta('');
    } catch (error) {
      console.error('Error al enviar la respuesta:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo enviar la respuesta. Inténtalo nuevamente.',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-grow bg-white py-10 px-6">
        <div className="container mx-auto p-4">
          {/* Título */}
          <h2 className="consultarQuejasG-title">Consultar Quejas</h2>
          <p className="consultarQuejasG-subtitle">
            Estas son las últimas quejas registradas en el sistema
          </p>
          <div className="table-wrapper">
            <table id="quejas-table" className="display" style={{ width: '100%' }}></table>
          </div>
          {mostrarQuejaIndex !== null && quejas[mostrarQuejaIndex] && (
            <div className="table-detail-row">
              <div className="consultarQuejasG-detail">
                <h3 className="consultarQuejasG-detail-title">Detalle de la Queja</h3>
                <p className="consultarQuejasG-detail-content">
                  {quejas[mostrarQuejaIndex].contenido}
                </p>
                {quejas[mostrarQuejaIndex].respuesta ? (
                  <p className="text-green-600 font-bold">
                    Respuesta: {quejas[mostrarQuejaIndex].respuesta}
                  </p>
                ) : (
                  <div>
                    <textarea
                      value={respuesta}
                      onChange={(e) => setRespuesta(e.target.value)}
                      placeholder="Escribe tu respuesta aquí..."
                      className="w-full p-4 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                    ></textarea>
                    <button
                      onClick={() => handleEnviarRespuesta(quejas[mostrarQuejaIndex])}
                      className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
                      disabled={!respuesta}
                    >
                      Enviar Respuesta
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConsultarQuejasG;
