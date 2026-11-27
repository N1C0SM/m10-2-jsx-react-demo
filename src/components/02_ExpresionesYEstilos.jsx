
import { useState } from 'react';

// ============================================================================
// [CLAVE EXPOSICIÓN 1] REGLAS SINTÁCTICAS FUNDAMENTALES DE JSX
// ----------------------------------------------------------------------------
// 1. UN SOLO ELEMENTO RAÍZ: Un componente debe devolver un único nodo padre.
//    Para evitar <div> innecesarios en el DOM, usamos Fragmentos: <> ... </>
// 2. CIERRE OBLIGATORIO: Etiquetas vacías como <input />, <br />, <hr />
//    SIEMPRE deben cerrarse con `/`.
// 3. PALABRAS RESERVADAS DE JS:
//    - En HTML: class="..."   -> En JSX: className="..."
//    - En HTML: for="..."     -> En JSX: htmlFor="..."
// 4. MAYÚSCULAS VS MINÚSCULAS:
//    - <button> (minúscula)   -> Etiqueta HTML nativa
//    - <EtiquetaInfo /> (May) -> Componente personalizado de React
// ============================================================================

// Pequeño componente auxiliar (obligatoriamente empieza en MAYÚSCULA)
function EtiquetaInfo({ texto }) {
  return <span className="pill">{texto}</span>;
}

export default function SintaxisYFragmentos() {

  // [TICKET 02] ESTADO DEL INPUT
  // useState guarda el nombre que escribe el usuario.
  const [nombre, setNombre] = useState('');

  // Comprobamos si el nombre tiene al menos 3 caracteres.
  const nombreLimpio = nombre.trim();
  const nombreValido = nombreLimpio.length >= 3;

  // Mostramos error si ha escrito algo pero no llega a 3 caracteres.
  const mostrarError = nombre.length > 0 && !nombreValido;

  // Este bloque demuestra el uso de Fragment (<>...</>):
  // Si inspeccionas el DOM en el navegador (F12), verás que el Fragment
  // NO crea ningún <div> extra envolviendo las tarjetas.

  return (
    <>
      <section className="card">
        <h2>1. Reglas Sintácticas y Fragmentos (&lt;&gt;...&lt;/&gt;)</h2>

        <p className="subtitle">
          JSX parece HTML, pero se compila a llamadas de JavaScript (
          <code className="code-inline">_jsx()</code>).
          Por eso es más estricto que HTML5.
        </p>

        <div className="grid-2">

          {/* =========================================
              EJEMPLO 1: ATRIBUTOS Y VALIDACIÓN
          ========================================= */}

          <div className="box box-success">
            <h3>Atributos adaptados a JavaScript</h3>

            {/* Comentario en JSX: siempre entre llaves y sintaxis de bloque JS */}

            <label htmlFor="campo-alumno">
              Nombre del alumno (
              <code className="code-inline">htmlFor</code>
              {' '}en lugar de{' '}
              <code className="code-inline">for</code>):
            </label>

            {/* [TICKET 02] INPUT CONTROLADO */}
            <input
              id="campo-alumno"
              type="text"
              className="input"
              placeholder="Ej.: Elena Martínez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              aria-invalid={mostrarError}
              aria-describedby="mensaje-validacion"
            />

            {/* [TICKET 02] VALIDACIÓN DEL NOMBRE */}

            {mostrarError && (
              <p
                id="mensaje-validacion"
                role="alert"
                style={{
                  color: 'var(--red)',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  marginTop: '0.6rem'
                }}
              >
                ⚠️ Error: El nombre debe tener al menos 3 caracteres.
              </p>
            )}

            {/* [TICKET 02] SALUDO PERSONALIZADO */}

            {nombreValido && (
              <p
                style={{
                  color: 'var(--green)',
                  fontWeight: '600',
                  marginTop: '0.6rem'
                }}
              >
                ¡Bienvenido/a al portal, {nombreLimpio}!
              </p>
            )}

            {/* MENSAJE INICIAL */}

            {nombre.length === 0 && (
              <p
                style={{
                  color: 'var(--muted)',
                  fontSize: '0.85rem',
                  marginTop: '0.5rem'
                }}
              >
                Introduce al menos 3 caracteres.
              </p>
            )}
          </div>

          {/* =========================================
              EJEMPLO 2: COMPONENTES PERSONALIZADOS
          ========================================= */}

          <div className="box box-warn">
            <h3>Componentes en Mayúscula vs. HTML</h3>

            <p style={{
              marginBottom: '0.75rem',
              color: 'var(--muted)',
              fontSize: '0.9rem'
            }}>
              Abajo renderizamos un componente propio{' '}
              <code className="code-inline">
                &lt;EtiquetaInfo /&gt;
              </code>:
            </p>

            <EtiquetaInfo texto="Componente con inicial Mayúscula" />

            <br />
            <br />

            <small style={{ color: 'var(--muted)' }}>
              Nota: los saltos de línea anteriores usan{' '}
              <code className="code-inline">&lt;br /&gt;</code> cerrado.
            </small>
          </div>

        </div>

        {/* INFORMACIÓN DEL ARCHIVO */}

        <p className="file-hint">
          Archivo para mostrar en VS Code:{' '}
          <code className="code-inline">
            src/components/01_SintaxisYFragmentos.jsx
          </code>
        </p>

      </section>
    </>
  );
}
