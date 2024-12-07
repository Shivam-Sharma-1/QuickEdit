import checkImageProcessing from "./check-processing";

export async function waitForProcessing(url: string) {
  return new Promise((resolve, reject) => {
    const checkInterval = setInterval(async () => {
      const isProcessed = await checkImageProcessing(url);

      if (isProcessed) {
        clearInterval(checkInterval);
        resolve(true);
      }
    }, 3000);

    setTimeout(() => {
      clearInterval(checkInterval);
      reject(new Error("Processing timed out"));
    }, 180000);
  });
}
