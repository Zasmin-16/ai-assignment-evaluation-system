import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import AdminLayout from "./layouts/AdminLayout";
import ProfessorLayout from "./layouts/ProfessorLayout";
import StudentLayout from "./layouts/StudentLayout";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminLayout />} />
        <Route path="/professor" element={<ProfessorLayout />} />
        <Route path="/student" element={<StudentLayout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
