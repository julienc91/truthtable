import React, {
  InputHTMLAttributes,
  useCallback,
  useMemo,
  useState,
} from "react";
import { isValid } from "../utils/parsing";

const FormulaInput: React.FC<
  InputHTMLAttributes<HTMLInputElement> & {
    onAddFormula: (value: string) => void;
  }
> = ({ className, onAddFormula, ...props }) => {
  const [value, setValue] = useState<string>("");
  const isFormulaValid = useMemo<boolean>(() => {
    return value.length > 0 && isValid(value);
  }, [value]);

  const handleKeyDown = useCallback(
    (key: string) => {
      if (isFormulaValid && key === "Enter") {
        onAddFormula(value);
        setValue("");
      }
    },
    [value]
  );

  return (
    <input
      autoFocus
      className={
        (className ?? "") +
        (value.length > 0 && !isFormulaValid ? " border-red-500" : "")
      }
      placeholder="!A | (B & C)"
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => handleKeyDown(e.key)}
      {...props}
    />
  );
};

export default FormulaInput;
