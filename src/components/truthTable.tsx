import React, { ReactNode, useMemo, useState } from "react";
import {
  evaluate,
  listAllVariables,
  listVariables,
  prettyPrint,
} from "../utils/parsing";
import { generateCombinations } from "../utils/generator";
import { FaTrash, FaLock } from "react-icons/fa";
import EmptyState from "./emptyState";
import FormulaInput from "./formulaInput";
import ExportManager from "./exportManager";

const Cell: React.FC<{ className?: string; children: ReactNode }> = ({
  className,
  children,
}) => {
  return (
    <td
      className={
        "font-mono px-5 text-left" + (className ? ` ${className}` : "")
      }
    >
      {children}
    </td>
  );
};

const Row: React.FC<{
  formulas: string[];
  mapping: Map<string, boolean>;
  locks: Map<string, boolean>;
  onLock: (name: string, value: boolean) => void;
  onUnlock: (name: string) => void;
}> = ({ formulas, mapping, locks, onLock, onUnlock }) => {
  const rowValues: [string, boolean][] = [];
  for (let [key, value] of mapping) {
    rowValues.push([key, value]);
  }

  const isHidden = useMemo<boolean>(() => {
    for (let [key, value] of mapping) {
      const lockValue = locks.get(key);
      if (lockValue !== undefined && lockValue !== value) {
        return true;
      }
    }
    return false;
  }, [mapping, locks]);

  if (isHidden) {
    return null;
  }

  return (
    <tr className="hover:bg-blue-5 dark:hover:bg-blue-900">
      {rowValues.map(([key, value], i) => {
        const isLocked = locks.has(key);
        return (
          <Cell
            key={`variable-${key}`}
            className={
              "group" + (i % 2 === 1 ? " bg-neutral-100 dark:bg-gray-800" : "")
            }
          >
            <div className="flex justify-between items-center">
              {value.toString()}
              <FaLock
                className={
                  "inline-block ml-5 " +
                  (isLocked ? "visible" : "invisible group-hover:visible")
                }
                onClick={() => (isLocked ? onUnlock(key) : onLock(key, value))}
              />
            </div>
          </Cell>
        );
      })}
      {formulas.map((formula, i) => {
        const value = evaluate(formula, mapping);
        return (
          <Cell
            key={`formula-${i}`}
            className={
              "border-l-2 dark:text-black " +
              (value ? "bg-green-100" : "bg-red-100")
            }
          >
            {value.toString()}
          </Cell>
        );
      })}
    </tr>
  );
};

const TruthTable: React.FC = () => {
  const [formulas, setFormulas] = useState<string[]>([]);
  const [adding, setAdding] = useState<boolean>(false);
  const [locks, setLocks] = useState<Map<string, boolean>>(new Map());
  const variables = useMemo<string[]>(
    () => listAllVariables(formulas),
    [formulas]
  );

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
    return <EmptyState onAddFormula={addFormula} />;
  }

  const rows: React.ReactNode[] = [];
  const combinationGenerator = generateCombinations(variables);
  let index = 0;
  for (let mapping of combinationGenerator) {
    rows.push(
      <Row
        key={index}
        formulas={formulas}
        mapping={mapping}
        locks={locks}
        onLock={(name, value) => {
          locks.set(name, value);
          setLocks(new Map(locks));
        }}
        onUnlock={(name) => {
          locks.delete(name);
          setLocks(new Map(locks));
        }}
      />
    );
    index += 1;
  }

  return (
    <>
      <table className="table-auto overflow-auto">
        <thead className="border-b-2">
          <tr>
            {variables.map((variable, i) => (
              <th
                key={`variable-${variable}`}
                className={
                  i % 2 === 1 ? "bg-neutral-100 dark:bg-slate-800" : ""
                }
              >
                {variable}
              </th>
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
            <th>
              {adding ? (
                <FormulaInput
                  className="w-[120px] px-1"
                  onAddFormula={(value: string) => {
                    addFormula(value);
                    setAdding(false);
                  }}
                  onBlur={() => setAdding(false)}
                />
              ) : (
                <button
                  className=""
                  title="Add a formula"
                  onClick={() => setAdding(true)}
                >
                  +
                </button>
              )}
            </th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      <ExportManager formulas={formulas} />
    </>
  );
};

export default TruthTable;
