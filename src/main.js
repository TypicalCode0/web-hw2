const BASE_URL = 'https://dog.ceo/api';

const elements = {
    breedList: document.querySelector('.breed-list'),
    dogImage: document.querySelector('.dog-image'),
    loader: document.querySelector('.loader'),
    themeToggle: document.querySelector('.theme-toggle')
};

let currentBreed = null;

async function fetchBreeds() {
    try {
        const response = await fetch(`${BASE_URL}/breeds/list/all`);
        const data = await response.json();
        return Object.keys(data.message);
    } catch (error) {
        console.error('Error fetching breeds:', error);
        return [];
    }
}

async function fetchRandomImage(breed) {
    try {
        elements.loader.classList.remove('hidden');
        const response = await fetch(`${BASE_URL}/breed/${breed}/images/random`);
        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    } finally {
        elements.loader.classList.add('hidden');
    }
}

function renderBreeds(breeds) {
    elements.breedList.innerHTML = breeds
        .map(breed => `
            <button class="breed-button" data-breed="${breed}">
                ${breed}
            </button>
        `)
        .join('');
}

function handleBreedClick(event) {
    const breedButton = event.target.closest('.breed-button');
    if (!breedButton) return;

    const breed = breedButton.dataset.breed;
    if (currentBreed === breed) return;

    currentBreed = breed;
    document.querySelectorAll('.breed-button').forEach(btn => {
        btn.classList.toggle('active', btn === breedButton);
    });
    
    fetchRandomImage(breed).then(imageUrl => {
        if (imageUrl) {
            elements.dogImage.src = imageUrl;
        }
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
}

async function init() {
    const breeds = await fetchBreeds();
    renderBreeds(breeds);
    
    elements.breedList.addEventListener('click', handleBreedClick);
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Load initial image
    const initialBreed = breeds[0];
    currentBreed = initialBreed;
    const imageUrl = await fetchRandomImage(initialBreed);
    elements.dogImage.src = imageUrl;
}

init();