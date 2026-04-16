function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Finished after ${ms}ms`);
      }, ms);
    });
  }
  
  async function run() {
    console.log(await delay(1000));
    console.log(await delay(2000));
    console.log(await delay(500));
  }
  
  run();