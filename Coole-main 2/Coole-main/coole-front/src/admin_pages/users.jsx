import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const AdminUserPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await axios.get(`/api/admin/users`, {
          withCredentials: true,
        });
        setUsers(response.data); // ✅ Fixed typo
        setLoading(false); // ✅ Ensure loading state updates
      } catch (err) {
        setError("❌ Not available.");
        setLoading(false);
        setTimeout(() => navigate("/login"), 1500); // ✅ Slight delay before redirect
      }
    }
    fetchUserData();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Admin Users</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto w-full max-w-4xl">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 text-black py-2">Name</th>
                <th className="px-4 text-black py-2">Email</th>
                <th className="px-4 text-black  py-2">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="px-4 text-black  py-2">{user.name}</td>
                  <td className="px-4 text-black  py-2">{user.email}</td>
                  <td className="px-4 text-black  py-2">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default AdminUserPage;
