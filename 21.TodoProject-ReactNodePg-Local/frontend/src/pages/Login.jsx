

import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import './Login.css'


export default function Login() {
    const navigate = useNavigate();
    const [data, setData] = useState({ username: "", password: "" });


    const handleLogin = async () => {
        await api.post("/users/login", data);
    
        navigate("/products");
    };


    return (
        <div className="form-container">
            <h2>Login</h2>
            <input
                placeholder="Username"
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
            />
            <input
                placeholder="Password"
                type="password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
            />


            <button onClick={handleLogin}>Login</button>
        </div>
    );
}