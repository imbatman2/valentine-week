// ============================================
// CONFIGURATION - REPLACE WITH YOUR SHEETDB API URL
// ============================================
const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/h66wb9dm9xn23';
// After setting up SheetDB, replace YOUR_SHEETDB_ID with your actual ID
// Example: 'https://sheetdb.io/api/v1/abc123def456'

// ============================================
// FLOATING HEARTS ANIMATION
// ============================================
function createFloatingHearts() {
    const container = document.getElementById('heartsContainer');
    const hearts = ['❤️', '💕', '💖', '💗', '💓', '💝', '🌸', '🌺'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 5 + 8) + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        
        container.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 12000);
    }, 500);
}

createFloatingHearts();

// ============================================
// MUSIC TOGGLE
// ============================================
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
let isMusicPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.innerHTML = '<span class="music-icon">🎵</span>';
    } else {
        bgMusic.play();
        musicToggle.innerHTML = '<span class="music-icon">🔊</span>';
    }
    isMusicPlaying = !isMusicPlaying;
});

// ============================================
// PAGE 1: ASK OUT PAGE - BUTTON INTERACTIONS
// ============================================
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const askOutPage = document.getElementById('askOutPage');
const schedulePage = document.getElementById('schedulePage');
const dogMascot = document.getElementById('dogMascot');
const modal = document.getElementById('modal');
const modalText = document.getElementById('modalText');
const modalBtn = document.getElementById('modalBtn');

let noClickCount = 0;

// YES Button - Direct transition to schedule
yesBtn.addEventListener('click', () => {
    // Make dog happy
    dogMascot.classList.add('happy');
    
    // Show celebration
    showModal("Yay! I knew you'd say yes! ❤️✨");
    
    setTimeout(() => {
        modal.classList.remove('active');
        askOutPage.classList.remove('active');
        schedulePage.classList.add('active');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Animate day cards in sequence
        animateDayCards();
    }, 2000);
});

// NO Button - Playful evasion
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    noClickCount++;
    
    if (noClickCount === 1) {
        // First click - move button randomly
        const x = Math.random() * (window.innerWidth - 200);
        const y = Math.random() * (window.innerHeight - 100);
        noBtn.style.position = 'fixed';
        noBtn.style.left = x + 'px';
        noBtn.style.top = y + 'px';
        noBtn.textContent = "Wait, don't click me! 😅";
    } else if (noClickCount === 2) {
        // Second click - swap positions
        const noBtnRect = noBtn.getBoundingClientRect();
        const yesBtnRect = yesBtn.getBoundingClientRect();
        
        noBtn.style.left = yesBtnRect.left + 'px';
        noBtn.style.top = yesBtnRect.top + 'px';
        noBtn.textContent = "Seriously? 😂";
    } else if (noClickCount === 3) {
        // Third click - show message and convert to yes
        showModal("You really thought you had a choice? ❤️");
        
        setTimeout(() => {
            noBtn.textContent = "Yes! ❤️";
            noBtn.classList.remove('btn-no');
            noBtn.classList.add('btn-yes');
            
            // Make both buttons trigger YES
            noBtn.onclick = yesBtn.onclick;
        }, 2000);
    }
});

// Prevent NO button from being clicked easily - mouse enter evasion
noBtn.addEventListener('mouseenter', () => {
    if (noClickCount > 0 && noClickCount < 3) {
        const x = Math.random() * (window.innerWidth - 200);
        const y = Math.random() * (window.innerHeight - 100);
        noBtn.style.left = x + 'px';
        noBtn.style.top = y + 'px';
    }
});

// ============================================
// MODAL FUNCTIONS
// ============================================
function showModal(message) {
    modalText.textContent = message;
    modal.classList.add('active');
}

modalBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});

// ============================================
// ANIMATE DAY CARDS
// ============================================
function animateDayCards() {
    const dayCards = document.querySelectorAll('.day-card');
    dayCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.8s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
}

// ============================================
// PAGE 2: SCHEDULE PAGE - DATA COLLECTION
// ============================================

// Movie Suggestion
const movieInput = document.getElementById('movieInput');
const movieSubmit = document.getElementById('movieSubmit');

movieSubmit.addEventListener('click', async () => {
    const movie = movieInput.value.trim();
    
    if (!movie) {
        showModal("Please suggest a movie! 🎬");
        return;
    }
    
    try {
        await saveToSheet({
            type: 'Movie Suggestion',
            value: movie,
            timestamp: new Date().toLocaleString()
        });
        
        movieInput.value = '';
        movieInput.placeholder = '✅ Suggestion saved!';
        showModal(`Perfect! We'll watch "${movie}" together! 🎬❤️`);
        
        setTimeout(() => {
            movieInput.placeholder = 'Suggest a movie...';
        }, 3000);
    } catch (error) {
        console.error('Error saving movie:', error);
        showModal("Oops! Something went wrong. But I'll remember your suggestion! ❤️");
    }
});

