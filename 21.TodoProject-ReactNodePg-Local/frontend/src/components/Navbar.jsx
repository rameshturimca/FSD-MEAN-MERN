import { Link } from "react-router-dom";
import "./Navbar.css";


export default function Navbar() {
    return (
        <nav className="nav">
            <h2>Product App</h2>
            <div>
                <Link to="/">Login</Link>
                <Link to="/register">Register</Link>
                
                
                <Link to="/products">Products</Link>
                
            </div>
        </nav>
    );
}