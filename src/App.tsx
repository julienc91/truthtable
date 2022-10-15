import React from "react";
import TruthTable from "./components/truthTable";

const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center min-h-screen mx-auto">
      <h1 className="text-3xl md:text-5xl font-bold mt-1 mb-10">
        Truth Table Online
      </h1>
      <TruthTable />
    </div>
  );
};

export default App;
