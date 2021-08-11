import { observer } from "mobx-react-lite";
import { ComponentProps, useRef, useState } from "react";
import { PencilIcon, PlusIcon } from "@heroicons/react/solid";
import { TrashIcon } from "@heroicons/react/outline";
import { NavLink, useParams } from "react-router-dom";

import { Marks, Year } from "./store";
import { Semester } from "./store";
import { Params } from "./App";

const Sidebar = observer(({ marks, className }: { marks: Marks; className?: string }) => (
  <nav
    className={`${
      className ?? ""
    } hidden fixed top-0 left-0 w-80 h-screen px-8 py-8 text-lg font-semibold text-white bg-gradient-to-br from-blue-400 to-indigo-400 shadow-2xl lg:block`}
  >
    <h1 className="pb-3 text-3xl">Years</h1>

    <ul className="flex flex-col gap-1 pl-2 text-xl">
      {marks.years.map((year, i) => (
        <YearButton marks={marks} year={year} i={i} key={i} />
      ))}

      <Plus onClick={() => marks.addYear((marks.years.length + 1).toString())} />
    </ul>
  </nav>
));

const YearButton = observer(({ marks, year, i }: { marks: Marks; year: Year; i: number }) => {
  const [editingName, setEditingName] = useState(false);
  const { year: activeYear } = useParams<Params>();
  const active = i === Number.parseInt(activeYear);

  const icons = useRef<HTMLDivElement>(null);

  return (
    <div key={i}>
      <NavLink
        to={`/${i}/0`}
        onClick={e => {
          if (icons.current?.contains(e.target as Node)) {
            e.preventDefault();
          } else {
            marks.setYear(i);
          }
        }}
        isActive={() => active}
        className="pr-0 group sidebar-btn hover:bg-opacity-20"
        activeClassName="active bg-opacity-40 hover:!bg-opacity-60"
      >
        {editingName ? (
          <Input
            value={year.year}
            onChange={e => marks.setYearName(i, e.currentTarget.value)}
            onBlur={() => setEditingName(false)}
          />
        ) : (
          year.year
        )}

        <div className="flex ml-auto" ref={icons}>
          <Pencil onClick={() => setEditingName(true)} />
          <Trash onClick={() => marks.deleteYear(i)} />
        </div>
      </NavLink>

      {active ? <Semesters semesters={year.semesters} marks={marks} /> : null}
    </div>
  );
});

const Input = (props: ComponentProps<"input">) => (
  <input
    type="text"
    {...props}
    className="w-full bg-transparent rounded-sm outline-none focus:ring ring-sky-300"
    onKeyDown={e => {
      if (e.key === "Enter") {
        e.currentTarget.blur();
      }
    }}
    autoFocus
  />
);

const Pencil = (props: ComponentProps<"button">) => (
  <Icon label="Edit name" {...props}>
    <PencilIcon className="box-content w-5 h-5 p-1 px-2 text-white" />
  </Icon>
);

const Trash = (props: ComponentProps<"button">) => (
  <Icon label="Delete" {...props}>
    <TrashIcon className="box-content w-5 h-5 p-1 px-2 text-red-400" />
  </Icon>
);

const Icon = ({ label, children, ...props }: ComponentProps<"button"> & { label: string }) => (
  <button
    aria-label={label}
    title={label}
    className="flex-shrink-0 transition-opacity opacity-0 group-hover:opacity-50 hover:!opacity-100 focus-visible:!opacity-100 outline-none rounded focus-visible:ring ring-sky-300"
    {...props}
  >
    {children}
  </button>
);

const Semesters = observer(({ semesters, marks }: { semesters: Semester[]; marks: Marks }) => {
  return (
    <ul className="flex flex-col gap-1 py-1 pl-4 text-base">
      {semesters.map((sem, i) => (
        <SemesterButton marks={marks} sem={sem} i={i} key={i} />
      ))}

      <Plus onClick={() => marks.addSemester(`Semester ${marks.semesters.length + 1}`)} />
    </ul>
  );
});

const SemesterButton = observer(({ marks, sem, i }: { marks: Marks; sem: Semester; i: number }) => {
  const [editingName, setEditingName] = useState(false);
  const { year } = useParams<{ year: string; semester: string }>();

  const icons = useRef<HTMLDivElement>(null);

  return (
    <NavLink
      to={`/${year}/${i}`}
      className="group sidebar-btn pr-0 hover:bg-opacity-[0.15]"
      activeClassName="active bg-opacity-30 hover:!bg-opacity-50"
      onClick={e => {
        if (icons.current?.contains(e.target as Node)) {
          e.preventDefault();
        } else {
          marks.setSemester(i);
        }
      }}
    >
      {editingName ? (
        <Input
          value={sem.name}
          onChange={e => marks.setYearName(i, e.currentTarget.value)}
          onBlur={() => setEditingName(false)}
        />
      ) : (
        sem.name
      )}

      <div className="flex ml-auto" ref={icons}>
        <Pencil onClick={() => setEditingName(true)} />
        <Trash onClick={() => marks.deleteSemester(i)} />
      </div>
    </NavLink>
  );
});

const Plus = (props: ComponentProps<"button">) => (
  <button
    className="sidebar-btn mt-0.5 transition bg-opacity-[0.075] hover:!bg-opacity-25 hover:!text-white"
    {...props}
  >
    <PlusIcon className="w-5 h-5 mx-auto" />
  </button>
);

export default Sidebar;
