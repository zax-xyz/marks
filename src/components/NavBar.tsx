import { ChevronRightIcon } from "@heroicons/react/solid";
import { Dispatch, SetStateAction } from "react";
import { Marks } from "../store";

type NavBarProps = {
  marks: Marks;
  sidebarActive: boolean;
  setSidebarActive: Dispatch<SetStateAction<boolean>>;
};

export const NavBar = ({ marks, sidebarActive, setSidebarActive }: NavBarProps) => (
  <div className="fixed top-0 left-0 right-0 z-10 flex items-center h-12 shadow-md text-blue-50 bg-gradient-to-br from-blue-400 to-indigo-400 lg:hidden">
    <button
      className="h-full p-2 text-blue-100 transition-colors hover:text-white"
      onClick={() => setSidebarActive(!sidebarActive)}
    >
      {/* TODO: animate chevron */}
      <ChevronRightIcon className="h-full" />
    </button>
    <p className="font-semibold">
      {marks.year?.year}, {marks.semester?.name}
    </p>
  </div>
);
