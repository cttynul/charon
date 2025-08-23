# Charon: Just another Javascript no-backend blog

<p text-align="center"><img style="max-height:300px" src="https://raw.githubusercontent.com/cttynul/charon/refs/heads/master/assets/logo.png"></p>

Welcome to Charon Engine, the simplest way to run a static blog. Tired of complex databases, expensive hosting, and endless security patches? Charon Engine is your one-way ticket to a backend-free paradise. Write in Markdown, and let a little JavaScript magic do the rest.

### ✨ Key Features

This blog engine is packed with features to make your blogging experience smooth and enjoyable:

* **Completely Backend-Free**: No databases, no server-side logic, just static files.
* **Markdown-Powered**: Write your content in simple Markdown files.
* **Automatic Post Management**: The `sync.js` script automatically scans your content, manages metadata, and organizes your files.
* **Automatic Sorting**: Articles are automatically sorted by publication date, from most recent to least recent.
* **Interactive Tag Filter**: On the homepage, you can select and filter articles based on specific tags to easily find content of interest.
* **Customizable View Modes**: Choose between a modern "grid" or a classic "list" view for your homepage.
* **Smooth Page Transitions**: Optional sliding animations for a seamless user experience.
* **Syntax Highlighting**: Code blocks are automatically highlighted for better readability.
* **Mathematical Notation**: Support for KaTeX for rendering mathematical formulas.
* **Clean Navigation**: The page automatically scrolls to the top when a new article or page is opened, improving the navigation experience.

---

### ⚙️ Project Structure

The project structure is intuitive and easy to navigate

```
.
├── css/
│   ├── custom.css          # Your personal style overrides
│   └── style.css           # Framework's base styles
├── data/                   # The source of truth for post and page data
│   ├── pages.js
│   └── post.js
├── images/                 # All your visual assets
│   ├── <post_id>/          # Folder for each post's images (e.g., my_first_post)
│   │   └── post.png
│   ├── favicon.ico
│   └── logo.png
├── js/
│   ├── app.js              # The heart of the blog logic
│   └── site.js             # The brain of the blog settings
├── pages/                  # Markdown files for your static pages
│   └── about.md
├── posts/                  # Markdown files for your blog posts
│   └── <post_id>.md
└── index.html              # Your blog's single entry point
```

### 🚀 Quick Start

Getting started is easy.

#### Prerequisites

You'll need Node.js installed on your computer to use the `sync.js` script.

1.  **Set Up Your Site**
    Start by configuring your blog in `js/site.js`.

    ```javascript
    const SITE_SETTINGS = {
        siteName: "Charon Engine",
        footerText: "© 2024 Charon Engine. All rights reserved.",
        postsPath: "posts",
        imagesPath: "images",
        pagesPath: "pages", 
        logoNavbarPath: null,
        logoMainPath: "assets/logo.png",
        faviconPath: "assets/favicon.ico",
        viewMode: "grid", // Choose between "grid" or "list"
        enableAnimations: false // true enables animations, false disables them
    };
    ```

2.  **Create Your Content**
    Just drop your Markdown files into the `posts/` or `pages/` folders. Don't worry about editing `data/post.js` or `data/pages.js`—the script handles that for you.

3.  **Automagic**
    Run the synchronization script from your terminal.

    ```bash
    node sync.js
    ```

    This command will perform the following operations:
    * Scans the `posts/` and `pages/` directories.
    * Automatically updates `data/post.js` and `data/pages.js` with new entries.
    * Creates a dedicated image folder for each new post, if one doesn't exist.

4.  **Serve and Enjoy**
    Simply open `index.html` in your favorite web browser. For local development, a simple web server (like `live-server` or Python's built-in server) is highly recommended to avoid CORS issues.

---

### 🎨 Customization

* **Global Settings**: Edit `js/site.js` to change the site name, footer, logos, layout mode ("grid" or "list"), and animations.
* **Custom CSS**: Override any default styles by adding your own rules to `css/custom.css`.
* **Post Metadata**: Edit the `data/post.js` file to manually add metadata like `author`, `publicationDate`, and `tags` for your posts.

---

### 📄 License

This project is licensed under the MIT License. For the full text, see the LICENSE file.
