$(document).ready(function () {
    let products = [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    function fetchProducts() {
        $.getJSON('products.json', function (data) {
            products = data;
            displayProducts(products);
        });
    }

    function displayProducts(products) {
        $('#product-list').empty();
        products.forEach(product => {
            let productCard = `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <p>$${product.price}</p>
                    <button class="details-btn" data-id="${product.id}">Details</button>
                    <button class="fav-btn" data-id="${product.id}">${favorites.includes(product.id) ? 'Remove from Favorites' : 'Add to Favorites'}</button>
                </div>
            `;
            $('#product-list').append(productCard);
        });
    }

    function filterProducts(query) {
        const filteredProducts = products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
        displayProducts(filteredProducts);
    }

    function sortProducts(criteria) {
        const sortedProducts = products.sort((a, b) => {
            if (criteria === 'price') {
                return a.price - b.price;
            } else {
                return a.name.localeCompare(b.name);
            }
        });
        displayProducts(sortedProducts);
    }

    function toggleFavorite(productId) {
        if (favorites.includes(productId)) {
            favorites = favorites.filter(id => id !== productId);
        } else {
            favorites.push(productId);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayProducts(products);
    }

    function showModal(product) {
        $('#modal-body').html(`
            <h2>${product.name}</h2>
            <img src="${product.image}" alt="${product.name}">
            <p>${product.description}</p>
            <p>$${product.price}</p>
        `);
        $('#product-modal').css('display', 'block');
    }

    $(document).on('click', '.details-btn', function () {
        const productId = $(this).data('id');
        const product = products.find(product => product.id === productId);
        showModal(product);
    });

    $(document).on('click', '.fav-btn', function () {
        const productId = $(this).data('id');
        toggleFavorite(productId);
    });

    $('#search').on('input', function () {
        const query = $(this).val();
        filterProducts(query);
    });

    $('#sort').on('change', function () {
        const criteria = $(this).val();
        sortProducts(criteria);
    });

    $('.close').on('click', function () {
        $('#product-modal').css('display', 'none');
    });

    $(window).on('click', function (event) {
        if ($(event.target).is('#product-modal')) {
            $('#product-modal').css('display', 'none');
        }
    });

    fetchProducts();
});
