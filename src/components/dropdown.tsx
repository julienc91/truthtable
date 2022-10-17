import React, { ReactNode } from "react";
import { Menu, Transition } from "@headlessui/react";
import { FaCaretDown } from "react-icons/all";

const Dropdown: React.FC<{
  children: ReactNode;
  options: string[];
  onSelect: (value: string) => void;
}> = ({ children, options, onSelect }) => {
  return (
    <Menu>
      <Menu.Button className="flex items-center rounded border px-3 mt-10">
        {children}
        <FaCaretDown className="ml-2" />
      </Menu.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items className="flex flex-col border w-full px-2">
          {options.map((option) => (
            <Menu.Item>
              {({ active }) => (
                <a
                  className={`cursor-pointer ${active && "bg-blue-500"}`}
                  onClick={() => onSelect(option)}
                >
                  {option}
                </a>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
