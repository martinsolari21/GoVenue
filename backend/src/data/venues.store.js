const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'venues.json');

const readVenues = () => {
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

const writeVenues = (venues) => {
  fs.writeFileSync(filePath, JSON.stringify(venues, null, 2));
};

module.exports = {
  readVenues,
  writeVenues
};
