'use strict';

const fs       = require('fs')
const request  = require('request-promise');
const cheerio  = require('cheerio');
const bluebird = require('bluebird');
const parseXML = require('xml-to-json-promise').xmlDataToJSON;
const groupURL = require('./config.json').group;
const decode   = (new require('html-entities').AllHtmlEntities).decode
const baseUrl  = 'https://steamcommunity.com';

let requestDelay = 0;

/**
 * @summary Gets a Steam group's list of members.
 * @param {string} group The group's custom URL subdirectory.
 * @return {Promise<string[]>} Resolves a collection of steamID64s.
 */
const getMembers = (group) => {
  if (!group)
    throw new Error('group is required.');

  const url = `${baseUrl}/groups/${group}/memberslistxml?xml=1`;

  return request(url)
    .then((xml) => parseXML(xml))
    .then((json) => json.memberList.members[0].steamID64);
}

/**
 * @summary Gets a Steam user's inventory tabs.
 * @param {string} userId A user's steamID64
 * @return {object} A mapping of app tabs and their respective item counts.
 */
const getInventory = (userId) => {
  if (!userId)
    throw new Error('userId is required.');

  const inventory = {
    url: `${baseUrl}/profiles/${userId}/inventory`,
    tabCounts: {},
    private: false
  };

  requestDelay += 10000;

  return bluebird.delay(requestDelay)
    .then(() => request(inventory.url))
    .then((html) => {
      const $ = cheerio.load(html);

      if (html.includes('too many requests')) {
        throw new Error('Rate limited by Valve');
      } else if (html.includes('inventory is currently private') || html.includes('This profile is private.')) {
        inventory.private = true;
      } else {
        $('.games_list_tab').map((i, element) => {
          const appId = element.attribs.href.replace('#', '');
          const count = element.children[1].attribs.class !== 'games_list_tab_failed'
            ? parseInt(/\(([^)]+)\)/.exec(element.children[5].children[0].data)[1]) : -1;

          inventory.tabCounts[appId] = count;
        });
      }

      inventory.name = decode($('a', '.profile_small_header_name').html());
      // Save inventory individually case something goes wrong
      fs.writeFileSync(`inventories/${userId}.json`, JSON.stringify(inventory, null, 2));
      console.log(`${new Date().toLocaleTimeString()} - ${userId}`);
      return inventory;
    });
}

const promises = getMembers(groupURL)
  .map((userId) => getInventory(userId));

Promise.all(promises).then((inventories) => {
  fs.writeFileSync('inventories.json', JSON.stringify(inventories, null, 2));
  console.log(`${new Date().toLocaleTimeString()} - done!`);
});
