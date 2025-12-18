import { useEffect, useState } from 'react'
import api from '../../../api/axios'

type Note = {
  id: number
  title: string
  content: string
  note_type: 'draft' | 'public' | 'private'
  created_at: string
}

const MyNote = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)

  // ================= FETCH NOTES =================
  const fetchNotes = async () => {
    try {
      const res = await api.get('/note/author_notes')
      console.log('Fetched Notes:', res.data.notes)

      // backend -> frontend field mapping
      const fixedNotes = res.data.notes.map((note: any) => ({
        id: note.id,
        title: note.title,
        content: note.content,
        note_type: note.noteType, // camelCase → snake_case
        created_at: note.createdAt,
      }))

      setNotes(fixedNotes)
      setLoading(false)
    } catch (err: any) {
      console.error('Fetch Error:', err)
      setError(err.response?.data?.message || 'Failed to fetch notes')
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  // ================= UPDATE NOTE =================
  const handleUpdate = async (noteId: number) => {
    const note = notes.find((n) => n.id === noteId)
    if (!note) return

    try {
      console.log('Updating Note Payload:', note)

      const res = await api.patch(`/note/${noteId}`, {
        title: note.title,
        content: note.content,
        note_type: note.note_type,
      })

      console.log('Update Response:', res.data)

      setEditingNoteId(null)
      alert('Note updated successfully')
    } catch (err: any) {
      console.error('Update Error:', err)
      alert(err.response?.data?.message || 'Update failed')
    }
  }

  if (loading) return <p>Loading notes...</p>
  if (error) return <p className="text-red-500">{error}</p>

  // ================= UI =================
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Notes</h2>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Content</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Created At</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {notes.map((note) => {
            const isEditing = editingNoteId === note.id

            return (
              <tr key={note.id}>
                <td className="border px-4 py-2">{note.id}</td>

                {/* TITLE */}
                <td className="border px-4 py-2">
                  {isEditing ? (
                    <input
                      className="border px-2 py-1 w-full"
                      value={note.title}
                      onChange={(e) =>
                        setNotes((prev) =>
                          prev.map((n) =>
                            n.id === note.id
                              ? { ...n, title: e.target.value }
                              : n
                          )
                        )
                      }
                    />
                  ) : (
                    note.title
                  )}
                </td>

                {/* CONTENT */}
                <td className="border px-4 py-2">
                  {isEditing ? (
                    <textarea
                      className="border px-2 py-1 w-full"
                      value={note.content}
                      onChange={(e) =>
                        setNotes((prev) =>
                          prev.map((n) =>
                            n.id === note.id
                              ? { ...n, content: e.target.value }
                              : n
                          )
                        )
                      }
                    />
                  ) : (
                    note.content
                  )}
                </td>

                {/* TYPE */}
                <td className="border px-4 py-2">
                  {isEditing ? (
                    <select
                      className="border px-2 py-1"
                      value={note.note_type}
                      onChange={(e) =>
                        setNotes((prev) =>
                          prev.map((n) =>
                            n.id === note.id
                              ? {
                                  ...n,
                                  note_type: e.target.value as
                                    | 'draft'
                                    | 'private'
                                    | 'public',
                                }
                              : n
                          )
                        )
                      }
                    >
                      <option value="draft">Draft</option>
                      <option value="private">Private</option>
                      <option value="public">Public</option>
                    </select>
                  ) : (
                    note.note_type
                  )}
                </td>

                {/* CREATED AT */}
                <td className="border px-4 py-2">
                  {new Date(note.created_at).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>

                {/* ACTION */}
                <td className="border px-4 py-2">
                  {isEditing ? (
                    <button
                      onClick={() => handleUpdate(note.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingNoteId(note.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Update
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default MyNote
