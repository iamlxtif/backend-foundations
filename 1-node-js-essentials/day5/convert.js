 function fakeFetchPromise() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: "Promise response" });
      }, 1000);
    });
  }

  async function run(){
    const data = await fakeFetchPromise();
    console.log("Async/Await", data);
  }
  
  run();
