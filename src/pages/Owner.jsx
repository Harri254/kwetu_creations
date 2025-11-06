import { useState, useEffect } from "react";
import book from "../assets/photos/book.jpg";
import coding from "../assets/photos/coding.jpg";

function Owner() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [savedItems, setSavedItems] = useState([]);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingCategory, setEditingCategory] = useState("");
  const [editingPrice, setEditingPrice] = useState("");
  const [editingPreview, setEditingPreview] = useState(null);
  const [editingFile, setEditingFile] = useState(null);

  // Dummy initial products
  const all = [
    { id: 1, image: book, price: 400, category: "brands" },
    { id: 2, image: coding, price: 500, category: "motion" },
    { id: 3, image: book, price: 350, category: "marketing" },
    { id: 4, image: coding, price: 600, category: "poster" },
  ];

  // Load stored items from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("owner-items")) || [];
    setSavedItems(stored);
  }, []);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setSelectedFiles(imageFiles);

    const urls = imageFiles.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
  };

  const handleAdd = () => {
    if (!category || !price || selectedFiles.length === 0) {
      alert("Please select category, price and at least one image");
      return;
    }

    // Convert files to data URLs for persistence
    const readers = selectedFiles.map(
      (file) =>
        new Promise((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result);
          r.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((dataUrls) => {
      const newItems = dataUrls.map((dataUrl, i) => ({
        id: Date.now() + i,
        image: dataUrl,
        category,
        price: parseFloat(price),
      }));

      const updatedList = [...savedItems, ...newItems];
      setSavedItems(updatedList);
      localStorage.setItem("owner-items", JSON.stringify(updatedList));

      // Reset form
      setCategory("");
      setPrice("");
      setSelectedFiles([]);
      setPreviews([]);
      alert("Images added successfully");
    });
  };

  const handleDelete = (id) => {
    const updated = savedItems.filter((item) => item.id !== id);
    setSavedItems(updated);
    localStorage.setItem("owner-items", JSON.stringify(updated));
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    setPreviews([]);
    setCategory("");
    setPrice("");
  };

  // Start editing an item
  const startEdit = (item) => {
    setIsEditing(true);
    setEditingItem(item);
    setEditingCategory(item.category || "");
    setEditingPrice(String(item.price || ""));
    setEditingPreview(item.image || null);
    setEditingFile(null);
  };

  // Handle file selection inside edit modal
  const handleEditFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setEditingFile(file);
    setEditingPreview(URL.createObjectURL(file));
  };

  // Save updates (if item exists in savedItems update it else add edited version to savedItems)
  const handleSaveUpdate = () => {
    if (!editingItem) return;
    const doUpdate = (imageData) => {
      const updatedItem = {
        ...editingItem,
        category: editingCategory,
        price: parseFloat(editingPrice) || 0,
        image: imageData ?? editingPreview,
      };

      // If item exists in savedItems replace it, otherwise add it (override initial 'all' entry)
      const existsIndex = savedItems.findIndex((it) => it.id === editingItem.id);
      let updatedList;
      if (existsIndex >= 0) {
        updatedList = [...savedItems];
        updatedList[existsIndex] = updatedItem;
      } else {
        updatedList = [...savedItems, updatedItem];
      }

      setSavedItems(updatedList);
      localStorage.setItem("owner-items", JSON.stringify(updatedList));
      setIsEditing(false);
      setEditingItem(null);
      setEditingFile(null);
      setEditingPreview(null);
      alert("Item updated");
    };

    if (editingFile) {
      const reader = new FileReader();
      reader.onload = () => {
        doUpdate(reader.result);
      };
      reader.readAsDataURL(editingFile);
    } else {
      doUpdate(null);
    }
  };

  // Build merged list: savedItems override initial all items by id, then include savedItems-only items
  const mergedItems = [
    ...all.map((a) => savedItems.find((s) => s.id === a.id) || a),
    ...savedItems.filter((s) => !all.find((a) => a.id === s.id)),
  ];

  return (
    <div className="py-6 px-1 sm:p-6 w-screen overflow-x-hidden">
      <h2 className="text-5xl mb-6 text-center font-semibold">Admin Page</h2>

      {/* Upload Section */}
      <div className="w-full mx-auto rounded-xl h-auto mt-4 flex flex-col items-center gap-4 border-2 border-gray-400 p-4">
        <div className="flex flex-col sm:flex-row gap-5 w-full justify-around">
          <input
            type="text"
            placeholder="Category name"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 sm:w-[45%] rounded"
          />
          <input
            type="number"
            placeholder="Category price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 sm:w-[45%] rounded"
          />
        </div>

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="text-secondary mb-4 text-center mx-auto"
        />

        {previews.length > 0 ? (
          <div className="flex flex-wrap gap-3 w-full mx-auto items-center justify-center">
            {previews.map((src, index) => (
              <div
                key={index}
                className="w-fit h-[250px] md:w-[30%] lg:w-[24%] rounded-lg overflow-hidden flex flex-wrap items-center justify-center"
              >
                <img
                  src={src}
                  alt={`preview-${index}`}
                  className="object-cover w-[19rem] max-w-[500px] md:max-w-[700px] h-full rounded-[0.63rem]"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 font-medium text-center">No images selected</div>
        )}

        <div className="flex justify-around w-full py-2">
          <button onClick={handleAdd} className="px-8 py-1 bg-green-600 text-white rounded">
            Add
          </button>
          <button onClick={handleCancel} className="px-8 py-1 bg-red-600 text-white rounded">
            Cancel
          </button>
        </div>
      </div>

      {/* Saved Items Section */}
      <div className="flex flex-col my-6">
        <h3 className="text-3xl text-center underline">Make Changes on Templates</h3>
        <div className="flex flex-wrap w-full items-center justify-center gap-3 mt-4">
          {mergedItems.map((product) => (
            <div
              key={product.id}
              className="w-[90%] max-w-[400px] h-[20rem] flex flex-col items-center justify-around border-2 rounded-xl border-primary sm:w-[48%] md:w-[30%] hover:scale-[0.98]"
            >
              <img src={product.image} alt={product.category} className="h-[75%] w-full rounded-t-[0.63rem]" />
              <div className="flex flex-col flex-wrap items-center justify-around w-[90%]">
                <span className="text-gray-600 text-xl block">
                  {product.category.toUpperCase()} - Kshs. {product.price}
                </span>
                <div className="w-full flex justify-around gap-3 my-3">
                  <button
                    onClick={() => startEdit(product)}
                    className="text-[1rem] bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-[1rem] bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsEditing(false)} />
          <div className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[90%] max-w-md">
            <h4 className="text-xl mb-3">Edit Item</h4>
            <input
              type="text"
              value={editingCategory}
              onChange={(e) => setEditingCategory(e.target.value)}
              className="border p-2 w-full rounded mb-2"
              placeholder="Category"
            />
            <input
              type="number"
              value={editingPrice}
              onChange={(e) => setEditingPrice(e.target.value)}
              className="border p-2 w-full rounded mb-2"
              placeholder="Price"
            />
            <div className="mb-2">
              <input type="file" accept="image/*" onChange={handleEditFileChange} />
            </div>
            {editingPreview && (
              <div className="mb-2">
                <img src={editingPreview} alt="editing-preview" className="w-full h-36 object-cover rounded" />
              </div>
            )}
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setIsEditing(false)} className="px-4 py-1 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={handleSaveUpdate} className="px-4 py-1 bg-blue-600 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Owner;
