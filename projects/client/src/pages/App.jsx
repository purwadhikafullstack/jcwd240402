import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminHome from "./AdminHome";
import AdminLoginPage from "./AdminLogin";
import AdminRegister from "./RegisterForm";
import AdminList from "./AdminList";
import WarehouseList from "./WarehouseList";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/admin-dashboard" element={<AdminHome />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/list" element={<AdminList />} />
          <Route path="/warehouse/list" element={<WarehouseList />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
