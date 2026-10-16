const { World, setWorldConstructor } = require('@cucumber/cucumber');
class TestWorld extends World {
  constructor(options) {
    super(options);
    this.baseUrl = process.env.BASE_URL || 'https://www.saucedemo.com/';
    this.selectedProducts = [];
  }
}
setWorldConstructor(TestWorld);
