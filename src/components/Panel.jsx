import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import * as XLSX from "xlsx";
import "./Panel.css";

// Datos de grupos
const grupos = [
  { id: '1a', nombre: '1A', turno: 'matutino' },
  { id: '1b', nombre: '1B', turno: 'matutino' },
  { id: '1c', nombre: '1C', turno: 'matutino' },
  { id: '1d', nombre: '1D', turno: 'matutino' },
  { id: '1e', nombre: '1E', turno: 'matutino' },
  { id: '2a', nombre: '2A', turno: 'matutino' },
  { id: '2b', nombre: '2B', turno: 'matutino' },
  { id: '2c', nombre: '2C', turno: 'matutino' },
  { id: '2d', nombre: '2D', turno: 'matutino' },
  { id: '2e', nombre: '2E', turno: 'matutino' },
  { id: '3a', nombre: '3A', turno: 'matutino' },
  { id: '3b', nombre: '3B', turno: 'matutino' },
  { id: '3c', nombre: '3C', turno: 'matutino' },
  { id: '3d', nombre: '3D', turno: 'matutino' },
  { id: '3e', nombre: '3E', turno: 'matutino' },
];
// Datos de clases
const clases = [
  {
    id: 101,
    nombre: "Matemáticas",
    grupo: "1a",
    horario: "7:20 - 8:50",
    turno: "matutino",
    alumnos: Array.from({ length: 30 }, (_, i) => ({
      id: `1a-${i+1}`,
      nombre: `Alumno ${i + 1}`,
      apellido: `Apellido ${i + 1}`,
      correo: `alumno${i + 1}@example.com`,
      matricula: `A${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
  {
    id: 102,
    nombre: "Historia",
    grupo: "1b",
    horario: "7:20 - 8:50",
    turno: "matutino",
    alumnos: Array.from({ length: 25 }, (_, i) => ({
      id: `1b-${i+1}`,
      nombre: `Alumno B${i + 1}`,
      apellido: `Apellido B${i + 1}`,
      correo: `alumnob${i + 1}@example.com`,
      matricula: `B${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
  {
    id: 103,
    nombre: "Física",
    grupo: "2a",
    horario: "9:20 - 10:50",
    turno: "matutino",
    alumnos: Array.from({ length: 28 }, (_, i) => ({
      id: `2a-${i+1}`,
      nombre: `Alumno C${i + 1}`,
      apellido: `Apellido C${i + 1}`,
      correo: `alumnoc${i + 1}@example.com`,
      matricula: `C${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
  // Más clases para otros grupos y horarios...
];
const horariosMatutinos = [
  { id: 1, hora: "7:20 - 8:50", nombre: "1ra Hora" },
  { id: 2, hora: "9:20 - 10:50", nombre: "2da Hora" },
  { id: 3, hora: "11:20 - 12:50", nombre: "3ra Hora" },
  { id: 4, hora: "13:20 - 14:50", nombre: "4ta Hora" },
];

const COLORS = {
  presente: '#4CAF50',
  justificante: '#FFC107',
  ausente: '#F44336'
};

const Panel = () => {
  const [claseSeleccionada, setClaseSeleccionada] = useState(clases[0].id);
  const [asistencia, setAsistencia] = useState({});
  const [verMas, setVerMas] = useState(false);
  const [asientoSeleccionado, setAsientoSeleccionado] = useState(null);
  const [alumnoModal, setAlumnoModal] = useState(null);
  const [fechaHoraActual, setFechaHoraActual] = useState(new Date());
  const [mostrarTodasClases, setMostrarTodasClases] = useState(false);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setFechaHoraActual(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const claseActual = clases.find(c => c.id === claseSeleccionada);

  const toggleAsistencia = (alumnoId) => {
    setAsistencia(prev => ({
      ...prev,
      [alumnoId]: 
        prev[alumnoId] === 'presente' ? 'justificante' :
        prev[alumnoId] === 'justificante' ? 'ausente' :
        'presente'
    }));
  };

  const alumnosVisibles = verMas ? claseActual.alumnos : claseActual.alumnos.slice(0, 5);

  const totalAlumnosClase = claseActual.alumnos.length;
  const presentesClase = claseActual.alumnos.filter(a => asistencia[a.id] === 'presente').length;
  const justificantesClase = claseActual.alumnos.filter(a => asistencia[a.id] === 'justificante').length;
  const ausentesClase = totalAlumnosClase - presentesClase - justificantesClase;
  const porcentajeAsistencia = Math.round((presentesClase / totalAlumnosClase) * 100);

  const formatoFecha = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const formatoHora = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };

  const fechaFormateada = fechaHoraActual.toLocaleDateString('es-MX', formatoFecha);
  const horaFormateada = fechaHoraActual.toLocaleTimeString('es-MX', formatoHora);

  const claseStatsData = [
    { name: 'Presentes', value: presentesClase, color: COLORS.presente },
    { name: 'Justificantes', value: justificantesClase, color: COLORS.justificante },
    { name: 'Ausentes', value: ausentesClase, color: COLORS.ausente },
  ];

  const stats = {
    totalAlumnos: 1200,
    clases: [
      { id: 101, nombre: "Matemáticas 101", total: 50, presentes: 45, porcentaje: 90 },
      { id: 102, nombre: "Historia 102", total: 30, presentes: 25, porcentaje: 83 },
      { id: 103, nombre: "Biología 103", total: 40, presentes: 38, porcentaje: 95 },
    ]
  };

  const resumenData = [
    { name: 'Asistencia', value: 89, color: '#4CAF50' },
    { name: 'Inasistencia', value: 11, color: '#F44336' },
  ];

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
        return numeroLista <= cantidad ? { id: `${fila + 1}-${col + 1}`, numeroLista } : null;
      })
    );
  };

  // Funciones para la vista de todas las clases
  const obtenerGruposPorHorario = (horaId) => {
    const horario = horariosMatutinos.find(h => h.id === horaId);
    const clasesEnHorario = clases.filter(c => c.horario === horario.hora);
    const gruposIds = [...new Set(clasesEnHorario.map(c => c.grupo))];
    
    return gruposIds.map(grupoId => {
      const grupo = grupos.find(g => g.id === grupoId);
      const clasesDelGrupo = clasesEnHorario.filter(c => c.grupo === grupoId);
      
      // Calcular estadísticas del grupo
      let totalAlumnos = 0;
      let presentes = 0;
      let ausentes = 0;
      let justificantes = 0;
      
      clasesDelGrupo.forEach(clase => {
        totalAlumnos += clase.alumnos.length;
        presentes += clase.alumnos.filter(a => asistencia[a.id] === 'presente').length;
        justificantes += clase.alumnos.filter(a => asistencia[a.id] === 'justificante').length;
        ausentes += clase.alumnos.length - 
          clase.alumnos.filter(a => asistencia[a.id] === 'presente').length - 
          clase.alumnos.filter(a => asistencia[a.id] === 'justificante').length;
      });
      
      const porcentajeAsistencia = totalAlumnos > 0 ? 
        Math.round((presentes / totalAlumnos) * 100) : 0;
      
      return {
        ...grupo,
        clases: clasesDelGrupo,
        estadisticas: {
          totalAlumnos,
          presentes,
          ausentes,
          justificantes,
          porcentajeAsistencia
        }
      };
    });
  };

  if (mostrarTodasClases) {
    return (
      <div className="panel-app">
        <div className="cabecera-panel">
          <div className="logo-nombre">
            <img src="/logo.png" alt="Logo Institución" className="logo" />
            <h1>Preparatoria Lázaro Cárdenas</h1>
          </div>
          <div className="bienvenida">
            <div className="fecha-hora">
              <p>{fechaHoraActual.toLocaleDateString('es-MX', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
              <p>{fechaHoraActual.toLocaleTimeString('es-MX', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}</p>
            </div>
            <button className="btn-volver" onClick={() => {
              setMostrarTodasClases(false);
              setHoraSeleccionada(null);
            }}>
              Volver al panel principal
            </button>
          </div>
        </div>

        <div className="todas-clases-container">
          <h2>Asistencia por Horario - Turno Matutino</h2>
          
          {!horaSeleccionada ? (
            <div className="horarios-grid">
              {horariosMatutinos.map(horario => (
                <div 
                  key={horario.id} 
                  className="horario-card"
                  onClick={() => setHoraSeleccionada(horario.id)}
                >
                  <h3>{horario.nombre}</h3>
                  <p>{horario.hora}</p>
                  <p>
                    {[...new Set(clases.filter(c => c.horario === horario.hora).map(c => c.grupo))].length} 
                    grupos
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grupos-por-hora">
              <button className="btn-volver-horarios" onClick={() => setHoraSeleccionada(null)}>
                ← Volver a horarios
              </button>
              
              <h3>
                {horariosMatutinos.find(h => h.id === horaSeleccionada).nombre} - 
                {horariosMatutinos.find(h => h.id === horaSeleccionada).hora}
              </h3>
              
              <div className="grupos-grid">
                {obtenerGruposPorHorario(horaSeleccionada).map(grupo => (
                  <div key={grupo.id} className="grupo-card">
                    <h4>{grupo.nombre}</h4>
                    
                    <div className="grupo-stats">
                      <div className="stat-item">
                        <span className="stat-label">Total:</span>
                        <span className="stat-value">{grupo.estadisticas.totalAlumnos}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Presentes:</span>
                        <span className="stat-value" style={{color: COLORS.presente}}>
                          {grupo.estadisticas.presentes}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Justificantes:</span>
                        <span className="stat-value" style={{color: COLORS.justificante}}>
                          {grupo.estadisticas.justificantes}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Ausentes:</span>
                        <span className="stat-value" style={{color: COLORS.ausente}}>
                          {grupo.estadisticas.ausentes}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Asistencia:</span>
                        <span className="stat-value">
                          {grupo.estadisticas.porcentajeAsistencia}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="grupo-chart">
                      <ResponsiveContainer width="100%" height={150}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Presentes', value: grupo.estadisticas.presentes, color: COLORS.presente },
                              { name: 'Justificantes', value: grupo.estadisticas.justificantes, color: COLORS.justificante },
                              { name: 'Ausentes', value: grupo.estadisticas.ausentes, color: COLORS.ausente },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={60}
                            paddingAngle={2}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            <Cell key="presente" fill={COLORS.presente} />
                            <Cell key="justificante" fill={COLORS.justificante} />
                            <Cell key="ausente" fill={COLORS.ausente} />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="grupo-clases">
                      <h5>Clases en este horario:</h5>
                      <ul>
                        {grupo.clases.map(clase => (
                          <li key={clase.id}>
                            {clase.nombre} - {clase.alumnos.length} alumnos
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const asientos = generarAsientos(claseActual.alumnos.length);
  const alumnoSeleccionado = asientoSeleccionado ? claseActual.alumnos.find(a => a.id === asientoSeleccionado) : null;

  const generarReporteExcel = () => {
    const datosReporte = claseActual.alumnos.map(alumno => [
      alumno.id,
      alumno.nombre,
      alumno.apellido,
      alumno.matricula,
      asistencia[alumno.id] || "No registrado",
      alumno.correo
    ]);

    const metadata = [
      ["Institución", "Preparatoria Lázaro Cárdenas"],
      ["Reporte de Asistencia", claseActual.nombre],
      ["Fecha", fechaFormateada],
      ["Hora", horaFormateada],
      ["Generado por", "Sistema de Asistencia"],
      [],
      ["No. Lista", "Nombre", "Apellido", "Matrícula", "Estado", "Correo"]
    ];

    const reporteCompleto = [...metadata, ...datosReporte];
    const worksheet = XLSX.utils.aoa_to_sheet(reporteCompleto);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Asistencia ${claseActual.nombre}`);
    
    worksheet["!cols"] = [
      { width: 10 }, { width: 20 }, { width: 20 }, { width: 15 }, { width: 15 }, { width: 30 }
    ];

    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 5 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 5 } }
    ];

    XLSX.writeFile(workbook, `Asistencia_${claseActual.nombre}_${fechaHoraActual.toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="panel-app">
      <div className="cabecera-panel">
        <div className="logo-nombre">
          <img src="/logo.png" alt="Logo Institución" className="logo" />
          <h1>Preparatoria Lázaro Cárdenas</h1>
        </div>
        <div className="bienvenida">
          <div className="fecha-hora">
            <p>{fechaFormateada}</p>
            <p>{horaFormateada}</p>
          </div>
          <p>Bienvenido</p>
          <button className="btn-salir" onClick={() => alert("Sesión cerrada")}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="panel-container">
        <div className="seccion-asistencia">
          <h2>Control de Asistencia por Clase</h2>
          <div className="clase-selector">
            <select
              value={claseSeleccionada}
              onChange={e => setClaseSeleccionada(parseInt(e.target.value))}
            >
              {clases.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} - {c.grupo}</option>
              ))}
            </select>
            <button className="btn-excel" onClick={generarReporteExcel}>
              Exportar a Excel
            </button>
            <button className="btn-todas-clases" onClick={() => setMostrarTodasClases(true)}>
              Ver todas las clases
            </button>
          </div>

          <div className="info-reporte">
            <p><strong>Clase:</strong> {claseActual.nombre}</p>
            <p><strong>Fecha:</strong> {fechaFormateada}</p>
            <p><strong>Hora:</strong> {horaFormateada}</p>
          </div>

          <div className="estadisticas-clase">
            <div className="estadisticas-numeros">
              <p>Total alumnos: <strong>{totalAlumnosClase}</strong></p>
              <p>Presentes: <strong>{presentesClase}</strong></p>
              <p>Justificantes: <strong>{justificantesClase}</strong></p>
              <p>Ausentes: <strong>{ausentesClase}</strong></p>
              <p>Porcentaje: <strong>{porcentajeAsistencia}%</strong></p>
            </div>
            <div className="estadisticas-grafico">
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={claseStatsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {claseStatsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lista-alumnos">
            {alumnosVisibles.map(alumno => (
              <div key={alumno.id} className="alumno-card" onClick={() => setAlumnoModal(alumno)}>
                <span>{alumno.nombre} {alumno.apellido}</span>
                <button
                  className={asistencia[alumno.id] || "ausente"}
                  onClick={(e) => {
                    e.stopPropagation();
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
            <div className="resumen-grafico">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={resumenData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {resumenData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

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
        </div>

        <div className="asientos-container">
          <div className="asientos-grid">
            <div className="pantalla">Mapa de Asientos</div>
            {asientos.map((fila, i) => (
              <div key={i} className="fila-asientos">
                {fila.map((asiento, j) =>
                  asiento ? (
                    <div
                      key={asiento.id}
                      className={`asiento ${asistencia[claseActual.alumnos[asiento.numeroLista - 1]?.id] || 'ausente'}`}
                      onClick={() => setAsientoSeleccionado(claseActual.alumnos[asiento.numeroLista - 1]?.id)}
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

          {asientoSeleccionado && (
            <div className="info-alumno-asiento">
              <h3>Información del Alumno</h3>
              <img src={alumnoSeleccionado.foto} alt={alumnoSeleccionado.nombre} />
              <p><strong>Nombre:</strong> {alumnoSeleccionado.nombre} {alumnoSeleccionado.apellido}</p>
              <p><strong>Matrícula:</strong> {alumnoSeleccionado.matricula}</p>
              <p><strong>Correo:</strong> {alumnoSeleccionado.correo}</p>
              <div className="estado-asistencia">
                <p><strong>Estado:</strong> {asistencia[alumnoSeleccionado.id] || "No registrado"}</p>
                <button
                  className={asistencia[alumnoSeleccionado.id] || "ausente"}
                  onClick={() => toggleAsistencia(alumnoSeleccionado.id)}
                >
                  Cambiar estado
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {alumnoModal && (
        <div className="modal-overlay" onClick={() => setAlumnoModal(null)}>
          <div className="modal-contenido" onClick={e => e.stopPropagation()}>
            <button className="cerrar-modal" onClick={() => setAlumnoModal(null)}>×</button>
            <img src={alumnoModal.foto} alt={alumnoModal.nombre} />
            <p><strong>Nombre:</strong> {alumnoModal.nombre} {alumnoModal.apellido}</p>
            <p><strong>Matrícula:</strong> {alumnoModal.matricula}</p>
            <p><strong>Correo:</strong> {alumnoModal.correo}</p>
            <div className="estado-asistencia">
              <p><strong>Estado:</strong> {asistencia[alumnoModal.id] || "No registrado"}</p>
              <button
                className={asistencia[alumnoModal.id] || "ausente"}
                onClick={() => toggleAsistencia(alumnoModal.id)}
              >
                Cambiar estado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Panel;