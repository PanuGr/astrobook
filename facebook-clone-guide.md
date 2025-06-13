# Facebook Clone Step-by-Step Guide

## Phase 1: Project Setup

### 1. Initialize Astro Project
```bash
npm create astro@latest friendsbook
cd friendsbook
npm install
npm install @tailwindcss/typography
npx tailwindcss init -p
```

### 2. Configure Tailwind
Edit `tailwind.config.mjs`:
```js
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add to `src/styles/global.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

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

### 9. Create Astro Components

Create `src/components/Navigation.astro`:
```astro
---
const { user } = Astro.props
---

<nav class="bg-blue-600 text-white p-4">
  <div class="container mx-auto flex justify-between items-center">
    <h1 class="text-xl font-bold">FriendsBook</h1>
    <div class="flex items-center space-x-4">
      <span>Welcome, {user.email}</span>
      <button id="logout-btn" class="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded">
        Logout
      </button>
    </div>
  </div>
</nav>
```

Create `src/components/PostInput.astro`:
```astro
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
```

Create `src/components/PostCard.astro`:
```astro
---
const { post } = Astro.props
---

<div class="bg-white rounded-lg shadow p-4 mb-4">
  <div class="flex items-center space-x-3 mb-3">
    <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
    <div>
      <h4 class="font-semibold">{post.username}</h4>
      <p class="text-gray-500 text-sm">{new Date(post.created_at).toLocaleString()}</p>
    </div>
  </div>
  <p class="mb-3">{post.content}</p>
  <div class="flex space-x-4 text-gray-500">
    <button class="hover:text-blue-600">👍 Like ({post.likes})</button>
    <button class="hover:text-blue-600">💬 Comment ({post.comments})</button>
  </div>
</div>
```

Create `src/components/Sidebar.astro`:
```astro
---
const { user } = Astro.props
---

<!-- Left Sidebar -->
<div class="lg:col-span-1">
  <div class="bg-white rounded-lg shadow p-4">
    <h3 class="font-semibold mb-3">My Profile</h3>
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
      <span>{user.email}</span>
    </div>
  </div>
</div>
```

### 10. Updated Home Page
Create `src/pages/index.astro`:
```astro
---
import Layout from '../layouts/Layout.astro'
import Navigation from '../components/Navigation.astro'
import PostInput from '../components/PostInput.astro'
import PostCard from '../components/PostCard.astro'
import Sidebar from '../components/Sidebar.astro'
---

<Layout title="FriendsBook">
  <div id="app">
    <div class="min-h-screen bg-gray-100" style="display: none;">
      <div id="main-content"></div>
      
      <div class="container mx-auto mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div id="sidebar-container"></div>
        
        <!-- Main Feed -->
        <div class="lg:col-span-2">
          <div id="post-input-container"></div>
          <div id="posts-container"></div>
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
      
      loadMainApp(user)
    }

    function loadMainApp(user) {
      // Show the main app
      document.querySelector('.min-h-screen').style.display = 'block'
      
      // Load navigation
      document.getElementById('main-content').innerHTML = `
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
      `
      
      // Load sidebar
      document.getElementById('sidebar-container').innerHTML = `
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow p-4">
            <h3 class="font-semibold mb-3">My Profile</h3>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
              <span>${user.email}</span>
            </div>
          </div>
        </div>
      `
      
      // Load post input
      document.getElementById('post-input-container').innerHTML = `
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
      `

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

    // Replace createPost function with:
    async function createPost(user, content) {
      try {
        const { data, error } = await supabase
          .from('posts')
          .insert([
            {
              user_id: user.id,
              username: user.email.split('@')[0],
              content: content,
              likes: 0,
              comments: 0
            }
          ])

        if (error) throw error
      } catch (error) {
        console.error('Error creating post:', error)
        alert('Error creating post')
      }
    }

    // Replace loadPosts function with:
    async function loadPosts() {
      try {
        const { data: posts, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        
        const postsHtml = posts.map(post => `
          <div class="bg-white rounded-lg shadow p-4 mb-4">
            <div class="flex items-center space-x-3 mb-3">
              <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <h4 class="font-semibold">${post.username}</h4>
                <p class="text-gray-500 text-sm">${new Date(post.created_at).toLocaleString()}</p>
              </div>
            </div>
            <p class="mb-3">${post.content}</p>
            <div class="flex space-x-4 text-gray-500">
              <button class="hover:text-blue-600">👍 Like (${post.likes})</button>
              <button class="hover:text-blue-600">💬 Comment (${post.comments})</button>
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

## Phase 5: Supabase Database Setup

### 10. Create Database Table
In your Supabase dashboard, go to SQL Editor and run:
```sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all posts
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

-- Policy: Users can insert their own posts
CREATE POLICY "Users can insert their own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 11. Update Frontend - Remove Serverless Functions
Replace the post creation and loading functions in `src/pages/index.astro`:

```js
// Replace createPost function with:
async function createPost(user, content) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          user_id: user.id,
          username: user.email.split('@')[0],
          content: content,
          likes: 0,
          comments: 0
        }
      ])

    if (error) throw error
  } catch (error) {
    console.error('Error creating post:', error)
    alert('Error creating post')
  }
}

// Replace loadPosts function with:
async function loadPosts() {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    
    const postsHtml = posts.map(post => `
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <div class="flex items-center space-x-3 mb-3">
          <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div>
            <h4 class="font-semibold">${post.username}</h4>
            <p class="text-gray-500 text-sm">${new Date(post.created_at).toLocaleString()}</p>
          </div>
        </div>
        <p class="mb-3">${post.content}</p>
        <div class="flex space-x-4 text-gray-500">
          <button class="hover:text-blue-600">👍 Like (${post.likes})</button>
          <button class="hover:text-blue-600">💬 Comment (${post.comments})</button>
        </div>
      </div>
    `).join('')
    
    document.getElementById('posts-container').innerHTML = postsHtml
  } catch (error) {
    console.error('Error loading posts:', error)
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