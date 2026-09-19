/**
 * Promotes a user to admin by email.
 * Usage: node scripts/promote-admin.cjs user@example.com
 *
 * Loads ../.env (relative to the backend folder) the same way index.js does.
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: node scripts/promote-admin.cjs <email>");
    process.exit(1);
  }

  const mongoose = require("mongoose");
  await mongoose.connect(`${process.env.MONGODB_URI}`, { dbName: "void-studios" });

  const User = require("../src/models/user.model.js").User;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    console.error(`❌ No user found with email: ${email}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  user.role = "admin";
  await user.save({ validateBeforeSave: false });
  console.log(`✅ ${user.email} is now an admin`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("💥 Failed:", err.message);
  process.exit(1);
});
