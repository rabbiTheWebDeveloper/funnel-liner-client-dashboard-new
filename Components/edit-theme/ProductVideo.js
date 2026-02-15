import React, { useState } from "react";

const containerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const inputRow = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
};

const videoPreviewContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
  marginTop: "10px",
};

const videoCard = {
  width: "200px",
  position: "relative",
  border: "1px solid #ccc",
  borderRadius: "6px",
  overflow: "hidden",
  background: "#f9f9f9",
};

const iframeStyle = {
  width: "100%",
  height: "120px",
  border: "none",
};

const deleteBtn = {
  position: "absolute",
  top: "4px",
  right: "4px",
  background: "rgba(255, 255, 255, 0.8)",
  border: "none",
  borderRadius: "50%",
  cursor: "pointer",
  padding: "4px",
};

const ProductVideo = React.memo(({ productVideoLinks = [], setProductGalleryVideos }) => {
  const [inputValue, setInputValue] = useState("");

  const addVideoLink = () => {
    if (!inputValue) return;
    if (productVideoLinks.length >= 5) {
      alert("You can add up to 5 videos only");
      return;
    }
    if (!isValidYoutubeUrl(inputValue)) {
      alert("Please enter a valid YouTube URL");
      return;
    }
    setProductGalleryVideos([...productVideoLinks, inputValue]);
    setInputValue("");
  };

  const removeVideoLink = index => {
    const updated = [...productVideoLinks];
    updated.splice(index, 1);
    setProductGalleryVideos(updated);
  };

  const isValidYoutubeUrl = url => {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(url);
  };

  const getEmbedUrl = url => {
    const videoIdMatch = url?.match(
      /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([^&#]*)/
    );
    return videoIdMatch
      ? `https://www.youtube.com/embed/${videoIdMatch[1]}`
      : "";
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      addVideoLink();
    }
  };

  return (
    <div style={containerStyle}>
      <div style={inputRow}>
        <input
          type="text"
          placeholder="Enter YouTube video link"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          id="addVideoYoutube"
          type="button" // FIXED: Changed from "submit" to "button"
          onClick={addVideoLink}
          style={{
            padding: "8px 12px",
            background: "#894bca",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>

      <div style={videoPreviewContainer}>
        {productVideoLinks?.map((link, index) => (
          <div key={index} style={videoCard}>
            <iframe
              src={getEmbedUrl(link)}
              style={iframeStyle}
              allowFullScreen
              title={`video-${index}`}
            ></iframe>
            <button 
              style={deleteBtn} 
              onClick={() => removeVideoLink(index)}
              type="button" // Added type="button" for delete button too
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  if (prevProps?.productVideoLinks?.length !== nextProps?.productVideoLinks?.length) {
    return false;
  }
  
  for (let i = 0; i < prevProps?.productVideoLinks?.length; i++) {
    if (prevProps?.productVideoLinks[i] !== nextProps?.productVideoLinks[i]) {
      return false;
    }
  }
  
  return true;
});

export default ProductVideo;