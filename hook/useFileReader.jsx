import { useState } from "react";
import { toast } from "react-hot-toast";

function useImageReader(allowedTypes) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectIndex, setSelectIndex] = useState(null);

  const handleImageChange = (e, index) => {
    console.log("index",e. index)
    const file = e.target.files?.[0];
    if (file && allowedTypes.includes(file?.type)) {
      const reader = new FileReader();
      reader.onload = () => {
          setSelectedImage((reader.result));
             
      };
      reader.readAsDataURL(file);
    } else {
      toast.error(`${file?.type} is not allowed`);
    }
  };

  return {
    selectedImage,
    handleImageChange,
  };
}

export default useImageReader;