import { useEffect, useState, useCallback } from 'react'
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
  currentPage: number
  firstPage: number
  lastPage: number
  perPage: number
  total: number
  firstPageUrl?: string
  lastPageUrl?: string
  nextPageUrl?: string
  previousPageUrl?: string
}

const PublicNotes = () => {
  const [sort, setSort] = useState<'new'|'old'|'upvotes' | 'downvotes'>('new')
  const [notes, setNotes] = useState<Note[]>([])
  const [meta, setMeta] = useState<Meta>({
    currentPage: 1,
    firstPage: 1,
    lastPage: 1,
    perPage: 10,
    total: 0,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // 🔹 Fetch public notes with debounce
  const fetchPublicNotes = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/note/show_notes', { params: { page, limit, search: searchQuery, sort } })

      const data = res.data
      if (!data || !data.note) {
        setNotes([])
        setMeta({ currentPage: 1, firstPage: 1, lastPage: 1, perPage: limit, total: 0 })
        return
      }

      setNotes(data.note)
      setMeta({
        currentPage: data.meta.currentPage,
        firstPage: data.meta.firstPage,
        lastPage: data.meta.lastPage,
        perPage: data.meta.perPage,
        total: data.meta.total,
        firstPageUrl: data.meta.firstPageUrl,
        lastPageUrl: data.meta.lastPageUrl,
        nextPageUrl: data.meta.nextPageUrl,
        previousPageUrl: data.meta.previousPageUrl,
      })
    } catch (err) {
      console.error('❌ Fetch error:', err)
      setError('Failed to fetch public notes')
      setNotes([])
      setMeta({ currentPage: 1, firstPage: 1, lastPage: 1, perPage: limit, total: 0 })
    } finally {
      setLoading(false)
    }
  }, [page, limit, searchQuery, sort])

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchPublicNotes()
    }, 500)

    return () => clearTimeout(debounce)
  }, [fetchPublicNotes])

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
  if (!notes.length) return <p className="p-4">No public notes found</p>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📢 Public Notes</h1>

      {/* Search input */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
          className="border px-2 py-1 rounded flex-1"
        />
        <button onClick={() => { setPage(1); fetchPublicNotes() }} className="px-4 py-2 bg-gray-200 rounded">
          Search
        </button>
      </div>

      {/* Limit selector */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Notes per page:</label>
        <select
          value={limit}
          onChange={(e) => { setPage(1); setLimit(Number(e.target.value)) }}
          className="border px-2 py-1 rounded"
        >
          {[5,10,15,20].map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Sort selector */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Sort by:</label>
        <select
          value={sort}
          onChange={(e) => { setPage(1); setSort(e.target.value as 'new' | 'old' | 'upvotes' | 'downvotes') }}
          className="border px-2 py-1 rounded"
        >
          <option value="new">Newest</option>
          <option value="old">Oldest</option>
          <option value="upvotes">Most Upvotes</option>
          <option value="downvotes">Most Downvotes</option>
        </select>
      </div>

      {/* Notes list */}
      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="border rounded-lg p-5 shadow-sm bg-white hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedNote(note)}>
            <p className="text-sm text-gray-500">Workspace: <span className="font-medium">{note.workspaceName}</span></p>
            <h2 className="text-xl font-bold text-gray-800 mt-1">{note.title}</h2>
            <p className="text-gray-700 mt-2 whitespace-pre-line">{note.content}</p>

            {/* Voting */}
            <div className="flex gap-4 mt-3">
              <span className="cursor-pointer select-none" onClick={(e) => handleVote(e, note.id, 'upvote')}>👍 {note.upvotes}</span>
              <span className="cursor-pointer select-none" onClick={(e) => handleVote(e, note.id, 'downvote')}>👎 {note.downvotes}</span>
            </div>

            <p className="text-xs text-gray-400 pt-3">Created at: {new Date(note.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex gap-4 justify-center items-center mt-6">
        <button disabled={page <= meta.firstPage} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Prev</button>
        <span>Page {meta.currentPage} of {meta.lastPage}</span>
        <button disabled={page >= meta.lastPage} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50">Next</button>
      </div>

      {/* Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <h2 className="text-2xl font-bold mb-4">📄 Note Details</h2>
            <p><strong>Title:</strong> {selectedNote.title}</p>
            <p><strong>Content:</strong> {selectedNote.content}</p>
            <p><strong>Type:</strong> {selectedNote.noteType}</p>
            <p><strong>Workspace:</strong> {selectedNote.workspaceName}</p>
            <button className="mt-4 px-4 py-2 bg-red-500 text-white rounded" onClick={() => setSelectedNote(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PublicNotes
