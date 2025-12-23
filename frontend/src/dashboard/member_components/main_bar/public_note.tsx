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

type Meta = {
  current_page: number
  last_page: number
  total: number
  per_page: number
}

const PublicNotes = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [meta, setMeta] = useState<Meta>({ current_page: 1, last_page: 1, total: 0, per_page: 20 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10) // default 10 per page
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  // 🔹 Fetch public notes with pagination & dynamic limit
 useEffect(() => {
    const fetchPublicNotes = async () => {
      setLoading(true)
      setError('') // reset previous error
      try {
        console.log('🟡 Fetching public notes...', { page, limit })
        
        const res = await api.get('/note/show_notes', { params: { page, limit } })
        console.log('🟢 API response:', res.data)
      
        // Check if the response has 'note' array
        if (!res.data || !res.data.note) {
          console.warn('⚠️ API response missing "note"', res.data)
          setNotes([])
          setMeta({
            current_page: 1,
            last_page: 1,
            total: 0,
            per_page: limit,
          })
          return
        }
      
        // Check if the 'note' array is empty
        if (res.data.note.length === 0) {
          console.warn('⚠️ API returned empty note array', res.data)
          setNotes([])
          setMeta(res.data.meta || {
            current_page: 1,
            last_page: 1,
            total: 0,
            per_page: limit,
          })
          return
        }
      
        console.log('✅ Notes fetched:', res.data.note.length)
        setNotes(res.data.note)
        setMeta(res.data.meta)
      
      } catch (err) {
        console.error('❌ Fetch error:', err)
        setError('Failed to fetch public notes')
        setNotes([]) // clear notes if fetch fails
        setMeta({
          current_page: 1,
          last_page: 1,
          total: 0,
          per_page: limit,
        })
      } finally {
        setLoading(false)
      }
    }
  
    fetchPublicNotes()
  }, [page, limit]) // refetch when page or limit changes
  


  // 🔹 Vote handler
  const handleVote = async (e: React.MouseEvent, noteId: number, type: 'upvote' | 'downvote') => {
    e.stopPropagation()
    try {
      const res = await api.post(`/note/${noteId}/vote`, { vote_value: type === 'upvote' ? 1 : -1 })
      const updatedNote = res.data.note

      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId
            ? { ...n, upvotes: updatedNote.upvotes, downvotes: updatedNote.downvotes, totalvotes: updatedNote.totalvotes }
            : n
        )
      )
    } catch (err) {
      console.error('❌ Vote failed:', err)
    }
  }

  if (loading) return <p className="p-4">Loading public notes...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>
  if (!notes || notes.length === 0) return <p className="p-4">No public notes found</p>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📢 Public Notes</h1>

      {/* 🔹 Limit selector */}
      <div className="mb-4">
        <label className="mr-2 font-medium">
          Notes per page:
        </label>
        <select
          value={limit}
          onChange={(e) => {
            setPage(1) // reset to first page when limit changes
            setLimit(Number(e.target.value))
          }}
          className="border px-2 py-1 rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* 🔹 Notes list */}
      <div className="space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="border rounded-lg p-5 shadow-sm bg-white hover:bg-gray-50 cursor-pointer"
            onClick={() => setSelectedNote(note)}
          >
            <p className="text-sm text-gray-500">
              Workspace: <span className="font-medium">{note.workspaceName}</span>
            </p>

            <h2 className="text-xl font-bold text-gray-800 mt-1">{note.title}</h2>
            <p className="text-gray-700 mt-2 whitespace-pre-line">{note.content}</p>

            {/* 🔹 Voting */}
            <div className="flex gap-4 mt-3">
              <span className="cursor-pointer select-none" onClick={(e) => handleVote(e, note.id, 'upvote')}>
                👍 {note.upvotes}
              </span>

              <span className="cursor-pointer select-none" onClick={(e) => handleVote(e, note.id, 'downvote')}>
                👎 {note.downvotes}
              </span>
            </div>

            <p className="text-xs text-gray-400 pt-3">
              Created at: {new Date(note.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* 🔹 Pagination */}
      <div className="flex gap-4 justify-center items-center mt-6">
        <button
          disabled={page <= 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>
          Page {meta.current_page} of {meta.last_page}
        </span>

        <button
          disabled={page >= meta.last_page}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
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
