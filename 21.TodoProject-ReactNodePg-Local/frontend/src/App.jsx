
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Navbar from "./components/Navbar";
import { useState } from "react";


export default function App() {
    
    return (
        <>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/add" element={<AddProduct />} />
                <Route path="/products/edit/:id" element={<EditProduct />} />
            </Routes>
        </>
    );
}