import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Products.css";




export default function Products() {
    const [products, setProducts] = useState([]);


    const loadProducts = async () => {
        const res = await api.get("/products");
        console.log(res)
        setProducts(res.data.products);
    };


    const deleteProduct = async (id) => {
        await api.delete(`/products/${id}`);
        loadProducts();
    };


    useEffect(() => {
        loadProducts();
    }, []);


    return (
        <div className="table-container">
            <div className="header-row">
                <h2>Products</h2>
                <Link to="/products/add" className="add-btn">Add Product</Link>
            </div>


            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            <td>{p.price}</td>
                            <td>{p.description}</td>
                            <td>
                                <Link to={`/products/edit/${p.id}`}>Edit</Link>
                                <button onClick={() => deleteProduct(p.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}