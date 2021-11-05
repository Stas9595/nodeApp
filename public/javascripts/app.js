document.querySelectorAll('.price').forEach((node) => {
    node.textContent = new Intl.NumberFormat('en-US', {
        currency: 'EUR',
        style: 'currency'
    }).format(node.textContent);
})

const $card = document.querySelector('#card')
if ($card) {
    $card.addEventListener('click', event => {
        debugger;
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id

            fetch('/card/remove/' + id, {
                method: 'delete'
            }).then(res => res.json())
                .then(card => {
                    console.log(card)
                })
        }
    })
}