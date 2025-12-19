import { useState, useEffect } from 'react'
import api from '../../../api/axios'

type Workspace = { workspaceName: string }
type Tag = { tagName: string }

const CreateNote = () => {
  const userStr = localStorage.getItem('loggedInUser')
  const user = userStr ? JSON.parse(userStr) : null

  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = useState('')
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [noteType, setNoteType] = useState<'draft' | 'public' | 'private'>('draft')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // ✅ useEffect only runs once after mount
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const [wsRes, tagRes] = await Promise.all([
          api.get('/workspace/all', { withCredentials: true }),
          api.get('/tag/all', { withCredentials: true }),
        ])
        console.log('Fetched workspaces:', wsRes.data.workspaces)
        console.log('Fetched tags:', tagRes.data.tags)
        setWorkspaces(wsRes.data.workspaces)
        if (wsRes.data.workspaces.length > 0) setSelectedWorkspace(wsRes.data.workspaces[0].workspaceName)
        setTags(tagRes.data.tags || [])
      } catch (err: any) {
        console.error('Error fetching workspaces or tags:', err.response || err)
        setError('Failed to fetch workspaces or tags')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []) // ✅ empty dependency array: run only once

  const handleTagSelect = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    console.log('Selected Workspace:', selectedWorkspace)
    console.log('Selected Tags:', selectedTags)
    console.log('Title:', title)
    console.log('Content:', content)
    console.log('Note Type:', noteType)

    if (!selectedWorkspace) return setError('Please select a workspace')
    if (!title.trim() || !content.trim()) return setError('Title and content are required')

    try {
      const payload = {
        title,
        content,
        workspace_name: selectedWorkspace,
        note_type: noteType,
        tags: selectedTags,
        company_hostname: user.company_hostname,
      }

      console.log('Sending payload to backend:', payload)

      const res = await api.post('/note/create', payload, { withCredentials: true })
      console.log('Response from backend:', res.data)

      setSuccess(res.data.message)
      setTitle('')
      setContent('')
      setSelectedTags([])
      setNoteType('draft')
    } catch (err: any) {
      console.error('Error creating note:', err.response || err)
      if (err.response?.data?.message) setError(err.response.data.message)
      else if (err instanceof Error) setError(err.message)
      else setError('Failed to create note')
    }
  }

  if (!user) return <p className="text-red-600">User not logged in</p>

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded mt-6">
      <h1 className="text-2xl font-bold mb-4">Create Note</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}
      {loading && <p>Loading workspaces and tags...</p>}

      {!loading && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Workspace</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedWorkspace}
              onChange={(e) => setSelectedWorkspace(e.target.value)}
            >
              <option value="">Select Workspace</option>
              {workspaces.map(ws => (
                <option key={ws.workspaceName} value={ws.workspaceName}>
                  {ws.workspaceName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Tags</label>
            <div className="flex flex-wrap gap-2 border rounded p-2">
              {tags.map(tag => (
                <span
                  key={tag.tagName}
                  className={`px-2 py-1 rounded cursor-pointer ${
                    selectedTags.includes(tag.tagName)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                  onClick={() => handleTagSelect(tag.tagName)}
                >
                  {tag.tagName}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Content</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Note Type</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={noteType}
              onChange={(e) => setNoteType(e.target.value as 'draft' | 'public' | 'private')}
            >
              <option value="draft">Draft</option>
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create Note
          </button>
        </form>
      )}
    </div>
  )
}

export default CreateNote
