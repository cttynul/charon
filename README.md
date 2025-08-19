# Charon: Just another Javascript no-backend blog

Welcome to Charon, the simplest way to run a static blog. Tired of complex databases, expensive hosting, and endless security patches? Charon is your one-way ticket to a backend-free paradise. Write in Markdown, and let a little JavaScript magic do the rest.

### ✨ New Features Added

In addition to the original functionalities, the blog now includes the following improvements:

* **Improved Transition Animations**: The transparency effect has been replaced with a smoother sliding animation for page transitions.
* **Advanced Post Management**: Posts now support additional metadata such as tags, author, and publication date.
* **Automatic Sorting**: Articles are automatically sorted by publication date, from most recent to least recent.
* **Interactive Tag Filter**: On the homepage, you can select and filter articles based on specific tags to easily find content of interest.
* **Custom Tags**: Tags are now displayed with a darker color for better readability in articles.
* **Simplified Navigation**: The page automatically scrolls to the top when a new article or page is opened, improving the navigation experience.
* **Readable Font**: The font for titles has been changed to a more readable one, ensuring a more pleasant reading experience.

### ⚙️ Updated Project Structure

The project structure now includes the following files:

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

2.  **Create Your Content**
    Just drop your Markdown files into the `posts/` or `pages/` folders. Don't worry about editing `data/post.js` or `data/pages.js`—we have a script for that.

3.  **Automagic**
    Run the synchronization script from your terminal.

    ```bash
    node sync.js
    ```

    This command will perform the following operations:
    * Scans the `posts/` and `pages/` directories.
    * Automatically updates `data/post.js` and `data/pages.js` with new entries.
    * Creates a dedicated image folder for each new post.

4.  **Serve and Enjoy**
    Simply open `index.html` in your favorite web browser. For local development, a simple web server (like `live-server` or Python's built-in server) is recommended.

### 🎨 Customization

* **Global Settings**: Edit `js/site.js` to change the site name, footer, logos, and layout mode ("grid" or "list").
* **Custom CSS**: Override any default styles by adding your own rules to `css/custom.css`.

### 📄 License

This project is licensed under the MIT License. For the full text, see the LICENSE file.