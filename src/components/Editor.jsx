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
  useOthers,
  useSelf,
} from "@liveblocks/react/suspense";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useEffect, useState, useCallback, useRef } from "react";
import { AuthService } from "@/lib/appwrite";

function Avatar({ name, color, isSelf }) {
  return (
    <div
      className={`group relative flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border-2 border-white bg-zinc-100 text-xs font-medium text-white shadow-sm transition-all hover:z-10 ${isSelf ? "ring-2 ring-emerald-500 ring-offset-1" : ""}`}
      style={{ backgroundColor: color }}
      title={name + (isSelf ? " (You)" : "")}
    >
      {name.charAt(0).toUpperCase()}

      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-zinc-900 px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
        {name} {isSelf && "(You)"}
      </div>
    </div>
  );
}

function ActiveUsers() {
  const others = useOthers();
  const self = useSelf();

  const hasMoreUsers = others.length > 3;

  return (
    <div className="flex items-center gap-2 px-2 border-l border-zinc-200 ml-2">
      <div className="flex -space-x-2">
        {others.slice(0, 3).map(({ connectionId, info }) => (
          <Avatar
            key={connectionId}
            name={info?.name || "Anonymous"}
            color={info?.color || "#3b82f6"}
          />
        ))}

        {hasMoreUsers && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-zinc-100 text-xs font-medium text-zinc-500">
            +{others.length - 3}
          </div>
        )}

        {self && (
          <Avatar
            name={self.info?.name || "Me"}
            color={self.info?.color || "#10b981"}
            isSelf
          />
        )}
      </div>

      <div className="flex items-center gap-1.5 ml-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[10px] font-medium text-zinc-400 hidden sm:inline-block">
          {others.length > 0 ? `${others.length} online` : "Online"}
        </span>
      </div>
    </div>
  );
}

function Toolbar({ editor, onSave, isSaving }) {
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [versionLabel, setVersionLabel] = useState("");
  const menuRef = useRef(null);

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

  const handleSaveClick = () => {
    setShowSaveMenu(!showSaveMenu);
    setVersionLabel("");
  };

  const confirmSave = () => {
    onSave(versionLabel || "Manual Save");
    setShowSaveMenu(false);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 bg-white/50 backdrop-blur-sm p-2 sticky top-0 z-10 gap-2">
      <div className="flex items-center gap-1 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
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
        <div className="w-px h-5 bg-zinc-300 mx-1 shrink-0" />
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

      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto relative">
        <ActiveUsers />

        <div className="relative" ref={menuRef}>
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded transition-all disabled:opacity-50 shadow-sm whitespace-nowrap"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>

          {/* SAVE POPOVER MENU */}
          {showSaveMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-zinc-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
              <h4 className="text-xs font-semibold text-zinc-900 mb-2">
                Save Version
              </h4>
              <input
                type="text"
                placeholder="Label (e.g. Draft 2)"
                className="w-full text-xs p-2 border border-zinc-200 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                autoFocus
                value={versionLabel}
                onChange={(e) => setVersionLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && confirmSave()}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSaveMenu(false)}
                  className="flex-1 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSave}
                  className="flex-1 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Editor({ doc, initialContent, restoreContent, onSave }) {
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ history: false }),
      Placeholder.configure({ placeholder: "Write something amazing..." }),
      Collaboration.configure({ document: doc }),
    ],
  });

  useEffect(() => {
    if (editor && initialContent && !editor.getText()) {
      try {
        const content =
          typeof initialContent === "string"
            ? JSON.parse(initialContent)
            : initialContent;
        editor.commands.setContent(content);
      } catch (e) {
        console.error(e);
      }
    }
  }, [editor, initialContent]);

  useEffect(() => {
    if (editor && restoreContent) {
      try {
        const content =
          typeof restoreContent === "string"
            ? JSON.parse(restoreContent)
            : restoreContent;
        editor.commands.setContent(content);
      } catch (e) {
        console.error(e);
      }
    }
  }, [editor, restoreContent]);

  const handleSave = async (label) => {
    if (!editor) return;
    setIsSaving(true);
    try {
      const content = JSON.stringify(editor.getJSON());
      await onSave(content, label); // Pass label up
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save.");
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

function CollaborativeEditor({ initialContent, restoreContent, onSave }) {
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

  return (
    <Editor
      doc={doc}
      initialContent={initialContent}
      restoreContent={restoreContent}
      onSave={onSave}
    />
  );
}

export default function LiveblocksEditorWrapper({
  roomId,
  user,
  initialContent,
  restoreContent,
  onSave,
}) {
  if (!user) return null;

  const resolveAuth = useCallback(async (room) => {
    const jwt = await AuthService.getJWT();
    const response = await fetch("/api/liveblocks-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
              restoreContent={restoreContent}
              onSave={onSave}
            />
          )}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
