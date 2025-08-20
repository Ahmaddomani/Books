import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spinner } from "./common/Spinner";
import Swal from "sweetalert2";
import NetworkError from "./common/NetworkError";
import Unauthorized from "./Unatuorized";

export const SingleBook = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);
  const [updatePopup, setUpdatePopup] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", photo: "" });
  const [saveing, setSaving] = useState(false);
  const [axiosError, setAxiosError] = useState(false);
  const navigator = useNavigate();

  const role = window.localStorage.getItem("role") || {};

  // ------------------------Delete Function Start-----------------------

  const deleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/books/${id}`, {
        withCredentials: true,
      });
      return true;
    } catch (error) {
      setAxiosError(error);
      return false;
    }
  };
  /// ------------------------Delete Function End-----------------------

  // -------------------------------- Handle Show Popup function Start --------------------------------
  const showPopup = () => {
    setForm({
      title: book.title || "",
      description: book.description || "",
      photo: book.photo || "",
    });
    setUpdatePopup(true);
  };
  // -------------------------------- Handle Show Popup function End --------------------------------

  // Handle Delete Function Start
  const handleDeleteFunc = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (await deleteBook(id)) {
          Swal.fire({
            title: "Deleted!",
            text: "The Book has been deleted.",
            icon: "success",
          });
          navigator("/");
        }
      } else {
        return <NetworkError />;
      }
    });
  };
  // Handle Delete Function End

  //handleChange Function Start
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  //handleChange Function End

  // handleSubmit Function Start
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await updateBook()) {
      updateBook();
      setUpdatePopup(false);
      setSaving(false);
    } else {
      setAxiosError(true);
    }
  };
  // handleSubmit Function End

  // ---------------------Get Book Function Start -----------------
  const getBook = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/books/${id}`, {
        withCredentials: true,
      });
      setBook(response.data.data);
    } catch (error) {
      setAxiosError(error);
    } finally {
      setLoading(false);
    }
  };
  // ---------------------Get Book Function End -----------------

  // ---------------------Update Book Function Start -----------------
  const updateBook = async () => {
    try {
      setSaving(true);
      const response = await axios.patch(
        `http://localhost:3000/books/${id}`,
        form,
        {
          withCredentials: true,
        }
      );
      const data = response.data.data;
      setBook({ ...book, ...data });
      return true;
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      return false;
    }
  };
  // ---------------------Update Book Function End -----------------

  useEffect(() => {
    getBook();
  }, []);

  if (loading) return <Spinner />;
  if (axiosError?.response?.status === 401) return <Unauthorized />;
  if (axiosError) return <NetworkError />;
  return (
    <div className="min-h-screen relative bg-gray-50 flex items-center justify-center py-10 px-5">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-md overflow-hidden flex flex-col md:flex-row">
        {/* Book Img */}
        <div className="md:w-1/3 flex items-center justify-center bg-gray-100 p-5">
          <img
            src={book.photo || "https://via.placeholder.com/200x300"}
            alt={book.title}
            className="rounded-lg shadow-lg object-cover h-[300px] w-[200px]"
          />
        </div>

        {/*  Details Book*/}
        <div className="md:w-2/3 p-6 flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-800">{book.title}</h1>
          <p className="text-gray-600">
            By: <span className="font-medium">{book.author}</span>
          </p>
          <p className="text-sm text-gray-500">Published: {book.publishYear}</p>
          <p className="text-sm text-gray-500">Language: {book.language}</p>
          <p className="text-sm text-gray-500">Pages: {book.pages}</p>
          <p className="text-sm text-gray-500">Rating: ⭐ {book.rating}</p>

          <p className="text-gray-700 leading-relaxed">{book.description}</p>

          {book.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {book.genres.map((genre, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-sm bg-indigo-100 text-indigo-600 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/*  Actions Buttons  */}
          {role === "admin" && (
            <div className="flex gap-3 mt-5">
              <button
                onClick={showPopup}
                className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  handleDeleteFunc(id);
                }}
                className="px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {updatePopup && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center z-50">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col bg-white rounded-2xl shadow-lg p-6 gap-4 w-[90%] max-w-md h-auto"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Update Book
            </h2>
            {Object.keys(book).map((key) => {
              if (key === "title" || key === "description" || key === "photo")
                return (
                  <div key={key} className="flex flex-col">
                    <label
                      className="mb-1 font-medium text-gray-700"
                      htmlFor={key}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      required
                      onChange={handleChange}
                      value={form[key]}
                      type="text"
                      name={key}
                      placeholder={`${
                        key == "photo" ? "new photo link" : `new ${key}`
                      }`}
                      className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                );
            })}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setUpdatePopup(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {saveing ? "...saving" : "save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
