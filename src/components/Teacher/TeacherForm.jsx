import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  UserCheck,
  UserPlus,
  UserRoundMinus,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const TeacherForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { token, institution } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
  });



  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;



  useEffect(() => {
    if (isEdit) {
      fetch(`${API_URL}api/teacher/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {

          if (!data) {
            setNotFound(true);
            return;
          }
          setFormData({
            name: data.name,
            phone_number: data.phone_number,
            email: data.email,
          });
        })
        .catch((err) => {
          console.error("Error al cargar profesor:", err);
          setNotFound(true);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `${API_URL}api/teacher/${id}` : `${API_URL}api/teacher`;
    console.log(API_URL)
    const payload = {
      phone_number: formData.phone_number,
      name: formData.name,
      email: formData.email,
      password: '1234'
    };

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      console.log(res.message)
      if (!res.ok) throw new Error("Error en la operación");
      navigate("/teachers");
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${API_URL}/profesores/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/teachers");
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  if (loading) return <p className="text-gray-600 mt-4">Cargando datos...</p>;

  if (notFound) {
    return (
      <div className="text-red-600 mt-4 font-semibold">
        No se encontró el profesor solicitado.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-6">
      <h1 className="text-xl font-semibold text-blue-700 mb-4">
        {isEdit ? "Editar Profesor" : "Agregar Profesor"} {formData.name}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Telefono"
          value={formData.phone_number}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-3"
        />

        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            {isEdit ? <UserCheck /> : <UserPlus />}
          </button>
          <button
            type="button"
            onClick={() => navigate("/teachers")}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            <X />
          </button>
        </div>

        {isEdit && (
          <div className="mt-6 border-t pt-4">
            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                <UserRoundMinus />
              </button>
            ) : (
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-600">
                  Para confirmar la eliminación, escribe <strong>{formData.nom}</strong>:
                </p>
                <input
                  type="text"
                  value={deleteInput}
                  onChange={(e) => setDeleteInput(e.target.value)}
                  className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                />
                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={deleteInput !== formData.nom}
                    onClick={handleDelete}
                    className={`px-4 py-2 rounded-lg text-white ${deleteInput === formData.nom
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-gray-300 cursor-not-allowed"
                      }`}
                  >
                    Confirmar eliminación
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteInput("");
                    }}
                    className="text-sm underline text-gray-600 hover:text-gray-800"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default TeacherForm;