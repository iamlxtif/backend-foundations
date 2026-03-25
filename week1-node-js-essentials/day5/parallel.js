function wait(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }
  
  async function sequential() {
    console.time("sequential");
    await wait(1000);
    await wait(1000);
    await wait(1000);
    console.timeEnd("sequential");
  }
  
  async function parallel() {
    console.time("parallel");
    await Promise.all([
      wait(1000),
      wait(1000),
      wait(1000)
    ]);
    console.timeEnd("parallel");
  }
  
  sequential();
  parallel();
  