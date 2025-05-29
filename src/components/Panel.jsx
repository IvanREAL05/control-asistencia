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

const clases = [
  {
    id: 101,
    nombre: "Matemáticas 101",
    alumnos: Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      nombre: `Alumno ${i + 1}`,
      apellido: `Apellido ${i + 1}`,
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
      apellido: `Apellido B${i + 1}`,
      correo: `alumnob${i + 1}@example.com`,
      matricula: `B${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
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
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            <button className="btn-excel" onClick={generarReporteExcel}>
              Exportar a Excel
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
            <div className="pantalla">Pantalla</div>
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