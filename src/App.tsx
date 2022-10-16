import React from "react";
import TruthTable from "./components/truthTable";
import LightModeSwitch from "./components/lightModeSwitch";

const App: React.FC = () => {
  return (
    <div className="flex flex-col items-center min-h-screen mx-auto bg-white dark:bg-stone-900 text-black dark:text-blue-50">
      <h1 className="text-3xl md:text-5xl font-bold mt-1 mb-10">
        Truth Table Online
      </h1>
      <TruthTable />
      <LightModeSwitch />
    </div>
  );
};

export default App;
