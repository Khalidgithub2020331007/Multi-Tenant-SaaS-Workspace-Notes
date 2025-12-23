import { useState, useEffect } from 'react'
import api from '../../../api/axios'

type Workspace = {
  id: number
  workspaceName: string
}
type Tag = {
  id: number
  tagName: string
}

const CreateNote = () => {
  const userStr = localStorage.getItem('loggedInUser')
  const user = userStr ? JSON.parse(userStr) : null

  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = useState<number | null>(null)
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [noteType, setNoteType] = useState<'draft' | 'public' | 'private'>('draft')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      console.log('No user found in localStorage')
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        console.log('Fetching workspaces and tags from backend...')
        const [wsRes, tagRes] = await Promise.all([
          api.get('/workspace/all'),
          api.get('/tag/all'),
        ])

        console.log('Workspaces response:', wsRes)
        console.log('Tags response:', tagRes)

        const wsArray = wsRes.data.workspaces.data || []
        setWorkspaces(wsArray)
        console.log('Workspaces array:', wsArray)
              
        if (wsArray.length > 0) setSelectedWorkspace(wsArray[0].id)
        
        setTags(tagRes.data.tags || [])

        if (wsRes.data.workspaces?.length > 0) {
          setSelectedWorkspace(wsRes.data.workspaces[0].id)
          console.log('Default selected workspace ID:', wsRes.data.workspaces[0].id)
        }

      } catch (err: unknown) {
        console.error('Error fetching workspaces or tags:', err)
        setError('Failed to fetch workspaces or tags. Check console for details.')
      } finally {
        setLoading(false)
        console.log('Finished fetching workspaces and tags.')
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (selectedWorkspace === null) {
      console.warn('No workspace selected')
      return setError('Please select a workspace')
    }
    if (!title.trim() || !content.trim()) {
      console.warn('Title or content empty')
      return setError('Title and content are required')
    }

    const payload = {
      title,
      content,
      workspace_id: selectedWorkspace,
      note_type: noteType,
      tags: selectedTags,
      company_hostname: user.company_hostname,
    }

    console.log('Submitting note payload:', payload)

    try {
      const res = await api.post('/note/create', payload)
      console.log('Response from backend:', res)

      setSuccess(res.data.message || 'Note created successfully')
      setTitle('')
      setContent('')
      setSelectedTags([])
      setNoteType('draft')
      setSelectedWorkspace(null)
    } catch (err: unknown) {
      console.error('Error creating note:', err)
      if (err instanceof Error) console.log('Error message:', err.message)
      setError('Failed to create note. Check console for details.')
    }
  }

  const handleTagSelect = (tagId: number) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    )
    console.log('Selected tags updated:', selectedTags)
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
              value={selectedWorkspace ?? ''}
              onChange={(e) => {
                const val = Number(e.target.value)
                console.log('Selected workspace changed to:', val)
                setSelectedWorkspace(val)
              }}
            >
              <option value="">Select Workspace</option>
              {workspaces.map(ws => (
                <option key={ws.id} value={ws.id}>
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
                  key={tag.id}
                  className={`px-2 py-1 rounded cursor-pointer ${
                    selectedTags.includes(tag.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                  onClick={() => handleTagSelect(tag.id)}
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
              onChange={(e) => {
                setTitle(e.target.value)
                console.log('Title changed:', e.target.value)
              }}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Content</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={5}
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                console.log('Content changed:', e.target.value)
              }}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Note Type</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={noteType}
              onChange={(e) => {
                setNoteType(e.target.value as 'draft' | 'public' | 'private')
                console.log('Note type changed to:', e.target.value)
              }}
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
