const redis = require('redis');
const client = redis.createClient({ 
  url: 'redis://localhost:6379' 
});

client.connect().catch(console.error);

// Cache data for 1 hour (3600 seconds)
const cache = (key, data) => {
  client.setEx(key, 3600, JSON.stringify(data));
};

// Retrieve cached data
const getCached = async (key) => {
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
};

module.exports = { cache, getCached };