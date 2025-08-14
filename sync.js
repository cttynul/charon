const fs = require('fs');
const path = require('path');
const SITE_SETTINGS = require('./js/site.js');

// Funzione per leggere e analizzare il contenuto Markdown
const getMarkdownIntro = (filePath) => {
    const markdownContent = fs.readFileSync(filePath, 'utf8');
    // Rimuove gli header e le formattazioni come grassetto, corsivo, link
    const cleanContent = markdownContent.replace(/#+\s?.*|\*\*|\*|\[.*\]\(.*\)/g, '').trim();
    // Prende le prime 30 parole e aggiunge i puntini di sospensione
    return cleanContent.split(' ').slice(0, 30).join(' ') + '...';
};

// Funzione per formattare i dati per il file JS
const formatData = (data) => {
    return JSON.stringify(data, null, 4).replace(/\}$/g, '}');
};

// Funzione principale per la sincronizzazione
const syncContent = () => {
    try {
        console.log('Starting content synchronization...');

        // Sincronizza i post
        let postDataContent = fs.readFileSync('data/post.js', 'utf8');
        let posts = JSON.parse(postDataContent.replace('const POSTS =', '').replace(';', ''));
        const existingPostIds = new Set(posts.map(p => p.id));
        const newPosts = [];

        const postFiles = fs.readdirSync(SITE_SETTINGS.postsPath);
        for (const file of postFiles) {
            if (path.extname(file) === '.md') {
                const id = path.basename(file, '.md');
                if (!existingPostIds.has(id)) {
                    const filePath = path.join(SITE_SETTINGS.postsPath, file);
                    const fileContent = fs.readFileSync(filePath, 'utf8');
                    const titleMatch = fileContent.match(/^#\s(.+)$/m);
                    const title = titleMatch ? titleMatch[1] : id;
                    
                    // Estrazione automatica dell'anteprima dal file Markdown
                    const intro = getMarkdownIntro(filePath);

                    newPosts.push({ id, title, intro });
                    
                    // Crea la cartella per le immagini
                    const imageDir = path.join(SITE_SETTINGS.imagesPath, id);
                    if (!fs.existsSync(imageDir)) {
                        fs.mkdirSync(imageDir);
                        console.log(`Created image folder for post: ${id}`);
                    }
                }
            }
        }
        
        if (newPosts.length > 0) {
            const updatedPosts = newPosts.concat(posts);
            const postFileContent = `const POSTS = ${formatData(updatedPosts)};`;
            fs.writeFileSync('data/post.js', postFileContent);
            console.log(`Updated post.js with ${newPosts.length} new posts.`);
        } else {
            console.log('No new posts to add.');
        }

        // Sincronizza le pagine
        let pagesDataContent = fs.readFileSync('data/pages.js', 'utf8');
        let pages = JSON.parse(pagesDataContent.replace('const PAGES =', '').replace(';', ''));
        const existingPageIds = new Set(pages.map(p => p.id));
        const newPages = [];

        const pageFiles = fs.readdirSync(SITE_SETTINGS.pagesPath);
        for (const file of pageFiles) {
            if (path.extname(file) === '.md') {
                const id = path.basename(file, '.md');
                if (!existingPageIds.has(id)) {
                    const filePath = path.join(SITE_SETTINGS.pagesPath, file);
                    const fileContent = fs.readFileSync(filePath, 'utf8');
                    const titleMatch = fileContent.match(/^#\s(.+)$/m);
                    const title = titleMatch ? titleMatch[1] : id;

                    newPages.push({ id, title, navTitle: title });
                }
            }
        }
        
        if (newPages.length > 0) {
            const updatedPages = pages.concat(newPages);
            const pageFileContent = `const PAGES = ${formatData(updatedPages)};`;
            fs.writeFileSync('data/pages.js', pageFileContent);
            console.log(`Updated pages.js with ${newPages.length} new pages.`);
        } else {
            console.log('No new pages to add.');
        }

        console.log('Synchronization complete!');

    } catch (error) {
        console.error('An error occurred during synchronization:', error);
    }
};

syncContent();