import express from 'express';

const app = express();
app.use(express.json());

let users = [{id: 1, name: 'Abdelatif'}];

app.get('/users', (req, res) => {
  res.status(200).json(users);
});

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === Number(req.params.id));
  if(!user){
    return res.status(404).json({error: 'User not found'});
  }
  res.status(200).json(user);
});

app.post('/users', (req, res) => {
  const {name} = req.body;

  if(!name){
    return res.status(400).json({error: 'Name is required'});
  }

  const user = {
    id: Date().now,
    name: name
  };

  users.push(user);
  res.status(201).json(user);
});



app.delete('/users/:id', (req, res) => {
  const id = Number(req.params);
  users = users.filter(u => u.id !== id);
  res.status(204).end();
});

app.listen(3000, () => {
  console.log('API running on http://localhost:3000');
});