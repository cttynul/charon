document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const navLinks = document.getElementById('nav-links');
    const converter = new showdown.Converter({
        tables: true,
        strikethrough: true,
        tasklists: true
    });

    PAGES.forEach(page => {
        const link = document.createElement('a');
        link.href = `#/pages/${page.id}`;
        link.className = 'nav-link text-dark mx-2';
        link.textContent = page.navTitle;
        navLinks.appendChild(link);
    });

    const animateIn = (element) => {
        element.classList.add('animate__animated', 'animate__fadeIn');
        element.addEventListener('animationend', () => {
            element.classList.remove('animate__animated', 'animate__fadeIn');
        }, { once: true });
    };

    const animateOut = (element, callback) => {
        element.classList.add('animate__animated', 'animate__fadeOut');
        element.addEventListener('animationend', () => {
            element.classList.remove('animate__animated', 'animate__fadeOut');
            if (callback) callback();
        }, { once: true });
    };

    const getPostIntro = async (postId) => {
        try {
            const response = await fetch(`${SITE_SETTINGS.postsPath}/${postId}.md`);
            if (!response.ok) return '...';

            const markdownText = await response.text();
            const cleanedText = markdownText.replace(/#+\s?.*|\*\*|\*|\[.*\]\(.*\)/g, '').trim();
            return cleanedText.split(' ').slice(0, 30).join(' ') + '...';
        } catch (error) {
            console.error('Error fetching post intro:', error);
            return '...';
        }
    };

    const renderHomePage = async () => {
        if (SITE_SETTINGS.logoMainPath) {
            document.getElementById('main-logo-container').classList.remove('d-none');
            document.getElementById('logo-main').src = SITE_SETTINGS.logoMainPath;
        } else {
            document.getElementById('main-logo-container').classList.add('d-none');
        }
        
        let postsHtml = '';
        if (SITE_SETTINGS.viewMode === "grid") {
            let cardsHtml = '';
            for (const post of POSTS) {
                const intro = await getPostIntro(post.id);
                cardsHtml += `
                    <div class="col">
                        <a href="#/posts/${post.id}" class="card h-100 shadow-sm text-decoration-none text-dark grid-post-card">
                            <img src="${SITE_SETTINGS.imagesPath}/${post.id}/post.png" class="card-img-top" alt="${post.title}">
                            <div class="card-body">
                                <h5 class="card-title">${post.title}</h5>
                                <p class="card-text">${intro}</p>
                            </div>
                        </a>
                    </div>
                `;
            }
            postsHtml = `<div class="row row-cols-1 row-cols-md-2 g-4" id="posts-container">${cardsHtml}</div>`;
        } else if (SITE_SETTINGS.viewMode === "list") {
            let listItemsHtml = '';
            for (const post of POSTS) {
                const intro = await getPostIntro(post.id);
                listItemsHtml += `
                    <a href="#/posts/${post.id}" class="list-group-item blog-list-item">
                        <h5 class="mb-1">${post.title}</h5>
                        <p class="mb-1">${intro}</p>
                    </a>
                `;
            }
            postsHtml = `<div class="list-group" id="posts-container">${listItemsHtml}</div>`;
        }

        appContent.innerHTML = postsHtml;
        animateIn(appContent);
    };

    const renderAllPostsPage = async () => {
        document.getElementById('main-logo-container').classList.add('d-none');
        appContent.innerHTML = `
            <div class="container mt-5 pt-5">
                <h1 class="my-4 text-center">All Posts</h1>
                <hr>
                <div class="list-group" id="all-posts-list"></div>
            </div>
        `;
        const allPostsList = document.getElementById('all-posts-list');
        for (const post of POSTS) {
            const intro = await getPostIntro(post.id);
            const postItem = `
                <a href="#/posts/${post.id}" class="list-group-item list-group-item-action">
                    <h5>${post.title}</h5>
                    <small>${intro}</small>
                </a>
            `;
            allPostsList.innerHTML += postItem;
        }
        document.title = `All Posts - ${SITE_SETTINGS.siteName}`;
        animateIn(appContent);
    };

    const renderPost = async (postId) => {
        const postExists = POSTS.find(p => p.id === postId);
        if (!postExists) {
            appContent.innerHTML = `
                <div class="container mt-5 pt-5 text-center">
                    <h2>404 - Post not found</h2>
                    <p>The requested article does not exist.</p>
                    <a href="#/" class="btn btn-dark">Back to Home</a>
                </div>
            `;
            document.title = `404 - ${SITE_SETTINGS.siteName}`;
            animateIn(appContent);
            return;
        }

        try {
            const response = await fetch(`${SITE_SETTINGS.postsPath}/${postId}.md`);
            if (!response.ok) {
                throw new Error('Post not found');
            }
            const markdownText = await response.text();
            
            const processedMarkdown = markdownText.replace(/PLACEHOLDER/g, '```');

            const htmlContent = converter.makeHtml(processedMarkdown);
            appContent.innerHTML = `
                <h1 class="my-4 text-center mt-5 pt-5">${postExists.title}</h1>
                <div class="text-center mb-4">
                    <img src="${SITE_SETTINGS.imagesPath}/${postExists.id}/post.png" alt="${postExists.title}" class="img-fluid post-header-image">
                </div>
                <div class="post-content">${htmlContent}</div>
            `;
            document.title = `${postExists.title} - ${SITE_SETTINGS.siteName}`;

            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });

            document.querySelectorAll('div.post-content p').forEach(p => {
                const text = p.textContent;
                if (text.startsWith('$') && text.endsWith('$') || text.startsWith('$$') && text.endsWith('$$')) {
                    try {
                        const latexCode = text.replace(/\$/g, '');
                        katex.render(latexCode, p, {
                            throwOnError: false
                        });
                    } catch (e) {
                        console.error('KaTeX rendering error:', e);
                    }
                }
            });

            document.getElementById('main-logo-container').classList.add('d-none');
            animateIn(appContent);

        } catch (error) {
            appContent.innerHTML = `
                <div class="container mt-5 pt-5 text-center">
                    <h2>Oops! Something went wrong...</h2>
                    <p>Looks like the post decided to take a day off. We're working on convincing it to come back. ☕</p>
                    <a href="#/" class="btn btn-dark">Back to Home</a>
                </div>
            `;
            console.error('Errore nel caricamento del post:', error);
            document.title = `Errore - ${SITE_SETTINGS.siteName}`;
            animateIn(appContent);
        }
    };
    
    const renderPage = async (pageId) => {
        document.getElementById('main-logo-container').classList.add('d-none');
        const pageExists = PAGES.find(p => p.id === pageId);
        if (!pageExists) {
             appContent.innerHTML = `
                <div class="container mt-5 pt-5 text-center">
                    <h2>404 - Lost in Cyberspace?</h2>
                    <p>This page seems to have wandered off. Let's get you back on track!</p>
                    <a href="#/" class="btn btn-dark">Back to Home</a>
                </div>
            `;
            document.title = `404 - ${SITE_SETTINGS.siteName}`;
            animateIn(appContent);
            return;
        }

        try {
            const response = await fetch(`${SITE_SETTINGS.pagesPath}/${pageId}.md`);
            if (!response.ok) {
                throw new Error('Page not found');
            }
            const markdownText = await response.text();
            
            const processedMarkdown = markdownText.replace(/PLACEHOLDER/g, '```');
            const htmlContent = converter.makeHtml(processedMarkdown);

            appContent.innerHTML = `<div class="post-content mt-5 pt-5">${htmlContent}</div>`;
            document.title = `${pageExists.title.charAt(0).toUpperCase() + pageExists.title.slice(1)} - ${SITE_SETTINGS.siteName}`;

            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
            animateIn(appContent);
        } catch (error) {
            appContent.innerHTML = `
                <div class="container mt-5 pt-5 text-center">
                    <h2>Oops! Something went wrong...</h2>
                    <p>Looks like the page decided to take a day off. We're working on convincing it to come back. ☕</p>
                    <a href="#/" class="btn btn-dark">Back to Home</a>
                </div>
            `;
            console.error('Error loading page:', error);
            document.title = `Error - ${SITE_SETTINGS.siteName}`;
            animateIn(appContent);
        }
    };

    const router = () => {
        const path = window.location.hash.slice(1) || '/';
        
        if (path === '/pages') {
            window.location.hash = '/';
            return;
        }

        if (appContent.innerHTML.trim() === '') {
            if (path === '/') {
                renderHomePage();
            } else if (path === '/posts/') {
                renderAllPostsPage();
            } else if (path.startsWith('/posts/')) {
                const postId = path.replace('/posts/', '');
                renderPost(postId);
            } else if (path.startsWith('/pages/')) {
                const pageId = path.replace('/pages/', '');
                renderPage(pageId);
            } else {
                appContent.innerHTML = `
                    <div class="container mt-5 pt-5 text-center">
                        <h2>404 - Lost in Cyberspace?</h2>
                        <p>This page seems to have wandered off. Let's get you back on track!</p>
                        <a href="#/" class="btn btn-dark">Back to Home</a>
                    </div>
                `;
                document.title = `404 - ${SITE_SETTINGS.siteName}`;
                document.getElementById('main-logo-container').classList.add('d-none');
                animateIn(appContent);
            }
        } else {
            animateOut(appContent, () => {
                if (path === '/') {
                    renderHomePage();
                } else if (path === '/posts/') {
                    renderAllPostsPage();
                } else if (path.startsWith('/posts/')) {
                    const postId = path.replace('/posts/', '');
                    renderPost(postId);
                } else if (path.startsWith('/pages/')) {
                    const pageId = path.replace('/pages/', '');
                    renderPage(pageId);
                } else {
                    appContent.innerHTML = `
                        <div class="container mt-5 pt-5 text-center">
                            <h2>404 - Lost in Cyberspace?</h2>
                            <p>This page seems to have wandered off. Let's get you back on track!</p>
                            <a href="#/" class="btn btn-dark">Back to Home</a>
                        </div>
                    `;
                    document.title = `404 - ${SITE_SETTINGS.siteName}`;
                    document.getElementById('main-logo-container').classList.add('d-none');
                    animateIn(appContent);
                }
            });
        }
    };

    window.addEventListener('hashchange', router);
    router();
    
    document.title = SITE_SETTINGS.siteName;
    document.getElementById('site-name').textContent = SITE_SETTINGS.siteName;

    /*
    const logoNavbar = document.getElementById('logo-navbar');
    logoNavbar.style.display = 'none';

    if (SITE_SETTINGS.logoNavbarPath) {
        logoNavbar.src = SITE_SETTINGS.logoNavbarPath;
        logoNavbar.style.display = 'inline-block';
    }
    */

    if (SITE_SETTINGS.faviconPath) {
        const faviconLink = document.createElement('link');
        faviconLink.rel = 'icon';
        faviconLink.href = SITE_SETTINGS.faviconPath;
        document.head.appendChild(faviconLink);
    }

    document.getElementById('footer-content').innerHTML = `
        <p class="mb-0">${SITE_SETTINGS.footerText}</p>
        <p class="mb-0"><small>Powered by <a href="https://github.com/cttynul/charon" target="_blank" class="link-dark">Charon</a></small></p>
    `;
});