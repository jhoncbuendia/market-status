import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { bookOrderRouter } from './feature/book-order';

const app = express();
const port = 3000;

dotenv.config();

app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use(bookOrderRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
