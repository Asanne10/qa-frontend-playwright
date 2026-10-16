const { expect } = require('@playwright/test');
const { standardUser } = require('../data/users');

async function signInAsStandardUser({ login, page, baseUrl }) {
  await login.open(baseUrl);
  await login.signIn(standardUser.username, standardUser.password);
  await expect(page).toHaveURL(/\/inventory\.html$/);
}

module.exports = { signInAsStandardUser };
