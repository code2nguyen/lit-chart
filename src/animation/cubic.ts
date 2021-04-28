export function cubic(position: number) {
  return position === 1 ? 1 : (1 - Math.pow(1 - position, 3)) * 1;
}
