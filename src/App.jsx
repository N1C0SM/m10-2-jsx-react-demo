
import { useState, useEffect } from 'react';

import SintaxisYFragmentos from './components/01_SintaxisYFragmentos.jsx';
import ExpresionesYEstilos from './components/02_ExpresionesYEstilos.jsx';
import RenderizadoCondicional from './components/03_RenderizadoCondicional.jsx';
import ListasYKeys from './components/04_ListasYKeys.jsx';
import EventosYSeguridadXSS from './components/05_EventosYSeguridadXSS.jsx';
import DemoIntegradora from './components/06_DemoIntegradora.jsx';

const SECCIONES = [
  { id: '01', titulo: '1. Sintaxis y Fragmentos', componente: SintaxisYFragmentos },
  { id: '02', titulo: '2. Expresiones y Estilos', componente: ExpresionesYEstilos },
  { id: '03', titulo: '3. Condicionales (y el 0)', componente: RenderizadoCondicional },
  { id: '04', titulo: '4. Listas y Keys', componente: ListasYKeys },
  { id: '05', titulo: '5. Eventos y XSS', componente: EventosYSeguridadXSS },
  { id: '06', titulo: '6. Demo Integradora', componente: DemoIntegradora }
];

export default function App() {
  const [activa, setActiva] = useState('01');

  // Recuperar tema guardado
  const [tema, setTema] = useState(
    () => localStorage.getItem('theme') || 'dark'
  );

  // Guardar preferencia
  useEffect(() => {
    localStorage.setItem('theme', tema);
  }, [tema]);

  // Alternar tema
  const cambiarTema = () => {
    setTema((temaActual) =>
      temaActual === 'dark' ? 'light' : 'dark'
    );
  };

  // Buscar sección activa
  const seccionActual = SECCIONES.find(
    (sec) => sec.id === activa
  );

  const ComponenteActivo = seccionActual.componente;

  return (
    <div className={`app ${tema}-mode`}>

      {/* HEADER */}
      <header className="header">
        <div className="header-info">
          <span className="header-tag">REACT · MÓDULO 10.2</span>

          <h1>JSX (JavaScript XML)</h1>

          <p>
            Demostración interactiva de React para exposición en clase.
          </p>
        </div>

        <button
          type="button"
          className="theme-toggle"
          onClick={cambiarTema}
          aria-label="Cambiar tema"
        >
          {tema === 'dark' ? (
            <>
              <span>☀️</span> Modo claro
            </>
          ) : (
            <>
              <span>🌙</span> Modo oscuro
            </>
          )}
        </button>
      </header>

      {/* NAVEGACIÓN */}
      <nav className="tabs" aria-label="Temas de JSX">
        {SECCIONES.map((sec) => (
          <button
            key={sec.id}
            type="button"
            className={`tab-btn ${activa === sec.id ? 'active' : ''}`}
            onClick={() => setActiva(sec.id)}
          >
            {sec.titulo}
          </button>
        ))}
      </nav>

      {/* CONTENIDO */}
      <main className="main-content">
        <ComponenteActivo />
      </main>

      {/* FOOTER CORPORATIVO */}
      <footer className="footer">
        <div>
          <strong>Nicolás San Marcos</strong>
          <p>Desarrollo de aplicaciones · Módulo 10.2 JSX</p>
        </div>

        <span>© {new Date().getFullYear()} · Todos los derechos reservados</span>
      </footer>

    </div>
  );
}
