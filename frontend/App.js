import React, { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState("");

  const fetchProducts = () => {
    fetch(process.env.REACT_APP_API_URL + "/api/products")
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = () => {
    if (!newProduct.trim()) return;
    fetch(process.env.REACT_APP_API_URL + "/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newProduct })
    })
      .then(res => {
        if (res.ok) {
          setNewProduct("");
          fetchProducts();
        } else {
          alert("Error adding product");
        }
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ fontFamily: "sans-serif", textAlign: "center", marginTop: "2rem" }}>
      <h1>3-Tier Azure POC</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter product name"
          value={newProduct}
          onChange={e => setNewProduct(e.target.value)}
          style={{ padding: "0.5rem", width: "200px" }}
        />
        <button
          onClick={addProduct}
          style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}
        >
          Add
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {products.map(p => (
          <li key={p.ProductID}>{p.ProductName}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
