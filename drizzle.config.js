/** @type {import ("drizzle-kit").Config} */

export default { 
  schema: "./utils/schema.js",
  dialect: 'postgresql',
  dbCredentials: {
  url: 'postgresql://neondb_owner:vcCLR1DFzG3a@ep-frosty-silence-a5crdjqr.us-east-2.aws.neon.tech/ai-interview-mocker?sslmode=require'
  }
};
