# Inventory Aggregator
> Collects stats on the inventories of a steam group's members.

## Getting started
You'll need [git](https://git-scm.com) and [node](https://nodejs.org).

1. Clone the repository.
2. Edit the `group` field of [config.json](config.json) to a desired steam community group's custom URL subdirectory.
3. Grap dependencies with `npm install`.

## Running
* `npm start` grabs and saves user inventories to the [inventories](inventories/) folder.
   * `npm run users` aggregates **users** based on tab ownership and saves to the [data](data/) folder.
   * `npm run apps` aggregates **apps** based on tab ownership and saves to the [data](data/) folder.

## Sample data
The config, data, and inventories from the [InventoryService](https://steamcommunity.com/groups/InventoryService) group are included in the repository.  
This was collected on `8/31/2017 5:00 PM EST`.
