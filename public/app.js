const toCurrency = (price) => {
  return new Intl.NumberFormat('en-US', {
    currency: 'usd',
    style: 'currency',
  }).format(price);
};

const toDate = (date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date));
};

document.querySelectorAll('.date').forEach((node) => {
  node.textContent = toDate(node.textContent);
});

document.querySelectorAll('.price').forEach((node) => {
  node.textContent = toCurrency(+node.textContent);
});

const $cart = document.querySelector('#cart');

if ($cart) {
  $cart.addEventListener('click', (e) => {
    if (!e.target.classList.contains('js-remove')) {
      return;
    }
    const { id, csrf } = e.target.dataset;

    fetch('/cart/remove/' + id, {
      method: 'delete',
      headers: {
        'X-XSRF-TOKEN': csrf,
      },
    })
      .then((res) => res.json())
      .then(({ courses, price, csrf }) => {
        if (price) {
          const html = courses
            .map((c) => {
              return `
            <tr>
              <td>${c.title}</td>
              <td>${c.count}</td>
              <td><button class="btn btn-small js-remove" data-id="${c.id}" data-csrf="${csrf}">Delete</button></td>
            </tr>`;
            })
            .join('');
          $cart.querySelector('tbody').innerHTML = html;
          $cart.querySelector('.price').textContent = toCurrency(price);
        } else {
          $cart.innerHTML = '<h2>Cart is empty!</h2>';
        }
      });
  });
}

var instance = M.Tabs.init(document.querySelectorAll('.tabs'));
