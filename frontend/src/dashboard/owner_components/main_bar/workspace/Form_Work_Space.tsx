import { useState } from 'react'
import { createWorkspace } from '../../../../api/workspace'
// import api from '../../../../api/axios'

const CreateWorkspaceForm = () => {
  const userStr = localStorage.getItem('loggedInUser');
  const user = userStr ? JSON.parse(userStr) : null;

  const [workspaceName, setWorkspaceName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  if (!user) {
    return <p className="text-red-600">User not logged in</p>
  }

  // 🔐 Only owner can create workspace
  if (user.role !== 'owner') {
    return (
      <p className="text-gray-600">
        You are not allowed to create a workspace
      </p>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!workspaceName.trim()) {
      setError('Workspace name is required')
      return
    }

    try {
      setLoading(true)

      await createWorkspace({
          workspace_name: workspaceName,
          company_hostname: user.company_hostname, // snake_case
        });
        

      setSuccess('Workspace created successfully')
      setWorkspaceName('')
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('Network error or server is down');
      }
    }
  }

  return (
    <div className="max-w-md bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">
        Create New Workspace
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Workspace Name
          </label>
          <input
            type="text"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="e.g. engineering"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Company Hostname
          </label>
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
  )
}

export default CreateWorkspaceForm
