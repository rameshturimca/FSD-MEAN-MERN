import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";


export default function Register() {
const navigate = useNavigate();
const [data, setData] = useState({ name: "", username: "", password: "" });


const handleRegister = async () => {
await api.post("/users/register", data);
navigate("/");
};


return (
<div className="form-container">
<h2>Register</h2>


<input
placeholder="Name"
value={data.name}
onChange={(e) => setData({ ...data, name: e.target.value })}
/>


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


<button onClick={handleRegister}>Register</button>
</div>
);
}