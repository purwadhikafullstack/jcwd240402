import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarDesktop from "../components/NavbarDesktop";

function App() {
  return (
    <div className="App">
      <Router>
        <NavbarDesktop />
        <Routes>
          <Route />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
