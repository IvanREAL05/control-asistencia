import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./Panel.css"; // Archivo CSS para estilos (lo creamos después)

const clases = [
  {
    id: 102,
    nombre: "Matemáticas",
    alumnos: [
      { id: 1, nombre: "Juan Pérez" },
      { id: 2, nombre: "María López" },
      { id: 3, nombre: "Luis García" },
    ],
  },
  {
    id: 103,
    nombre: "Historia",
    alumnos: [
      { id: 4, nombre: "Ana Ruiz" },
      { id: 5, nombre: "Carlos Díaz" },
    ],
  },
];

const Panel = () => {
  // Estados para el control de asistencia
  const [claseSeleccionada, setClaseSeleccionada] = useState(clases[0].id);
  const [asistencia, setAsistencia] = useState({});
  
  // Estados para el panel general
  const [stats] = useState({
    totalAlumnos: 1200,
    clases: [
      { id: 101, nombre: "Matemáticas 101", total: 50, presentes: 45, porcentaje: 90 },
      { id: 102, nombre: "Historia 102", total: 30, presentes: 25, porcentaje: 83 },
      { id: 103, nombre: "Biología 103", total: 40, presentes: 38, porcentaje: 95 },
    ]
  });

  // Mapa de asientos
  const [asientos] = useState(
    Array(5).fill().map((_, fila) => 
      Array(6).fill().map((_, col) => ({
        id: `${fila+1}-${col+1}`,
        ocupado: Math.random() > 0.5
      }))
    )
  );

  // Funciones para control de asistencia
  const claseActual = clases.find(c => c.id === claseSeleccionada);
  
  const toggleAsistencia = (alumnoId) => {
    setAsistencia(prev => ({
      ...prev,
      [alumnoId]: !prev[alumnoId],
    }));
  };

  const totalAlumnosClase = claseActual.alumnos.length;
  const presentesClase = claseActual.alumnos.filter(a => asistencia[a.id]).length;

  // Datos para gráfica
  const chartData = stats.clases.map(clase => ({
    name: clase.id,
    porcentaje: clase.porcentaje,
    presentes: clase.presentes,
    total: clase.total
  }));

  return (
    <div className="panel-container">
      {/* Sección de Control de Asistencia */}
      <div className="seccion-asistencia">
        <h2>Control de Asistencia por Clase</h2>
        
        <div className="selector-clase">
          <select
            value={claseSeleccionada}
            onChange={e => setClaseSeleccionada(parseInt(e.target.value))}
          >
            {clases.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="estadisticas-clase">
          <p>Total alumnos: {totalAlumnosClase}</p>
          <p>Presentes: {presentesClase}</p>
          <p>Porcentaje: {Math.round((presentesClase / totalAlumnosClase) * 100)}%</p>
        </div>

        <div className="lista-alumnos">
          {claseActual.alumnos.map(alumno => (
            <div key={alumno.id} className="alumno-card">
              <span>{alumno.nombre}</span>
              <button
                className={asistencia[alumno.id] ? "presente" : "ausente"}
                onClick={() => toggleAsistencia(alumno.id)}
              >
                {asistencia[alumno.id] ? "Presente" : "Marcar Presente"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de Estadísticas Generales */}
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
            <Bar dataKey="porcentaje" fill="#8884d8" name="Porcentaje" />
            <Bar dataKey="presentes" fill="#82ca9d" name="Presentes" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mapa de Asientos */}
      <div className="asientos-card">
        <h2>Asientos - {claseActual.nombre}</h2>
        <div className="sala-cine">
          <div className="pantalla">Pantalla</div>
          <div className="asientos-grid">
            {asientos.map((fila, i) => (
              <div key={i} className="fila-asientos">
                {fila.map(asiento => (
                  <div 
                    key={asiento.id}
                    className={`asiento ${asiento.ocupado ? 'ocupado' : 'libre'}`}
                  >
                    {asiento.id}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="leyenda">
            <span><div className="cuadro libre"></div> Libre</span>
            <span><div className="cuadro ocupado"></div> Ocupado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Panel;