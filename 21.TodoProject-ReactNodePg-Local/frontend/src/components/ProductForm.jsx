import { useState } from "react";
import "./ProductForm.css";


export default function ProductForm({ initialData, onSubmit }) {
    const [form, setForm] = useState(initialData);


    return (
        <div className="form-container">
            <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
            />


            <input
                placeholder="Price"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
            />


            <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
            />


            <button onClick={() => onSubmit(form)}>Submit</button>
        </div>
    );
}