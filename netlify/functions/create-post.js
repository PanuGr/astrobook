const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const newPost = JSON.parse(event.body)
    const filePath = path.join(process.cwd(), 'data', 'posts.json')

    // Read existing posts
    let posts = { posts: [] }
    try {
      const data = await fs.readFile(filePath, 'utf8')
      posts = JSON.parse(data)
    } catch (error) {
      // File doesn't exist, use empty array
    }

    // Add new post
    posts.posts.unshift(newPost)

    // Ensure data directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true })

    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(posts, null, 2))

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ success: true })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}