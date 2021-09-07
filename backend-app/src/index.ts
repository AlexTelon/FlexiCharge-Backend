import express from 'express';

const app = express();

app.get('/', (req,res)=>{
  res.send('Hello');
});

app.listen(8080,()=> console.log('Backend app is running on localhost:8080.'))