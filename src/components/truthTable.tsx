import React, { ReactNode, useMemo, useState } from "react";
import { evaluate, listVariables, prettyPrint } from "../utils/parsing";
import { generateCombinations } from "../utils/generator";
import { FaTrash } from "react-icons/fa";
import EmptyState from "./emptyState";

const Cell: React.FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => {
  return (
    <td
      className={
        "font-mono px-5 text-center" + (className ? ` ${className}` : "")
      }
    >
      {children}
    </td>
  );
};

const Row: React.FC<{ formulas: string[]; mapping: Map<string, boolean> }> = ({
  formulas,
  mapping,
}) => {
  const rowValues: string[] = [];
  for (let value of mapping.values()) {
    rowValues.push(value.toString());
  }
  return (
    <tr>
      {rowValues.map((cell, i) => (
        <Cell key={`variable-${i}`}>{cell}</Cell>
      ))}
      {formulas.map((formula, i) => (
        <Cell key={`formula-${i}`} className="border-l-2">
          {evaluate(formula, mapping).toString()}
        </Cell>
      ))}
      {/*<Cell key="empty" className="border-l-2">*/}
      {/*  &nbsp;*/}
      {/*</Cell>*/}
    </tr>
  );
};

const TruthTable: React.FC = () => {
  const [formulas, setFormulas] = useState<string[]>([]);
  const variables = useMemo<string[]>(() => {
    const variables = new Set<string>();
    formulas.forEach((formula) =>
      listVariables(formula).forEach((variable) => variables.add(variable))
    );
    return [...variables].sort();
  }, [formulas]);

  const addFormula = (formula: string) => {
    formula = prettyPrint(formula);
    if (!formulas.includes(formula)) {
      setFormulas([...formulas, formula]);
    }
  };

  const deleteFormula = (formula: string) => {
    setFormulas([...formulas.filter((value) => value !== formula)]);
  };

  if (formulas.length === 0) {
    return <EmptyState onSubmit={addFormula} />;
  }

  const rows: React.ReactNode[] = [];
  const combinationGenerator = generateCombinations(variables);
  let index = 0;
  for (let mapping of combinationGenerator) {
    rows.push(<Row key={index} formulas={formulas} mapping={mapping} />);
    index += 1;
  }

  return (
    <table className="table-auto overflow-auto">
      <thead className="border-b-2">
        <tr>
          {variables.map((variable) => (
            <th key={`variable-${variable}`}>{variable}</th>
          ))}
          {formulas.map((formula) => (
            <th key={`formula-${formula}`} className="border-l-2 px-4">
              <div className="flex items-center justify-center">
                <span className="mr-2">{formula}</span>
                <FaTrash
                  onClick={() => deleteFormula(formula)}
                  className="cursor-pointer"
                />
              </div>
            </th>
          ))}
          {/*<th className="border-l-2">*/}
          {/*  <FormulaInput*/}
          {/*    onSubmit={(value: string) =>*/}
          {/*      setFormulas([...formulas, prettyPrint(value)])*/}
          {/*    }*/}
          {/*  />*/}
          {/*</th>*/}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default TruthTable;
