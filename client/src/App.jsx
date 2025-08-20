import { Route, Routes } from "react-router-dom";
import { CreateBook } from "./pages/CreateBook";
import { Home } from "./pages/Home";
import { ShowBook } from "./pages/ShowBook";
import { EditBook } from "./pages/EditBook";
import { DeleteBook } from "./pages/DeleteBook";
import NotFound from "./pages/common/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Unauthorized from "./pages/Unatuorized";
import { SingleBook } from "./pages/SingleBook";

function App() {
  return (
    <>
      <div className="text-red-500"></div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/show-book" element={<ShowBook />} />
        <Route path="/createBook" element={<CreateBook />} />
        <Route path="/edit-book/:id" element={<EditBook />} />
        <Route path="/delete-book" element={<DeleteBook />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/book/:id" element={<SingleBook />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
