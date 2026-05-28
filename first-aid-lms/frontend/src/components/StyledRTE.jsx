import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";

export default function StyledRTE({ value, onChange, height = 200 }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        link: false,
      }),
      Underline,
      Placeholder.configure({
        placeholder: "Write something here...",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="border rounded-md overflow-hidden bg-white">

      {/* TOOLBAR (CLEAN VERSION) */}
      <div className="flex flex-wrap gap-2 border-b bg-gray-50 p-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded px-2 py-1 text-gray-800 hover:bg-gray-200 ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
        >
          <b>B</b>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded px-2 py-1 text-gray-800 hover:bg-gray-200 ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
        >
          <i>I</i>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded px-2 py-1 text-gray-800 hover:bg-gray-200 ${editor.isActive("underline") ? "bg-gray-200" : ""}`}
        >
          <u>U</u>
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`rounded px-2 py-1 font-semibold text-gray-900 hover:bg-gray-200 ${editor.isActive("heading", { level: 1 }) ? "bg-gray-200 text-black" : ""}`}
        >
          H1
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`rounded px-2 py-1 font-semibold text-gray-900 hover:bg-gray-200 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200 text-black" : ""}`}
        >
          H2
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`rounded px-2 py-1 font-semibold text-gray-900 hover:bg-gray-200 ${editor.isActive("heading", { level: 3 }) ? "bg-gray-200 text-black" : ""}`}
        >
          H3
        </button>
      </div>

      {/* EDITOR */}
      <EditorContent
        editor={editor}
        className="prose prose-slate max-w-none text-black"
        style={{
          minHeight: height,
          padding: "12px",
          color: "#111827",
          whiteSpace: "pre-wrap",
        }}
      />
    </div>
  );
}