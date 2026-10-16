const { expect } = require('@playwright/test');

async function assertCartContents(page, cart, expectedProducts) {
  await expect(page).toHaveURL(/\/cart\.html$/);
  await expect(cart.products.items).toHaveCount(expectedProducts.length);
  expect(await cart.products.readItems()).toEqual(expectedProducts);
}

module.exports = { assertCartContents };
