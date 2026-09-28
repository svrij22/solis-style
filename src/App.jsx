import { useEffect, useRef, useState } from "react";
import {
  PanelLeft,
  MessageSquare,
  Bot,
  Folder,
  Users,
  ListPlus,
  HelpCircle,
  CircleUserRound,
  Plus,
  Search,
  BookOpen,
  SquarePen,
  GraduationCap,
  MoreVertical,
  ChevronDown,
  Mic,
  Send,
  Pencil,
  FlaskConical,
  Briefcase,
  X,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Trash2,
  Upload,
} from "lucide-react";
import defaultCss from "./App.css?inline";
import uuCss from "./App.uu.css?inline";

const THEMES = {
  default: { label: "Default", css: defaultCss },
  uu: { label: "UU huisstijl", css: uuCss },
};

const MODELS = ["gpt-5.6-luna", "gpt-5.6-sol", "claude-opus-5", "llama-4-local"];

const SUGGESTIONS = [
  { label: "Writing", icon: Pencil, prompt: "Help me write an abstract for my thesis." },
  { label: "Research", icon: FlaskConical, prompt: "Compare three research methods in a table." },
  { label: "Learning", icon: GraduationCap, prompt: "Explain recursion simply." },
  { label: "Professional Development", icon: Briefcase, prompt: "Optimize my LinkedIn profile." },
];

const INITIAL_CHATS = [
  { id: 1, title: "Greeting and Offer to Help", messages: [] },
  { id: 2, title: "LinkedIn Profile Optimization", messages: [] },
  { id: 3, title: "Explaining Topics Simply", messages: [] },
];

const PROJECTS = [{ id: 1, name: "asd" }];

const ASSISTANTS = [
  { name: "Thesis Helper", model: "gpt-5.6-luna", owner: "Vrij, S.J.", updated: "2026-09-21", status: "Active" },
  { name: "Code Reviewer", model: "claude-opus-5", owner: "Jansen, K.", updated: "2026-09-18", status: "Active" },
  { name: "Statistics Tutor", model: "gpt-5.6-sol", owner: "de Boer, M.", updated: "2026-09-02", status: "Draft" },
  { name: "Citation Checker", model: "llama-4-local", owner: "Vrij, S.J.", updated: "2026-08-29", status: "Archived" },
];

const FILES = [
  { name: "thesis_draft_v3.pdf", size: "2.4 MB", type: "PDF", uploaded: "2026-09-27" },
  { name: "survey_results.csv", size: "812 KB", type: "CSV", uploaded: "2026-09-25" },
  { name: "lecture_notes_week4.docx", size: "356 KB", type: "DOCX", uploaded: "2026-09-20" },
  { name: "dataset_cleaned.xlsx", size: "1.1 MB", type: "XLSX", uploaded: "2026-09-14" },
];

const GROUPS = [
  { name: "INFOMAI 2026", members: 124, role: "Student", created: "2026-09-01" },
  { name: "Research Group NLP", members: 18, role: "Member", created: "2026-03-12" },
  { name: "Thesis Supervision", members: 4, role: "Owner", created: "2026-06-30" },
];

const PROMPTS = [
  { title: "Summarize paper", text: "Summarize the following paper in 5 bullet points, focusing on methods and findings." },
  { title: "Feedback on text", text: "Give constructive feedback on the structure and clarity of this text." },
  { title: "Quiz me", text: "Create 5 multiple-choice questions about the following topic." },
  { title: "Explain like I'm 12", text: "Explain the following concept as if I were 12 years old." },
];

const NAV = [
  { id: "chat", icon: MessageSquare, label: "Chats" },
  { id: "assistants", icon: Bot, label: "Assistants" },
  { id: "files", icon: Folder, label: "Files" },
  { id: "groups", icon: Users, label: "Groups" },
  { id: "prompts", icon: ListPlus, label: "Prompts" },
];

function fakeReply(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes("table") || p.includes("compare")) {
    return {
      text: "Here is a comparison of three common research methods:",
      table: {
        headers: ["Method", "Strength", "Weakness", "Typical use"],
        rows: [
          ["Survey", "Large samples, cheap", "Shallow answers", "Opinions, trends"],
          ["Interview", "Rich, in-depth data", "Time-consuming", "Experiences, motivations"],
          ["Experiment", "Causal conclusions", "Artificial setting", "Testing hypotheses"],
        ],
      },
    };
  }
  return {
    text: `This is a mock response to: "${prompt}". The frontend is running without a backend, so every answer is generated locally for testing purposes. Try asking for a "table" to see a structured reply.`,
  };
}

function Logo() {
  return (
    <div className="logo">
      <div className="logo-seal">UU</div>
      <div className="logo-text">
        <span>Universiteit</span>
        <span>Utrecht</span>
      </div>
    </div>
  );
}

