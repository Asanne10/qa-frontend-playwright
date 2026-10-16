const { Before, After, setDefaultTimeout, Status } = require('@cucumber/cucumber');
const { chromium, selectors } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
setDefaultTimeout(45_000);
selectors.setTestIdAttribute('data-test');
Before(async function () {
  const launchOptions = { headless: process.env.HEADLESS !== 'false' };
  // Configuración opcional para redes corporativas; no altera las verificaciones TLS.
  if (process.env.PW_PROXY_SERVER) launchOptions.proxy = { server: process.env.PW_PROXY_SERVER };
  this.browser = await chromium.launch(launchOptions);
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(10_000);
  this.page.setDefaultNavigationTimeout(30_000);
  this.login = new LoginPage(this.page);
  this.inventory = new InventoryPage(this.page);
  this.cart = new CartPage(this.page);
  this.checkout = new CheckoutPage(this.page);
});
After(async function ({ result }) {
  try {
    if (result?.status === Status.FAILED && this.page && !this.page.isClosed()) {
      await this.attach(`URL al fallar: ${this.page.url()}`, 'text/plain');
    }
  } finally {
    try { if (this.context) await this.context.close(); }
    finally { if (this.browser) await this.browser.close(); }
  }
});
