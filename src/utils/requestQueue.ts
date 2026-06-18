export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function staggeredExecution<T>(
  tasks: (() => Promise<T>)[],
  gapMs = 500
): Promise<T[]> {
  const results: Promise<T>[] = [];

  tasks.forEach((task, index) => {
    const wrappedTask = async () => {
      if (index > 0) {
        await delay(index * gapMs);
      }
      return task();
    };

    results.push(wrappedTask());
  });

  return Promise.all(results);
}
