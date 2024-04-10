import { createNotification } from './utils.js';

/**
 * Handle the diffrents actions in the Cart
 */
export default class Cart {
  constructor() {
    const currentItem = localStorage.getItem('cart');
    this.cart = currentItem === null ? [] : JSON.parse(currentItem);
    this.kanapAPI = [];
  }

  /**
   * Add an product in the localstorage of navigator
   * @param { Object } productToAdd - A object containing the color, quantity and id
   */
  addProduct(productToAdd) {
    const sameProductInCart = this.cart.find(
      (kanapFromLS) =>
        kanapFromLS.id === productToAdd.id &&
        kanapFromLS.colour === productToAdd.colour
    );

    if (sameProductInCart) {
      sameProductInCart.quantity += productToAdd.quantity;
    } else {
      this.cart.push(productToAdd);
    }

    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  /**
   * Fetch all produts in the localstorage in the navigator and the informations API's corresponding at product in the * localstorage. Display products in the cart
   */
  async displayArticle() {
    try {
      const articlesFromCart = JSON.parse(localStorage.getItem('cart'));

      let articles = '';
      let nbTotalArticle = 0;
      let priceTotal = 0;
      const response = await fetch(`http://localhost:3000/api/products/`);
      const kanapAPI = await response.json();
      this.kanapAPI = kanapAPI;

      articlesFromCart.forEach((kanap) => {
        let name, price, altTxt, img;
        kanapAPI.forEach((kanapFomAPI) => {
          if (kanap.id === kanapFomAPI._id) {
            name = kanapFomAPI.name;
            price = kanapFomAPI.price;
            altTxt = kanapFomAPI.altTxt;
            img = kanapFomAPI.imageUrl;
          }
        });

        articles += `<article class="cart__item" data-id="${kanap.id}" data-color="${kanap.colour}">
                                <div class="cart__item__img">
                                <img src="${img}" alt="${altTxt}">
                                </div>
                                <div class="cart__item__content">
                                <div class="cart__item__content__description">
                                    <h2>${name}</h2>
                                    <p>${kanap.colour}</p>
                                    <p>${price} €</p>
                                </div>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${kanap.quantity}">
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                    </div>
                                </div>
                                </div>
                            </article>`;

        nbTotalArticle += Number(kanap.quantity);
        priceTotal += Number(price) * Number(kanap.quantity);
      });

      document.getElementById('cart__items').innerHTML = articles;
      document.getElementById('totalQuantity').textContent = nbTotalArticle;
      document.getElementById('totalPrice').textContent = priceTotal;

      const inputsQuantity = [
        ...document.getElementsByClassName('itemQuantity'),
      ];
      inputsQuantity.forEach((DOMinput) =>
        DOMinput.addEventListener('change', (event) =>
          this.updateQuantity(event)
        )
      );
      const buttonDeleteArticle = [
        ...document.getElementsByClassName('deleteItem'),
      ];
      buttonDeleteArticle.forEach((DOMbuttom) =>
        DOMbuttom.addEventListener('click', (event) => {
          this.deleteArticle(event);
        })
      );
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Update the quantity when the product is delete or modify in the Cart by user
   * @param { event } event - User's modify or delete a product
   */
  updateQuantity(event) {
    try {
      const kanapNewQuantity = Number(event.target.value);
      if (kanapNewQuantity < 1) this.deleteArticle(event);

      const kanapParentDomElement = event.target.closest('.cart__item');
      const sameKanapFromLocalstorage = this.cart.find(
        (kanapFormLS) =>
          kanapFormLS.id === kanapParentDomElement.dataset.id &&
          kanapFormLS.colour === kanapParentDomElement.dataset.color
      );

      sameKanapFromLocalstorage.quantity = kanapNewQuantity;
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.updateTotalQuantity();
      this.updateTotalPrice();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Delete a product in the Cart
   * @param { event } event - User's click an delete bottom
   * @returns - The delete product
   */
  deleteArticle(event) {
    const kanapParent = event.target.closest('.cart__item');

    if (!window.confirm('Souhaitez-vous supprimer cet article ?')) {
      return;
    }

    try {
      const deleteElement = (element) =>
        element.id === kanapParent.dataset.id &&
        element.colour === kanapParent.dataset.color;
      if (deleteElement === -1) {
        return;
      }

      const indexToDelete = this.cart.findIndex(deleteElement);
      this.cart.splice(indexToDelete, 1);
      localStorage.setItem('cart', JSON.stringify(this.cart));
      kanapParent.remove();

      createNotification("L'article a bien été supprimé !", true);

      this.updateTotalQuantity();
      this.updateTotalPrice();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Update the total price in the cart
   */
  updateTotalPrice() {
    let totalPrice = 0;
    try {
      this.cart.forEach((kanapFromLS) => {
        const findKanap = this.kanapAPI.find(
          (kanap) => kanap._id === kanapFromLS.id
        );
        const productTotal = Number(kanapFromLS.quantity) * findKanap.price;

        totalPrice += productTotal;
      });

      document.getElementById('totalPrice').textContent = totalPrice;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Update the total quantity in the cart
   */
  updateTotalQuantity() {
    let totalQuantity = 0;
    {
    }
    this.cart.forEach((kanapFormLS) => {
      totalQuantity += Number(kanapFormLS.quantity);
    });
    document.getElementById('totalQuantity').textContent = totalQuantity;
  }

  /**
   * Handle the form with regex
   * @return {Boolean} - Return true if form fields are valid
   */
  checkFields() {
    try {
      const regexLettersOnly = /^[a-zA-Z\-\s]{3,20}$/;
      const regexAddress = /^[\w\s\,\-\']{2,80}$/;
      const regexEmail = /^[\w\+-]{2,40}@[\w-]{2,60}\.[a-z]{2,15}$/;

      const allDatas = [
        {
          domElement: 'firstName',
          domElementError: 'firstNameErrorMsg',
          errorContent: 'Veuillez saisir un prénom',
          regexpToUse: regexLettersOnly,
        },
        {
          domElement: 'lastName',
          domElementError: 'lastNameErrorMsg',
          errorContent: 'Veuillez saisir un nom',
          regexpToUse: regexLettersOnly,
        },
        {
          domElement: 'address',
          domElementError: 'addressErrorMsg',
          errorContent: 'Veuillez saisir une adresse',
          regexpToUse: regexAddress,
        },
        {
          domElement: 'city',
          domElementError: 'cityErrorMsg',
          errorContent: 'Veuillez saisir une ville',
          regexpToUse: regexLettersOnly,
        },
        {
          domElement: 'email',
          domElementError: 'emailErrorMsg',
          errorContent: 'Veuillez saisir une adresse mail',
          regexpToUse: regexEmail,
        },
      ];

      const inputValid = '2px solid green';
      const inputInvalid = '2px solid red';
      let hasError = false;

      allDatas.forEach((data) => {
        const domElementError = document.getElementById(data.domElementError);
        const domElement = document.getElementById(data.domElement);
        const valueElement = domElement.value;
        const isValid = data.regexpToUse.test(valueElement);
        domElementError.textContent = '';
        domElement.style.border = inputValid;
        if (!isValid) {
          domElementError.textContent = data.errorContent;
          domElement.style.border = inputInvalid;
          hasError = true;
        }
      });

      return !hasError;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Post an order and get an orderId
   */
  async postOrder() {
    const firstnameDom = document.getElementById('firstName');
    const lastnameDom = document.getElementById('lastName');
    const addressDom = document.getElementById('address');
    const cityDom = document.getElementById('city');
    const emailDom = document.getElementById('email');

    const allKanapInCart = this.cart.map((kanap) => kanap.id);

    const order = {
      contact: {
        firstName: firstnameDom.value,
        lastName: lastnameDom.value,
        address: addressDom.value,
        city: cityDom.value,
        email: emailDom.value,
      },
      products: allKanapInCart,
    };

    if (this.cart.length === 0) {
      createNotification('Veuillez mettre au moins un article !', false);
      throw new Error('Le script ne continu pas');
    } else {
      const sendOrder = await fetch(
        'http://localhost:3000/api/products/order',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(order),
        }
      );
      const response = await sendOrder.json();
      const orderId = response.orderId;
      localStorage.clear();
      window.location.href = `./confirmation.html?orderId=${orderId}`;
    }
  }

  gettingCart() {
    return this.cart;
  }
}
