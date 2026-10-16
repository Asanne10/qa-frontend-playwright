const { ProductList } = require('../components/ProductList');
class CartPage {
  constructor(page) {
    this.products = new ProductList(page);
    this.checkoutButton = page.getByTestId('checkout');
  }
  async checkout() { await this.checkoutButton.click(); }
}
module.exports = { CartPage };
