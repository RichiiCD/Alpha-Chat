import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Components/ProtectedRoute";
import ChatApp from "./Components/ChatApp/ChatApp";
import Login from "./Components/Login/Login";
import Signup from "./Components/Signup/Signup";



function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route element={<ProtectedRoute />} >
                    <Route path="/" element={<ChatApp />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default App