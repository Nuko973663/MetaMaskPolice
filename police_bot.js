/**
 * bot.js
 */

import { TwitterApi } from "twitter-api-v2";
import { sleep } from "./sleep.js";
import fs from "fs";
const config = JSON.parse(fs.readFileSync("./twitter.json", "utf8"));

const client = new TwitterApi({
  appKey: config.keys.api_key,
  appSecret: config.keys.api_key_secret,
  accessToken: config.keys.access_token,
  accessSecret: config.keys.access_token_secret,
});

const getBaits = () => {
  return config.baits[Math.floor(Math.random() * config.baits.length)];
};

const getMyId = async () => {
  const meUser = await client.v2.me();
  return meUser.data;
};

const main = async () => {
  const me = await getMyId();
  console.log(me.id, " : ", me.name);

  let { data: createdTweet } = await client.v2.tweet(
    getBaits() + " " + Date.now()
  );
  console.log("Tweet", createdTweet.id, ":", createdTweet.text);

  console.log("wait for reply");
  await sleep(10000);

  const tweetsOfMe = await client.v2.userMentionTimeline(me.id, {
    expansions: ["author_id", "in_reply_to_user_id"],
  });
  for (const fetchedTweet of tweetsOfMe) {
    if (fetchedTweet.text.indexOf("https://t.co/") > 0) {
      const spammer = await client.v2.user(fetchedTweet.author_id, {
        "tweet.fields": ["id", "text"],
      });

      console.log("Detect Spam");
      console.log(spammer);
      console.log(fetchedTweet);

      try {
        const res = await client.v1.post(
          "users/report_spam.json",
          {
            user_id: spammer.id,
          },
          { forceBodyMode: "json" }
        );

        console.log(res);
        console.log("@" + spammer.username + " を通報しました");
      } catch (e) {}
    }
  }
};

main();
