const { randomUUID } = require('node:crypto');

const standardUser = Object.freeze({
  username: 'standard_user',
  password: 'secret_sauce'
});

function resolveUsername(username) {
  return username === 'qa_inexistente_automatizado'
    ? `qa_${randomUUID()}`
    : username;
}

module.exports = { standardUser, resolveUsername };
