const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { randomUUID } = require('node:crypto');
const { toCents } = require('../utils/money');

async function signInStandard(world) {
  await world.login.open(world.baseUrl);
  await world.login.signIn('standard_user', 'secret_sauce');
  await expect(world.page).toHaveURL(/\/inventory\.html$/);
}
async function assertCart(world) {
  await expect(world.page).toHaveURL(/\/cart\.html$/);
  await expect(world.cart.products.items).toHaveCount(world.selectedProducts.length);
  expect(await world.cart.products.readItems()).toEqual(world.selectedProducts);
}
Given('que estoy en el login sin sesión', async function () { await this.login.open(this.baseUrl); });
Given('que ingresé como usuario estándar', async function () { await signInStandard(this); });
Given('que estoy en checkout con Backpack en el carrito', async function () {
  await signInStandard(this);
  this.selectedProducts = await this.inventory.addProducts(['Sauce Labs Backpack']);
  await this.inventory.openCart();
  await assertCart(this);
  await this.cart.checkout();
  await expect(this.page).toHaveURL(/\/checkout-step-one\.html$/);
});
When('ingreso {string} y {string}', async function (username, password) {
  if (username === 'qa_inexistente_automatizado') username = `qa_${randomUUID()}`;
  await this.login.signIn(username, password);
});
Then('accedo al catálogo de productos', async function () {
  await expect(this.page).toHaveURL(/\/inventory\.html$/);
  await expect(this.inventory.title).toHaveText('Products');
  await expect(this.login.submit).not.toBeVisible();
  expect(await this.inventory.products.items.count()).toBeGreaterThan(0);
  const first = this.inventory.products.items.first();
  await expect(first.getByTestId('inventory-item-name')).not.toBeEmpty();
  expect(toCents(await first.getByTestId('inventory-item-price').innerText())).toBeGreaterThan(0);
  await expect(first.getByRole('button', { name: 'Add to cart', exact: true })).toBeVisible();
});
Then('veo el error de acceso {string}', async function (message) {
  await expect(this.login.error).toHaveText(message);
});
Then('permanezco fuera del catálogo', async function () {
  await expect(this.login.submit).toBeVisible();
  await expect(this.page).not.toHaveURL(/\/inventory\.html$/);
  await expect(this.inventory.products.items).toHaveCount(0);
});
When('agrego los productos {string}', async function (products) {
  this.selectedProducts = await this.inventory.addProducts(products.split(';').map(p => p.trim()));
});
Then('el catálogo refleja los productos agregados', async function () {
  await expect(this.inventory.cartBadge).toHaveText(String(this.selectedProducts.length));
  for (const product of this.selectedProducts) {
    await expect(this.inventory.products.item(product.name).getByRole('button', { name: 'Remove', exact: true })).toBeVisible();
  }
});
When('abro el carrito', async function () { await this.inventory.openCart(); });
Then('el carrito conserva los productos y sus importes', async function () { await assertCart(this); });
When('inicio el checkout', async function () {
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
Then('el carrito conserva el producto preparado', async function () {
  await this.inventory.openCart();
  await assertCart(this);
});
Then('el resumen conserva los productos y los importes son consistentes', async function () {
  await expect(this.page).toHaveURL(/\/checkout-step-two\.html$/);
  await expect(this.checkout.products.items).toHaveCount(this.selectedProducts.length);
  expect(await this.checkout.products.readItems()).toEqual(this.selectedProducts);
  const subtotal = toCents(await this.checkout.subtotal.innerText());
  const tax = toCents(await this.checkout.tax.innerText());
  const total = toCents(await this.checkout.total.innerText());
  const expectedSubtotal = this.selectedProducts.reduce((sum, p) => sum + p.priceCents * p.quantity, 0);
  expect(subtotal).toBe(expectedSubtotal);
  expect(tax).toBeGreaterThanOrEqual(0);
  expect(total).toBe(subtotal + tax);
});
When('confirmo la compra', async function () { await this.checkout.finish(); });
Then('veo la confirmación del pedido', async function () {
  await expect(this.page).toHaveURL(/\/checkout-complete\.html$/);
  await expect(this.checkout.confirmation).toHaveText('Thank you for your order!');
});
