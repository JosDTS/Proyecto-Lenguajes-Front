import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";
import { useAuth } from "../context/AuthContext";
import usePaginatedFetch from "../hooks/usePaginatedFetch";
import SearchBar from "../SearchBar";

import {
  UserCog,
  ArrowBigRight,
  ArrowBigLeft,
  UserPlus,
  Rows3
} from "lucide-react";

const Teachers = () => {
  const { searchTerm, setSearchTitle, setSearchTerm } = useContext(SearchContext);
  const { token, user } = useAuth();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(() => user?.paginacion || 10);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  // Establecer título para SearchBar
  useEffect(() => {
    setSearchTitle("Profesores");
  }, [setSearchTitle]);

  // Resetear página a 1 cuando cambie búsqueda
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const queryValue = searchTerm ? `?value=${encodeURIComponent(searchTerm)}` : "";

  // Hook personalizado con paginación y búsqueda
  const { data: teachers = [], totalPages = 1, loading, error } = usePaginatedFetch({
    url: `${API_URL}api/teacher${queryValue}`,
    token,
    searchTerm,
    page,
    pageSize,
  });

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este profesor?")) return;

    try {
      await fetch(`${API_URL}api/teacher/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Re-fetch automático en el hook por dependencias
    } catch (error) {
      console.error("Error al eliminar profesor:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="flex justify-between items-center mb-4 ">
          <button
            onClick={() => navigate("/teachers/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <UserPlus />
          </button>
        </div>
        <table className="min-w-full border text-left text-sm border-gray-300">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border border-gray-300 w-2/12">Id</th>
              <th className="px-4 py-2 border border-gray-300 w-4/12">Correo</th>
              <th className="px-4 py-2 border border-gray-300 w-4/12">Nombre</th>
              <th className="px-4 py-2 border border-gray-300 w-2/12 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(pageSize || 4)].map((_, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="px-4 py-2 border border-gray-300 text-gray-600"></td>
                <td className="px-4 py-2 border border-gray-300 font-medium text-gray-800"></td>
                <td className="px-4 py-2 border border-gray-300 font-medium text-gray-800"></td>
                <td className="px-4 py-2 border border-gray-300 text-center"></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="text-lg">
      {/* Barra de búsqueda */}
      <SearchBar
        searchTitle="Profesores"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div className="flex justify-between items-center my-4">
        <button
          onClick={() => navigate("/teachers/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <UserPlus />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-left text-sm border-gray-300">
          <thead className="bg-blue-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 border border-gray-300 w-2/12">Id</th>
              <th className="px-4 py-2 border border-gray-300 w-4/12">Correo</th>
              <th className="px-4 py-2 border border-gray-300 w-4/12">Nombre</th>
              <th className="px-4 py-2 border border-gray-300 w-2/12 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher, index) => (
              <tr
                key={teacher.id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="px-4 py-2 border border-gray-300 text-gray-600">
                  {teacher.id}
                </td>
                <td className="px-4 py-2 border border-gray-300 font-medium text-gray-800">
                  {teacher.email}
                </td>
                <td className="px-4 py-2 border border-gray-300 font-medium text-gray-800">
                  {teacher.name}
                </td>
                <td className="px-4 py-2 border border-gray-300 space-x-2 text-center">
                  <button
                    onClick={() => navigate(`/teachers/edit/${teacher.id}`)}
                    className="text-blue-600 hover:underline"
                  >
                    <UserCog size={16} />
                  </button>
                  <button
                    onClick={() => navigate(`/teachers/teacherGroups/${teacher.doc}`)}
                    className="text-blue-600 hover:underline"
                  >
                    <Rows3 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          <ArrowBigLeft />
        </button>
        <span className="text-gray-700">
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          <ArrowBigRight />
        </button>
      </div>
    </div>
  );
};

export default Teachers;
