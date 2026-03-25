import fetch from "node-fetch";

async function getTodo(id) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
  console.log('todo');
  const data = await res.json();
  return data;
}

async function run() {
  console.log(await getTodo(1));
  console.log('run');
}

run();
