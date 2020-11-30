const toCurrency = (price) => {
  return new Intl.NumberFormat('en-US', {
    currency: 'usd',
    style: 'currency',
  }).format(price);
};

document.querySelectorAll('.price').forEach((node) => {
  node.textContent = toCurrency(+node.textContent);
});

const $card = document.querySelector('#card');

if ($card) {
  $card.addEventListener('click', (e) => {
    if (!e.target.classList.contains('js-remove')) {
      return;
    }
    const id = e.target.dataset.id;

    fetch('/card/remove/' + id, {
      method: 'delete',
    })
      .then((res) => res.json())
      .then(({ courses, price }) => {
        console.log(price);
        if (price) {
          const html = courses
            .map((c) => {
              return `
            <tr>
              <td>${c.title}</td>
              <td>${c.count}</td>
              <td><button class="btn btn-small js-remove" data-id="${c.id}">Delete</button></td>
            </tr>`;
            })
            .join('');
          $card.querySelector('tbody').innerHTML = html;
          $card.querySelector('.price').textContent = toCurrency(price);
        } else {
          $card.innerHTML = '<h2>Card is empty!</h2>';
        }
      });
  });
}
