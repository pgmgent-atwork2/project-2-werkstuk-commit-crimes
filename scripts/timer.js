function timer(seconds) {
  let remaining = seconds;

  const interval = setInterval(() => {
    console.log(remaining);
    remaining--;

    if (remaining < 0) {
      clearInterval(interval);
      console.log("Time's up!");
    }
  }, 1000);
}

timer(30);
