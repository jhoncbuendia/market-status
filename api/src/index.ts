import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

const app = express();
const port = 3000;

dotenv.config();

app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
