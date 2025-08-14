# Charon Blog Framework

Charon is a lightweight and easy-to-use static blog framework built entirely with HTML, CSS, and JavaScript. It doesn't require a backend, allowing you to create a personal blog by managing all content in Markdown files.

## Features

* **Modern Layout**: Based on **Bootstrap 5** for a responsive and clean design.
* **Simple Content Management**: All articles are written in **Markdown** and loaded dynamically.
* **Static Routing**: Uses hash-based URLs (`#/`) to navigate between the homepage and posts without reloading the page.
* **Multimedia Support**: Handles syntax highlighting for code, LaTeX formulas, and tables.
* **Easy Customization**: You can personalize styles via a `custom.css` file and global site settings with `site.js`.

---

## Project Structure

The folder structure is designed to be intuitive and easy to manage:

```
.
├── css/
│   ├── custom.css          # For your custom styles
│   └── style.css           # Base framework styles
├── data/                   # For post and page data
│   ├── pages.js            
│   └── post.js             
├── images/                 # For logos, favicon, and post images
│   ├── <post_id>/          # Folder with a post's images
│   │   └── post.png
│   ├── favicon.ico
│   └── logo.png
├── js/
│   ├── app.js              # Main framework logic
│   └── site.js             # Global site settings
├── pages/                  # Contains all static pages in Markdown
│   └── about.md
├── posts/                  # Contains all blog post Markdown files
│   └── <post_id>.md
└── index.html              # The main site file
```

---

## Quick Start Guide

### 1. Site Configuration

All global settings for your blog are in the **`js/site.js`** file. You can customize the site name, footer text, and logo paths.

```javascript
const SITE_SETTINGS = {
    siteName: "My Blog",
    footerText: "© 2024 My Blog. All rights reserved.",
    postsPath: "posts",
    pagesPath: "pages",
    imagesPath: "images",
    logoNavbarPath: "assets/logo.png", // Set to null to hide
    logoMainPath: "assets/logo-main.png", // Set to null to hide
    faviconPath: "assets/favicon.ico", // Set to null to hide
    viewMode: "grid" // "grid" or "list"
};
```

### 2. Creating a New Post or Page

You can create new content manually or automatically using the synchronization script.

#### Manually
1.  **Create the Markdown file**: Add a new `.md` file to the `posts/` or `pages/` folder. The filename (e.g., `new_post.md`) will be the post's ID.
2.  **Write the content**: Write your post in Markdown. You can use code blocks (delimit code blocks with ```), LaTeX formulas (`$E=mc^2$`), and tables.
3.  **Add post data**: Open the file **`data/post.js`** or **`data/pages.js`** and add a new object to the respective array.


#### Automagically
You can use the `sync.js` script to automatically generate the necessary configuration files.

1.  **Create the Markdown files**: Simply add your `.md` files to the `posts/` and `pages/` folders.
2.  **Run the script**: From your terminal, run the following command:
    ```
    node sync.js
    ```
    The script will scan the folders, create the image directories for new posts, and update `data/post.js` and `data/pages.js` automatically.

### 3. Adding Images

1.  **Create a folder**: In the `images/` folder, create a new folder with the same ID as your post (e.g., `images/new_post/`). This step is done automatically by the `sync.js` script.
2.  **Thumbnail image**: Place the post's thumbnail image in this folder and name it `post.png` (or `.jpg`, `.jpeg`).

---

## Customization

* **Styles**: To change the site's look, use the file **`css/custom.css`**. The rules you write here will override the default styles.
* **Layout**: In `js/site.js`, change `viewMode` to `"grid"` or `"list"` to switch the homepage layout.

