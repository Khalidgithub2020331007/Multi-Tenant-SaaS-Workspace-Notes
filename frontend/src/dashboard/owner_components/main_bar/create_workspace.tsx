
import { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { createWorkspace } from '../../../api/workspace';

type Workspace = {
  workspaceName: string;
};

const CreateWorkSpace = () => {
  const userStr = localStorage.getItem('loggedInUser');
  const user = userStr ? JSON.parse(userStr) : null;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [, setFetching] = useState(false);
  const [limit, setLimit] = useState(5);


  // Fetch workspaces initially
  useEffect(() => {
    setFetching(true);
    api
      .get(`/workspace/all?page=${page}&limit=${limit}`)
      .then((res) => {
        setWorkspaces(res.data.workspaces.data);
        setTotalPages(res.data.workspaces.meta.lastPage);
      })
      .catch(() => setError('Failed to fetch workspaces'))
      .finally(() => setFetching(false));
  }, [page,limit]);


  // Handle creating new workspace
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!workspaceName.trim()) {
      setError('Workspace name is required');
      return;
    }

    try {
      setLoading(true);
      await createWorkspace({
        workspace_name: workspaceName,
        company_hostname: user.company_hostname,
      });

      const newWorkspace = { workspaceName: workspaceName };
      setWorkspaces((prev) => [...prev, newWorkspace]); // 🔹 add instantly
      setSuccess('Workspace created successfully');
      setWorkspaceName('');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Network error or server is down');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (name: string) => {
    if (!confirm(`Are you sure you want to delete workspace "${name}"?`)) return;

    try {
      await api.post('/workspace/delete', {
        workspace_name: name,
        company_hostname: user.company_hostname,
      });
      setWorkspaces((prev) => prev.filter((ws) => ws.workspaceName !== name));
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message);
      else alert('Failed to delete workspace');
    }
  };
   if (!user) return <p className="text-red-600">User not logged in</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* ===== Create Workspace Form ===== */}
      {user.role === 'owner' ? (
        <div className="max-w-md bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Create New Workspace</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Workspace Name</label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="e.g. engineering"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Company Hostname</label>
              <input
                type="text"
                value={user.company_hostname}
                disabled
                className="w-full bg-gray-100 border rounded-lg px-3 py-2"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Workspace'}
            </button>
          </form>
        </div>
      ) : (
        <p className="text-gray-600">You are not allowed to create a workspace</p>
      )}

      {/* ===== Workspace List ===== */}
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Workspaces</h1>

        {workspaces.length === 0 && <p className="text-gray-500 text-center">No workspaces found</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {workspaces.map((ws, index) => (
            <div
              key={index}
              className="relative p-4 bg-white rounded-xl shadow hover:shadow-lg transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800">{ws.workspaceName}</h2>
              <span
                onClick={() => handleDelete(ws.workspaceName)}
                className="absolute top-2 right-2 cursor-pointer text-red-500 font-bold text-lg hover:text-red-700"
              >
                &times;
              </span>
            </div>
          ))}
        </div>
        {/* ===== Pagination ===== */}
        <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1) }}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="font-semibold">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      </div>
    </div>
  );
};

export default CreateWorkSpace;
