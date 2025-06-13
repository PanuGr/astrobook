# Core Features (Minimum Viable Product)

For your first iteration, let's focus on the absolute essentials to get a basic social networking experience running.

* ## User Authentication:

  * Goal: Allow users to securely sign up, log in, and log out.  
  * Technology: Supabase auth.  

* ## Basic Profile Creation:

  * Goal: Allow users to create a minimal profile with a username (which will be their identifier).  
  * Technology: Supabase database  
  * Plan:  
    1. Determine the essential profile information (for now, just a username is sufficient).  
    2. Design a simple form on the profile page to capture this information.  
    3. When a new user signs up, store their username in your chosen database.

* ## Posting and Displaying Content (The "Feed"):

  * Goal: Allow users to create simple text posts and see posts from all users on the main page.  
  * Technology: Supabase.  
  * Plan:  
    1. Design a simple text input field and a "Post" button on the main page.  
    2. When a user submits a post, store the post content, the timestamp, and the author's username in your database.  
    3. On page load, fetch the latest posts from the database and display them in a chronological order on the main page.

# ITechnology Stack Decisions (Iterative)

Let's solidify your technology choices for this first iteration.

* ## Frontend:

  * HTML: For structuring your three pages (landing, main, profile).  
  * TailwindCss+Components UI (daisyui or other)  
  * Plain JavaScript: Perfect for handling user interactions, form submissions, and fetching/displaying data.

* ## Backend:
  * Supabase 

# Page Structure and Basic UI

* ## Landing Page (Login/Signup):
  * Simple layout with clear sections for login and signup.  

* ## Main Page (Feed and News \- For now, just the feed):

  * A section for users to type and submit new posts.  
  * A display area to show the latest posts from all users, ordered chronologically.  
  * Consider a very basic visual structure using grid.

* ## Profile Page (Setting Own Preferences \- For now, just displaying the username):

  * Display the logged-in user's username.  
  * In future iterations, you can add options for more profile details or preferences.

# Step-by-Step Roadmap

1. ## Setup and Authentication:
  [x] Supabase authentication
2. ## Basic Profile Storage:
  [x] save a username when a new user signs up.  
  [x] On the profile page, fetch and display the logged-in user's username.

3. ## Basic Post Storage and Display (JSON Files \- Initial):

  [] Decide on the structure of your posts (content, timestamp, author etc).  
  [x] Capture user input for new posts.  
  [x] append the new post to your database.  
  [] Fetch and display the posts, ordered by timestamp.

4. ## Refinement and Iteration:

   * Review your code and structure.  
   * Identify areas for improvement or simplification.  
   * Plan your next iteration based on what you've learned (e.g., adding the ability to follow users, like posts, etc.).

# Things You Haven't Thought Of (Yet\!)

* Data Security  
* Error Handling: Implement basic error handling for network requests and form submissions.  
* User Experience (UX): While minimal, try to make the flow intuitive. Clear button labels and basic feedback are important.  