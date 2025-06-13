# Step-by-Step Guide

## Phase 1: Project Setup
### 1. Initialize Astro Project
### 2. Configure Tailwind
### 3. Setup Supabase

## Phase 2: Authentication Setup
### 4. Create Supabase Client
### 5. Auth Helper Functions

## Phase 3: Page Structure
### 6. Login Page
### 7. Signup Page
### 8. Main Layout

## Phase 4: Main Feed Page
### 9. Create Astro Components
### 10. Import components at Home Page 
- components not in use. The page loads dynamically with javascript. 

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

### 11. Update Frontend 
- Post creation and post loading uses supabase database 

## Phase 6: Deploy
### 12. Netlify HTTP-headers Configuration
### 13. Deploy

## Next Steps
- Add like/comment functionality
- Implement image uploads
- Add friend system
- Add weather forecast
- Add news feed based on your interests
- Add real-time updates

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