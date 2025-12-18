import { useState } from 'react'
import api from '../../../../api/axios'

type Tag = {
  tagName: string
}

const FetchTags = () => {
  const userStr = localStorage.getItem('loggedInUser')
  const user = userStr ? JSON.parse(userStr) : null

  const [tags, setTags] = useState<Tag[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  if (!user) {
    console.log('No user logged in')
    return <p className="text-red-600">User not logged in</p>
  }

  // 🔥 Fetch tags immediately
  if (loading) {
    console.log('Fetching tags from backend...')
    api
      .get('/tag/all', { withCredentials: true })
      .then(res => {
        console.log('Response from backend:', res.data)
        const fetchedTags = res.data.tags || []
        console.log('Fetched tags array:', fetchedTags)
        setTags(fetchedTags)
        setLoading(false)
      })
      .catch(err => {
        console.log('Error fetching tags:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch tags')
        setLoading(false)
      })
  }

  const handleDelete = async (tagName: string) => {
    console.log('Deleting tag:', tagName)
    try {
      await api.post(
        '/tag/delete',
        { tag_name: tagName },
        { withCredentials: true }
      )
      console.log('Deleted tag successfully:', tagName)
      setTags(prev => prev.filter(t => t.tagName !== tagName))
    } catch (err: unknown) {
      console.log('Error deleting tag:', err)
      if (err instanceof Error) setError(err.message)
      else setError('Failed to delete tag')
    }
  }

  console.log('Current tags in state:', tags)

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Tags</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {loading && <p>Loading tags...</p>}

      {!loading && tags.length === 0 && <p>No tags available.</p>}

      <ul className="space-y-2">
        {tags.map(tag => (
          <li
            key={tag.tagName}
            className="flex justify-between items-center border p-2 rounded bg-gray-50 hover:bg-gray-100"
          >
            <span className="text-gray-800">{tag.tagName}</span>
            <span
              className="text-red-500 font-bold cursor-pointer hover:text-red-700"
              onClick={() => handleDelete(tag.tagName)}
            >
              X
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default FetchTags
