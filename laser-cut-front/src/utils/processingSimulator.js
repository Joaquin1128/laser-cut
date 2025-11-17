export async function simulateProcessingWithProgress(apiPromise, setProgress, options = {}) {
  const {
    minProcessingTime = 2000,
  } = options;

  setProgress(0);

  const progressInterval = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 90) {
        clearInterval(progressInterval);
        return prev;
      }
      const progressFactor = 1 - (prev / 90);
      const minIncrement = 0.5;
      const maxIncrement = 3 * progressFactor;
      const increment = minIncrement + Math.random() * (maxIncrement - minIncrement);
      return Math.min(prev + increment, 90);
    });
  }, 100);

  try {
    const [data] = await Promise.all([
      apiPromise,
      new Promise(resolve => setTimeout(resolve, minProcessingTime))
    ]);

    clearInterval(progressInterval);

    const steps = 20;
    const stepDuration = 30;
    const startProgress = 90;

    for (let i = 1; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDuration));
      const newProgress = startProgress + ((100 - startProgress) * (i / steps));
      setProgress(newProgress);
    }

    await new Promise(resolve => setTimeout(resolve, 300));
    setProgress(0);

    return data;
  } catch (error) {
    clearInterval(progressInterval);
    setProgress(0);
    throw error;
  }
}
