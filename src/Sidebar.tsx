import { observer } from "mobx-react-lite";
import { ComponentProps, MouseEventHandler, useRef, useState } from "react";
import { PencilIcon, PlusIcon } from "@heroicons/react/solid";
import { TrashIcon } from "@heroicons/react/outline";
import { Link, useParams } from "react-router-dom";

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

    <ul className="pl-2 text-xl flex flex-col gap-1">
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
      <Link
        to={`/${i}/0`}
        tabIndex={-1}
        onClick={e => {
          if (icons.current?.contains(e.relatedTarget as Node)) {
            e.stopPropagation();
            e.preventDefault();
            return false;
          }
        }}
      >
        <Button
          active={active}
          className={`pr-0 ${active ? "bg-opacity-40 hover:bg-opacity-60" : "hover:bg-opacity-20"}`}
          onClick={() => marks.setYear(i)}
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
            <Pencil
              onClick={e => {
                setEditingName(true);
                e.stopPropagation();
              }}
            />
            <Trash
              onClick={e => {
                marks.deleteYear(i);
                e.stopPropagation();
              }}
            />
          </div>
        </Button>
      </Link>

      {active ? <Semesters semesters={year.semesters} marks={marks} /> : null}
    </div>
  );
});

const Button = ({
  children,
  className,
  active,
  onClick,
  ...props
}: ComponentProps<"button"> & {
  children: any;
  className?: string;
  active?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) => (
  <button
    className={`group relative w-full flex items-center text-left rounded focus-visible:outline-none focus-visible:!bg-opacity-70 focus-visible:text-white focus-visible:ring ring-sky-300 px-3 py-1 cursor-pointer transition ${
      active
        ? "text-white shadow hover:shadow-md hover:text-white"
        : "text-gray-100 bg-opacity-0 hover:shadow-sm hover:text-gray-100"
    } ${className}`}
    onClick={e => {
      e.currentTarget.blur();
      onClick?.(e);
    }}
    {...props}
  >
    <div className="absolute inset-0 z-[-1] rounded bg-gradient-to-r from-blue-700 to-indigo-700 transition-opacity opacity-[var(--tw-bg-opacity)]"></div>
    {children}
  </button>
);

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
    <PencilIcon className="w-5 h-5 p-1 px-2 box-content text-white" />
  </Icon>
);

const Trash = (props: ComponentProps<"button">) => (
  <Icon label="Delete" {...props}>
    <TrashIcon className="w-5 h-5 p-1 px-2 box-content text-red-400" />
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
    <ul className="pl-4 py-1 text-base flex flex-col gap-1">
      {semesters.map((sem, i) => (
        <SemesterButton marks={marks} sem={sem} i={i} key={i} />
      ))}

      <Plus onClick={() => marks.addSemester(`Semester ${marks.semesters.length + 1}`)} />
    </ul>
  );
});

const SemesterButton = observer(({ marks, sem, i }: { marks: Marks; sem: Semester; i: number }) => {
  const [editingName, setEditingName] = useState(false);
  const { year, semester: activeSemester } = useParams<{ year: string; semester: string }>();
  const active = i === Number.parseInt(activeSemester);

  return (
    <Link to={`/${year}/${i}`} tabIndex={-1}>
      <Button
        key={i}
        active={active}
        className={`pr-0 ${
          active ? "bg-opacity-30 hover:bg-opacity-50" : "hover:bg-opacity-[0.15]"
        }`}
        onClick={() => marks.setSemester(i)}
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

        <div className="flex ml-auto">
          <Pencil
            onClick={() => {
              setEditingName(true);
            }}
          />
          <Trash
            onClick={() => {
              marks.deleteSemester(i);
            }}
          />
        </div>
      </Button>
    </Link>
  );
});

const Plus = (props: Omit<ComponentProps<typeof Button>, "children">) => (
  <Button
    className="mt-0.5 transition bg-opacity-[0.075] hover:!bg-opacity-25 hover:!text-white"
    {...props}
  >
    <PlusIcon className="w-5 h-5 mx-auto" />
  </Button>
);

export default Sidebar;