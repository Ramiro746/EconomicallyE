import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Pages/Homepage.jsx';
import Perfil from './Pages/UserProfile.jsx';
import Login from './Components/Login/LoginForm';
import Register from './Components/Register/Register';
import FormUser from './Components/FormUser/FormUser';
import AdviceForm from "./Components/AdviceForm.jsx";
import LoginForm from "./Components/Login/LoginForm";
import FinancialDashboard from "./Components/FinancialDashboard.jsx"; // crea este si aún no lo tienes

function App() {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<Homepage />} />
                <Route path="/perfil/:userId" element={<Perfil />} />
                {/*<Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<Register />} />
                <Route path="/formuser" element={<FormUser />} />*/}
                <Route path="/advice-form" element={<FinancialDashboard />} /> {/* Ruta para AdviceForm */}

                {/* Agrega más rutas aquí si tienes más vistas */}
            </Routes>
        </Router>
    );
}

String.prototype.capitalize = function () {}

export default App;
