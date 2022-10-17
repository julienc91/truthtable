import ohm from "ohm-js";

const grammar = ohm.grammar(`
  Grammar {
    Exp     = OrExp
    OrExp   = OrExp "|" AndExp -- or
            | AndExp
    AndExp  = AndExp "&" NotExp  -- and
            | NotExp
    NotExp  = "!" PriExp  -- not
            | PriExp
    PriExp  = "(" Exp ")"  -- paren
            | Variable
            | Boolean

    Variable = ~Boolean letter (alnum | "_")*

    Boolean = True | False
    True = "true" ~(alnum | "_")
    False = "false" ~(alnum | "_")
  } 
`);

const baseSemantics = grammar.createSemantics();
baseSemantics.addOperation<boolean>("eval", {
  OrExp_or: (exp1, op, exp2) => exp1.eval() || exp2.eval(),
  AndExp_and: (exp1, op, exp2) => exp1.eval() && exp2.eval(),
  NotExp_not: (notop, exp) => !exp.eval(),
  PriExp_paren: (openpar, exp, closepar) => exp.eval(),
  Variable: (first, rest) => true,
  True: (_) => true,
  False: (_) => false,
});
baseSemantics.addOperation<string[]>("listVariables", {
  OrExp_or: (exp1, op, exp2) => [
    ...exp1.listVariables(),
    ...exp2.listVariables(),
  ],
  AndExp_and: (exp1, op, exp2) => [
    ...exp1.listVariables(),
    ...exp2.listVariables(),
  ],
  NotExp_not: (notop, exp) => exp.listVariables(),
  PriExp_paren: (openpar, exp, closepar) => exp.listVariables(),
  Variable: (first, rest) => [`${first.sourceString}${rest.sourceString}`],
  True: (_) => [],
  False: (_) => [],
});
baseSemantics.addOperation<string>("prettyPrint", {
  OrExp_or: (exp1, op, exp2) => `${exp1.prettyPrint()} | ${exp2.prettyPrint()}`,
  AndExp_and: (exp1, op, exp2) =>
    `${exp1.prettyPrint()} & ${exp2.prettyPrint()}`,
  NotExp_not: (notop, exp) => `!${exp.prettyPrint()}`,
  PriExp_paren: (openpar, exp, closepar) => `(${exp.prettyPrint()})`,
  Variable: (first, rest) => `${first.sourceString}${rest.sourceString}`,
  True: (_) => "true",
  False: (_) => "false",
});

/**
 * Determine if a formula is syntactically correct.
 * @param formula
 */
export const isValid = (formula: string): boolean => {
  return grammar.match(formula).succeeded();
};

/**
 * Return the list of variables used by a formula.
 * @param formula
 */
export const listVariables = (formula: string): string[] => {
  const match = grammar.match(formula);
  if (!match.succeeded()) {
    return [];
  }
  const variables: string[] = baseSemantics(match).listVariables();
  return [...new Set(variables)];
};

export const listAllVariables = (formulas: string[]): string[] => {
  const variables = new Set<string>();
  formulas.forEach((formula) =>
    listVariables(formula).forEach((variable) => variables.add(variable))
  );
  return [...variables].sort();
};

/**
 * Evaluate a formula.
 * @param formula
 * @param mapping
 */
export const evaluate = (
  formula: string,
  mapping: Map<string, boolean>
): boolean => {
  const match = grammar.match(formula);
  if (!match.succeeded()) {
    throw new Error("Invalid formula");
  }

  const semantics = grammar.extendSemantics(baseSemantics);
  semantics.extendOperation("eval", {
    Variable: (first, rest): boolean => {
      const variableName = first.sourceString + rest.sourceString;
      const value = mapping.get(variableName);
      if (value === undefined) {
        throw new Error(`Unknown variable ${variableName}`);
      }
      return value;
    },
  });
  return semantics(match).eval();
};

export const prettyPrint = (formula: string): string => {
  const match = grammar.match(formula);
  if (!match.succeeded()) {
    throw new Error("Invalid formula");
  }
  return baseSemantics(match).prettyPrint();
};
