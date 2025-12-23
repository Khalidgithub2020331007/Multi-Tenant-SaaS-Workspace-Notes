import { useEffect, useState } from 'react'
import api from '../../../api/axios'

type Note = {
  id: number
  title: string
  content: string
  noteType: 'draft' | 'public' | 'private'
  createdAt: string
  workspaceName: string | null
  tag: string[]
}

type Meta = {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
}

const MyNote = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [meta, setMeta] = useState<Meta | null>(null)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ================= FETCH NOTES =================
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true)
        setError('')

        const res = await api.get('/note/author_notes', {
          params: { page, limit },
        })

        console.log('Notes response:', res.data)

        setNotes(res.data.notes)
        setMeta(res.data.meta)
      } catch (err) {
        console.error('Fetch error:', err)
        setError('Failed to fetch notes')
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [page, limit])

  // ================= UI STATES =================
  if (loading) return <p>Loading notes...</p>
  if (error) return <p className="text-red-500">{error}</p>

  // ================= UI =================
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Notes</h2>

      {/* TABLE */}
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Content</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Tags</th>
            <th className="border px-4 py-2">Workspace</th>
            <th className="border px-4 py-2">Created</th>
          </tr>
        </thead>

        <tbody>
          {notes.map((note) => (
            <tr key={note.id}>
              <td className="border px-4 py-2">{note.id}</td>
              <td className="border px-4 py-2">{note.title}</td>
              <td className="border px-4 py-2">{note.content}</td>
              <td className="border px-4 py-2">{note.noteType}</td>

              {/* TAGS */}
              <td className="border px-4 py-2">
                {note.tag.map((t) => (
                  <span
                    key={t}
                    className="mr-1 px-2 py-1 bg-gray-200 rounded text-sm"
                  >
                    {t}
                  </span>
                ))}
              </td>

              <td className="border px-4 py-2">
                {note.workspaceName ?? '—'}
              </td>

              <td className="border px-4 py-2">
                {new Date(note.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      {meta && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            Page {meta.currentPage} of {meta.lastPage} — Total {meta.total}
          </p>

          <div className="space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className={`px-3 py-1 rounded ${
                page === 1
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 text-white'
              }`}
            >
              Previous
            </button>

            <button
              disabled={page === meta.lastPage}
              onClick={() => setPage((p) => p + 1)}
              className={`px-3 py-1 rounded ${
                page === meta.lastPage
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 text-white'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyNote
