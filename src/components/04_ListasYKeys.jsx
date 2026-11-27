
import { useState } from 'react';

// ============================================================================
// [CLAVE EXPOSICIÓN 4] RENDERIZADO DE LISTAS CON .map() Y LA PROP `key`
// ----------------------------------------------------------------------------
// 1. En JSX no se usan bucles `for`; se transforman arrays con `.map()`.
// 2. Cada elemento raíz devuelto dentro de `.map()` DEBE llevar una prop `key`
//    única y estable entre renderizados (normalmente un `id` de BD o UUID).
// 3. ¿POR QUÉ NO USAR EL ÍNDICE DEL ARRAY (`index`) COMO `key`?
//    Si reordenas, filtras o eliminas el primer elemento, todos los índices
//    cambian y React confunde el estado interno de cada fila.
// 4. FILTRADO CON .filter(): Permite buscar elementos según una condición.
// 5. CONTROL DE DUPLICADOS: Utilizamos toLowerCase() para comparar nombres
//    sin distinguir entre mayúsculas y minúsculas.
// ============================================================================

const MODULOS_INICIALES = [
  { id: 'di-01', codigo: 'DI', nombre: 'Desarrollo de Interfaces', horas: 120 },
  { id: 'psp-02', codigo: 'PSP', nombre: 'Programación de Servicios y Procesos', horas: 90 },
  { id: 'ad-03', codigo: 'AD', nombre: 'Acceso a Datos', horas: 120 }
];

export default function ListasYKeys() {
  const [modulos, setModulos] = useState(MODULOS_INICIALES);
  const [nuevoNombre, setNuevoNombre] = useState('');

  // [TICKET 05] ESTADOS DEL BUSCADOR Y LOS AVISOS
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');

  // [TICKET 05] AÑADIR MÓDULOS EVITANDO DUPLICADOS
  const agregarModulo = (e) => {
    e.preventDefault();

    const nombreLimpio = nuevoNombre.trim();

    if (!nombreLimpio) {
      setError('Escribe el nombre de un módulo.');
      return;
    }

    // Comparamos los nombres sin distinguir mayúsculas y minúsculas.
    const duplicado = modulos.some(
      (modulo) =>
        modulo.nombre.toLowerCase() === nombreLimpio.toLowerCase()
    );

    if (duplicado) {
      setError('Este módulo ya existe en la lista. No se permiten duplicados.');
      return;
    }

    const nuevo = {
      id: `mod-${Date.now()}`,
      codigo: 'OPT',
      nombre: nombreLimpio,
      horas: 60
    };

    // Insertamos al principio de la lista.
    setModulos((modulosActuales) => [nuevo, ...modulosActuales]);

    setNuevoNombre('');
    setError('');
  };

  const eliminarModulo = (idAEliminar) => {
    setModulos((modulosActuales) =>
      modulosActuales.filter((m) => m.id !== idAEliminar)
    );
  };

  const invertirOrden = () => {
    setModulos((modulosActuales) => [...modulosActuales].reverse());
  };

  // [TICKET 05] BUSCADOR EN TIEMPO REAL
  // Filtramos por nombre o código del módulo.
  const modulosFiltrados = modulos.filter((modulo) => {
    const textoBusqueda = busqueda.toLowerCase().trim();

    return (
      modulo.nombre.toLowerCase().includes(textoBusqueda) ||
      modulo.codigo.toLowerCase().includes(textoBusqueda)
    );
  });

  return (
    <section className="card">
      <h2>4. Listas Dinámicas con .map() y la prop key</h2>

      <p className="subtitle">
        Cada elemento de la lista utiliza{' '}
        <code className="code-inline">key=&#123;modulo.id&#125;</code> para
        que el algoritmo de reconciliación (Virtual DOM) identifique
        cambios con precisión.
      </p>

      {/* FORMULARIO PARA AÑADIR MÓDULOS */}

      <form
        onSubmit={agregarModulo}
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}
      >
        <input
          type="text"
          className="input"
          style={{
            flex: '1 1 260px',
            marginTop: 0
          }}
          placeholder="Añadir nuevo módulo al principio de la lista..."
          value={nuevoNombre}
          onChange={(e) => {
            setNuevoNombre(e.target.value);
            setError('');
          }}
        />

        <button type="submit" className="btn">
          Añadir módulo
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={invertirOrden}
        >
          Invertir orden
        </button>
      </form>

      {/* MENSAJE DE ERROR POR DUPLICADOS */}

      {error && (
        <p
          role="alert"
          style={{
            color: 'var(--red)',
            fontWeight: '600',
            marginTop: '0.75rem'
          }}
        >
          ⚠️ {error}
        </p>
      )}

      {/* [TICKET 05] BUSCADOR */}

      <div style={{ marginTop: '1.25rem' }}>
        <label htmlFor="buscador-modulos">
          Buscar módulo por nombre o código:
        </label>

        <input
          id="buscador-modulos"
          type="text"
          className="input"
          placeholder="Ej.: Desarrollo de Interfaces, DI, PSP..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* [TICKET 05] CONTADOR DINÁMICO */}

      <p
        style={{
          marginTop: '1rem',
          color: 'var(--muted)',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}
      >
        Mostrando {modulosFiltrados.length} de {modulos.length} módulos
      </p>

      {/* LISTA DINÁMICA CON .map() */}

      <ul className="list">
        {modulosFiltrados.map((modulo) => (
          // [CLAVE EXPOSICIÓN] La `key` va siempre en el elemento raíz del `.map()`
          <li key={modulo.id} className="list-item">
            <div>
              <span
                className="pill"
                style={{ marginRight: '0.6rem' }}
              >
                {modulo.codigo}
              </span>

              <strong>{modulo.nombre}</strong>

              <span
                style={{
                  color: 'var(--muted)',
                  marginLeft: '0.5rem',
                  fontSize: '0.85rem'
                }}
              >
                ({modulo.horas} h · key:{' '}
                <code className="code-inline">{modulo.id}</code>)
              </span>
            </div>

            <button
              type="button"
              className="btn btn-danger"
              onClick={() => eliminarModulo(modulo.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {/* ESTADO VACÍO */}

      {modulosFiltrados.length === 0 && (
        <p
          className="subtitle"
          style={{ marginTop: '0.75rem' }}
        >
          {modulos.length === 0
            ? 'No quedan módulos en la lista. Añade uno nuevo arriba.'
            : 'No se encontraron módulos con esa búsqueda.'}
        </p>
      )}

      <p className="file-hint">
        Archivo para mostrar en VS Code:{' '}
        <code className="code-inline">
          src/components/04_ListasYKeys.jsx
        </code>
      </p>
    </section>
  );
}
