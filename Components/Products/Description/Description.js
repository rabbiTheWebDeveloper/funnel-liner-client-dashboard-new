import dynamic from "next/dynamic";

import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
const QuillNoSSRWrapper = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const QuillEditor = ({ value, data, onChange, placeholder }) => {
  const [editorValue, setEditorValue] = useState("");

  useEffect(() => {
    const initial = value || data || "";
    setEditorValue(DOMPurify.sanitize(initial));
  }, [value, data]);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  const handleChange = content => {
    setEditorValue(content);
    onChange(content);
  };

  return (
    <QuillNoSSRWrapper
      value={editorValue}
      modules={modules}
      formats={formats}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
};

export default QuillEditor;
