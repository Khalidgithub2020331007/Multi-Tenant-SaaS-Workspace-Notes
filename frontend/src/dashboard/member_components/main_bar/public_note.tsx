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
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  // 🔹 fetch public notes
  useEffect(() => {
    const fetchPublicNotes = async () => {
      try {
        console.log('🟡 Fetching public notes...')
        const res = await api.get('/note/show_notes')

        console.log('🟢 Public notes API response:', res.data)

        setNotes(res.data.note)
      } catch (err) {
        console.error('❌ Fetch error:', err)
        setError('Failed to fetch public notes')
      } finally {
        setLoading(false)
      }
    }
    fetchPublicNotes()
  }, [])

  // 🔹 vote handler
  const handleVote = async (
    e: React.MouseEvent,
    noteId: number,
    type: 'upvote' | 'downvote'
  ) => {
    e.stopPropagation()

    console.log('🟢 Vote clicked:', { noteId, type })

    try {
      const res = await api.post(`/note/${noteId}/vote`, { 
        vote_value:type==='upvote'?1:-1,
       })

      console.log('🟢 Vote API response:', res.data)

      const updatedNote = res.data.note

      console.log('🟣 Updating state for note:', updatedNote)

      setNotes((prev) => {
        console.log('🟣 Previous notes state:', prev)

        const updated = prev.map((n) =>
          n.id === noteId
            ? {
                ...n,
                upvotes: updatedNote.upvotes,
                downvotes: updatedNote.downvotes,
                totalvotes: updatedNote.totalvotes,
              }
            : n
        )

        console.log('🟣 Updated notes state:', updated)
        return updated
      })
    } catch (error) {
      console.error('❌ Vote failed:', error)
    }
  }

  // 🔹 render log
  console.log('🔵 Rendering notes:', notes)

  if (loading) return <p className="p-4">Loading public notes...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>
  if (notes.length === 0) return <p className="p-4">No public notes found</p>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📢 Public Notes</h1>

      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="border rounded-lg p-5 shadow-sm bg-white hover:bg-gray-50"
            onClick={() => {
              console.log('🔵 Card clicked:', note.id)
              setSelectedNote(note)
            }}
          >
            <p className="text-sm text-gray-500">
              Workspace:{' '}
              <span className="font-medium">{note.workspaceName}</span>
            </p>

            <h2 className="text-xl font-bold mt-1">{note.title}</h2>
            <p className="text-gray-700 mt-2 whitespace-pre-line">
              {note.content}
            </p>

            {/* 🔥 Voting section */}
            <div className="flex gap-4 mt-3">
              <span
                className="cursor-pointer select-none"
                onClick={(e) => handleVote(e, note.id, 'upvote')}
              >
                👍 {note.upvotes}
              </span>

              <span
                className="cursor-pointer select-none"
                onClick={(e) => handleVote(e, note.id, 'downvote')}
              >
                👎 {note.downvotes}
              </span>
            </div>

            <p className="text-xs text-gray-400 pt-3">
              Created at: {new Date(note.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* 🔹 Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <h2 className="text-2xl font-bold mb-4">📄 Note Details</h2>

            <p><strong>Title:</strong> {selectedNote.title}</p>
            <p><strong>Content:</strong> {selectedNote.content}</p>
            <p><strong>Type:</strong> {selectedNote.noteType}</p>
            <p><strong>Workspace:</strong> {selectedNote.workspaceName}</p>

            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => {
                console.log('🔵 Modal closed')
                setSelectedNote(null)
              }}
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
