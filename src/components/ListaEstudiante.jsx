import React, { useEffect, useState } from 'react';

const ListaEstudiantes = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/estudiante')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener estudiantes');
        }
        return response.json();
      })
      .then(data => {
        setEstudiantes(data);
        setCargando(false);
      })
      .catch(err => {
        setError(err.message);
        setCargando(false);
      });
  }, []);

  if (cargando) return <p>Cargando estudiantes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Lista de Estudiantes</h2>
      <ul>
        {estudiantes.map((est) => (
          <li key={est.id}>
            <strong>{est.nombre}</strong> — Matrícula: {est.matricula} — Grupo: {est.grupo} — Email: {est.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaEstudiantes;