const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  try {
    const filePath = path.join(process.cwd(), '/temp', 'posts.json')

    let posts = { posts: [] }
    try {
      const data = await fs.readFile(filePath, 'utf8')
      posts = JSON.parse(data)
    } catch (error) {
      // File doesn't exist, return empty array
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(posts)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}