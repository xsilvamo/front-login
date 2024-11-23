import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components_login/layout'; // Layout para login
import Login from './components_login/login'; //Login para estudiante
import Register from './components_login/register'; //Register para estudiante
import LoginEm from './components_login/login_em'; //Login para empresa
import RegisterEm from './components_login/register_em'; //Register para empresa
import CompleteProfile from './components_login/complete_profile';
import PasswordResetForm from './components_login/password_recovery';

import UserProfile from './components_profile/user-profile';
import EditProfile from './components_profile/edit-profile';
import Logout from './components_profile/logout';
import Layout2 from './components_profile/layout2'; // Layout para el resto de cosas 

import LogoutEm from './components_crud/logout-em';
import Layout3 from './components_crud/layout3'; // Nuevo Layout3
import Cpractica from './components_crud/cpractica'; // Componente para crear prácticas
import Rpractica from './components_crud/rpractica'; // Componente para que los estudiantes lean prácticas
import Dpractica from './components_crud/dpractica'; // Componente para eliminar y editar prácticas
import Gpracticas from './components_crud/gpracticas'; // Componente para que las empresas lean prácticas

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas con el primer Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="login_em" element={<LoginEm />} />
          <Route path="register_em" element={<RegisterEm />} />
          <Route path="complete_profile" element={<CompleteProfile />} />
          <Route path="password_recovery" element={<PasswordResetForm />} />


        </Route>

        {/* Rutas con el segundo Layout (Layout2) */}
        <Route path="/user-profile" element={<Layout2><UserProfile /></Layout2>} />
        <Route path="/edit-profile" element={<Layout2><EditProfile /></Layout2>} />
        <Route path="/logout" element={<Layout2><Logout /></Layout2>} />
        <Route path="/rpractica" element={<Layout2><Rpractica /></Layout2>} />


        {/* Rutas CRUD para las prácticas utilizando Layout3 */}
        <Route path="/cpractica" element={<Layout3><Cpractica /></Layout3>} />
        <Route path="/upractica" element={<Layout3><Dpractica /></Layout3>} />
        <Route path="/gpracticas" element={<Layout3><Gpracticas /></Layout3>} />
        <Route path="/logout-em" element={<Layout3><LogoutEm /></Layout3>} />

      </Routes>
    </Router>
  );
}

export default App;
