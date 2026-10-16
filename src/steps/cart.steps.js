const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { assertCartContents } = require('../assertions/cart.assertions');

When('abro el carrito', async function () {
  await this.inventory.openCart();
});

Then('el carrito conserva los productos y sus importes', async function () {
  await assertCartContents(this.page, this.cart, this.selectedProducts);
});

When('inicio el checkout', async function () {
  await this.cart.checkout();
  await expect(this.page).toHaveURL(/\/checkout-step-one\.html$/);
});

Then('el carrito conserva el producto preparado', async function () {
  await this.inventory.openCart();
  await assertCartContents(this.page, this.cart, this.selectedProducts);
});
