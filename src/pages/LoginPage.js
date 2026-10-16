class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.getByTestId('username');
    this.password = page.getByTestId('password');
    this.submit = page.getByTestId('login-button');
    this.error = page.getByTestId('error');
  }
  async open(url) { await this.page.goto(url, { waitUntil: 'domcontentloaded' }); }
  async signIn(username, password) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submit.click();
  }
}
module.exports = { LoginPage };
