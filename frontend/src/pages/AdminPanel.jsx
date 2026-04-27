// frontend/src/pages/AdminPanel.jsx
import { useEffect, useState } from "react";
import { Trash2, Edit2, Plus, MoreVertical } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("creations");
  const [creations, setCreations] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddPromptModal, setShowAddPromptModal] = useState(false);
  const [newPrompt, setNewPrompt] = useState({
    title: "",
    content: "",
    category: "general",
    isPublic: false,
  });

  useEffect(() => {
    if (activeTab === "creations") {
      fetchCreations();
    } else {
      fetchPrompts();
    }
  }, [activeTab]);

  const fetchCreations = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/creations", {
        headers: { "x-user-id": localStorage.getItem("userId") },
      });
      if (data.success) {
        setCreations(data.data);
      }
    } catch (error) {
      console.error("Error fetching creations:", error);
      toast.error("Failed to load creations");
    } finally {
      setLoading(false);
    }
  };

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/prompts", {
        headers: { "x-user-id": localStorage.getItem("userId") },
      });
      if (data.success) {
        setPrompts(data.data);
      }
    } catch (error) {
      console.error("Error fetching prompts:", error);
      toast.error("Failed to load prompts");
    } finally {
      setLoading(false);
    }
  };

  const deleteCreation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this creation?")) return;

    try {
      const { data } = await axios.delete(`/api/admin/creations/${id}`, {
        headers: { "x-user-id": localStorage.getItem("userId") },
      });
      if (data.success) {
        setCreations(creations.filter((c) => c._id !== id));
        toast.success("Creation deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting creation:", error);
      toast.error("Failed to delete creation");
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      const { data } = await axios.patch(
        `/api/admin/creations/${id}/publish`,
        { publish: !currentStatus },
        { headers: { "x-user-id": localStorage.getItem("userId") } }
      );
      if (data.success) {
        setCreations(
          creations.map((c) =>
            c._id === id ? { ...c, publish: !currentStatus } : c
          )
        );
        toast.success("Creation updated");
      }
    } catch (error) {
      console.error("Error updating creation:", error);
      toast.error("Failed to update creation");
    }
  };

  const deletePrompt = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prompt?")) return;

    try {
      const { data } = await axios.delete(`/api/admin/prompts/${id}`, {
        headers: { "x-user-id": localStorage.getItem("userId") },
      });
      if (data.success) {
        setPrompts(prompts.filter((p) => p._id !== id));
        toast.success("Prompt deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting prompt:", error);
      toast.error("Failed to delete prompt");
    }
  };

  const handleAddPrompt = async () => {
    if (!newPrompt.title || !newPrompt.content) {
      toast.error("Title and content are required");
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/admin/prompts",
        newPrompt,
        { headers: { "x-user-id": localStorage.getItem("userId") } }
      );
      if (data.success) {
        setPrompts([data.data, ...prompts]);
        setNewPrompt({ title: "", content: "", category: "general", isPublic: false });
        setShowAddPromptModal(false);
        toast.success("Prompt created successfully");
      }
    } catch (error) {
      console.error("Error creating prompt:", error);
      toast.error("Failed to create prompt");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-gray-400">Manage creations, prompts, and content</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-700">
          <button
            onClick={() => setActiveTab("creations")}
            className={`pb-3 px-4 font-semibold transition ${
              activeTab === "creations"
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Creations
          </button>
          <button
            onClick={() => setActiveTab("prompts")}
            className={`pb-3 px-4 font-semibold transition ${
              activeTab === "prompts"
                ? "border-b-2 border-blue-500 text-blue-400"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Prompt Templates
          </button>
        </div>

        {/* Content */}
        {activeTab === "creations" ? (
          <CreationsTab
            creations={creations}
            loading={loading}
            onDelete={deleteCreation}
            onTogglePublish={togglePublish}
          />
        ) : (
          <PromptsTab
            prompts={prompts}
            loading={loading}
            onDelete={deletePrompt}
            onAddClick={() => setShowAddPromptModal(true)}
          />
        )}
      </div>

      {/* Add Prompt Modal */}
      {showAddPromptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Create New Prompt</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Prompt Title"
                value={newPrompt.title}
                onChange={(e) =>
                  setNewPrompt({ ...newPrompt, title: e.target.value })
                }
                className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Prompt Content"
                value={newPrompt.content}
                onChange={(e) =>
                  setNewPrompt({ ...newPrompt, content: e.target.value })
                }
                className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              />
              <select
                value={newPrompt.category}
                onChange={(e) =>
                  setNewPrompt({ ...newPrompt, category: e.target.value })
                }
                className="w-full bg-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General</option>
                <option value="article">Article</option>
                <option value="image">Image</option>
                <option value="blog">Blog</option>
              </select>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newPrompt.isPublic}
                  onChange={(e) =>
                    setNewPrompt({ ...newPrompt, isPublic: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span>Make Public</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddPromptModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPrompt}
                className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CreationsTab = ({ creations, loading, onDelete, onTogglePublish }) => {
  if (loading) {
    return <div className="text-center text-gray-400">Loading creations...</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-700 border-b border-gray-600">
          <tr>
            <th className="text-left py-4 px-6">User ID</th>
            <th className="text-left py-4 px-6">Type</th>
            <th className="text-left py-4 px-6">Prompt</th>
            <th className="text-left py-4 px-6">Status</th>
            <th className="text-left py-4 px-6">Created</th>
            <th className="text-left py-4 px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {creations.length > 0 ? (
            creations.map((creation) => (
              <tr key={creation._id} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="py-4 px-6 text-blue-400">{creation.userId}</td>
                <td className="py-4 px-6">
                  <span className="bg-purple-600 px-3 py-1 rounded text-xs">
                    {creation.type}
                  </span>
                </td>
                <td className="py-4 px-6 text-gray-300 truncate max-w-xs">
                  {creation.prompt.substring(0, 40)}...
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => onTogglePublish(creation._id, creation.publish)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      creation.publish
                        ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                        : "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                    }`}
                  >
                    {creation.publish ? "Published" : "Hidden"}
                  </button>
                </td>
                <td className="py-4 px-6 text-gray-400">
                  {new Date(creation.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => onDelete(creation._id)}
                    className="text-red-400 hover:text-red-300 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-4 px-6 text-center text-gray-400">
                No creations found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const PromptsTab = ({ prompts, loading, onDelete, onAddClick }) => {
  if (loading) {
    return <div className="text-center text-gray-400">Loading prompts...</div>;
  }

  return (
    <div>
      <button
        onClick={onAddClick}
        className="mb-6 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2 transition"
      >
        <Plus size={20} />
        Add Prompt
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.length > 0 ? (
          prompts.map((prompt) => (
            <div key={prompt._id} className="bg-gray-800 p-6 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-bold">{prompt.title}</h3>
                  <p className="text-sm text-gray-400">{prompt.category}</p>
                </div>
                <button
                  onClick={() => onDelete(prompt._id)}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {prompt.content}
              </p>
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs px-3 py-1 rounded ${
                    prompt.isPublic
                      ? "bg-green-600/20 text-green-400"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {prompt.isPublic ? "Public" : "Private"}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(prompt.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400 py-8">
            No prompts found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
