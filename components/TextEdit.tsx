import React, { useState, useCallback, useEffect, useMemo } from "react";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(import("react-quill"), { ssr: false });

interface TextEditorProps {
  placeholder?: string;
  updateContent?: (content: string) => void;
  initialContent?: string;
  disabled?: boolean;
}

const TextEditor: React.FC<TextEditorProps> = ({
  placeholder,
  updateContent,
  initialContent = "",
  disabled = false,
}) => {
  const [editorHtml, setEditorHtml] = useState(initialContent);

  const handleChange = useCallback(
    (content: any, delta: any, source: any, editor: any) => {
      console.log(content, 123);
      setEditorHtml(content);
      updateContent && updateContent(content);
    },
    [updateContent]
  );

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
      ["link", "image", "video"],
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

  return (
    <ReactQuill
      theme="snow"
      readOnly={disabled}
      onChange={handleChange}
      value={editorHtml}
      modules={modules}
      formats={formats}
      bounds={"#root"}
      placeholder={placeholder}
      style={{ height: "212px" }}
      className={`${disabled && "cursor-not-allowed bg-lightGray"}`}
    />
  );
};

export default TextEditor;
