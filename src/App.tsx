import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Services from './pages/Services';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ProjectsAdmin from './pages/admin/ProjectsAdmin';
import ServicesAdmin from './pages/admin/ServicesAdmin';
import AboutAdmin from './pages/admin/AboutAdmin';
import ContactAdmin from './pages/admin/ContactAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/projetos" element={<Projects />} />
        <Route path="/servicos" element={<Services />} />
        <Route path="/contato" element={<Contact />} />
        
        {/* Admin Routes */}
        <Route path="/admin-acesso-privado" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/projetos" element={<ProjectsAdmin />} />
        <Route path="/admin/servicos" element={<ServicesAdmin />} />
        <Route path="/admin/sobre" element={<AboutAdmin />} />
        <Route path="/admin/contato" element={<ContactAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
