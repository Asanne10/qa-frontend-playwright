const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { signInAsStandardUser } = require('../flows/authentication.flow');
const { assertCartContents } = require('../assertions/cart.assertions');
const { toCents } = require('../utils/money');

Given('que estoy en checkout con Backpack en el carrito', async function () {
  await signInAsStandardUser(this);
  this.selectedProducts = await this.inventory.addProducts(['Sauce Labs Backpack']);
  await this.inventory.openCart();
  await assertCartContents(this.page, this.cart, this.selectedProducts);
  await this.cart.checkout();
  await expect(this.page).toHaveURL(/\/checkout-step-one\.html$/);
});

When('envío los datos {string}, {string} y {string}', async function (first, last, postal) {
  this.customer = { first, last, postal };
  await this.checkout.submitInformation(first, last, postal);
});

Then('veo el error de checkout {string}', async function (message) {
  await expect(this.checkout.error).toHaveText(message);
  await expect(this.page).toHaveURL(/\/checkout-step-one\.html$/);
  await expect(this.checkout.finishButton).not.toBeVisible();
  await expect(this.checkout.confirmation).not.toBeVisible();
});

Then('el formulario conserva los datos válidos', async function () {
  await expect(this.checkout.firstName).toHaveValue(this.customer.first);
  await expect(this.checkout.lastName).toHaveValue(this.customer.last);
  await expect(this.checkout.postalCode).toHaveValue(this.customer.postal);
});

Then('el resumen conserva los productos y los importes son consistentes', async function () {
  await expect(this.page).toHaveURL(/\/checkout-step-two\.html$/);
  await expect(this.checkout.products.items).toHaveCount(this.selectedProducts.length);
  expect(await this.checkout.products.readItems()).toEqual(this.selectedProducts);
  const subtotal = toCents(await this.checkout.subtotal.innerText());
  const tax = toCents(await this.checkout.tax.innerText());
  const total = toCents(await this.checkout.total.innerText());
  const expectedSubtotal = this.selectedProducts.reduce(
    (sum, product) => sum + product.priceCents * product.quantity, 0
  );
  expect(subtotal).toBe(expectedSubtotal);
  expect(tax).toBeGreaterThanOrEqual(0);
  expect(total).toBe(subtotal + tax);
});

When('confirmo la compra', async function () {
  await this.checkout.finish();
});

Then('veo la confirmación del pedido', async function () {
  await expect(this.page).toHaveURL(/\/checkout-complete\.html$/);
  await expect(this.checkout.confirmation).toHaveText('Thank you for your order!');
});
