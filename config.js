var config = {};

config.mongoUri = process.env.MONGOLAB_URI;
config.cookieMaxAge = 30 * 24 * 3600 * 1000; // 30 days
config.ordrxKey = 'ndFJ9AiO81KyjC7NYQUglzbuftM8FUDwHnWyN48UBfs';
config.address = {
  addr: '288 Coleridge St.',
  city: 'San Francisco',
  zip: '94110',
  state: 'CA'
};
config.phone = '415-555-1234';

module.exports = config;