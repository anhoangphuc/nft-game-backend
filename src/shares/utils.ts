export function randomMinMax(minNumber: number, maxNumber: number) {
  //Include minValue, exclude maxValue
  const diff = maxNumber - minNumber;
  return Math.floor(Math.random() * diff) + minNumber;
}