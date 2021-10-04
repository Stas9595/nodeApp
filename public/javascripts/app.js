document.querySelectorAll('.price').forEach((node) => {
    node.textContent = new Intl.NumberFormat('en-US', {
        currency: 'EUR',
        style: 'currency'
    }).format(node.textContent);
})