// Dinner Selection
const urbanTadka = document.getElementById('urbanTadka');
const lauriat = document.getElementById('lauriat');
const dinnerSubmit = document.getElementById('dinnerSubmit');

// Make checkboxes mutually exclusive
urbanTadka.addEventListener('change', () => {
    if (urbanTadka.checked) {
        lauriat.checked = false;
    }
});

lauriat.addEventListener('change', () => {
    if (lauriat.checked) {
        urbanTadka.checked = false;
    }
});

dinnerSubmit.addEventListener('click', async () => {
    let selection = '';
    
    if (urbanTadka.checked) {
        selection = 'Urban Tadka';
    } else if (lauriat.checked) {
        selection = 'Lauriat';
    }
    
    if (!selection) {
        showModal("Please choose where you'd like to have dinner! 🍽️");
        return;
    }
    
    try {
        await saveToSheet({
            type: 'Dinner Choice',
            value: selection,
            timestamp: new Date().toLocaleString()
        });
        
        showModal(`Awesome! Dinner at ${selection} it is! 🍽️❤️`);
        dinnerSubmit.textContent = '✅ Confirmed!';
        dinnerSubmit.disabled = true;
    } catch (error) {
        console.error('Error saving dinner choice:', error);
        showModal("Got it! I'll remember your choice! ❤️");
    }
});

// Location Suggestion
const locationInput = document.getElementById('locationInput');
const locationSubmit = document.getElementById('locationSubmit');

locationSubmit.addEventListener('click', async () => {
    const location = locationInput.value.trim();
    
    if (!location) {
        showModal("Please suggest a location! 💋");
        return;
    }
    
    try {
        await saveToSheet({
            type: 'Kiss Location Suggestion',
            value: location,
            timestamp: new Date().toLocaleString()
        });
        
        locationInput.value = '';
        locationInput.placeholder = '✅ Location saved!';
        showModal(`Perfect spot! Can't wait to kiss you there! 💋❤️`);
        
        setTimeout(() => {
            locationInput.placeholder = 'Where should we kiss?';
        }, 3000);
    } catch (error) {
        console.error('Error saving location:', error);
        showModal("Love it! I'll add that to our list! ❤️");
    }
});

// ============================================
// GOOGLE SHEETS / SHEETDB INTEGRATION
// ============================================

/**
 * Save data to Google Sheets via SheetDB
 * @param {Object} data - Data to save
 */
async function saveToSheet(data) {
    // Check if API URL is configured
    if (SHEETDB_API_URL.includes('YOUR_SHEETDB_ID')) {
        console.warn('SheetDB API URL not configured. Data:', data);
        // Store in localStorage as fallback
        saveToLocalStorage(data);
        return;
    }
    
    try {
        const response = await fetch(SHEETDB_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: [data]
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to save to sheet');
        }
        
        console.log('Data saved successfully:', data);
    } catch (error) {
        console.error('Error saving to sheet:', error);
        // Fallback to localStorage
        saveToLocalStorage(data);
        throw error;
    }
}

/**
 * Fallback: Save to localStorage
 * @param {Object} data - Data to save
 */
function saveToLocalStorage(data) {
    const key = 'valentine_week_data';
    let existingData = [];
    
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            existingData = JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error reading localStorage:', e);
    }
    
    existingData.push(data);
    localStorage.setItem(key, JSON.stringify(existingData));
    console.log('Data saved to localStorage:', data);
}

// ============================================
// ADDITIONAL ROMANTIC EFFECTS
// ============================================

// Sparkle effect on mouse move
document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.9) {
        createSparkle(e.clientX, e.clientY);
    }
});

function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.textContent = '✨';
    sparkle.style.position = 'fixed';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.zIndex = '9999';
    sparkle.style.fontSize = '20px';
    sparkle.style.animation = 'sparkle 1s ease-out forwards';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Add sparkle animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkle {
        0% {
            opacity: 1;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1.5) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// SMOOTH SCROLLING FOR NAVIGATION
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// PREVENT ACCIDENTAL PAGE RELOAD
// ============================================
window.addEventListener('beforeunload', (e) => {
    if (schedulePage.classList.contains('active')) {
        e.preventDefault();
        e.returnValue = '';
    }
});

console.log('❤️ Valentine Week Website Loaded Successfully! ❤️');
console.log('Made with love for someone special 💕');
