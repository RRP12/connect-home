import React, { useState } from "react";

const ImageUpload = () => {
  const [images, setImages] = useState([]);

  // Handle image selection
  const handleImageChange = (e) => {
    const files = e.target.files;
    const newImages = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onloadend = () => {
        newImages.push({ id: Date.now() + i, src: reader.result }); // Adding an ID for each image
        if (newImages.length === files.length) {
          setImages((prevImages) => [...prevImages, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image deletion
  const handleDeleteImage = (id) => {
    setImages(images.filter((image) => image.id !== id));
  };

  // Handle image editing (replace)
  const handleEditImage = (id) => {
    document.getElementById(id).click(); // Trigger file input for that image
  };

  const handleEditChange = (e, id) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(
          images.map((image) =>
            image.id === id ? { ...image, src: reader.result } : image
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Image upload button */}
      <label
        htmlFor="image-upload"
        className="w-full max-w-sm px-4 py-2 text-center bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Upload Property Images
      </label>
      <input
        type="file"
        id="image-upload"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleImageChange}
      />

      {/* Image Previews */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <img
              src={image.src}
              alt="Property Preview"
              className="w-20 h-20 object-cover rounded-md shadow-md"
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex justify-center items-center space-x-2">
              {/* Edit Image Button */}
              <button
                type="button"
                onClick={() => handleEditImage(image.id)}
                className="text-white text-sm bg-blue-500 px-2 py-1 rounded-md hover:bg-blue-600"
              >
                Edit
              </button>

              {/* Delete Image Button */}
              <button
                type="button"
                onClick={() => handleDeleteImage(image.id)}
                className="text-white text-sm bg-red-500 px-2 py-1 rounded-md hover:bg-red-600"
              >
                Delete
              </button>

              {/* Hidden Input for Editing Image */}
              <input
                type="file"
                id={image.id}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleEditChange(e, image.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Optional: Instructions */}
      {images.length === 0 && (
        <p className="text-gray-500 text-sm text-center">
          Choose images to upload and preview them here.
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
