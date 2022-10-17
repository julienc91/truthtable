import { evaluate, listAllVariables } from "./parsing";
import { generateCombinations } from "./generator";

function* exportToSimpleSeparatorFormat(
  formulas: string[],
  separator: string
): Generator<string, void, undefined> {
  const variables = listAllVariables(formulas);
  const generator = generateCombinations(variables);

  const header = [...variables, ...formulas].join(separator);
  yield header;

  for (let mapping of generator) {
    yield [
      ...variables.map((name) => mapping.get(name)?.toString()),
      ...formulas.map((formula) => evaluate(formula, mapping).toString()),
    ].join(separator);
  }
}

export function* exportToCSV(
  formulas: string[]
): Generator<string, void, undefined> {
  yield* exportToSimpleSeparatorFormat(formulas, ",");
}

export function* exportToTSV(
  formulas: string[]
): Generator<string, void, undefined> {
  yield* exportToSimpleSeparatorFormat(formulas, "\t");
}

export function* exportToMarkdown(
  formulas: string[]
): Generator<string, void, undefined> {
  const variables = listAllVariables(formulas);
  const generator = generateCombinations(variables);

  const escapedFormulas = formulas.map((formula) =>
    formula.replace("|", "\\|")
  );

  const header = "| " + [...variables, ...escapedFormulas].join(" | ") + " |";
  yield header;
  const topline =
    "|-" +
    [
      ...variables.map((variable) => "-".repeat(variable.length)),
      ...escapedFormulas.map((formula) => "-".repeat(formula.length)),
    ].join("-|-") +
    "-|";
  yield topline;

  for (let mapping of generator) {
    yield "| " +
      [
        ...variables.map((name) => mapping.get(name)?.toString()),
        ...formulas.map((formula) => evaluate(formula, mapping).toString()),
      ].join(" | ") +
      " |";
  }
}
