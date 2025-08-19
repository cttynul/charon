document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');
    const navLinks = document.getElementById('nav-links');
    const tagFilterContainer = document.getElementById('tag-filter-container');
    const tagFilter = document.getElementById('tag-filter');
    const converter = new showdown.Converter({
        tables: true,
        strikethrough: true,
        tasklists: true
    });

    let selectedTags = [];

    PAGES.forEach(page => {
        const link = document.createElement('a');
        link.href = `#/pages/${page.id}`;
        link.className = 'nav-link text-dark mx-2';
        link.textContent = page.navTitle;
        navLinks.appendChild(link);
    });

    const animateIn = (element) => {
        element.classList.add('animate__animated', 'animate__slideInUp');
        element.addEventListener('animationend', () => {
            element.classList.remove('animate__animated', 'animate__slideInUp');
        }, { once: true });
    };

    const animateOut = (element, callback) => {
        element.classList.add('animate__animated', 'animate__slideOutDown');
        element.addEventListener('animationend', () => {
            element.classList.remove('animate__animated', 'animate__slideOutDown');
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

    const sortPostsByDate = (posts) => {
        return posts.sort((a, b) => {
            const dateA = a.publicationDate ? new Date(a.publicationDate) : null;
            const dateB = b.publicationDate ? new Date(b.publicationDate) : null;
            
            if (dateA && dateB) {
                return dateB - dateA;
            } else if (dateA) {
                return -1;
            } else if (dateB) {
                return 1;
            } else {
                return 0;
            }
        });
    };

    const initializeTagFilter = () => {
        const allTags = new Set();
        POSTS.forEach(post => {
            if (post.tags) {
                post.tags.forEach(tag => allTags.add(tag));
            }
        });

        tagFilter.innerHTML = '';
        
        const allButton = document.createElement('button');
        allButton.textContent = 'all';
        allButton.className = 'btn btn-secondary btn-sm m-1 all-tag-button';
        allButton.onclick = () => {
            selectedTags = [];
            document.querySelectorAll('.tag-button').forEach(btn => btn.classList.remove('active', 'btn-primary'));
            allButton.classList.add('active', 'btn-secondary');
            renderHomePage();
        };
        tagFilter.appendChild(allButton);

        allTags.forEach(tag => {
            const button = document.createElement('button');
            button.textContent = tag;
            button.className = 'btn btn-outline-secondary btn-sm m-1 tag-button';
            button.onclick = () => {
                const isActive = button.classList.toggle('active');
                if (isActive) {
                    selectedTags.push(tag);
                    button.classList.add('btn-primary');
                    allButton.classList.remove('active', 'btn-secondary');
                    allButton.classList.add('btn-outline-secondary');
                } else {
                    selectedTags = selectedTags.filter(t => t !== tag);
                    button.classList.remove('btn-primary');
                    if (selectedTags.length === 0) {
                        allButton.classList.add('active', 'btn-secondary');
                        allButton.classList.remove('btn-outline-secondary');
                    }
                }
                renderHomePage();
            };
            tagFilter.appendChild(button);
        });
        
        allButton.classList.add('active');
    };

    const renderHomePage = async () => {
        window.scrollTo(0, 0); // Nuova riga per scrollare in cima

        if (SITE_SETTINGS.logoMainPath) {
            document.getElementById('main-logo-container').classList.remove('d-none');
            document.getElementById('logo-main').src = SITE_SETTINGS.logoMainPath;
        } else {
            document.getElementById('main-logo-container').classList.add('d-none');
        }
        
        tagFilterContainer.classList.remove('d-none');

        const sortedPosts = sortPostsByDate([...POSTS]);

        const filteredPosts = sortedPosts.filter(post => {
            if (selectedTags.length === 0) {
                return true;
            }
            if (post.tags) {
                return selectedTags.some(tag => post.tags.includes(tag));
            }
            return false;
        });

        let postsHtml = '';
        if (SITE_SETTINGS.viewMode === "grid") {
            let cardsHtml = '';
            for (const post of filteredPosts) {
                const intro = await getPostIntro(post.id);
                const tagsHtml = post.tags && post.tags.length > 0
                    ? `<div class="mt-2">${post.tags.map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('')}</div>`
                    : '';
                const authorHtml = post.author ? `<small class="text-muted d-block mt-2">By: ${post.author}</small>` : '';
                const dateHtml = post.publicationDate ? `<small class="text-muted d-block">Published: ${post.publicationDate}</small>` : '';

                cardsHtml += `
                    <div class="col">
                        <a href="#/posts/${post.id}" class="card h-100 shadow-sm text-decoration-none text-dark grid-post-card">
                            <img src="${SITE_SETTINGS.imagesPath}/${post.id}/post.png" class="card-img-top" alt="${post.title}">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${post.title}</h5>
                                <p class="card-text">${intro}</p>
                                ${tagsHtml}
                                <div class="mt-auto pt-2">
                                    ${authorHtml}
                                    ${dateHtml}
                                </div>
                            </div>
                        </a>
                    </div>
                `;
            }
            postsHtml = `<div class="row row-cols-1 row-cols-md-2 g-4" id="posts-container">${cardsHtml}</div>`;
        } else if (SITE_SETTINGS.viewMode === "list") {
            let listItemsHtml = '';
            for (const post of filteredPosts) {
                const intro = await getPostIntro(post.id);
                const tagsHtml = post.tags && post.tags.length > 0
                    ? `<div class="mt-2">${post.tags.map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('')}</div>`
                    : '';
                const authorHtml = post.author ? `<small class="text-muted d-block mt-2">By: ${post.author}</small>` : '';
                const dateHtml = post.publicationDate ? `<small class="text-muted d-block">Published: ${post.publicationDate}</small>` : '';

                listItemsHtml += `
                    <a href="#/posts/${post.id}" class="list-group-item blog-list-item">
                        <h5 class="mb-1">${post.title}</h5>
                        <p class="mb-1">${intro}</p>
                        ${tagsHtml}
                        <div class="mt-auto pt-2">
                            ${authorHtml}
                            ${dateHtml}
                        </div>
                    </a>
                `;
            }
            postsHtml = `<div class="list-group" id="posts-container">${listItemsHtml}</div>`;
        }
        
        if (filteredPosts.length === 0) {
            postsHtml = '<div class="text-center mt-5"><h4>Nessun articolo trovato con questi tag.</h4></div>';
        }

        appContent.innerHTML = postsHtml;
        animateIn(appContent);
    };

    const renderAllPostsPage = async () => {
        window.scrollTo(0, 0); // Nuova riga per scrollare in cima

        document.getElementById('main-logo-container').classList.add('d-none');
        tagFilterContainer.classList.add('d-none');
        appContent.innerHTML = `
            <div class="container mt-5 pt-5">
                <h1 class="my-4 text-center">All Posts</h1>
                <hr>
                <div class="list-group" id="all-posts-list"></div>
            </div>
        `;
        const allPostsList = document.getElementById('all-posts-list');
        const sortedPosts = sortPostsByDate([...POSTS]);
        for (const post of sortedPosts) {
            const intro = await getPostIntro(post.id);
            const tagsHtml = post.tags && post.tags.length > 0
                ? `<div class="mt-2">${post.tags.map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('')}</div>`
                : '';
            const postItem = `
                <a href="#/posts/${post.id}" class="list-group-item list-group-item-action">
                    <h5>${post.title}</h5>
                    <small>${intro}</small>
                    ${tagsHtml}
                </a>
            `;
            allPostsList.innerHTML += postItem;
        }
        document.title = `All Posts - ${SITE_SETTINGS.siteName}`;
        animateIn(appContent);
    };

    const renderPost = async (postId) => {
        window.scrollTo(0, 0); // Nuova riga per scrollare in cima

        tagFilterContainer.classList.add('d-none');
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

            const post = POSTS.find(p => p.id === postId);
            const tagsHtml = post.tags && post.tags.length > 0
                ? `<div class="my-3 text-center">${post.tags.map(tag => `<span class="badge bg-dark me-2">${tag}</span>`).join('')}</div>`
                : '';
            const authorHtml = post.author ? `<p class="text-center text-muted mb-0">By: ${post.author}</p>` : '';
            const dateHtml = post.publicationDate ? `<p class="text-center text-muted"><small>Published on: ${post.publicationDate}</small></p>` : '';

            const htmlContent = converter.makeHtml(processedMarkdown);
            appContent.innerHTML = `
                <h1 class="my-4 text-center mt-5 pt-5">${post.title}</h1>
                <div class="post-meta mb-4">
                    ${authorHtml}
                    ${dateHtml}
                    ${tagsHtml}
                </div>
                <div class="text-center mb-4">
                    <img src="${SITE_SETTINGS.imagesPath}/${post.id}/post.png" alt="${post.title}" class="img-fluid post-header-image">
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
        window.scrollTo(0, 0); // Nuova riga per scrollare in cima

        document.getElementById('main-logo-container').classList.add('d-none');
        tagFilterContainer.classList.add('d-none');
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
                initializeTagFilter();
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
                tagFilterContainer.classList.add('d-none');
                animateIn(appContent);
            }
        } else {
            animateOut(appContent, () => {
                if (path === '/') {
                    initializeTagFilter();
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
                    tagFilterContainer.classList.add('d-none');
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