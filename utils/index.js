function flatten(array) {
  return array.reduce((prev, next) => {
    return Array.isArray(next) ? [...prev, ...next] : [...prev, next];
  });
}

function sleep(time) {
  return new Promise(resolve => setTimeout(() => resolve(), time));
}

module.exports = {flatten, sleep};
