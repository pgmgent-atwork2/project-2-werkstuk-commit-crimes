import express from 'express';
import answerRoutes from './routes/answerRoutes.js';
import questionRoutes from './routes/questionRoutes.js';

const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/answers', answerRoutes);
app.use('/api/questions', questionRoutes);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})