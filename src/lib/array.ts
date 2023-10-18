export function findAndPop<T>(
  array: T[],
  target: T,
  predicate?: (a: T, b: T) => boolean
) {
  const index = array.findIndex((item) =>
    predicate ? predicate(item, target) : item === target
  );
  if (index === -1) {
    return undefined;
  }
  return array.splice(index, 1)[0];
}
