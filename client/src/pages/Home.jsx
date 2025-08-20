import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Spinner } from "./common/Spinner";
import Unauthorized from "./Unatuorized";
import { useNavigate } from "react-router-dom";
import NetworkError from "./common/NetworkError";

//!----------------------------------------------------
//!----------------------------------------------------
export const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const container = useRef(null);
  const [viewOfContainer, setViewOfContainer] = useState(0);
  const navigator = useNavigate();

  //!----------------------------------------------------
  //!----------------------------------------------------

  // ? -------------------Scroll Behavior Function start -------------------
  const scrollToX = (dir) => {
    container.current.scrollBy({
      left: dir === "left" ? window.innerWidth : -window.innerWidth,
      behavior: "smooth",
    });
  };
  // ? -------------------Scroll Behavior Function end -------------------

  // ? ========================create Get Books Function Start =================
  const getBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/books", {
        withCredentials: true,
      });
      setBooks(response.data.data);
      response.data.data;
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  // ? ========================create Get Books Function End =================

  //!----------------------------------------------------
  useEffect(() => {
    getBooks();
  }, []);
  //! ----------------------------------------------------

  //? ----------------------------------------------------

  if (error?.response?.status === 401) return <Unauthorized />;
  if (loading) return <Spinner />;
  if (error) return <NetworkError />;

  return (
    <div className="p-5">
      <h1 className="text-3xl py-3 bg-clip-text text-transparent bg-gradient-to-tr from-green-400 to-blue-900 ">
        All Books
      </h1>
      <div
        onScroll={() => {
          setViewOfContainer(
            ((container.current.clientWidth +
              container.current.scrollLeft +
              20) /
              (270 * books.length)) *
              100
          );
          viewOfContainer;
        }}
        ref={container}
        style={{ scrollbarWidth: "none" }}
        onWheel={(e) => {
          e.currentTarget.scrollLeft += e.deltaY;
        }}
        className="flex xs:flex-col gap-5 md:flex-row w-full overflow-auto relative overflow-y-hidden "
      >
        <svg
          onClick={() => scrollToX("right")}
          title="backward"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`xs:hidden ${
            container.current?.scrollLeft > 13 ? "md:block" : "md:hidden"
          } size-12 fixed top-[200px] z-50 bg-slate-200 hover:bg-slate-400 duration-200 cursor-pointer  rounded-full p-2`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>

        <svg
          onClick={() => scrollToX("left")}
          title="forward"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={` xs:hidden md:${
            viewOfContainer >= 99 ? "hidden" : "block"
          } size-12 fixed top-[200px] right-4 z-50 bg-slate-200 hover:bg-slate-400 duration-200 cursor-pointer rounded-full p-2`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
        {books.map((book, index) => {
          return (
            <div
              onClick={() => navigator(`/book/${book._id}`)}
              key={index}
              className="min-w-[300px] border p-4 hover:bg-slate-300 hover:scale-105 cursor-pointer duration-150"
            >
              <img
                className=" object-contain max-h-[250px] w-full"
                src={book.photo}
                alt="The Godfather"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{book.title}</h2>
                <p className="text-gray-600 mb-2">{book.author}</p>
                <p className="text-gray-500 text-sm">{book.publishYear}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

//? ----------------------------------------------------
