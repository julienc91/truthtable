export function* generateCombinations(
  variables: string[]
): Generator<Map<string, boolean>, void, undefined> {
  const values: boolean[] = variables.map(() => false);
  let index: number;

  do {
    yield new Map(variables.map((variable, i) => [variable, values[i]]));

    index = values.length - 1;
    while (index >= 0) {
      if (values[index]) {
        values[index] = false;
        index -= 1;
      } else {
        values[index] = true;
        break;
      }
    }
  } while (index >= 0);
}
