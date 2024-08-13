
import '../src/assets/styles/app.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './pages/authentication/login';
import Addpatient from './pages/forms/addpatient';
import Dashboard from './pages/forms/dashboard';
import PrivateRoutes from './PrivateRoutes';


function App() {
  return (
    <div className="App">
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<PrivateRoutes/>}>
            <Route path="/dashboard" element={< Dashboard />} />
            <Route path="/addpatient" element={<Addpatient />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
