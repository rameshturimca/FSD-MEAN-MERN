import api from "../services/api";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";


export default function AddProduct() {
const navigate = useNavigate();


const submit = async (data) => {
await api.post("/products", data);
navigate("/products");
};


return (
<ProductForm
initialData={{ name: "", price: "", description: "" }}
onSubmit={submit}
/>
);
}