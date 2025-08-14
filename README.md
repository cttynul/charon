# Charon: Just another Javascript no-backend blog

Welcome to Charon, the simplest way to run a static blog. Tired of complex databases, expensive hosting, and endless security patches? Charon is your one-way ticket to a backend-free paradise. Write in Markdown, and let a little JavaScript magic do the rest.

## ✨ Features

- No Backend, No Worries: The backend is a lie. This blog runs purely on HTML, CSS, and JavaScript.
- Markdown-First: All content is written in .md files, which are a joy to edit.
- Speed Demon: With no server-side processing, your pages load at the speed of light and are loaded by your clients.
- Responsiveness: Built with Bootstrap 5 for a clean, mobile-friendly design.
- Automated Sync: A powerful sync.js script automatically discovers new Markdown files, generates post data, and even creates image folders for you.
- Developer-Friendly: Supports syntax highlighting for code, LaTeX formulas, and tables.

## 📂 Project Structure

Navigating your project is as simple as it gets.

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

## 🚀 Quick Start

Getting started is painless.

### Prerequisites

You'll need Node.js installed on your machine to use the sync.js script.

1. Set Up Your Site
Start by configuring your blog in js/site.js.

```
module.exports = {
    siteName: "My Awesome Blog",
    footerText: "© 2024 My Awesome Blog. All rights reserved.",
    postsPath: "posts",
    pagesPath: "pages",
    imagesPath: "images",
    logoNavbarPath: "images/logo.png",
    logoMainPath: null,
    faviconPath: "images/favicon.ico",
    viewMode: "grid" // "grid" or "list"
};
```

2. Create your contents
Just drop your Markdown files into the posts/ or pages/ folders. Don't worry about editing data/post.js or data/pages.js—we have a guy for that.

3. Automagic
Run the synchronization script from your terminal.

```
node sync.js
```

This command will:

- Scan the posts/ and pages/ directories.
- Automatically update data/post.js and data/pages.js with new entries.
- Create a dedicated image folder for each new post.

4. Serve and Enjoy
Simply open index.html in your favorite web browser. For local development, a simple web server (like live-server or Python's built-in server) is recommended.

### 🎨 Customization

- Global Settings: Edit `js/site.js` to change the site name, footer, logos, and layout mode ("grid" or "list").

- Custom CSS: Override any default styles by adding your own rules to `css/custom.css`.

## 📄 License

This project is licensed under the MIT License. For the full text, see the LICENSE file.