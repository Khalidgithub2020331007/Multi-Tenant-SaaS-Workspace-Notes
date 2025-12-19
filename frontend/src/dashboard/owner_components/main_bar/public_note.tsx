import { useEffect, useState } from 'react'
import api from '../../../api/axios'

type Note = {
  id: number
  title: string
  content: string
  noteType: 'draft' | 'public' | 'private'
  createdAt: string
  workspaceName: string
}

const PublicNotes = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPublicNotes = async () => {
    try {
      console.log('📡 Fetching public notes...')
      const res = await api.get('/note/show_notes')

      console.log('✅ Public Note API Response:', res.data)

      setNotes(res.data.note) // 🔥 array সেট করা হচ্ছে
    } catch (err: any) {
      console.error('❌ Public Note Fetch Error:', err)
      setError(err.response?.data?.message || 'Failed to fetch public notes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPublicNotes()
  }, [])

  if (loading) {
    return <p className="p-4">Loading public notes...</p>
  }

  if (error) {
    return <p className="p-4 text-red-500 font-semibold">{error}</p>
  }

  if (notes.length === 0) {
    return <p className="p-4 text-gray-500">No public notes found</p>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📢 Public Notes</h1>

      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="border rounded-lg p-5 shadow-sm bg-white"
          >
            <p className="text-sm text-gray-500">
              Workspace:{' '}
              <span className="font-medium">{note.workspaceName}</span>
            </p>

            <h2 className="text-xl font-bold text-gray-800 mt-1">
              Title:{note.title}
            </h2>

            <p className="text-gray-700 mt-2 whitespace-pre-line">
              Content:{note.content}
            </p>

            <p className="text-xs text-gray-400 pt-3">
              Created at:{' '}
              {new Date(note.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PublicNotes
