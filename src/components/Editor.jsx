"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Collaboration from "@tiptap/extension-collaboration";
import * as Y from "yjs";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
  useRoom,
} from "@liveblocks/react/suspense";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useEffect, useState, useCallback } from "react";
import { AuthService } from "@/lib/appwrite";

// Toolbar Component
function Toolbar({ editor, onSave, isSaving }) {
  if (!editor) return null;

  const Btn = ({ onClick, isActive, children }) => (
    <button
      onClick={onClick}
      className={`p-1.5 min-w-[32px] rounded text-sm font-medium transition-colors ${
        isActive
          ? "bg-emerald-100 text-emerald-700"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center justify-between border-b border-zinc-200 bg-white/50 backdrop-blur-sm p-2 sticky top-0 z-10">
      <div className="flex items-center gap-1">
        <Btn
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          B
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          I
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
        >
          S
        </Btn>
        <div className="w-px h-5 bg-zinc-300 mx-1" />
        <Btn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
        >
          H1
        </Btn>
        <Btn
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
        >
          H2
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        >
          List
        </Btn>
      </div>

      <button
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded transition-colors disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save to Cloud"}
      </button>
    </div>
  );
}

// Editor Instance
function Editor({ doc, initialContent, onSave }) {
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Placeholder.configure({
        placeholder: "Write something amazing...",
      }),
      Collaboration.configure({
        document: doc,
      }),
    ],
  });

  // Handle Initial Content Loading
  useEffect(() => {
    if (editor && initialContent && !editor.getText()) {
      try {
        const content = JSON.parse(initialContent);
        editor.commands.setContent(content);
      } catch (e) {
        console.error("Initial content parse error:", e);
      }
    }
  }, [editor, initialContent]);

  const handleSave = async () => {
    if (!editor) return;
    setIsSaving(true);
    try {
      const content = JSON.stringify(editor.getJSON());
      await onSave(content);
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save. Check console.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <Toolbar editor={editor} onSave={handleSave} isSaving={isSaving} />
      <EditorContent
        editor={editor}
        className="flex-1 p-8 outline-none prose prose-zinc max-w-none prose-headings:font-semibold prose-p:text-zinc-700"
      />
    </div>
  );
}

// Room Wrapper
function CollaborativeEditor({ initialContent, onSave }) {
  const room = useRoom();
  const [doc, setDoc] = useState();
  const [provider, setProvider] = useState();

  useEffect(() => {
    const yDoc = new Y.Doc();
    const yProvider = new LiveblocksYjsProvider(room, yDoc);

    setDoc(yDoc);
    setProvider(yProvider);

    return () => {
      yDoc.destroy();
      yProvider.destroy();
    };
  }, [room]);

  if (!doc || !provider) return null;

  return <Editor doc={doc} initialContent={initialContent} onSave={onSave} />;
}

// Main Entry
export default function LiveblocksEditorWrapper({
  roomId,
  user,
  initialContent,
  onSave,
}) {
  if (!user) return null;

  // Custom Authentication resolver
  const resolveAuth = useCallback(async (room) => {
    // 1. Generate JWT from Appwrite Client SDK
    const jwt = await AuthService.getJWT();

    // 2. Call our API route with the JWT
    const response = await fetch("/api/liveblocks-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room, token: jwt }),
    });

    return await response.json();
  }, []);

  return (
    <LiveblocksProvider authEndpoint={resolveAuth}>
      <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
        <ClientSideSuspense
          fallback={
            <div className="p-8 text-center text-zinc-400">
              Connecting to secure room...
            </div>
          }
        >
          {() => (
            <CollaborativeEditor
              initialContent={initialContent}
              onSave={onSave}
            />
          )}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
