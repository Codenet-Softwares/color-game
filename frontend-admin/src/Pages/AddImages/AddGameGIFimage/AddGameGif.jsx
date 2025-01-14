import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../Utils/Auth";
import GameService from "../../../Services/GameService";

const AddGameGif = () => {
  const [file, setFile] = useState(null);
  const [gifPreview, setGifPreview] = useState(null);
  const auth = useAuth(); 

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setGifPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleRemoveGif = () => {
    setFile(null);
    setGifPreview(null);
  };

  const handleUploadGif = async () => {
    if (!file) {
      toast.error("Please select a GIF to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Gif = reader.result.split(",")[1]; 

      const data = {
        data: [
          {
            docBase: base64Gif,
            isActive: true,
          },
        ],
      };

      try {
        const response = await GameService.gifSliderImage(auth.user, data);
        toast.success("GIF uploaded successfully!");
        console.log(response.data);
        setFile(null); 
        setGifPreview(null); 
      } catch (error) {
        toast.error("Failed to upload the GIF. Please try again.");
        console.error(error);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="container">
      <div className="card shadow-sm">
        <div
          className="card-header"
          style={{ backgroundColor: "#7D7D7D", color: "#FFFFFF" }}
        >
          <h3 className="mb-0 fw-bold text-center">Create GIF</h3>
        </div>
        <div className="card-body">
          <div className="mb-4 text-center">
            <div
              onClick={() => document.getElementById("file-input").click()}
              style={{
                display: "inline-block",
                cursor: "pointer",
                fontSize: "40px",
                color: "#007BFF",
                padding: "30px",
                border: "2px solid #007BFF",
                borderRadius: "8px",
                backgroundColor: "lightgray",
                boxSizing: "border-box",
                position: "relative",
              }}
            >
              <h4 className="fw-bold">Choose GIF</h4>
              <i className="fas fa-plus-circle"></i>
              {gifPreview && (
                <img
                  src={gifPreview}
                  alt="GIF Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                />
              )}
            </div>
            {gifPreview && (
              <div
                onClick={handleRemoveGif}
                style={{
                  cursor: "pointer",
                  color: "#FF0000",
                  marginTop: "10px",
                }}
              >
                <i className="fas fa-times"></i> Remove GIF
              </div>
            )}
            <input
              id="file-input"
              type="file"
              accept="image/gif" 
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
          <div className="text-center">
            <button className="btn btn-primary" onClick={handleUploadGif}>
              Upload GIF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGameGif;
