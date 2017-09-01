const fs = require('fs');
const userCounts = {/* #tabs: [users] */};

fs.readdirSync('inventories')
  .map((fileName) => fs.readFileSync(`inventories/${fileName}`))
  .map((file) => JSON.parse(file))
  .filter((inventory) => !inventory.private)
  .forEach((inventory) => {
    const tabTotal = Object.keys(inventory.tabCounts).length;

    if (!userCounts[tabTotal]) {
      userCounts[tabTotal] = inventory.name;
      return;
    } else if (typeof userCounts[tabTotal] === 'string') {
      userCounts[tabTotal] = [userCounts[tabTotal]];
    }

    userCounts[tabTotal].push(inventory.name);
  });

fs.writeFileSync('data/user-counts.json', JSON.stringify(userCounts, null, 2));
