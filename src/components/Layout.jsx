import { useState, useEffect } from 'react';
import { useAuth } from "./context/AuthContext";
import Header from './Header';
import SideBar from './SideBar';
import Breadcrumbs from './Breadcrumbs';
import { Outlet } from 'react-router-dom';
import { Menu } from "lucide-react";

export const DEFAULT_THEME = "bg-gray-100";

const Layout = () => {
  const { user } = useAuth();
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(window.innerWidth < 768);
  const [darkMode, setDarkMode] = useState(false);
  const backgroundTheme = user?.conf_tema || DEFAULT_THEME;

  // Alternar tema claro/oscuro
  const toggleDarkMode = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setDarkMode(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setDarkMode(true);
    }
  };

  // Al cargar, respetar preferencia guardada
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  // Minimizar o restaurar barra lateral en función del ancho
  const toggleSidebar = () => setIsSidebarMinimized((prev) => !prev);

  useEffect(() => {
    const resetSidebarOnResize = () => {
      if (window.innerWidth >= 768 && isSidebarMinimized) {
        setIsSidebarMinimized(false);
      } else if (window.innerWidth < 768 && !isSidebarMinimized) {
        setIsSidebarMinimized(true);
      }
    };

    window.addEventListener("resize", resetSidebarOnResize);
    return () => window.removeEventListener("resize", resetSidebarOnResize);
  }, [isSidebarMinimized]);

  return (
    <div className={`flex min-h-screen ${backgroundTheme}`}>
      <SideBar isMinimized={isSidebarMinimized} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarMinimized ? 'ml-20' : 'ml-64'} md:ml-0`}>
        {/* Botón de menú solo en móviles */}
        <div className="md:hidden bg-white shadow-md p-2">
          <button onClick={toggleSidebar} className="text-gray-700">
            <Menu size={24} />
          </button>
        </div>

        {/* Encabezado */}
        <Header 
          className={`${backgroundTheme}`}
          toggleDarkMode={toggleDarkMode}
          darkMode={darkMode}
        />

        {/* Migas de pan */}
        <Breadcrumbs />

        {/* Área principal de contenido */}
        <main className="flex-grow p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

