module.exports = {
  env: 'test',
  port: 3100,
  db: require('./backends.json')['test']
}
