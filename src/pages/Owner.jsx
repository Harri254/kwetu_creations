import { useState, useEffect } from "react";

function Owner() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // load saved image (data URL) from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("owner-image");
    if (saved) setPreview(saved);
  }, []);

  // create object URL for preview when a new File is selected
  useEffect(() => {
    if (!selectedFile) return;

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => {
      // revoke object URL when component unmounts or file changes
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  }

  // convert File to data URL and save to localStorage
  function handleAdd() {
    if (!selectedFile) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      try {
        localStorage.setItem("owner-image", dataUrl);
        // set preview to the saved data URL (persisted)
        setPreview(dataUrl);
        setSelectedFile(null);
        alert("Image saved");
      } catch (err) {
        console.error("Could not save image to localStorage", err);
        alert("Failed to save image (maybe too large)");
      }
    };
    reader.readAsDataURL(selectedFile);
  }

  function handleCancel() {
    setSelectedFile(null);
    // if preview came from a selected file (object URL), clear it; if saved in localStorage keep it
    const saved = localStorage.getItem("owner-image");
    localStorage.removeItem("owner-image");
    setPreview(saved || null);
  }

  return (
    <div>
      <h2>You are on admin page</h2>
      <div>
        <h3>Add Products</h3>
        <hr />
        <input
          type="file"
          accept="image/*"
        //   value={selectedFile}
          onChange={handleFileChange}
          className="text-secondary"
        />

        {/* Display selected image or saved image */}
        <div className="w-[95%] mx-auto rounded-xl h-[400px] mt-4 flex flex-col items-center justify-between gap-0">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-full h-[85%] object-cover rounded-t-xl"
            />
          ) : (
            <div className="text-white">No image selected</div>
          )}

          <div className="flex justify-around w-full h-[15%] py-2">
            <button onClick={handleAdd} className="px-8 py-1 bg-green-600 text-white rounded">
              Add
            </button>
            <button onClick={handleCancel} className="px-8 py-1 bg-red-600 text-white rounded">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Owner;
