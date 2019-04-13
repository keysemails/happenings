module.exports = {
  env: 'dev',
  port: 3000,
  db: require('./backends.json')['dev']
}
