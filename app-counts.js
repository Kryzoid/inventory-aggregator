const fs = require('fs');
const appCounts = {/* appId: [owners] */};
const countApps = {/* owners: [appIds] */};

fs.readdirSync('inventories')
  .map((fileName) => fs.readFileSync(`inventories/${fileName}`))
  .map((file) => JSON.parse(file))
  .filter((inventory) => !inventory.private)
  .map((inventory) => inventory.tabCounts)
  .map((tabCounts) => {
    Object.keys(tabCounts).forEach((appId) => {
      appCounts[appId] = (appCounts[appId] || 0) + 1;
    });
  });

Object.keys(appCounts).forEach((appId) => {
  if (!countApps[appCounts[appId]]) {
    countApps[appCounts[appId]] = appId;
    return;
  } else if (typeof countApps[appCounts[appId]] === 'string') {
    countApps[appCounts[appId]] = [countApps[appCounts[appId]]];
  }

  countApps[appCounts[appId]].push(appId);
});

fs.writeFileSync('data/app-counts.json', JSON.stringify(countApps, null, 2));
