import Cart from './Cart.js';

const cartInstance = new Cart();
cartInstance.displayArticle();

const send = document.getElementById('order');
send.addEventListener('click', (event) => {
  event.preventDefault();
  if (cartInstance.checkFields()) {
    cartInstance.postOrder();
  }
});