function IconRail({ view, setView, onToggleSidebar }) {
  return (
    <nav className="rail">
      <button className="rail-btn" title="Toggle sidebar" onClick={onToggleSidebar}>
        <PanelLeft size={20} />
      </button>
      {NAV.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          title={label}
          className={`rail-btn ${view === id ? "active" : ""}`}
          onClick={() => setView(id)}
        >
          <Icon size={20} />
        </button>
      ))}
      <div className="rail-spacer" />
      <button className="rail-btn" title="Help">
        <HelpCircle size={20} />
      </button>
      <button className="rail-btn" title="Account">
        <CircleUserRound size={20} />
      </button>
    </nav>
  );
}

function Sidebar({ chats, activeId, onSelect, onNew, onDelete }) {
  const [query, setQuery] = useState("");
  const filtered = chats.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <aside className="sidebar">
      <Logo />
      <button className="new-chat" onClick={onNew}>
        <Plus size={16} /> New Chat
      </button>
      <div className="search">
        <Search size={14} />
        <input placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div className="section-title">Projects</div>
      {PROJECTS.map((p) => (
        <div key={p.id} className="project-item">
          <BookOpen size={15} /> {p.name}
        </div>
      ))}

      <div className="section-title with-action">
        All Chats
        <SquarePen size={14} className="section-action" onClick={onNew} />
      </div>
      <ul className="chat-list">
        {filtered.map((c) => (
          <li
            key={c.id}
            className={`chat-item ${c.id === activeId ? "active" : ""}`}
            onClick={() => onSelect(c.id)}
          >
            <span className="chat-title">{c.title}</span>
            <Trash2
              size={13}
              className="chat-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(c.id);
              }}
            />
          </li>
        ))}
        {filtered.length === 0 && <li className="chat-empty">No chats found</li>}
      </ul>
    </aside>
  );
}

