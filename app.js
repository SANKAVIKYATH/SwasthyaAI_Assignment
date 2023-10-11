// app.js
const express = require("express");
// const bodyParser = require("body-parser");
// const findOpenPort = require("find-open-port");
const mongoose = require("mongoose");
const User = require("./models/User");
const Blog = require("./models/Blog");
const Comment = require("./models/Comment");

const app = express();

app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://vikyaths20:SYs7dV6jpihPGIDL@cluster0.ic0nsyw.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Create a new user
app.post("/users", async (req, res) => {
  try {
    const { userID, username } = req.body; // Assuming request body contains userID and username
    const user = new User({ userID, username });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});


// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get a specific user by userID
app.get("/users/:userID", async (req, res) => {
  try {
    const { userID } = req.params;
    const user = await User.findOne({ userID });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Create a new blog
app.post("/blogs", async (req, res) => {
  try {
    const { blogID, title, content, createdBy } = req.body; // Assuming request body contains title, content, and createdBy (userID)

    // Ensure createdBy is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({ error: "Invalid createdBy ID" });
    }
    const blog = new Blog({ blogID, title, content, createdBy});
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create blog" });
  }
});


// Get all blogs
app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// Get a specific blog by blogID
app.get("/blogs/:blogID", async (req, res) => {
  try {
    const { blogID } = req.params;
    const blog = await Blog.findOne({ blogID });
    if (!blog) {
      return res.status(404).json({ error: "blog not found" });
    }
    res.json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

// Create a new comment
app.post('/comments', async (req, res) => {
    try {
      const { commentID, content, createdBy, blogID } = req.body; // Assuming request body contains content, createdBy (userID), and blogId
      const comment = new Comment({ commentID, content, createdBy, blogID });
      await comment.save();
      res.status(201).json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create comment' });
    }
  });
  
  // Get all comments
  app.get('/comments', async (req, res) => {
    try {
      const comments = await Comment.find();
      res.json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  });

  // Get a specific comment by commentID
app.get("/comments/:commentID", async (req, res) => {
  try {
    const { commentID } = req.params;
    const comment = await Comment.findOne({ commentID });
    if (!comment) {
      return res.status(404).json({ error: "blog not found" });
    }
    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

  
// Recursive function to find nth-level friends
// async function findNthLevelFriends(userId, level, currentLevel = 1, friends = new Set()) {
//     if (currentLevel > level) {
//       return Array.from(friends);
//     }
  
//     const user = await User.findById(userId);
  
//     // Find blogs commented by the user
//     const blogs = await Blog.find({ createdBy: userId });
  
//     // Find users who have commented on the same blogs
//     for (const blog of blogs) {
//       const comments = await Comment.find({ blogId: blog._id });
//       for (const comment of comments) {
//         if (comment.createdBy.toString() !== userId.toString()) {
//           friends.add(comment.createdBy.toString());
//         }
//       }
//     }
  
//     // Recursively find friends at the next level
//     return findNthLevelFriends(userId, level, currentLevel + 1, friends);
//   }
  
//   // API route to get nth-level friends for a user
//   app.get('/users/:userId/level/:levelNo', async (req, res) => {
//     try {
//       const { userId } = req.params;
//       const levelNo = parseInt(req.params.levelNo);
//       const friends = await findNthLevelFriends(userId, levelNo);
//       res.json(friends);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

// API route to get nth-level friends for a user
app.get('/users/:userId/level/:levelNo', async (req, res) => {
  try {
    const userId = req.params.userId;
    const levelNo = parseInt(req.params.levelNo);

    // Create a set to store friends
    const friends = new Set();

    // Create a queue for breadth-first traversal
    const queue = [{ userId, level: 1 }];

    while (queue.length > 0) {
      const { userId, level } = queue.shift();

      if (level > levelNo) {
        break; // We've reached the requested level
      }

      // Find blogs commented by the user
      const blogs = await Blog.find({ createdBy: userId });

      for (const blog of blogs) {
        // Find comments on this blog
        const comments = await Comment.find({ blogId: blog._id });

        for (const comment of comments) {
          if (comment.createdBy.toString() !== userId) {
            friends.add(comment.createdBy.toString());
          }
        }
      }

      if (level < levelNo) {
        // If we haven't reached the desired level, enqueue friends for the next level
        const friendIds = Array.from(friends);
        for (const friendId of friendIds) {
          queue.push({ userId: friendId, level: level + 1 });
        }
      }
    }

    res.json(Array.from(friends));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});






  
const port=4000 | process.env.port;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
