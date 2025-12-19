import { useState } from 'react';
import api from '../../../../api/axios';

type Workspace = {
  workspaceName: string;
};

const Fetch_Work_Space = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userStr = localStorage.getItem('loggedInUser');
  const user = userStr ? JSON.parse(userStr) : null;

  // 🔹 Fetch workspaces once without useEffect
  if (user && workspaces.length === 0 && !loading && !error) {
    setLoading(true);
    api
      .get('/workspace/all')
      .then((res) => {
        if (res.data.workspaces && res.data.workspaces.length > 0) {
          setWorkspaces(res.data.workspaces);
        } else {
          setError('No workspaces found');
        }
      })
      .catch((err: unknown) => {
        if (err instanceof Error) setError(err.message);
        else setError('Network error or server is down');
      })
      .finally(() => setLoading(false));
  }


  const handleDelete = async (workspaceName: string) => {
    if (!confirm(`Are you sure you want to delete workspace "${workspaceName}"?`)) return;

    try {
      await api.post('/workspace/delete', {
        workspace_name: workspaceName,
        company_hostname: user.company_hostname,
      });

      // Remove from UI after successful delete
      setWorkspaces((prev) => prev.filter((ws) => ws.workspaceName !== workspaceName));
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert('Failed to delete workspace');
    }
  };
  if (!user) return <p className="text-red-600">User not logged in</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Workspaces</h1>

      {loading && <p className="text-gray-500 text-center">Loading workspaces...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {workspaces.map((ws, index) => (
          <div
            key={index}
            className="relative p-4 bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-800">{ws.workspaceName}</h2>

            {/* ❌ X sign for delete */}
            <span
              onClick={() => handleDelete(ws.workspaceName)}
              className="absolute top-2 right-2 cursor-pointer text-red-500 font-bold text-lg hover:text-red-700"
            >
              &times;
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fetch_Work_Space;
