module.exports = {
  env: 'prod',
  port: 3000,
  db: require('./backends.json')['prod']
}
