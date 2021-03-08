export function generateId(): string {
  const rand: number = Math.floor(Math.random() * 1000);

  return (Date.now() * 1000 + rand).toString(16);
}
