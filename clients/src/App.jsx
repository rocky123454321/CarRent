// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // fixed import
import { useEffect , useState } from "react";
import axios from "axios"; // import axios
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Register';
import Home from './pages/Home';

function App() {
const [User , setUser] = useState(null)
  // Fetch current user if token exists
  console.log(User)
  const fetchUser = async () => {
    const token = localStorage.getItem("token"); // fixed case
    if (token) {
      try {
        const res = await axios.get('/api/users/me', { // endpoint correct
          headers: {
            Authorization: `Bearer ${token}` // fixed header
          }
        });
       setUser(res.data)
      } catch (err) {
        console.error('Error fetching user:', err.response || err);
      }
    }
  };

  // Run on component mount
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login setUser={setUser}/>} />
        <Route path="/signup" element={<Signup setUser={setUser}/>} />
        <Route path="/shop" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;