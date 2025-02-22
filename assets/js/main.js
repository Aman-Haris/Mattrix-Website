// main.js
document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const cards = document.querySelectorAll('.card');
    
    // Add animation delay to cards
    cards.forEach((card, index) => {
        card.style.setProperty('--order', index);
    });

    // Navbar background change on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Card hover effect with mouse movement
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });

        // Click effect
        card.addEventListener('click', () => {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe hero text and cards
    document.querySelectorAll('.hero-text, .card').forEach(el => {
        observer.observe(el);
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add this to your main.js
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    const cardsContainer = document.querySelector('.cards-container');

    // Enhanced 3D movement effect
    cardsContainer.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = cardsContainer.getBoundingClientRect();
        const mouseX = e.clientX - left;
        const mouseY = e.clientY - top;

        cards.forEach((card) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenterX = cardRect.left + cardRect.width / 2 - left;
            const cardCenterY = cardRect.top + cardRect.height / 2 - top;

            const angleX = (mouseY - cardCenterY) / 30;
            const angleY = (cardCenterX - mouseX) / 30;

            card.style.transform = `
                perspective(1000px)
                rotateX(${angleX}deg)
                rotateY(${angleY}deg)
                translateZ(10px)
            `;
        });
    });

    // Reset cards position
    cardsContainer.addEventListener('mouseleave', () => {
        cards.forEach((card, index) => {
            if (index === 0) {
                card.style.transform = 'translateX(20%) rotateY(25deg)';
            } else if (index === 1) {
                card.style.transform = 'translateZ(50px)';
            } else if (index === 2) {
                card.style.transform = 'translateX(-20%) rotateY(-25deg)';
            } else if (index === 3) {
                card.style.transform = 'translateX(-40%) rotateY(-35deg)';
            }
        });
    });

    // Smooth transition when clicking cards
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.style.transform = 'translateZ(0) rotateY(0)');
            card.style.transform = 'translateZ(100px) rotateY(0)';
        });
    });
});

// Card data structure with placeholder images
const categories = [
    {
        id: 'engine',
        title: 'Engine Parts',
        image: 'assets/images/categories/engine.png'
    },
    {
        id: 'brakes',
        title: 'Brake Systems',
        image: 'assets/images/categories/brakes.png'
    },
    {
        id: 'transmission',
        title: 'Transmission',
        image: 'assets/images/categories/transmission.png'
    },
    {
        id: 'electrical',
        title: 'Electrical Parts',
        image: 'assets/images/categories/electrical.png'
    }
];

class CardManager {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            console.error('Could not find container with selector:', containerSelector);
            return;
        }
        this.cards = [];
        this.init();
    }

    init() {
        console.log('Initializing CardManager');
        this.createCards();
        this.setupEventListeners();
        this.updateCardPositions();
    }

    createCards() {
        console.log('Creating cards');
        this.container.innerHTML = '';
        
        categories.forEach((category, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.setAttribute('data-category', category.id);
            card.setAttribute('data-index', index);
            
            card.innerHTML = `
                <div class="card-content">
                    <img src="${category.image}" alt="${category.title}" 
                         onerror="this.src='assets/images/placeholder.png'">
                    <h3>${category.title}</h3>
                </div>
            `;
            
            this.container.appendChild(card);
            this.cards.push(card);
            console.log(`Card created for ${category.title}`);
        });
    }

    calculateCardPosition(index, totalCards) {
        const radius = 250; // Adjust this value to change the circle size
        const angleStep = (2 * Math.PI) / totalCards;
        const angle = index * angleStep;
        
        // Calculate position on the circle
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        // Calculate rotation to face center
        const rotateY = (angle * (180 / Math.PI)) + 180;

        return {
            transform: `translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg)`,
            zIndex: Math.round(z + radius)
        };
    }

    updateCardPositions() {
        console.log('Updating card positions');
        const totalCards = this.cards.length;
        
        this.cards.forEach((card, index) => {
            const position = this.calculateCardPosition(index, totalCards);
            card.style.transform = position.transform;
            card.style.zIndex = position.zIndex;
            console.log(`Card ${index} position updated:`, position.transform);
        });
    }

    handleCardHover(hoveredCard) {
        const index = parseInt(hoveredCard.getAttribute('data-index'));
        const totalCards = this.cards.length;
        
        this.cards.forEach((card, i) => {
            if (card === hoveredCard) {
                // Bring hovered card to front
                card.style.transform = 'translateX(0) translateZ(200px) rotateY(0deg)';
                card.style.zIndex = '1000';
            } else {
                // Move other cards aside
                const offset = i < index ? -50 : 50;
                const position = this.calculateCardPosition(i, totalCards);
                card.style.transform = `${position.transform} translateX(${offset}px)`;
                card.style.zIndex = position.zIndex;
            }
        });
    }

    setupEventListeners() {
        // Mouse hover effects
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.handleCardHover(card);
            });

            card.addEventListener('mouseleave', () => {
                this.updateCardPositions();
            });
        });

        // Mouse movement effect
        this.container.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = this.container.getBoundingClientRect();
            const mouseX = e.clientX - left - width / 2;
            const mouseY = e.clientY - top - height / 2;

            this.cards.forEach((card) => {
                const rect = card.getBoundingClientRect();
                const cardX = rect.left + rect.width / 2 - left - width / 2;
                const cardY = rect.top + rect.height / 2 - top - height / 2;

                const angleX = (mouseY - cardY) / 30;
                const angleY = (cardX - mouseX) / 30;

                const currentTransform = card.style.transform.split('rotateX')[0];
                card.style.transform = `${currentTransform} rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            });
        });

        // Reset positions on mouse leave
        this.container.addEventListener('mouseleave', () => {
            this.updateCardPositions();
        });

        // Optional: Add touch events for mobile
        this.container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const { left, top, width, height } = this.container.getBoundingClientRect();
            const mouseX = touch.clientX - left - width / 2;
            const mouseY = touch.clientY - top - height / 2;

            this.cards.forEach((card) => {
                const rect = card.getBoundingClientRect();
                const cardX = rect.left + rect.width / 2 - left - width / 2;
                const cardY = rect.top + rect.height / 2 - top - height / 2;

                const angleX = (mouseY - cardY) / 30;
                const angleY = (cardX - mouseX) / 30;

                const currentTransform = card.style.transform.split('rotateX')[0];
                card.style.transform = `${currentTransform} rotateX(${angleX}deg) rotateY(${angleY}deg)`;
            });
        });
    }

    // Method to add a new card
    addCard(categoryData) {
        categories.push(categoryData);
        this.createCards();
        this.updateCardPositions();
    }

    // Method to remove a card
    removeCard(categoryId) {
        const index = categories.findIndex(cat => cat.id === categoryId);
        if (index !== -1) {
            categories.splice(index, 1);
            this.createCards();
            this.updateCardPositions();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing CardManager');
    const cardManager = new CardManager('.cards-container');

    // Make cardManager available globally for debugging
    window.cardManager = cardManager;

    // Example of how to add a new card
    window.addNewCard = function(categoryData) {
        cardManager.addCard(categoryData);
    };

    // Example of how to remove a card
    window.removeCard = function(categoryId) {
        cardManager.removeCard(categoryId);
    };
});