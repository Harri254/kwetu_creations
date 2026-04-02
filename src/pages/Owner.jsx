import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit, faImage,faTimes} from "@fortawesome/free-solid-svg-icons";
import book from '../assets/photos/book.jpg'
import coding from '../assets/photos/coding.jpg'
import design from '../assets/photos/design.jpg'
import light from '../assets/photos/i see the light.jpg'
import laptop from '../assets/photos/laptop.jpg'
import microphone from '../assets/photos/microphone.jpg'
import place from '../assets/photos/place.jpg'
import smile from '../assets/photos/smile.jpg'
import worker from '../assets/photos/worker.jpg'

// Dummy initial products for demonstration
const INITIAL_PRODUCTS = [
        { id: 1, image: book, price: 400, category: "latest" },
        { id: 6, image: design, price: 400, category: "latest" },
        { id: 5, image: coding, price: 400, category: "latest" },
        { id: 2, image: light, price: 500, category: "products" },
        { id: 3, image: laptop, price: 350, category: "products" },
        { id: 11, image: laptop, price: 350, category: "products" },
        { id: 4, image: microphone, price: 600, category: "products" },
        { id: 7, image: place, price: 500, category: "services" },
        { id: 8, image: smile, price: 350, category: "services" },
        { id: 12, image: smile, price: 350, category: "services" },
        { id: 10, image: worker, price: 600, category: "latest" },
    ];

function Owner() {
  const [savedItems, setSavedItems] = useState([]);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [previews, setPreviews] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Load Persistence
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("owner-items")) || [];
    setSavedItems(stored);
  }, []);

  // --- Handlers ---
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith("image/"));
    setSelectedFiles(files);
    setPreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleAdd = async () => {
    if (!category || !price || selectedFiles.length === 0) {
      alert("Missing details!"); return;
    }

    const newItems = await Promise.all(selectedFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve({
          id: Date.now() + Math.random(),
          image: reader.result,
          category,
          price: parseFloat(price)
        });
        reader.readAsDataURL(file);
      });
    }));

    const updated = [...savedItems, ...newItems];
    setSavedItems(updated);
    localStorage.setItem("owner-items", JSON.stringify(updated));
    resetForm();
  };

  const resetForm = () => {
    setCategory(""); setPrice(""); setSelectedFiles([]); setPreviews([]);
  };

  const handleDelete = (id) => {
    const updated = savedItems.filter(item => item.id !== id);
    setSavedItems(updated);
    localStorage.setItem("owner-items", JSON.stringify(updated));
  };

  const mergedItems = [
    ...INITIAL_PRODUCTS.map((a) => savedItems.find((s) => s.id === a.id) || a),
    ...savedItems.filter((s) => !INITIAL_PRODUCTS.find((a) => a.id === s.id)),
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 bg-gray-50 min-h-screen">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary">Admin Dashboard</h1>
        <p className="text-gray-500 mt-2">Manage your KwetuCreations Portfolio</p>
      </header>

      {/* Upload Section */}
      <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-12">
        <div className="flex items-center gap-3 mb-6 text-secondary">
          <FontAwesomeIcon icon={faPlus} className="text-xl" />
          <h2 className="text-2xl font-semibold text-primary">Add New Content</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input 
            type="text" placeholder="Category (e.g., Marketing)" 
            value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-secondary outline-none"
          />
          <input 
            type="number" placeholder="Price (KES)" 
            value={price} onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-secondary outline-none"
          />
        </div>

        <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center hover:border-secondary transition-colors relative">
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          <FontAwesomeIcon icon={faImage} className="text-4xl text-gray-300 mb-4" />
          <p className="text-gray-500">Drag and drop or <span className="text-secondary font-bold">browse images</span></p>
        </div>

        {previews.length > 0 && (
          <div className="flex gap-4 mt-6 overflow-x-auto pb-4">
            {previews.map((src, i) => (
              <img key={i} src={src} className="w-32 h-32 object-cover rounded-xl border shadow-sm" alt="Preview" />
            ))}
          </div>
        )}

        <div className="flex gap-4 mt-8">
          <button onClick={handleAdd} className="flex-1 bg-secondary text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all">Publish Item</button>
          <button onClick={resetForm} className="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">Clear</button>
        </div>
      </section>

      {/* Grid Section */}
      <h3 className="text-2xl font-bold text-primary mb-6 border-b pb-4">Current Templates</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mergedItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="h-48 overflow-hidden relative">
              <img src={item.image} className="w-full h-full object-cover" alt={item.category} />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingItem(item); setIsEditing(true); }} className="w-8 h-8 bg-white text-green-600 rounded-full shadow-md hover:bg-green-50"><FontAwesomeIcon icon={faEdit} size="sm"/></button>
                <button onClick={() => handleDelete(item.id)} className="w-8 h-8 bg-white text-red-600 rounded-full shadow-md hover:bg-red-50"><FontAwesomeIcon icon={faTrash} size="sm"/></button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs font-bold text-secondary uppercase mb-1">{item.category}</p>
              <p className="text-lg font-bold text-primary">KES {item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Owner;