function ThemeSwitch({ theme, setTheme }) {
  return (
    <div className="theme-switch" role="radiogroup" aria-label="Theme">
      {Object.entries(THEMES).map(([id, { label }]) => (
        <button
          key={id}
          role="radio"
          aria-checked={theme === id}
          className={theme === id ? "active" : ""}
          onClick={() => setTheme(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function TopBar({ bannerOpen, onClose, theme, setTheme }) {
  return (
    <header className="topbar">
      {bannerOpen ? (
        <p>
          UU AI Chat is designed with privacy in mind. Lecturers do not have access to your chats.
          Remain critical and use your own judgment, as generated information is not always complete,
          correct, up-to-date or without bias.
        </p>
      ) : (
        <div className="topbar-spacer" />
      )}
      <ThemeSwitch theme={theme} setTheme={setTheme} />
      {bannerOpen && (
        <button className="icon-btn" onClick={onClose} title="Dismiss">
          <X size={16} />
        </button>
      )}
    </header>
  );
}

function Composer({ onSend, model, setModel, autoFocus }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const submit = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="composer">
      <textarea
        autoFocus={autoFocus}
        rows={1}
        placeholder="Type your message here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
      />
      <div className="composer-bar">
        <button className="icon-btn" title="Attach"><Plus size={18} /></button>
        <button className="icon-btn" title="Study mode"><GraduationCap size={18} /></button>
        <button className="icon-btn" title="More"><MoreVertical size={18} /></button>
        <div className="composer-spacer" />
        <div className="model-select">
          <button className="model-btn" onClick={() => setOpen(!open)}>
            {model} <ChevronDown size={14} />
          </button>
          {open && (
            <ul className="model-menu">
              {MODELS.map((m) => (
                <li
                  key={m}
                  className={m === model ? "active" : ""}
                  onClick={() => {
                    setModel(m);
                    setOpen(false);
                  }}
                >
                  {m}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="icon-btn mic" title="Voice input">
          <Mic size={16} />
          <span>EN</span>
        </button>
        <button className="send-btn" onClick={submit} disabled={!text.trim()} title="Send">
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}

function DataTable({ headers, rows }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>{headers.map((h) => <th key={h}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Message({ msg }) {
  if (msg.role === "user") {
    return <div className="msg user"><div className="bubble">{msg.text}</div></div>;
  }
  return (
    <div className="msg assistant">
      <div className="avatar">AI</div>
      <div className="msg-body">
        {msg.pending ? (
          <div className="typing"><span /><span /><span /></div>
        ) : (
          <>
            <p>{msg.text}</p>
            {msg.table && <DataTable {...msg.table} />}
            <div className="msg-actions">
              <button className="icon-btn" title="Copy" onClick={() => navigator.clipboard?.writeText(msg.text)}>
                <Copy size={14} />
              </button>
              <button className="icon-btn" title="Good"><ThumbsUp size={14} /></button>
              <button className="icon-btn" title="Bad"><ThumbsDown size={14} /></button>
              <button className="icon-btn" title="Regenerate"><RotateCcw size={14} /></button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ChatView({ chat, onSend, model, setModel }) {
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  if (!chat || chat.messages.length === 0) {
    return (
      <div className="welcome">
        <h1>Welcome, Vrij, S.J. (Sep).</h1>
        <Composer onSend={onSend} model={model} setModel={setModel} autoFocus />
        <div className="chips">
          {SUGGESTIONS.map(({ label, icon: Icon, prompt }) => (
            <button key={label} className="chip" onClick={() => onSend(prompt)}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="chat">
      <div className="messages">
        {chat.messages.map((m) => <Message key={m.id} msg={m} />)}
        <div ref={endRef} />
      </div>
      <div className="chat-composer">
        <Composer onSend={onSend} model={model} setModel={setModel} />
        <small className="hint">AI can make mistakes. Check important information.</small>
      </div>
    </div>
  );
}

function PageHeader({ title, subtitle, action }) {
  return (
    <div className="page-header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function StatusBadge({ status }) {
  return <span className={`badge ${status.toLowerCase()}`}>{status}</span>;
}

function AssistantsPage() {
  return (
    <div className="page">
      <PageHeader
        title="Assistants"
        subtitle="Custom assistants with their own instructions and knowledge."
        action={<button className="primary-btn"><Plus size={15} /> New assistant</button>}
      />
      <div className="stats">
        <div className="stat"><span>Total</span><strong>{ASSISTANTS.length}</strong></div>
        <div className="stat"><span>Active</span><strong>{ASSISTANTS.filter((a) => a.status === "Active").length}</strong></div>
        <div className="stat"><span>Drafts</span><strong>{ASSISTANTS.filter((a) => a.status === "Draft").length}</strong></div>
      </div>
      <DataTable
        headers={["Name", "Model", "Owner", "Last updated", "Status"]}
        rows={ASSISTANTS.map((a) => [a.name, a.model, a.owner, a.updated, <StatusBadge status={a.status} />])}
      />
    </div>
  );
}

function FilesPage() {
  return (
    <div className="page">
      <PageHeader
        title="Files"
        subtitle="Documents you can use as context in your chats."
        action={<button className="primary-btn"><Upload size={15} /> Upload</button>}
      />
      <div className="dropzone">Drag & drop files here, or click Upload</div>
      <DataTable
        headers={["Name", "Type", "Size", "Uploaded"]}
        rows={FILES.map((f) => [f.name, f.type, f.size, f.uploaded])}
      />
    </div>
  );
}

function GroupsPage() {
  return (
    <div className="page">
      <PageHeader title="Groups" subtitle="Courses and teams you are part of." />
      <DataTable
        headers={["Group", "Members", "Your role", "Created"]}
        rows={GROUPS.map((g) => [g.name, g.members, g.role, g.created])}
      />
    </div>
  );
}

function PromptsPage({ onUse }) {
  return (
    <div className="page">
      <PageHeader
        title="Prompt library"
        subtitle="Reusable prompts. Click one to start a chat with it."
        action={<button className="primary-btn"><Plus size={15} /> New prompt</button>}
      />
      <div className="cards">
        {PROMPTS.map((p) => (
          <div key={p.title} className="card" onClick={() => onUse(p.text)}>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 800);
  const [bannerOpen, setBannerOpen] = useState(true);
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeId, setActiveId] = useState(null);
  const [model, setModel] = useState(MODELS[0]);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return THEMES[saved] ? saved : "default";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const activeChat = chats.find((c) => c.id === activeId);

  const updateChat = (id, fn) =>
    setChats((prev) => prev.map((c) => (c.id === id ? fn(c) : c)));

  const send = (text) => {
    let id = activeId;
    if (!activeChat) {
      id = Date.now();
      const title = text.length > 32 ? text.slice(0, 32) + "…" : text;
      setChats((prev) => [{ id, title, messages: [] }, ...prev]);
      setActiveId(id);
    }
    const pendingId = Date.now() + 1;
    updateChat(id, (c) => ({
      ...c,
      messages: [
        ...c.messages,
        { id: Date.now(), role: "user", text },
        { id: pendingId, role: "assistant", pending: true },
      ],
    }));
    setTimeout(() => {
      updateChat(id, (c) => ({
        ...c,
        messages: c.messages.map((m) =>
          m.id === pendingId ? { id: pendingId, role: "assistant", ...fakeReply(text) } : m
        ),
      }));
    }, 900);
  };

  const newChat = () => {
    setActiveId(null);
    setView("chat");
  };

  const deleteChat = (id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (id === activeId) setActiveId(null);
  };

  return (
    <div className="app">
      <style>{THEMES[theme].css}</style>
      <IconRail view={view} setView={setView} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      {sidebarOpen && (
        <Sidebar
          chats={chats}
          activeId={activeId}
          onSelect={(id) => {
            setActiveId(id);
            setView("chat");
          }}
          onNew={newChat}
          onDelete={deleteChat}
        />
      )}
      <main className="main">
        <TopBar
          bannerOpen={bannerOpen}
          onClose={() => setBannerOpen(false)}
          theme={theme}
          setTheme={setTheme}
        />
        <div className="content">
          {view === "chat" && <ChatView chat={activeChat} onSend={send} model={model} setModel={setModel} />}
          {view === "assistants" && <AssistantsPage />}
          {view === "files" && <FilesPage />}
          {view === "groups" && <GroupsPage />}
          {view === "prompts" && (
            <PromptsPage
              onUse={(text) => {
                setActiveId(null);
                setView("chat");
                send(text);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
