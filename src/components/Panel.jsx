import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Panel.css";

const clases = [
  {
    id: 101,
    nombre: "Matemáticas 101",
    alumnos: Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      nombre: `Alumno ${i + 1}`,
      correo: `alumno${i + 1}@example.com`,
      matricula: `A${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
  {
    id: 102,
    nombre: "Historia 102",
    alumnos: Array.from({ length: 5 }, (_, i) => ({
      id: 31 + i,
      nombre: `Alumno B${i + 1}`,
      correo: `alumnob${i + 1}@example.com`,
      matricula: `B${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
];

const Panel = () => {
  const [claseSeleccionada, setClaseSeleccionada] = useState(clases[0].id);
  const [asistencia, setAsistencia] = useState({});
  const [verMas, setVerMas] = useState(false);
  const [asientoSeleccionado, setAsientoSeleccionado] = useState(null);
  const [alumnoModal, setAlumnoModal] = useState(null);

  const claseActual = clases.find(c => c.id === claseSeleccionada);

  const toggleAsistencia = (alumnoId) => {
    setAsistencia(prev => {
      const estadoActual = prev[alumnoId];
      const nuevoEstado =
        estadoActual === 'presente' ? 'justificante' :
        estadoActual === 'justificante' ? 'ausente' :
        'presente';

      return {
        ...prev,
        [alumnoId]: nuevoEstado,
      };
    });
  };

  const alumnosVisibles = verMas ? claseActual.alumnos : claseActual.alumnos.slice(0, 5);

  const totalAlumnosClase = claseActual.alumnos.length;
  const presentesClase = claseActual.alumnos.filter(a => asistencia[a.id] === 'presente').length;

  const stats = {
    totalAlumnos: 1200,
    clases: [
      { id: 101, nombre: "Matemáticas 101", total: 50, presentes: 45, porcentaje: 90 },
      { id: 102, nombre: "Historia 102", total: 30, presentes: 25, porcentaje: 83 },
      { id: 103, nombre: "Biología 103", total: 40, presentes: 38, porcentaje: 95 },
    ]
  };

  const chartData = stats.clases.map(clase => ({
    name: clase.nombre,
    presentes: clase.presentes,
    ausentes: clase.total - clase.presentes,
  }));

  const generarAsientos = (cantidad) => {
    const filas = Math.ceil(cantidad / 6);
    let contador = 1;
    return Array.from({ length: filas }, (_, fila) =>
      Array.from({ length: 6 }, (_, col) => {
        const numeroLista = contador++;
        return numeroLista <= cantidad
          ? {
              id: `${fila + 1}-${col + 1}`,
              numeroLista,
            }
          : null;
      })
    );
  };

  const asientos = generarAsientos(claseActual.alumnos.length);

  const alumnoSeleccionado = asientoSeleccionado
    ? claseActual.alumnos.find(a => a.id === asientoSeleccionado)
    : null;

  return (
  <>
    {/* Cabecera superior */}
    <div className="cabecera-panel">
      <div className="logo-nombre">
        <img src="/logo.png" alt="Logo Institución" className="logo" />
        <h1>Preparatoria Lázaro Cárdenas</h1>
      </div>
      <div className="bienvenida">
        <p>Bienvenido</p>
        <button className="btn-salir" onClick={() => alert("Sesión cerrada")}>
          Cerrar sesión
        </button>
      </div>
    </div>

    <div className="panel-container">
      {/* Control de Asistencia */}
      <div className="seccion-asistencia">
        <h2>Control de Asistencia por Clase</h2>
        <select
          value={claseSeleccionada}
          onChange={e => setClaseSeleccionada(parseInt(e.target.value))}
        >
          {clases.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>

        <div className="estadisticas-clase">
          <p>Total alumnos: {totalAlumnosClase}</p>
          <p>Presentes: {presentesClase}</p>
          <p>Porcentaje: {Math.round((presentesClase / totalAlumnosClase) * 100)}%</p>
        </div>

        <div className="lista-alumnos">
          {alumnosVisibles.map(alumno => (
            <div
                key={alumno.id}
                className="alumno-card"
                onClick={() => setAlumnoModal(alumno)}
              >
                <span>{alumno.nombre}</span>
                <button
                  className={
                    asistencia[alumno.id] === 'presente'
                      ? "presente"
                      : asistencia[alumno.id] === 'justificante'
                      ? "justificante"
                      : "ausente"
                  }
                  onClick={(e) => {
                    e.stopPropagation(); // evita que se dispare el modal al hacer clic en el botón
                    toggleAsistencia(alumno.id);
                  }}
                >
                  {asistencia[alumno.id] || "Marcar Presente"}
                </button>
              </div>
          ))}
          {claseActual.alumnos.length > 5 && (
            <button className="ver-mas-btn" onClick={() => setVerMas(!verMas)}>
              {verMas ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="resumen-card">
        <h2>Resumen General</h2>
        <div className="resumen-grid">
          <div className="metric-card">
            <h3>Total Alumnos</h3>
            <p>{stats.totalAlumnos}</p>
          </div>
          <div className="metric-card">
            <h3>Asistencia Promedio</h3>
            <p>89%</p>
          </div>
        </div>
      </div>

      {/* Gráfica de Asistencias */}
      <div className="chart-card">
        <h2>Asistencia por Clase</h2>
        <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="presentes" fill="green" name="Presentes" />
          <Bar dataKey="ausentes" fill="red" name="Ausentes" />
        </BarChart>
      </ResponsiveContainer>

        {/* Mostrar alumno seleccionado */}
        {alumnoSeleccionado && (
          <div className="info-alumno">
            <h3>Alumno Seleccionado</h3>
            <img src={alumnoSeleccionado.foto} alt={alumnoSeleccionado.nombre} />
            <p><strong>Nombre:</strong> {alumnoSeleccionado.nombre}</p>
            <p><strong>Matrícula:</strong> {alumnoSeleccionado.matricula}</p>
            <p><strong>Correo:</strong> {alumnoSeleccionado.correo}</p>
          </div>
        )}
      </div>

      {/* Mapa de Asientos */}
      <div className="asientos-grid">
        {asientos.map((fila, i) => (
          <div key={i} className="fila-asientos">
            {fila.map((asiento, j) =>
              asiento ? (
                <div
                  key={asiento.id}
                  className={`asiento ${
                    asistencia[claseActual.alumnos[asiento.numeroLista - 1]?.id] === 'presente'
                      ? 'verde'
                      : asistencia[claseActual.alumnos[asiento.numeroLista - 1]?.id] === 'justificante'
                      ? 'amarillo'
                      : 'rojo'
                  }`}
                  onClick={() =>
                    setAsientoSeleccionado(claseActual.alumnos[asiento.numeroLista - 1]?.id)
                  }
                >
                  {asiento.numeroLista}
                </div>
              ) : (
                <div key={`${i}-${j}`} className="asiento invisible"></div>
              )
            )}
          </div>
        ))}
      </div>
    </div>

    {alumnoModal && (
      <div className="modal-overlay" onClick={() => setAlumnoModal(null)}>
        <div className="modal-contenido" onClick={e => e.stopPropagation()}>
          <button className="cerrar-modal" onClick={() => setAlumnoModal(null)}>×</button>
          <img src={alumnoModal.foto} alt={alumnoModal.nombre} />
          <p><strong>Nombre:</strong> {alumnoModal.nombre}</p>
          <p><strong>Matrícula:</strong> {alumnoModal.matricula}</p>
          <p><strong>Correo:</strong> {alumnoModal.correo}</p>
        </div>
      </div>
    )}
  </>
);
};

export default Panel;