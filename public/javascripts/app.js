//import * as JsSearch from './node_modules/sweetalert2';

const toCurrency = price => {
    return new Intl.NumberFormat('en-US', {
        currency: 'EUR',
        style: 'currency'
    }).format(price)
}

const toDate = function (date) {
    return new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date))
}

document.querySelectorAll('.date').forEach(node => {
    node.textContent = toDate(node.textContent)
})

document.querySelectorAll('.price').forEach((node) => {
    node.textContent = new Intl.NumberFormat('en-US', {
        currency: 'EUR',
        style: 'currency'
    }).format(node.textContent);
})



const $card = document.querySelector('#card')
if ($card) {
    $card.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id
            debugger;
            const csrf = event.target.dataset.csrf

            fetch('/card/remove/' + id, {
                method: 'delete',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            }).then(res => res.json())
                .then(card => {
                    if(card.courses.length) {
                        const html = card.courses.map(c => {
                            return `
                            <tr>
                                <td>${c.title}</td>
                                <td>${c.count}</td>
                                <td>
                                    <button class="btn btn-small js-remove" data-id="${c.id}" data-csrf="${csrf}">Delete</button>
                                </td>
                            </tr>
                            `
                        }).join('')
                        $card.querySelector('tbody').innerHTML = html
                        $card.querySelector('.price').textContent = toCurrency(card.price)
                    } else {
                        $card.innerHTML = '<p>Basket is empty</p>'
                    }
                })
        }
    })
}

/*const $courses = document.querySelector('#courses')
if ($courses) {
    $courses.addEventListener('click', event => {
        if (event.target.classList.contains('btn-primary')) {
            JsSearch.fire(
                'Good job!',
                'You clicked the button!',
                'success'
            )
        }
    })
}*/

M.Tabs.init(document.querySelectorAll('.tabs'))