// frontend/src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/admin/dashboard/stats", {
        headers: { "x-user-id": localStorage.getItem("userId") },
      });

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">System Analytics and Overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <StatCard
            title="Total Creations"
            value={stats?.totalCreations || 0}
            color="bg-blue-600"
          />
          <StatCard
            title="Unique Users"
            value={stats?.uniqueUsers || 0}
            color="bg-purple-600"
          />
          <StatCard
            title="Public Creations"
            value={stats?.publicCreations || 0}
            color="bg-green-600"
          />
          <StatCard
            title="Total Prompts"
            value={stats?.totalPrompts || 0}
            color="bg-pink-600"
          />
          <StatCard
            title="Total Likes"
            value={stats?.totalLikes || 0}
            color="bg-yellow-600"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Creations by Type Chart */}
          {stats?.creationsByType && stats.creationsByType.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Creations by Type</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.creationsByType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top Creators */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Top Creators</h2>
            <div className="space-y-3">
              {stats?.topCreators && stats.topCreators.length > 0 ? (
                stats.topCreators.map((creator, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-700 rounded"
                  >
                    <span className="font-semibold">#{index + 1} {creator._id}</span>
                    <span className="text-blue-400">{creator.count} creations</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Creations */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Recent Creations</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left py-3 px-4">User ID</th>
                  <th className="text-left py-3 px-4">Type</th>
                  <th className="text-left py-3 px-4">Prompt</th>
                  <th className="text-left py-3 px-4">Published</th>
                  <th className="text-left py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentCreations && stats.recentCreations.length > 0 ? (
                  stats.recentCreations.map((creation) => (
                    <tr key={creation._id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-3 px-4 text-blue-400">{creation.userId}</td>
                      <td className="py-3 px-4">
                        <span className="bg-purple-600 px-2 py-1 rounded text-xs">
                          {creation.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 truncate text-gray-300">
                        {creation.prompt.substring(0, 30)}...
                      </td>
                      <td className="py-3 px-4">
                        {creation.publish ? (
                          <span className="text-green-400">✓</span>
                        ) : (
                          <span className="text-red-400">✗</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {new Date(creation.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-3 px-4 text-center text-gray-400">
                      No creations yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className={`${color} p-6 rounded-lg text-center`}>
    <p className="text-gray-100 text-sm font-semibold mb-2">{title}</p>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

export default AdminDashboard;
