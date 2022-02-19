/**
 * bot.js
 */

"use strict";
const TwitterApi = require("twitter-api-v2").default;
const config = require("./twitter.json");

const client = new TwitterApi({
  appKey: config.keys.api_key,
  appSecret: config.keys.api_key_secret,
  accessToken: config.keys.access_token,
  accessSecret: config.keys.access_token_secret,
});

//const client = new TwitterApi(config.keys.bearer_token);

const getBaits = () => {
  return config.baits[Math.floor(Math.random() * config.baits.length)];
};

const main = async () => {
  //const user = await client.v2.userByUsername("nuko973663");
  await client.v1.tweet("Hello, this is a test.");
  //const meUser = await client.v2.me();
  //onsole.log(meUser);
  return;
  let { data: createdTweet } = await client.v2.tweet(getBaits());
  console.log("Tweet", createdTweet.id, ":", createdTweet.text);

  //await twitterClient.v1.tweet("Hello, this is a test.");
  // You can upload media easily!
};

main();
