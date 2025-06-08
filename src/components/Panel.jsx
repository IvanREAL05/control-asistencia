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
  Legend,
  LabelList
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
  { id: '1f', nombre: '1F', turno: 'matutino' },
  { id: '1g', nombre: '1G', turno: 'matutino' },
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
  // Primer año (1°)
  {
    id: 201,
    nombre: "Matemáticas",
    grupo: "1a",
    horario: "7:20 - 8:05",
    turno: "matutino",
    alumnos: Array.from({ length: 30 }, (_, i) => ({
      id: `1a-${i+1}`,
      nombre: `Alumno A${i + 1}`,
      apellido: `Apellido A${i + 1}`,
      correo: `1a-alumno${i + 1}@example.com`,
      matricula: `A${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
  {
    id: 202,
    nombre: "Historia",
    grupo: "1b",
    horario: "7:20 - 8:05",
    turno: "matutino",
    alumnos: Array.from({ length: 28 }, (_, i) => ({
      id: `1b-${i+1}`,
      nombre: `Alumno B${i + 1}`,
      apellido: `Apellido B${i + 1}`,
      correo: `1b-alumno${i + 1}@example.com`,
      matricula: `B${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
  {
    id: 203,
    nombre: "Biología",
    grupo: "1c",
    horario: "7:20 - 8:05",
    turno: "matutino",
    alumnos: Array.from({ length: 27 }, (_, i) => ({
      id: `1c-${i+1}`,
      nombre: `Alumno C${i + 1}`,
      apellido: `Apellido C${i + 1}`,
      correo: `1c-alumno${i + 1}@example.com`,
      matricula: `C${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
  {
    id: 204,
    nombre: "Física",
    grupo: "1d",
    horario: "7:20 - 8:05",
    turno: "matutino",
    alumnos: Array.from({ length: 25 }, (_, i) => ({
      id: `1d-${i+1}`,
      nombre: `Alumno D${i + 1}`,
      apellido: `Apellido D${i + 1}`,
      correo: `1d-alumno${i + 1}@example.com`,
      matricula: `D${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
  {
    id: 205,
    nombre: "Lectura y Redacción",
    grupo: "1e",
    horario: "7:20 - 8:05",
    turno: "matutino",
    alumnos: Array.from({ length: 26 }, (_, i) => ({
      id: `1e-${i+1}`,
      nombre: `Alumno E${i + 1}`,
      apellido: `Apellido E${i + 1}`,
      correo: `1e-alumno${i + 1}@example.com`,
      matricula: `E${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
  {
    id: 206,
    nombre: "Geografía",
    grupo: "1f",
    horario: "7:20 - 8:05",
    turno: "matutino",
    alumnos: Array.from({ length: 29 }, (_, i) => ({
      id: `1f-${i+1}`,
      nombre: `Alumno F${i + 1}`,
      apellido: `Apellido F${i + 1}`,
      correo: `1f-alumno${i + 1}@example.com`,
      matricula: `F${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },

  // Segundo año (2°)
  {
    id: 207,
    nombre: "Álgebra",
    grupo: "2a",
    horario: "7:20 - 8:05",
    turno: "matutino",
    alumnos: Array.from({ length: 28 }, (_, i) => ({
      id: `2a-${i+1}`,
      nombre: `Alumno G${i + 1}`,
      apellido: `Apellido G${i + 1}`,
      correo: `2a-alumno${i + 1}@example.com`,
      matricula: `G${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
  {
    id: 208,
    nombre: "Historia Universal",
    grupo: "2b",
    horario: "7:20 - 8:05",
    turno: "matutino",
    alumnos: Array.from({ length: 26 }, (_, i) => ({
      id: `2b-${i+1}`,
      nombre: `Alumno H${i + 1}`,
      apellido: `Apellido H${i + 1}`,
      correo: `2b-alumno${i + 1}@example.com`,
      matricula: `H${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
  {
    id: 209,
    nombre: "Química",
    grupo: "2c",
    horario: "7:20 - 8:05",
    turno: "matutino",
    alumnos: Array.from({ length: 27 }, (_, i) => ({
      id: `2c-${i+1}`,
      nombre: `Alumno I${i + 1}`,
      apellido: `Apellido I${i + 1}`,
      correo: `2c-alumno${i + 1}@example.com`,
      matricula: `I${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
  {
    id: 210,
    nombre: "Literatura",
    grupo: "2d",
    horario: "7:20 - 8:05",
    turno: "matutino",
    alumnos: Array.from({ length: 25 }, (_, i) => ({
      id: `2d-${i+1}`,
      nombre: `Alumno J${i + 1}`,
      apellido: `Apellido J${i + 1}`,
      correo: `2d-alumno${i + 1}@example.com`,
      matricula: `J${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
  {
    id: 211,
    nombre: "Inglés Intermedio",
    grupo: "2e",
    horario: "7:20 - 8:05",
    turno: "matutino",
    alumnos: Array.from({ length: 24 }, (_, i) => ({
      id: `2e-${i+1}`,
      nombre: `Alumno K${i + 1}`,
      apellido: `Apellido K${i + 1}`,
      correo: `2e-alumno${i + 1}@example.com`,
      matricula: `K${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
  {
    id: 212,
    nombre: "Informática",
    grupo: "2f",
    horario: "7:20 - 8:05",
    turno: "matutino",
    alumnos: Array.from({ length: 30 }, (_, i) => ({
      id: `2f-${i+1}`,
      nombre: `Alumno L${i + 1}`,
      apellido: `Apellido L${i + 1}`,
      correo: `2f-alumno${i + 1}@example.com`,
      matricula: `L${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },

  // Tercer año (3°)
  {
    id: 213,
    nombre: "Cálculo Diferencial",
    grupo: "3a",
    horario: "7:20 - 8:05",
    turno: "matutino",
    alumnos: Array.from({ length: 26 }, (_, i) => ({
      id: `3a-${i+1}`,
      nombre: `Alumno M${i + 1}`,
      apellido: `Apellido M${i + 1}`,
      correo: `3a-alumno${i + 1}@example.com`,
      matricula: `M${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
  {
    id: 214,
    nombre: "Historia de México",
    grupo: "3b",
    horario: "7:20 - 8:05",
    turno: "matutino",
    alumnos: Array.from({ length: 27 }, (_, i) => ({
      id: `3b-${i+1}`,
      nombre: `Alumno N${i + 1}`,
      apellido: `Apellido N${i + 1}`,
      correo: `3b-alumno${i + 1}@example.com`,
      matricula: `N${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
  {
    id: 215,
    nombre: "Física Avanzada",
    grupo: "3c",
    horario: "7:20 - 8:05",
    turno: "matutino",
    alumnos: Array.from({ length: 25 }, (_, i) => ({
      id: `3c-${i+1}`,
      nombre: `Alumno O${i + 1}`,
      apellido: `Apellido O${i + 1}`,
      correo: `3c-alumno${i + 1}@example.com`,
      matricula: `O${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
  {
    id: 216,
    nombre: "Literatura Universal",
    grupo: "3d",
    horario: "7:20 - 8:05",
    turno: "matutino",
    alumnos: Array.from({ length: 24 }, (_, i) => ({
      id: `3d-${i+1}`,
      nombre: `Alumno P${i + 1}`,
      apellido: `Apellido P${i + 1}`,
      correo: `3d-alumno${i + 1}@example.com`,
      matricula: `P${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
  {
    id: 217,
    nombre: "Inglés Avanzado",
    grupo: "3e",
    horario: "7:20 - 8:05",
    turno: "matutino",
    alumnos: Array.from({ length: 23 }, (_, i) => ({
      id: `3e-${i+1}`,
      nombre: `Alumno Q${i + 1}`,
      apellido: `Apellido Q${i + 1}`,
      correo: `3e-alumno${i + 1}@example.com`,
      matricula: `Q${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  },
  {
    id: 218,
    nombre: "Programación",
    grupo: "3f",
    horario: "7:20 - 8:05",
    turno: "matutino",
    alumnos: Array.from({ length: 28 }, (_, i) => ({
      id: `3f-${i+1}`,
      nombre: `Alumno R${i + 1}`,
      apellido: `Apellido R${i + 1}`,
      correo: `3f-alumno${i + 1}@example.com`,
      matricula: `R${String(i + 1).padStart(3, '0')}`,
      foto: "https://via.placeholder.com/100",
    })),
  }
];
const horariosMatutinos = [
  { id: 1, hora: "7:20 - 8:05", nombre: "Bloque 1" },
  { id: 2, hora: "8:05 - 8:50", nombre: "Bloque 2" },
  { id: 3, hora: "8:50 - 9:35", nombre: "Bloque 3" },
  { id: 4, hora: "9:35 - 10:20", nombre: "Bloque 4" },
  { id: 5, hora: "10:50 - 11:35", nombre: "Bloque 5" },
  { id: 6, hora: "11:35 - 12:20", nombre: "Bloque 6" },
  { id: 7, hora: "12:20 - 13:05", nombre: "Bloque 7" },
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
  const [paginaActual, setPaginaActual] = useState(0);
  const grados = ['1', '2', '3'];
  const gradoActual = grados[paginaActual];

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
      if (!grupo) return null;

      const clasesDelGrupo = clasesEnHorario.filter(c => c.grupo === grupoId);
      
      let totalAlumnos = 0, presentes = 0, ausentes = 0, justificantes = 0;
      
      clasesDelGrupo.forEach(clase => {
        totalAlumnos += clase.alumnos.length;
        clase.alumnos.forEach(alumno => {
          const estado = asistencia[alumno.id];
          if (estado === 'presente') presentes++;
          else if (estado === 'justificante') justificantes++;
          else ausentes++;
        });
      });

      const porcentajeAsistencia = totalAlumnos > 0
        ? Math.round((presentes / totalAlumnos) * 100)
        : 0;

      return {
        ...grupo,
        nombreHorario: horario.hora,
        clases: clasesDelGrupo,
        estadisticas: {
          totalAlumnos,
          presentes,
          ausentes,
          justificantes,
          porcentajeAsistencia
        }
      };
    }).filter(Boolean);
  };

  const GrupoCard = ({ grupo, onVerClases }) => {
  const [mostrarClases, setMostrarClases] = useState(false);

  return (
    <div className="grupo-card">
    <div className="grupo-header">
      <h4>{grupo.nombre}</h4>
      <div className="porcentajes-container">
        <span className="porcentaje porcentaje-presente">
          {Math.round((grupo.estadisticas.presentes / grupo.estadisticas.totalAlumnos) * 100)}%
        </span>
        <span className="porcentaje porcentaje-justificante">
          {Math.round((grupo.estadisticas.justificantes / grupo.estadisticas.totalAlumnos) * 100)}%
        </span>
        <span className="porcentaje porcentaje-ausente">
          {Math.round((grupo.estadisticas.ausentes / grupo.estadisticas.totalAlumnos) * 100)}%
        </span>
      </div>
    </div>

    <div className="grupo-stats-container">
      <div className="grupo-stats">
        <div className="stat-item">
          <span className="stat-label">Total:</span>
          <span className="stat-value">{grupo.estadisticas.totalAlumnos}</span>
        </div>
        <div className="stat-item">
          <span className="stat-dot presente"></span>
          <span className="stat-value">{grupo.estadisticas.presentes}</span>
        </div>
        <div className="stat-item">
          <span className="stat-dot justificante"></span>
          <span className="stat-value">{grupo.estadisticas.justificantes}</span>
        </div>
        <div className="stat-item">
          <span className="stat-dot ausente"></span>
          <span className="stat-value">{grupo.estadisticas.ausentes}</span>
        </div>
      </div>
      
      <div className="grupo-chart-mini">
        <ResponsiveContainer width={100} height={100}>
          <BarChart
            data={[
              { 
                name: 'Estadísticas',
                presentes: grupo.estadisticas.presentes,
                justificantes: grupo.estadisticas.justificantes,
                ausentes: grupo.estadisticas.ausentes,
                total: grupo.estadisticas.totalAlumnos
              }
            ]}
            layout="vertical"
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <XAxis type="number" hide domain={[0, 'dataMax']} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip 
              formatter={(value, name) => {
                const names = {
                  presentes: 'Presentes',
                  justificantes: 'Justificantes',
                  ausentes: 'Ausentes'
                };
                return [`${value} ${names[name]}`, ''];
              }}
            />
            <Bar dataKey="presentes" fill="#4CAF50" barSize={20} />
            <Bar dataKey="justificantes" fill="#FFC107" barSize={20} />
            <Bar dataKey="ausentes" fill="#F44336" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
      
      <button 
        className="btn-ver-clases"
        onClick={() => setMostrarClases(!mostrarClases)}
      >
        {mostrarClases ? 'Ocultar clases' : `Ver ${grupo.clases.length} clase${grupo.clases.length !== 1 ? 's' : ''}`}
      </button>
      
      {mostrarClases && (
        <div className="grupo-clases">
          <ul className="clases-list">
            {grupo.clases.map(clase => (
              <li key={clase.id}>
                <span className="clase-nombre">{clase.nombre}</span>
                <span className="clase-alumnos">
                  {clase.alumnos.length} alumno{clase.alumnos.length !== 1 ? 's' : ''}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


/* falta un componente */ 


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
    <>
      <div className="horarios-grid">
        {horariosMatutinos.map(horario => (
          <div 
            key={horario.id} 
            className="horario-card"
            onClick={() => {
              setHoraSeleccionada(horario.id);
              setPaginaActual(0); // Resetear a primer grado al seleccionar horario
            }}
          >
            <h3>{horario.nombre}</h3>
            <p>{horario.hora}</p>
            <p>
              {
                [...new Set(
                  clases.filter(c => c.horario === horario.hora && c.turno === 'matutino')
                        .map(c => c.grupo)
                )].length
              } grupos
            </p>
          </div>
        ))}
      </div>

      {/* Turno vespertino: solo visual */}
      <h2 className="turno-vespertino-titulo">Asistencia por Horario - Turno Vespertino</h2>
      <div className="horarios-grid vespertino-visual">
        {horariosMatutinos.map(horario => (
          <div 
            key={`vespertino-${horario.id}`} 
            className="horario-card deshabilitado"
          >
            <h3>{horario.nombre}</h3>
            <p>{horario.hora}</p>
            <p>0 grupos</p>
          </div>
        ))}
      </div>
    </>
        ) : (
          <div className="grupos-por-hora">
            <div className="controles-superiores">
              <button className="btn-volver-horarios" onClick={() => setHoraSeleccionada(null)}>
                ← Volver a horarios
              </button>
              
              <h3 className="hora-seleccionada-titulo">
                {horariosMatutinos.find(h => h.id === horaSeleccionada)?.nombre || 'Horario'} - 
                {horariosMatutinos.find(h => h.id === horaSeleccionada)?.hora || ''}
              </h3>
            </div>

            {/* Controles de paginación por grado */}
            <div className="paginacion-grados">
              {grados.map((grado, index) => (
                <button
                  key={`grado-${grado}`}
                  className={`paginacion-btn ${paginaActual === index ? 'activo' : ''}`}
                  onClick={() => setPaginaActual(index)}
                >
                  {grado}° Año
                </button>
              ))}
            </div>

            {/* Contenido del grado actual */}
            <div className="contenido-grado">
              <h4 className="grado-titulo">{gradoActual}° Año</h4>
              
              {obtenerGruposPorHorario(horaSeleccionada)
                .filter(grupo => grupo.id.startsWith(gradoActual))
                .length === 0 ? (
                <p className="sin-datos">No hay grupos registrados para este grado en el horario seleccionado</p>
              ) : (
                <div className="grupos-grid">
                  {obtenerGruposPorHorario(horaSeleccionada)
                    .filter(grupo => grupo.id.startsWith(gradoActual))
                    .map(grupo => (
                      <GrupoCard 
                        key={grupo.id} 
                        grupo={grupo} 
                        onVerClases={() => setGrupoSeleccionado(grupo.id)}
                      />
                    ))}
                </div>
              )}
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