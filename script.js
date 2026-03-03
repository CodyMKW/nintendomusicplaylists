document.addEventListener('DOMContentLoaded', loadPlaylists);

function loadPlaylists() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error-message');
    const container = document.getElementById('playlist-container');
    const featuredContainer = document.getElementById('featured-playlist-container');

    fetch('https://api.npoint.io/17efcaacff654b10f356')
        .then(response => {
            if (!response.ok) throw new Error('Network response failed');
            return response.json();
        })
        .then(playlists => {
            loadingEl.style.display = 'none';
            
            let featuredCount = 0;

            playlists.forEach(playlist => {
                const card = createPlaylistCard(playlist);

                if (playlist.featured && featuredCount < 4) {
                    featuredContainer.appendChild(createPlaylistCard(playlist));
                    featuredCount++;
                }

                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error loading playlists:', error);
            loadingEl.style.display = 'none';
            errorEl.textContent = 'Failed to load playlists. Please try again later.';
            errorEl.style.display = 'block';
        });
}

function createPlaylistCard(playlist) {
    const card = document.createElement('div');
    card.className = 'playlist-card';

    if (playlist.creator.toLowerCase() === 'nintendo') {
        card.classList.add('official-playlist');
    }
    if (playlist.creator.toLowerCase() === 'codymkw') {
        card.classList.add('codymkw-playlist');
    }
    if (playlist.icon === "https://files.catbox.moe/e4legu.jpg") {
        card.classList.add('nm-credit-project');
    }

    card.onclick = () => window.open(playlist.link, '_blank');

    const img = document.createElement('img');
    img.src = playlist.icon;
    img.alt = `${playlist.name} cover`;
    img.loading = "lazy";

    const info = document.createElement('div');
    info.className = 'playlist-info';

    const title = document.createElement('div');
    title.className = 'playlist-title';
    title.textContent = playlist.name;

    const creator = document.createElement('div');
    creator.className = 'playlist-creator';
    creator.textContent = `Created by: ${playlist.creator}`;

    info.appendChild(title);
    info.appendChild(creator);
    card.appendChild(img);
    card.appendChild(info);

    if (playlist.tags) {
        card.dataset.tags = playlist.tags.join(' ').toLowerCase();
    } else {
        card.dataset.tags = '';
    }

    card.dataset.date = playlist.dateAdded || '';
    card.dataset.featured = playlist.featured ? 'true' : 'false';

    return card;
}

function filterPlaylists() {
    const query = document.getElementById('search-bar').value.toLowerCase().trim();
    const cards = document.querySelectorAll('.playlist-card');

    cards.forEach(card => {
        const title = card.querySelector('.playlist-title').textContent.toLowerCase();
        const tags = card.dataset.tags || '';
        
        if (!query || title.includes(query) || tags.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function sortPlaylists() {
    const sortOption = document.getElementById('sort-options').value;
    const container = document.getElementById('playlist-container');
    let playlists = Array.from(container.getElementsByClassName('playlist-card'));

    playlists.sort((a, b) => {
        switch (sortOption) {
            case 'alphabetical':
                return a.querySelector('.playlist-title').textContent.localeCompare(
                       b.querySelector('.playlist-title').textContent);
            case 'reverse-alphabetical':
                return b.querySelector('.playlist-title').textContent.localeCompare(
                       a.querySelector('.playlist-title').textContent);
            case 'creator':
                return a.querySelector('.playlist-creator').textContent.localeCompare(
                       b.querySelector('.playlist-creator').textContent);
            case 'creator-reverse':
                return b.querySelector('.playlist-creator').textContent.localeCompare(
                       a.querySelector('.playlist-creator').textContent);
            case 'newest':
                return new Date(b.dataset.date) - new Date(a.dataset.date);
            case 'oldest':
                return new Date(a.dataset.date) - new Date(b.dataset.date);
            case 'featured':
                return (b.dataset.featured === 'true') - (a.dataset.featured === 'true');
            default:
                return 0;
        }
    });

    container.innerHTML = '';
    playlists.forEach(p => container.appendChild(p));
}