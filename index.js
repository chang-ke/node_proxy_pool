const {fnList, getAll} = require('./src/getProxy');

(async function() {
  console.log(await fnList.fifthFreePort());
})();
