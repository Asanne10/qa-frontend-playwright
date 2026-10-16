const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { resolveUsername } = require('../data/users');

Given('que estoy en el login sin sesión', async function () {
  await this.login.open(this.baseUrl);
});

When('ingreso {string} y {string}', async function (username, password) {
  await this.login.signIn(resolveUsername(username), password);
});

Then('veo el error de acceso {string}', async function (message) {
  await expect(this.login.error).toHaveText(message);
});

Then('permanezco fuera del catálogo', async function () {
  await expect(this.login.submit).toBeVisible();
  await expect(this.page).not.toHaveURL(/\/inventory\.html$/);
  await expect(this.inventory.products.items).toHaveCount(0);
});
