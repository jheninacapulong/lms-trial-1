import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect } from "react";

export default function StyledRTE({ value, onChange, height = 200 }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        link: false,
      }),
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
  }, [value]);

  if (!editor) return null;

  return (
    <div className="border rounded-md overflow-hidden bg-white">

      {/* TOOLBAR (CLEAN VERSION) */}
      <div className="flex gap-2 p-2 border-b bg-gray-50">

        {/* BOLD */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-2"
        >
          <b>B</b>
        </button>

        {/* ITALIC */}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-2"
        >
          <i>I</i>
        </button>

        {/* HEADING (optional but useful) */}
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="px-2 font-semibold"
        >
          H2
        </button>

        {/* CLEAR FORMATTING */}
        <button
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className="px-2 text-sm"
        >
          Clear
        </button>

      </div>

      {/* EDITOR */}
      <EditorContent
        editor={editor}
        style={{
          minHeight: height,
          padding: "12px",
        }}
      />
    </div>
  );
}