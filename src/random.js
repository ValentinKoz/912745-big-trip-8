export function rand(max = 6, min = 1) {
  return Math.floor(Math.random() * (max - min) + min);
}
