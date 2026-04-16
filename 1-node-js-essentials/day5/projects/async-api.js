import fetch from 'node-fetch';


async function fetchUser(){
    console.log('Fetching user...');
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/1`);
    const data = await res.json();
    return data;
}

async function fetchPosts(){
    console.log('Fetching Posts...');
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/1/posts`);
    const data = await res.json();
    return data;
}


async function run(){
    try {
        const [user, posts] = await Promise.all([
            fetchUser(),
            fetchPosts()
        ]);

        const result = {
            user: user,
            posts: posts
        };

        console.log(JSON.stringify(result, null, 2));

    } catch (error) {
        console.error('Error:', error.message);
    }
}

run();