const { faker } = require("@faker-js/faker");
const User = require("../models/User");
const Tweet = require("../models/Tweet");
const bcrypt = require("bcryptjs");

faker.locale = "en";

module.exports = async () => {
  const users = [];

  for (let i = 0; i < 10; i++) {
    users.push(
      new User({
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        username: faker.internet.userName(),
        password: await bcrypt.hash(process.env.SESSION_CREDENTIAL, 10),
        email: faker.internet.email(),
        description: faker.lorem.sentence(15),
        avatar: faker.image.avatar(),
      }),
    );
  }
  for (const user of users) {
    const rndNumber = faker.datatype.number({ min: 0, max: users.length });
    const userTo = users.filter((u) => u._id !== user._id);
    for (let j = 0; j < rndNumber; j++) {
      const tweet = new Tweet({
        content: faker.lorem.sentence(10),
        author: user._id,
        likes: userTo,
      });
      user.tweets.push(tweet);
      await tweet.save();
    }
    user.following = userTo;
    for (let k = 0; k < userTo.length; k++) {
      userTo[k].followers.push(user);
    }
  }

  await User.insertMany(users);
  console.log("[Database] Se corrió el seeder de Users.");
};
