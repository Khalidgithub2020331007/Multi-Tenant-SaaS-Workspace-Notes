import { useState } from 'react'
import api from '../../../../api/axios' // নিশ্চিত হও Axios ঠিক import হয়েছে

const CreateTagForm = () => {
  // ✅ Get logged-in user from localStorage
  const userStr = localStorage.getItem('loggedInUser')
  const user = userStr ? JSON.parse(userStr) : null

  const [tagName, setTagName] = useState('')
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (!user) return <p className="text-red-600">User not logged in</p>
  if (user.role !== 'owner')
    return <p className="text-gray-600">Only owners can create tags</p>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!tagName.trim()) {
      setError('Tag name is required')
      return
    }

    try {
      setLoading(true)
      const res = await api.post('/tag/create', {
        tag_name: tagName,
      })
      setSuccess(res.data.message)
      setTagName('')
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Network error or server down')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Create New Tag</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="Enter tag name"
          className="w-full border rounded-lg px-3 py-2"
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        {/* ✅ Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Tag'}
        </button>
      </form>
    </div>
  )
}

export default CreateTagForm
