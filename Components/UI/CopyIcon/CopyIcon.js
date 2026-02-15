import { Button } from "@mui/material";
import React, { useState } from "react";

const CopyIcon = ({ url, className }) => {
  const [copied, setCopied] = useState(false);
  const handleCopyClick = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // Reset copied state after 1.5 seconds
      })
      .catch(error => {
        console.error("Error copying URL:", error);
      });
  };

  return (
    <div>
      <Button
        className={className}
        style={{ fontSize: "12px" }}
        onClick={handleCopyClick}
      >
        {copied ? (
          <i className="flaticon-checked"></i>
        ) : (
          <i className="flaticon-copy"></i>
        )}
      </Button>
    </div>
  );
};

export default CopyIcon;
