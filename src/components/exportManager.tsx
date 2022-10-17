import React, { useEffect, useMemo, useState } from "react";
import { exportToCSV, exportToMarkdown, exportToTSV } from "../utils/export";
import Dropdown from "./dropdown";
import { FaCheck } from "react-icons/all";

type ExportMode = "CSV" | "TSV" | "Markdown";

const getGenerator = (mode: ExportMode) => {
  switch (mode) {
    case "CSV":
      return exportToCSV;
    case "TSV":
      return exportToTSV;
    case "Markdown":
      return exportToMarkdown;
  }
};

const ExportManager: React.FC<{ formulas: string[] }> = ({ formulas }) => {
  const [mode, setMode] = useState<ExportMode | undefined>(undefined);
  const [copied, setCopied] = useState<boolean>(false);

  const data = useMemo<string>(() => {
    if (!mode) {
      return "";
    }
    let rows = "";
    const generator = getGenerator(mode)(formulas);
    for (let row of generator) {
      rows += row + "\n";
    }
    return rows;
  }, [formulas, mode]);

  useEffect(() => {
    if (data.length) {
      navigator.clipboard.writeText(data);
      setMode(undefined);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }, [data]);

  return (
    <div className="flex flex-col items-center justify-start">
      <Dropdown
        options={["CSV", "TSV", "Markdown"]}
        onSelect={(value) => setMode(value as ExportMode)}
      >
        Export
      </Dropdown>
      {copied && (
        <span className="flex items-center mt-20 absolute">
          <FaCheck className="text-green-300 mr-2" /> Copied to clipboard
        </span>
      )}
    </div>
  );
};

export default ExportManager;
