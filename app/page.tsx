"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

type Cliente = {
  rut: string;
  nombre: string;
  apellido: string;
  correo: string;
  celular: string;
};

type Barbero = {
  id_barbero: number;
  nombre: string;
  usuario: string;
  activo: boolean;
};

type Servicio = {
  id_servicio: number;
  nombre: string;
  duracion_min: number;
  precio: number;
};

type Cita = {
  id_cita: number;
  cliente_nombre: string;
  barbero_nombre: string;
  servicio_nombre: string;
  fecha_programada: string;
  estado: string;
};

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("clientes");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api${endpoint}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json();
      setData(Array.isArray(result) ? result : [result]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const endpoints: Record<string, string> = {
      clientes: "/clientes/",
      barberos: "/barberos/",
      servicios: "/servicios/",
      citas: "/citas/",
    };
    if (endpoints[activeSection]) {
      fetchData(endpoints[activeSection]);
    }
  }, [activeSection]);

  const renderTable = () => {
    if (loading) return <div>Cargando...</div>;
    if (error) return <div className="error"><h3>Error al cargar datos</h3><p>{error}</p></div>;
    if (data.length === 0) return <p>No hay datos disponibles</p>;

    switch (activeSection) {
      case "clientes":
        return (
          <table>
            <thead>
              <tr>
                <th>RUT</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Correo</th>
                <th>Celular</th>
              </tr>
            </thead>
            <tbody>
              {data.map((c: Cliente, idx) => (
                <tr key={idx}>
                  <td>{c.rut || ""}</td>
                  <td>{c.nombre || ""}</td>
                  <td>{c.apellido || ""}</td>
                  <td>{c.correo || ""}</td>
                  <td>{c.celular || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "barberos":
        return (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Activo</th>
              </tr>
            </thead>
            <tbody>
              {data.map((b: Barbero, idx) => (
                <tr key={idx}>
                  <td>{b.id_barbero || ""}</td>
                  <td>{b.nombre || ""}</td>
                  <td>{b.usuario || ""}</td>
                  <td>{b.activo ? "Sí" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "servicios":
        return (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Duración</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s: Servicio, idx) => (
                <tr key={idx}>
                  <td>{s.id_servicio || ""}</td>
                  <td>{s.nombre || ""}</td>
                  <td>{s.duracion_min || ""} min</td>
                  <td>${s.precio || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "citas":
        return (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Barbero</th>
                <th>Servicio</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((c: Cita, idx) => (
                <tr key={idx}>
                  <td>{c.id_cita || ""}</td>
                  <td>{c.cliente_nombre || ""}</td>
                  <td>{c.barbero_nombre || ""}</td>
                  <td>{c.servicio_nombre || ""}</td>
                  <td>{c.fecha_programada ? new Date(c.fecha_programada).toLocaleString() : ""}</td>
                  <td>{c.estado || ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case "agenda":
        return <p>Contenido de Agenda no implementado.</p>;
      default:
        return null;
    }
  };

  return (
    <>
      <header>
        <div className="header-top">
          <div className="brand">
            <h1>Barbería</h1>
            <p>Gestión Administrativa</p>
          </div>
        </div>
        <div className="hero">
          <div className="hero-content">
            <Image
              src="/barber-pole.svg"
              alt="Barber pole"
              width={120}
              height={120}
              className="hero-illustration"
            />
            <div>
              <h2>Tu salón, más organizado y con estilo</h2>
              <p className="hero-subtext">Administra clientes, barberos, citas y servicios.</p>
            </div>
          </div>
          <Image
            src="/hero-waves.svg"
            alt="ondas decorativas"
            width={420}
            height={200}
            className="hero-waves"
            aria-hidden="true"
          />
        </div>
      </header>
      <nav>
        <ul>
          <li>
            <a
              href="#"
              className={activeSection === "clientes" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection("clientes");
              }}
            >
              Clientes
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeSection === "barberos" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection("barberos");
              }}
            >
              Barberos
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeSection === "servicios" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection("servicios");
              }}
            >
              Servicios
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeSection === "citas" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection("citas");
              }}
            >
              Citas
            </a>
          </li>
          <li>
            <a
              href="#"
              className={activeSection === "agenda" ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection("agenda");
              }}
            >
              Agenda
            </a>
          </li>
        </ul>
      </nav>
      <main>
        <h2>{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</h2>
        <div id="list-container">{renderTable()}</div>
      </main>
      <footer>
        <p>&copy; 2025 Barbería. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}
