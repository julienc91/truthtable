import React from "react";
import FormulaInput from "./formulaInput";

const Monospace: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <span className="font-mono text-xl text-red-500 border-2 border-red-500 rounded-md px-2 bg-red-50">
      {children}
    </span>
  );
};

const EmptyState: React.FC<{ onAddFormula: (value: string) => void }> = ({
  onAddFormula,
}) => {
  return (
    <div className="h-full w-full flex flex-col flex-1 items-center justify-between">
      <div className="border-4 border-blue-500 rounded-3xl px-10 text-center flex flex-col grow-[0.7] my-12 basis-1/3 justify-center items-center w-10/12 md:w-2/3 ">
        <label>
          <h3 className="font-bold text-3xl">Enter a formula</h3>
          <br />
          <FormulaInput
            className="border-2 px-2 py-2 w-full text-2xl"
            onAddFormula={onAddFormula}
          />
        </label>
      </div>
      <div className="my-10 text-2xl">
        <h3 className="text-3xl mb-3">Syntax</h3>
        <ul className="list-disc ml-5">
          <li>
            Or operator: <Monospace>|</Monospace>
          </li>
          <li>
            And operator: <Monospace>&</Monospace>
          </li>
          <li>
            Booleans: <Monospace>true</Monospace> and{" "}
            <Monospace>false</Monospace>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EmptyState;
