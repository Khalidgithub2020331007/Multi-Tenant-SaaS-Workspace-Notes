import { useEffect, useState } from 'react'
import api from '../../../api/axios'
type History = {
  id: number
  noteId: number
  noteTitle: string
  noteContent: string
  statusType: 'created' | 'updated' | 'deleted'
  authorUserId: number
  createdAt: string
}

const ShowHistory = () => {
  const [histories, setHistories] = useState<History[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchHistory = async () => {
    try {
      console.log('📡 Fetching author note history...')
      const res = await api.get('/note_history/author')
      console.log('✅ API Response:', res.data)

      const fixedHistories = res.data.histories.map((h: any) => ({
        ...h,
        createdAt: h.createdAt,
      }))

      setHistories(fixedHistories)
    } catch (err: any) {
      console.error('❌ Fetch Error:', err)
      setError(err.response?.data?.message || 'Failed to fetch note history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  if (loading) return <p className="p-4">Loading note history...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📝 My Note History</h1>

      {histories.length === 0 && (
        <p className="text-gray-500">No note history found</p>
      )}

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Note ID</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Content</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          {histories.map((h) => (
            <tr key={h.id}>
              <td className="border px-4 py-2">{h.id}</td>
              <td className="border px-4 py-2">{h.noteId}</td>
              <td className="border px-4 py-2">{h.noteTitle}</td>
              <td className="border px-4 py-2">{h.noteContent}</td>
              <td className="border px-4 py-2">{h.statusType}</td>
              <td className="border px-4 py-2">
                {new Date(h.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ShowHistory
