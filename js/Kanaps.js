/**
 * A class representing the kanaps in the application.
 */

export default class Kanaps {
  /**
   * Create a new instence of Kanapps class.
   */

  constructor() {
    /**
     * An array containing all the kanaps in the application.
     * @param { Array }
     */
    this.allKanaps;

    /**
     * A string containing the HTML code for the kanaps cards.
     * @param { String }
     */
    this.putCardsProducts = '';
  }

  /**
   * Display the kanaps on the page.
   * @param { Promise } - A promise that is resolved when the kanaps have been displayed.
   */

  async displayKanaps() {
    try {
      const response = await fetch('http://localhost:3000/api/products');
      this.allKanaps = await response.json();
      this.allKanaps.forEach((kanap) => {
        this.putCardsProducts += `<a href="./product.html?id=${kanap._id}">
                                            <article>
                                                <img src="${kanap.imageUrl}" alt="${kanap.altTxt}">
                                                <h3 class="productName">${kanap.name}</h3>
                                                <p class="productDescription">${kanap.description}</p>
                                            </article>
                                        </a>`;
      });
      document.getElementById('items').innerHTML = this.putCardsProducts;
    } catch (error) {
      console.error("L'API n'a pas pu être récupéré", error);
    }
  }

  /**
   * Return the array of all kanaps in the application.
   * @returns { Array } - An array containing all the kanaps in the application.
   */
  getKanaps() {
    return this.allKanaps;
  }
}
