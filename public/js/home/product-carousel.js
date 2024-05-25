window.onload = function() {
    const productCards = document.querySelectorAll('.product-card');  
    let max = -Infinity;

    // Loop through all the cards to find the max height
    productCards.forEach(card => {
        if (max < card.offsetHeight) max = card.offsetHeight;
    });

    // Set all cards to the maximum height found
    productCards.forEach(card => {
        card.style.height = `${max}px`;
    });
};
