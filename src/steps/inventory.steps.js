const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { signInAsStandardUser } = require('../flows/authentication.flow');
const { toCents } = require('../utils/money');

Given('que ingresé como usuario estándar', async function () {
  await signInAsStandardUser(this);
});

Then('accedo al catálogo de productos', async function () {
  await expect(this.page).toHaveURL(/\/inventory\.html$/);
  await expect(this.inventory.title).toHaveText('Products');
  await expect(this.login.submit).not.toBeVisible();
  expect(await this.inventory.products.items.count()).toBeGreaterThan(0);
  await expect(this.inventory.firstProductName).not.toBeEmpty();
  expect(toCents(await this.inventory.firstProductPrice.innerText())).toBeGreaterThan(0);
  await expect(this.inventory.firstProductAddButton).toBeVisible();
});

When('agrego los productos {string}', async function (products) {
  const names = products.split(';').map(name => name.trim());
  this.selectedProducts = await this.inventory.addProducts(names);
});

Then('el catálogo refleja los productos agregados', async function () {
  await expect(this.inventory.cartBadge).toHaveText(String(this.selectedProducts.length));
  for (const product of this.selectedProducts) {
    await expect(this.inventory.removeButtonFor(product.name)).toBeVisible();
  }
});
