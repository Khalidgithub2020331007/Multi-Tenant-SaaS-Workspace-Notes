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
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchPublicNote = async () => {
    try {
      console.log('📡 Fetching public note...')
      const res = await api.get('/note/show_notes')

      console.log('✅ Public Note Response:', res.data)

      setNote(res.data.note)
    } catch (err: any) {
      console.error('❌ Public Note Fetch Error:', err)
      setError(err.response?.data?.message || 'Failed to load public note')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPublicNote()
  }, [])

  if (loading) return <p className="p-4">Loading public note...</p>

  if (error)
    return <p className="p-4 text-red-500 font-semibold">{error}</p>

  if (!note)
    return <p className="p-4 text-gray-500">No public note available</p>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📢 Public Note</h1>

      <div className="border rounded-lg p-4 shadow-sm bg-white">
        <p className="text-sm text-gray-500 mb-2">
          Workspace: <span className="font-medium">{note.workspaceName}</span>
        </p>

        <h2 className="text-xl font-semibold mb-2">{note.title}</h2>

        <p className="text-gray-700 whitespace-pre-line">
          {note.content}
        </p>

        <p className="text-xs text-gray-400 mt-4">
          Created at:{' '}
          {new Date(note.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  )
}

export default PublicNotes
