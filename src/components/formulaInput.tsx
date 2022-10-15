import React, { useCallback, useMemo, useState } from "react";
import { isValid } from "../utils/parsing";

const FormulaInput: React.FC<{
  className?: string;
  onSubmit: (value: string) => void;
}> = ({ className, onSubmit }) => {
  const [value, setValue] = useState<string>("");
  const isFormulaValid = useMemo<boolean>(() => {
    return value.length > 0 && isValid(value);
  }, [value]);

  const handleKeyDown = useCallback(
    (key: string) => {
      if (isFormulaValid && key === "Enter") {
        onSubmit(value);
        setValue("");
      }
    },
    [value]
  );

  return (
    <input
      className={
        (className ?? "") +
        (value.length > 0 && !isFormulaValid ? " border-red-500" : "")
      }
      placeholder="!A | (B & C)"
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={(e) => handleKeyDown(e.key)}
    />
  );
};

export default FormulaInput;
