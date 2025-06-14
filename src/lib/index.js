//  import { supabase } from "../lib/supabase.js";
//import { getCurrentUser } from "../lib/auth.js";

// Check auth on page load
async function checkAuth() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = "/login";
    return;
  }

  // User is authenticated, load the main app
  loadMainApp(user);
}

function loadMainApp(user) {
    // Add event listeners
  setupEventListeners(user);
  loadPosts();
}

function setupEventListeners(user) {
  // Logout
  document
    .getElementById("logout-btn")
    .addEventListener("click", async () => {
      await supabase.auth.signOut();
      window.location.href = "/login";
    });

  // Post creation
  document
    .getElementById("post-btn")
    .addEventListener("click", async () => {
      const content = document
        .getElementById("post-content")
        .value.trim();
      if (!content) return;

      await createPost(user, content);
      document.getElementById("post-content").value = "";
      loadPosts();
    });
}

async function createPost(user, content) {
  try {
    const { data, error } = await supabase.from("posts").insert([
      {
        user_id: user.id,
        username: user.email.split("@")[0],
        content: content,
        likes: 0,
        comments: 0,
      },
    ]);

    if (error) throw error;
  } catch (error) {
    console.error("Error creating post:", error);
    alert("Error creating post");
  }
}

async function loadPosts() {
  try {
    const { data: posts, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const postsHtml = posts
      .map(
        (post) => `
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
`,
      )
      .join("");

    document.getElementById("posts-container").innerHTML = postsHtml;
  } catch (error) {
    console.error("Error loading posts:", error);
  }
} // Initialize app
checkAuth();