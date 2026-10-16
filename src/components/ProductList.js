const { toCents } = require('../utils/money');
class ProductList {
  constructor(page) {
    this.items = page.getByTestId('inventory-item');
    this.page = page;
  }
  item(name) {
    return this.items.filter({ has: this.page.getByText(name, { exact: true }) });
  }
  async readItems() {
    const result = [];
    for (const item of await this.items.all()) {
      result.push({
        name: await item.getByTestId('inventory-item-name').innerText(),
        priceCents: toCents(await item.getByTestId('inventory-item-price').innerText()),
        quantity: Number(await item.getByTestId('item-quantity').innerText())
      });
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }
}
module.exports = { ProductList };
