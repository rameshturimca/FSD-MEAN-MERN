import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import ProductForm from "../components/ProductForm";


export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);


    useEffect(() => {
        api.get(`/products/${id}`).then((res) => setProduct(res.data.product));
    }, [id]);


    const submit = async (data) => {
        await api.put(`/products/${id}`, data);
        navigate("/products");
    };


    if (!product) return <p>Loading...</p>;


    return <ProductForm initialData={product} onSubmit={submit} />;
}