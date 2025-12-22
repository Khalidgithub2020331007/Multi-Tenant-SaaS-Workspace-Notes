import { useEffect, useState } from 'react'
import api from '../../../api/axios'

type Note = {
  id: number
  title: string
  content: string
  noteType: 'draft' | 'public' | 'private'
  createdAt: string
  workspaceName: string
  upvotes: number
  downvotes: number
  totalvotes: number
}

const PublicNotes = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedNote, setSelectedNote] = useState<Note | null>(null) // selected note



  useEffect(() => {
      const fetchPublicNotes = async () => {
    try {
      // console.log('📡 Fetching public notes...')
      const res = await api.get('/note/show_notes', ) // cookie পাঠাতে
      console.log(' Public Note API Response:', res.data)
      setNotes(res.data.note)
    } catch (err: unknown) {
      console.error('❌ Public Note Fetch Error:', err)
      setError('Failed to fetch public notes')
    } finally {
      setLoading(false)
    }
  }
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
            className="border rounded-lg p-5 shadow-sm bg-white cursor-pointer hover:bg-gray-50"
            onClick={() => console.log('Clicked Note:', note)} // <-- এখানে
          >
            <p className="text-sm text-gray-500">
              Workspace: <span className="font-medium">{note.workspaceName}</span>
            </p>
            <h2 className="text-xl font-bold text-gray-800 mt-1">Title: {note.title}</h2>
            <p className="text-gray-700 mt-2 whitespace-pre-line">Content: {note.content}</p>
            <p>👍:{note.upvotes}</p>
            <p>👎:{note.downvotes}</p> 

            <p className="text-xs text-gray-400 pt-3">
              Created at: {new Date(note.createdAt).toLocaleString()}
            </p>
          </div>
        ))}

      </div>

      {/* Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md relative">
            <h2 className="text-2xl font-bold mb-4">📄 Note Details</h2>
            <p><strong>ID:</strong> {selectedNote.id}</p>
            <p><strong>Title:</strong> {selectedNote.title}</p>
            <p><strong>Content:</strong> {selectedNote.content}</p>
            <p><strong>Type:</strong> {selectedNote.noteType}</p>
            <p><strong>Workspace:</strong> {selectedNote.workspaceName}</p>
            <p><strong>Created At:</strong> {new Date(selectedNote.createdAt).toLocaleString()}</p>

            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => setSelectedNote(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PublicNotes
