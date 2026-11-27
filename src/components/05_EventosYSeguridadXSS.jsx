
import { useState } from 'react';

// ============================================================================
// [CLAVE EXPOSICIÓN 5] EVENTOS EN JSX Y SEGURIDAD AUTOMÁTICA CONTRA XSS
// ----------------------------------------------------------------------------
// 1. EVENTOS:
//    - En HTML: onclick="saludar()" (cadena de texto).
//    - En JSX:  onClick={saludar}   (referencia a función en camelCase).
//    - Si necesita argumentos: onClick={() => saludar('DAM2')}.
//    - ¡ERROR TÍPICO!: escribir onClick={saludar('DAM2')} ejecuta la función
//      inmediatamente al renderizar, no al hacer clic.
// 2. PREVENCIÓN DE XSS (Cross-Site Scripting):
//    - JSX escapa automáticamente cualquier cadena insertada dentro de { }.
//    - React muestra el HTML malicioso como texto plano sin ejecutarlo.
// 3. HISTORIAL DE EVENTOS:
//    - Utilizamos arrays y .map() para representar los últimos eventos.
//    - Cada elemento tiene una key única.
// ============================================================================

export default function EventosYSeguridadXSS() {

  // [TICKET 06] HISTORIAL DE LOS ÚLTIMOS 5 EVENTOS
  const [historialEventos, setHistorialEventos] = useState([]);

  const [entradaUsuario, setEntradaUsuario] = useState(
    `<img src=x onerror="alert('Ataque XSS')" /> <script>alert('Hack')</script>`
  );

  // Registrar eventos y conservar únicamente los últimos 5.
  const registrarEvento = (descripcion) => {
    const nuevoEvento = {
      id: `${Date.now()}-${Math.random()}`,
      descripcion: `${descripcion} · ${new Date().toLocaleTimeString()}`
    };

    setHistorialEventos((historialActual) =>
      [nuevoEvento, ...historialActual].slice(0, 5)
    );
  };

  // Manejador sin parámetros.
  const manejarClickSimple = () => {
    registrarEvento('Clic simple registrado');
  };

  // Manejador con parámetros.
  const manejarConParametro = (accion) => {
    registrarEvento(`Acción ejecutada con parámetro: "${accion}"`);
  };

  // [TICKET 06] CARGAR PAYLOADS XSS DE PRUEBA
  // Son cadenas de texto para comprobar el escapado automático de React.
  const cargarPayload = (payload, nombre) => {
    setEntradaUsuario(payload);
    registrarEvento(`Payload de prueba cargado: ${nombre}`);
  };

  // Limpiar el historial de eventos.
  const limpiarHistorial = () => {
    setHistorialEventos([]);
  };

  return (
    <section className="card">
      <h2>5. Manejo de Eventos y Protección Nativa contra XSS</h2>

      <p className="subtitle">
        Prueba los botones de eventos y comprueba cómo JSX neutraliza
        automáticamente código HTML/JS malicioso.
      </p>

      <div className="grid-2">

        {/* =========================================
            EJEMPLO 1: EVENTOS E HISTORIAL
        ========================================= */}

        <div className="box box-success">
          <h3>Sintaxis de Eventos (Synthetic Events)</h3>

          <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
            Pulsa los botones para registrar acciones en el historial.
          </p>

          <div className="btn-row">

            {/* Referencia directa a la función */}

            <button
              type="button"
              className="btn"
              onClick={manejarClickSimple}
            >
              onClick=&#123;fn&#125;
            </button>

            {/* Función flecha para pasar argumentos */}

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => manejarConParametro('Exportar PDF')}
            >
              onClick=&#123;() =&gt; fn(arg)&#125;
            </button>

          </div>

          {/* [TICKET 06] HISTORIAL DE EVENTOS */}

          <h3 style={{ marginTop: '1.25rem' }}>
            Historial de los últimos 5 eventos
          </h3>

          {historialEventos.length > 0 ? (
            <ul className="list">
              {historialEventos.map((evento) => (
                <li key={evento.id} className="list-item">
                  <span>{evento.descripcion}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p
              className="subtitle"
              style={{ marginTop: '0.75rem' }}
            >
              Todavía no hay eventos registrados.
            </p>
          )}

          {/* BOTÓN LIMPIAR HISTORIAL */}

          <div className="btn-row">
            <button
              type="button"
              className="btn btn-danger"
              onClick={limpiarHistorial}
              disabled={historialEventos.length === 0}
            >
              Limpiar historial
            </button>
          </div>
        </div>

        {/* =========================================
            EJEMPLO 2: PROTECCIÓN XSS
        ========================================= */}

        <div className="box box-warn">
          <h3>Escapado automático contra XSS</h3>

          <label htmlFor="xss-input">
            Introduce HTML o un payload XSS:
          </label>

          <input
            id="xss-input"
            type="text"
            className="input"
            value={entradaUsuario}
            onChange={(e) => setEntradaUsuario(e.target.value)}
          />

          {/* [TICKET 06] BOTONES DE PAYLOADS DE PRUEBA */}

          <h3 style={{ marginTop: '1rem' }}>
            Cargar payload XSS de prueba
          </h3>

          <div className="btn-row">

            <button
              type="button"
              className="btn"
              onClick={() =>
                cargarPayload(
                  `<script>alert('Ataque XSS')</script>`,
                  'Script'
                )
              }
            >
              Prueba 1: Script
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() =>
                cargarPayload(
                  `<img src=x onerror="alert('XSS')">`,
                  'Imagen'
                )
              }
            >
              Prueba 2: Imagen
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={() =>
                cargarPayload(
                  `<a href="javascript:alert('XSS')">Haz clic aquí</a>`,
                  'Enlace'
                )
              }
            >
              Prueba 3: Enlace
            </button>

          </div>

          {/* SALIDA SEGURA */}

          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.65rem',
              backgroundColor: 'var(--surface-alt)',
              borderRadius: '8px',
              fontFamily: 'Consolas, monospace',
              fontSize: '0.85rem',
              wordBreak: 'break-all',
              color: 'var(--text)'
            }}
          >
            <strong>Salida renderizada segura:</strong>
            <p style={{ marginTop: '0.5rem' }}>
              {entradaUsuario}
            </p>
          </div>

          <p
            style={{
              color: 'var(--green)',
              fontSize: '0.85rem',
              marginTop: '0.75rem',
              fontWeight: '600'
            }}
          >
            ✓ React muestra estas cadenas como texto, no como HTML ejecutable.
          </p>

        </div>

      </div>

      <p className="file-hint">
        Archivo para mostrar en VS Code:{' '}
        <code className="code-inline">
          src/components/05_EventosYSeguridadXSS.jsx
        </code>
      </p>
    </section>
  );
}
