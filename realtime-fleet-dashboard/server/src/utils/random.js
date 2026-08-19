export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomChoice(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
