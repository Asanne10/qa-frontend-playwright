const { ProductList } = require('../components/ProductList');
const { toCents } = require('../utils/money');
class InventoryPage {
  constructor(page) {
    this.page = page;
    this.products = new ProductList(page);
    this.title = page.getByTestId('title');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.cartLink = page.getByTestId('shopping-cart-link');
  }
  async addProducts(names) {
    const selected = [];
    for (const name of names) {
      const item = this.products.item(name);
      const priceCents = toCents(await item.getByTestId('inventory-item-price').innerText());
      await item.getByRole('button', { name: 'Add to cart', exact: true }).click();
      selected.push({ name, priceCents, quantity: 1 });
    }
    return selected.sort((a, b) => a.name.localeCompare(b.name));
  }
  async openCart() { await this.cartLink.click(); }
}
module.exports = { InventoryPage };
