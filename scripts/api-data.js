// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import fs from 'node:fs';

const API_URL = process.env.VITE_API_URL;

const endpoints = {
  items: {
    path: './src/data/items.json',
    url: `${API_URL}/vestigia/items`,
  },
  goals: {
    path: './src/data/goals.json',
    url: `${API_URL}/vestigia/goals`,
  },
};

async function saveOnlineJsonToLocal(url, path) {
  if (!url || !path) {
    throw new Error('No Url or Path provided');
  }
  try {
    const response = await fetch(url);
    const content = await response.json();
    fs.writeFile(path, JSON.stringify(content), (err) => {
      if (err) {
        throw new Error(err);
      }
    });
  } catch (err) {
    console.error(err);
  }
}

async function main() {
  await Promise.all(
    Object.keys(endpoints).map((endpoint) => {
      const { url, path } = endpoints[endpoint];
      return saveOnlineJsonToLocal(url, path);
    }),
  );
}

main();
