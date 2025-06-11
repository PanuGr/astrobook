# Facebook Clone Step-by-Step Guide

## Phase 1: Project Setup

### 1. Initialize Astro Project
```bash
npm create astro@latest
npm install
npm install @tailwindcss/typography
```

### 2. Configure Tailwind
See Astro documentation

### 3. Setup Supabase
```bash
npm install @supabase/supabase-js
```

Create `.env`:
```
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Phase 2: Authentication Setup

### 4. Create Supabase Client
Create `src/lib/supabase.js`:
```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 5. Auth Helper Functions
Create `src/lib/auth.js`:
```js
import { supabase } from './supabase.js'

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  return { data, error }
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
```

## Phase 3: Page Structure

### 6. Login Page
Create `src/pages/login.astro`:
```astro
---
import Layout from '../layouts/Layout.astro'
---

<Layout title="Login - FriendsBook">
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to FriendsBook
        </h2>
      </div>
      <form id="login-form" class="mt-8 space-y-6">
        <div>
          <input
            id="email"
            type="email"
            required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Email address"
          />
        </div>
        <div>
          <input
            id="password"
            type="password"
            required
            class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Password"
          />
        </div>
        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </div>
        <div class="text-center">
          <a href="/signup" class="text-indigo-600 hover:text-indigo-500">
            Don't have an account? Sign up
          </a>
        </div>
      </form>
    </div>
  </div>

  <script>
    import { signIn } from '../lib/auth.js'
    
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault()
      const email = document.getElementById('email').value
      const password = document.getElementById('password').value
      
      const { data, error } = await signIn(email, password)
      
      if (error) {
        alert('Error: ' + error.message)
      } else {
        window.location.href = '/'
      }
    })
  </script>
</Layout>
```

### 7. Signup Page
Create `src/pages/signup.astro` (similar structure to login, use `signUp` function)

### 8. Main Layout
Create `src/layouts/Layout.astro`:
```astro
---
export interface Props {
  title: string
}

const { title } = Astro.props
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content="A simple Facebook clone" />
    <meta name="viewport" content="width=device-width" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title}</title>
  </head>
  <body>
    <slot />
    <style is:global>
      @import "../styles/global.css";
    </style>
  </body>
</html>
```

## Phase 4: Main Feed Page

### 9. Home Page
Create `src/pages/index.astro`:
```astro
---
import Layout from '../layouts/Layout.astro'
---

<Layout title="FriendsBook">
  <div id="app">
    <!-- Will be populated by JavaScript -->
  </div>

  <script>
    import { supabase } from '../lib/supabase.js'
    import { getCurrentUser } from '../lib/auth.js'

    // Check auth on page load
    async function checkAuth() {
      const user = await getCurrentUser()
      if (!user) {
        window.location.href = '/login'
        return
      }
      
      // User is authenticated, load the main app
      loadMainApp(user)
    }

    function loadMainApp(user) {
      document.getElementById('app').innerHTML = `
        <div class="min-h-screen bg-gray-100">
          <!-- Navigation -->
          <nav class="bg-blue-600 text-white p-4">
            <div class="container mx-auto flex justify-between items-center">
              <h1 class="text-xl font-bold">FriendsBook</h1>
              <div class="flex items-center space-x-4">
                <span>Welcome, ${user.email}</span>
                <button id="logout-btn" class="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded">
                  Logout
                </button>
              </div>
            </div>
          </nav>

          <!-- Main Content -->
          <div class="container mx-auto mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
            <!-- Left Sidebar -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-lg shadow p-4">
                <h3 class="font-semibold mb-3">My Profile</h3>
                <div class="flex items-center space-x-3">
                  <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <span>${user.email}</span>
                </div>
              </div>
            </div>

            <!-- Main Feed -->
            <div class="lg:col-span-2">
              <!-- Post Creation -->
              <div class="bg-white rounded-lg shadow p-4 mb-6">
                <textarea
                  id="post-content"
                  placeholder="What's on your mind?"
                  class="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                ></textarea>
                <button
                  id="post-btn"
                  class="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Post
                </button>
              </div>

              <!-- Posts Feed -->
              <div id="posts-container">
                <!-- Posts will be loaded here -->
              </div>
            </div>

            <!-- Right Sidebar -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-lg shadow p-4">
                <h3 class="font-semibold mb-3">Upcoming Events</h3>
                <p class="text-gray-500">No events yet</p>
              </div>
            </div>
          </div>
        </div>
      `

      // Add event listeners
      setupEventListeners(user)
      loadPosts()
    }

    function setupEventListeners(user) {
      // Logout
      document.getElementById('logout-btn').addEventListener('click', async () => {
        await supabase.auth.signOut()
        window.location.href = '/login'
      })

      // Post creation
      document.getElementById('post-btn').addEventListener('click', async () => {
        const content = document.getElementById('post-content').value.trim()
        if (!content) return

        await createPost(user, content)
        document.getElementById('post-content').value = ''
        loadPosts()
      })
    }

    async function createPost(user, content) {
      const post = {
        id: Date.now().toString(),
        userId: user.id,
        username: user.email.split('@')[0],
        content: content,
        timestamp: new Date().toISOString(),
        likes: [],
        comments: []
      }

      // Send to serverless function
      try {
        await fetch('/.netlify/functions/create-post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(post)
        })
      } catch (error) {
        console.error('Error creating post:', error)
      }
    }

    async function loadPosts() {
      try {
        const response = await fetch('/.netlify/functions/get-posts')
        const data = await response.json()
        
        const postsHtml = data.posts.map(post => `
          <div class="bg-white rounded-lg shadow p-4 mb-4">
            <div class="flex items-center space-x-3 mb-3">
              <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <h4 class="font-semibold">${post.username}</h4>
                <p class="text-gray-500 text-sm">${new Date(post.timestamp).toLocaleString()}</p>
              </div>
            </div>
            <p class="mb-3">${post.content}</p>
            <div class="flex space-x-4 text-gray-500">
              <button class="hover:text-blue-600">👍 Like (${post.likes.length})</button>
              <button class="hover:text-blue-600">💬 Comment (${post.comments.length})</button>
            </div>
          </div>
        `).join('')
        
        document.getElementById('posts-container').innerHTML = postsHtml
      } catch (error) {
        console.error('Error loading posts:', error)
      }
    }

    // Initialize app
    checkAuth()
  </script>
</Layout>
```

## Phase 5: Serverless Functions

### 10. Create Posts Function
Create `netlify/functions/create-post.js`:
```js
const fs = require('fs').promises
const path = require('path')

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
```

### 11. Get Posts Function
Create `netlify/functions/get-posts.js`:
```js
const fs = require('fs').promises
const path = require('path')

exports.handler = async (event, context) => {
  try {
    const filePath = path.join(process.cwd(), 'data', 'posts.json')
    
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
```

## Phase 6: Deploy

### 12. Netlify Configuration
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 13. Deploy
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod
```

## Next Steps

1. Set up Supabase project and get credentials
2. Add environment variables to Netlify
3. Test authentication flow
4. Add like/comment functionality
5. Implement image uploads
6. Add friend system
7. Add real-time updates

## File Structure Summary
```
friendsbook/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── login.astro
│   │   └── signup.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   ├── supabase.js
│   │   └── auth.js
│   └── styles/
│       └── global.css
├── netlify/
│   └── functions/
│       ├── create-post.js
│       └── get-posts.js
├── data/
│   └── posts.json
└── netlify.toml
```