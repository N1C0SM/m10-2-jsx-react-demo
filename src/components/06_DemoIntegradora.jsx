
import { useState } from 'react';

// ============================================================================
// [CLAVE EXPOSICIÓN 6] DEMO INTEGRADORA DE TODAS LAS CARACTERÍSTICAS DE JSX
// ----------------------------------------------------------------------------
// Este componente reúne en un caso real de aula:
// - Fragmentos (<>...</>) y atributos camelCase (className, onClick, onChange)
// - Expresiones JS { } y estilos en línea dinámicos style={{ }}
// - Renderizado condicional (ternario + && booleano seguro)
// - Listas con .map() y key única estable
// - Comunicación mediante props y composición de componentes
// - Filtrado de arrays mediante .filter()
// - Ordenación de arrays mediante .sort()
// ============================================================================

const EXPEDIENTES = [
  { id: 101, nombre: 'Lucía Serrano', nota: 8.7, modulos: ['DI', 'PSP', 'AD'] },
  { id: 102, nombre: 'Marcos Vega', nota: 4.3, modulos: ['DI', 'SGE'] },
  { id: 103, nombre: 'Sofía Navarro', nota: 9.5, modulos: ['DI', 'PSP', 'AD', 'PMDM'] }
];

function TarjetaExpediente({ alumno, seleccionado, onSeleccionar }) {
  const aprobado = alumno.nota >= 5;

  return (
    <article
      className="box"
      style={{
        borderColor: seleccionado ? 'var(--primary)' : 'var(--border)',
        borderWidth: seleccionado ? '2px' : '1px'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <h3 style={{ margin: 0 }}>{alumno.nombre}</h3>

        <span className={`badge ${aprobado ? 'badge-ok' : 'badge-fail'}`}>
          {aprobado ? `Aprobado (${alumno.nota})` : `Pendiente (${alumno.nota})`}
        </span>
      </div>

      {alumno.modulos.length > 0 && (
        <div className="btn-row" style={{ marginTop: '0.6rem' }}>
          {alumno.modulos.map((mod) => (
            <span key={`${alumno.id}-${mod}`} className="code-inline">
              {mod}
            </span>
          ))}
        </div>
      )}

      <div className="btn-row">
        <button
          type="button"
          className="btn"
          onClick={() => onSeleccionar(alumno)}
        >
          {seleccionado ? 'Expediente seleccionado' : 'Seleccionar expediente'}
        </button>
      </div>
    </article>
  );
}

export default function DemoIntegradora() {
  const [soloAprobados, setSoloAprobados] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);

  // [TICKET 07] ESTADOS DEL BUSCADOR Y LA ORDENACIÓN
  const [busqueda, setBusqueda] = useState('');
  const [ordenacion, setOrdenacion] = useState('nota-desc');

  // [TICKET 07] FILTRAR Y ORDENAR EXPEDIENTES
  // Primero aplicamos los filtros y después ordenamos los resultados.

  const listaFiltrada = EXPEDIENTES
    .filter((alumno) => {
      // Filtro por nombre.
      const coincideNombre = alumno.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase().trim());

      // Filtro de alumnos aprobados.
      const coincideAprobado = !soloAprobados || alumno.nota >= 5;

      // Ambos filtros deben cumplirse.
      return coincideNombre && coincideAprobado;
    })
    .sort((a, b) => {
      // Nota de mayor a menor.
      if (ordenacion === 'nota-desc') {
        return b.nota - a.nota;
      }

      // Nota de menor a mayor.
      if (ordenacion === 'nota-asc') {
        return a.nota - b.nota;
      }

      // Nombre en orden alfabético.
      if (ordenacion === 'nombre-asc') {
        return a.nombre.localeCompare(b.nombre, 'es');
      }

      return 0;
    });

  return (
    <>
      <section className="card">
        <h2>6. Ejemplo Integrador: Panel de Expedientes DAM2</h2>

        <p className="subtitle">
          Composición de componentes reutilizables aplicando todas las reglas de JSX.
        </p>

        {/* =========================================
            [TICKET 07] BUSCADOR DE ALUMNOS
        ========================================= */}

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="buscar-alumno">
            Buscar alumno por nombre:
          </label>

          <input
            id="buscar-alumno"
            type="text"
            className="input"
            placeholder="Ej.: Lucía, Marcos, Sofía..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* =========================================
            FILTROS Y ORDENACIÓN
        ========================================= */}

        <div
          className="btn-row"
          style={{
            marginBottom: '1rem',
            alignItems: 'center'
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setSoloAprobados((prev) => !prev)}
          >
            {soloAprobados
              ? 'Mostrar todos los alumnos'
              : 'Filtrar solo aprobados (>= 5)'}
          </button>

          {seleccionado && (
            <span className="pill">
              Seleccionado: {seleccionado.nombre} (ID #{seleccionado.id})
            </span>
          )}
        </div>

        {/* [TICKET 07] SELECTOR DE ORDENACIÓN */}

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="ordenar-expedientes">
            Ordenar expedientes:
          </label>

          <select
            id="ordenar-expedientes"
            className="input"
            value={ordenacion}
            onChange={(e) => setOrdenacion(e.target.value)}
          >
            <option value="nota-desc">Nota (mayor a menor)</option>
            <option value="nota-asc">Nota (menor a mayor)</option>
            <option value="nombre-asc">Nombre (A–Z)</option>
          </select>
        </div>

        {/* =========================================
            LISTA DE EXPEDIENTES
        ========================================= */}

        <p
          style={{
            color: 'var(--muted)',
            fontSize: '0.9rem',
            marginBottom: '1rem'
          }}
        >
          Mostrando {listaFiltrada.length} de {EXPEDIENTES.length} expedientes
        </p>

        {listaFiltrada.length > 0 ? (
          <div className="grid-2">
            {listaFiltrada.map((alumno) => (
              <TarjetaExpediente
                key={alumno.id}
                alumno={alumno}
                seleccionado={seleccionado?.id === alumno.id}
                onSeleccionar={setSeleccionado}
              />
            ))}
          </div>
        ) : (
          // [TICKET 07] ESTADO VACÍO
          <div
            className="box box-warn"
            style={{ textAlign: 'center', padding: '1.5rem' }}
          >
            <h3>No se encontraron expedientes con esos criterios</h3>

            <p className="subtitle" style={{ marginTop: '0.5rem' }}>
              Prueba con otro nombre o modifica los filtros de búsqueda.
            </p>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setBusqueda('');
                setSoloAprobados(false);
              }}
            >
              Limpiar filtros
            </button>
          </div>
        )}

        <p className="file-hint">
          Archivo para mostrar en VS Code:{' '}
          <code className="code-inline">
            src/components/06_DemoIntegradora.jsx
          </code>
        </p>
      </section>
    </>
  );
}
