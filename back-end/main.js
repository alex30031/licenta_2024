import express from 'express'
import cors from 'cors'
import {router as indexRouter} from './routes/index.js'
import { syncDatabase } from './models/config.js'




const app = express()
const PORT = 3000



app.use(express.json());

app.use(cors());
app.use("/", indexRouter);

const server= app.listen(PORT, async () => {
    try{
        await syncDatabase();
        console.log(`Server started on http://localhost:${PORT}`)
    }
    catch(err){
        console.log("error with db");
        server.close();
    }
   });