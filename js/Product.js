import Cart from './Cart.js';
import { createNotification } from './utils.js';
/**
 * Fetch a product ID's and display the image, name, price, description, colors od product
 */
export default class Product {
  constructor() {
    this.kanapData = [];
  }

  
  /**
   * Check input color is a valid color
   * @param { Number } - The color selected
   * @returns { String } - An error message
   */
  checkColorIsValid(colour) {
    const errorMessageId = 'item__content__settings__color__error';
    const errorMessage = document.getElementById(errorMessageId);

    if (errorMessage) errorMessage.remove();
    if (colour == 0) {
      const newErrorMessage = document.createElement('p');

      newErrorMessage.textContent = 'Veuillez choisir une couleur!';
      newErrorMessage.style.color = 'red';
      newErrorMessage.setAttribute('id', errorMessageId);
      document
      .getElementsByClassName('item__content__settings__color')[0]
      .appendChild(newErrorMessage);
      return false;
    }
    return true;
  }
  
  /**
   * Check input quantity is between 1 to 100
   * @param { Number } - The quantity who enter by user
   * @returns { String } - An error message
   */
  checkQuantityIsValid(quantity) {
    const errorMessageId = 'item__content__settings__quantity__error';
    const errorMessage = document.getElementById(errorMessageId);

    if (errorMessage) errorMessage.remove();
    if (quantity <= 0 || quantity > 100) {
      const newErrorMessage = document.createElement('p');

      newErrorMessage.textContent = 'Veuillez choisir une quantité!';
      newErrorMessage.style.color = 'red';
      newErrorMessage.setAttribute('id', errorMessageId);
      document
        .getElementsByClassName('item__content__settings__quantity')[0]
        .appendChild(newErrorMessage);
      return false;
    }
    return true;
  }

  /**
   * Getting in the cart the kanap
   */
  handleProduct() {
    const btnAddCart = document.getElementById('addToCart');

    btnAddCart.addEventListener('click', () => {
      const id = this.kanapData._id;
      const colour = document.getElementById('colors').value;
      const quantity = Number(document.getElementById('quantity').value);
      
      const isQuantityValid = this.checkQuantityIsValid(quantity)
      const isColorValid = this.checkColorIsValid(colour)

      if (!isColorValid || !isQuantityValid) return;
      
      const productToAddToCart = {
        id,
        colour,
        quantity,
      };

      const cart = new Cart();
      cart.addProduct(productToAddToCart);

      createNotification('Un article a été ajouté dans le panier', true);
    });
  }

  /**
   * Display a kanap about's
   */
  async displayKanap() {
    try {
      const product = new URLSearchParams(document.location.search);
      const productId = product.get('id');

      const response = await fetch(
        `http://localhost:3000/api/products/${productId}`
      );
      this.kanapData = await response.json();

      if (productId !== this.kanapData._id || productId === null) {
        document.getElementsByClassName('item')[0].innerHTML = `
                    <h1>
                        Page 404
                    </h1>
                `;
        throw new Error("Cette page n'existe pas");
      }

      const imgEl = document.createElement('img');
      imgEl.src = this.kanapData.imageUrl;
      imgEl.alt = this.kanapData.altTxt;
      document.getElementsByClassName('item__img')[0].appendChild(imgEl);
      document.getElementById('title').textContent = this.kanapData.name;
      document.getElementById('price').textContent = this.kanapData.price;
      document.getElementById('description').textContent =
        this.kanapData.description;

      let allOptionsColors = '';
      this.kanapData.colors.forEach((color) => {
        allOptionsColors += `<option value="${color}">${color}</option>`;
      });

      document
        .getElementById('colors')
        .insertAdjacentHTML('beforeend', allOptionsColors);
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * The informations kanap about's
   * @returns { array }
   */
  getKanap() {
    return this.kanapData;
  }
}
