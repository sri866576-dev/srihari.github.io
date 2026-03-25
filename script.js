document.addEventListener('DOMContentLoaded', () => {
    // --- 1. SELECTIONS ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.place-card');
    const popup = document.getElementById('notification-popup');
    const favButtons = document.querySelectorAll('.fav-btn');

    // --- 2. FILTERING LOGIC ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update Active Class on Buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            let visibleCount = 0;

            // Show/Hide Cards
            cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Handle Empty Categories
            if (visibleCount === 0 && popup) {
                popup.classList.add('show');
                setTimeout(() => {
                    popup.classList.remove('show');
                }, 3000);
            }
        });
    });

    // --- 3. FAVORITES LOGIC ---
    favButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Prevents clicking the card link
            
            const card = button.closest('.place-card');
            const placeData = {
                id: card.getAttribute('data-id'),
                name: card.getAttribute('data-name'),
                img: card.getAttribute('data-img')
            };

            // Get existing favorites
            let favorites = JSON.parse(localStorage.getItem('myFavorites')) || [];

            // Check if already added
            const isAlreadyFavorited = favorites.some(fav => fav.id === placeData.id);

            if (!isAlreadyFavorited) {
                favorites.push(placeData);
                localStorage.setItem('myFavorites', JSON.stringify(favorites));
                
                // Visual Feedback
                button.innerText = "Saved!";
                button.style.backgroundColor = "#46140e"; 
            } else {
                alert("Already in your favorites!");
            }
        });
    });

    // OPTIONAL: Keep "Saved" state if user refreshes the page
    const favorites = JSON.parse(localStorage.getItem('myFavorites')) || [];
    favButtons.forEach(button => {
        const cardId = button.closest('.place-card').getAttribute('data-id');
        if (favorites.some(fav => fav.id === cardId)) {
            button.innerText = "Saved!";
            button.style.backgroundColor = "#46140e";
        }
    });
});
// This runs when the page loads to show your favorites
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('favorites-grid');
    const saved = JSON.parse(localStorage.getItem('myFavorites')) || [];

    if (saved.length === 0) {
        grid.innerHTML = "<p style='text-align:center; grid-column: 1/-1;'>No favourites saved yet.</p>";
        return;
    }

    // Clear grid before adding items
    grid.innerHTML = '';

    saved.forEach(place => {
        const card = document.createElement('div');
        card.className = 'place-card';
        card.innerHTML = `
            <img src="${place.img}" alt="${place.name}">
            <div class="card-content">
                <h3>${place.name}</h3>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    <a href="${place.id}.html" class="view-btn">View</a>
                    <button onclick="removeOne('${place.id}')" class="remove-btn">Remove</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
});

// --- GLOBAL FUNCTIONS (Must be outside DOMContentLoaded) ---

function removeOne(id) {
    let favs = JSON.parse(localStorage.getItem('myFavorites')) || [];
    // Keep everything EXCEPT the one with this ID
    favs = favs.filter(p => p.id !== id);
    
    localStorage.setItem('myFavorites', JSON.stringify(favs));
    
    // Refresh the page to show the updated list
    window.location.reload();
}

function clearAll() {
    if (confirm("Are you sure you want to clear all favorites?")) {
        localStorage.removeItem('myFavorites');
        window.location.reload();
    }
}
