import express, { Express, Router, Request, Response } from 'express';
import axios from "axios";
const app: Express = express();

import cors from "cors";
app.use(cors());

const router: Router = express.Router();
app.use("/api", router);

router.get('/list', async (req: Request, res: Response) => {
    const { data } = await axios.get("https://c.m.163.com/ug/api/wuhan/app/data/list-total?t=332750026222");
    res.json({
        ...data.data
    })
});
app.listen(3001, () => {
    console.log("http://localhost:3001");

})
