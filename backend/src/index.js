import express from 'express';
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import connect  from "./lib/db.js";
import bookRoutes from "./routes/bookRoutes.js";
import cors from "cors";



const app = express();
const PORT = process.env.PORT;



app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello, World!');
  });


app.use("/api/auth", authRoutes)
app.use("api/book", bookRoutes)

connect();
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  
  
});