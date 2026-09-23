
const path = require('path');

const locale = (ns) => path.resolve(__dirname, `src/i18n/locales/en/${ns}.json`);

// Add new namespaces here when their JSON files are created
module.exports = {
  algorithmic: locale('algorithmic'),
  swap: locale('swap'),
  trade: locale('trade'),
  borrow: locale('borrow'),
  portfolio: locale('portfolio'),
  strategies: locale('strategies'),
  leagues: locale('leagues'),
  merge: locale('merge'),
  home: locale('home'),
  ecosystem: locale('ecosystem'),
  index: locale('index'),
  // developer: locale('developer'),
  // tor: locale('tor'),
  common: locale('common'),
  header: locale('header'),
};
