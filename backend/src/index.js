import express from 'express';
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import { connect } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
console.log(PORT);
console.log(MONGO_URI);

app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

app.use("/api/auth", authRoutes)

  
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  connect();
});