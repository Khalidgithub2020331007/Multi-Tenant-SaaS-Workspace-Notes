import { useState, useEffect } from 'react'
import api from '../../../api/axios'

type Tag = {
  tagName: string
}

const CreateTag = () => {
  // ================= User =================
  const userStr = localStorage.getItem('loggedInUser')
  const user = userStr ? JSON.parse(userStr) : null

  // ================= State =================
  const [tagName, setTagName] = useState('')
  const [tags, setTags] = useState<Tag[]>([])
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [fetchingTags, setFetchingTags] = useState<boolean>(true)



  // ================= Fetch Tags =================
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get('/tag/all')
        setTags(res.data.tags || [])
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message)
        else setError('Failed to fetch tags')
      } finally {
        setFetchingTags(false)
      }
    }

    fetchTags()
  }, [])

  // ================= Create Tag =================
  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!tagName.trim()) {
      setError('Tag name is required')
      return
    }

    try {
      setLoading(true)
      const res = await api.post('/tag/create', { tag_name: tagName })
      setSuccess(res.data.message)
      setTagName('')

      // Update local tag list immediately
      setTags(prev => [...prev, { tagName: res.data.tag_name || tagName }])
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Network error or server down')
    } finally {
      setLoading(false)
    }
  }

  // ================= Delete Tag =================
  const handleDelete = async (tagName: string) => {
    try {
      await api.post('/tag/delete', { tag_name: tagName })
      setTags(prev => prev.filter(t => t.tagName !== tagName))
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message)
      else setError('Failed to delete tag')
    }
  }
    if (!user) return <p className="text-red-600">User not logged in</p>
  if (user.role !== 'owner')
    return <p className="text-gray-600">Only owners can create tags</p>

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow space-y-6">
      {/* ================= Create Tag Form ================= */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Create New Tag</h2>
        <form onSubmit={handleCreateTag} className="space-y-4">
          <input
            type="text"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Enter tag name"
            className="w-full border rounded-lg px-3 py-2"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Tag'}
          </button>
        </form>
      </div>

      {/* ================= Tag List ================= */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Tags</h2>
        {fetchingTags && <p>Loading tags...</p>}
        {!fetchingTags && tags.length === 0 && <p>No tags available.</p>}

        <ul className="space-y-2">
          {tags.map(tag => (
            <li
              key={tag.tagName}
              className="flex justify-between items-center border p-2 rounded bg-gray-50 hover:bg-gray-100"
            >
              <span className="text-gray-800">{tag.tagName}</span>
              <span
                className="text-red-500 font-bold cursor-pointer hover:text-red-700"
                onClick={() => handleDelete(tag.tagName)}
              >
                X
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default CreateTag
