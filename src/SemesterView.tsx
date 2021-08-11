import { PlusIcon, TrashIcon } from "@heroicons/react/outline";
import { PencilIcon } from "@heroicons/react/solid";
import { observer } from "mobx-react-lite";
import { ComponentProps, forwardRef, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Params } from "./App";

import LineChart from "./LineChart";
import "./SemesterView.css";
import { Assessment, Course, Marks } from "./store";

const SemesterView = observer(({ marks }: { marks: Marks }) => {
  const { courses } = marks;
  const { year, semester } = useParams<Params>();

  return (
    <TransitionGroup appear={true} exit={false} className="space-y-8">
      {marks.courses?.map((course, i) => (
        <CSSTransition
          key={`${year}.${semester}.${course.id}`}
          timeout={150 * i + 750}
          classNames="fade-up"
          onEnter={(node, _) => (node.style.transitionDelay = `${i * 150}ms`)}
          onEntered={(node, _) => node.style.removeProperty("transition-delay")}
        >
          <CourseView course={course} marks={marks} idx={i} />
        </CSSTransition>
      ))}

      <CSSTransition
        key={`${year}.${semester}.plus`}
        timeout={150 * courses.length + 750}
        classNames="fade-up"
        onEnter={(node, _) => (node.style.transitionDelay = `${courses.length * 150}ms`)}
        onEntered={(node, _) => node.style.removeProperty("transition-delay")}
      >
        <NewCourse onClick={() => marks.addCourse("New Course")} />
      </CSSTransition>
    </TransitionGroup>
  );
});

const CourseView = observer((props: { course: Course; marks: Marks; idx: number }) => {
  const [editingName, setEditingName] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const editButton = useRef<HTMLButtonElement>(null);

  return (
    <section className="flex flex-wrap items-center gap-4 xl:flex-nowrap xl:max-w-6xl">
      <div className="flex-1 flex-grow-[1.3]">
        <h1
          className="flex mb-3 text-2xl text-blue-600"
          onBlur={e => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setEditingName(false);
            }
          }}
        >
          {editingName ? (
            <Input
              ref={input}
              className="w-full p-0"
              label="Course Name"
              value={props.course.name}
              onChange={e => {
                props.marks.setCourseName(props.idx, e.currentTarget.value);
              }}
              autoFocus
            />
          ) : (
            props.course.name
          )}

          <button
            ref={editButton}
            className="px-2 ml-auto rounded outline-none group focus-visible:ring ring-blue-500"
            onClick={() => setEditingName(!editingName)}
            aria-label="Edit course name"
            title="Edit course name"
          >
            <PencilIcon className="w-5 h-5 transition-opacity outline-none opacity-30 group-hover:opacity-100 group-focus:opacity-100 ring-blue-500" />
          </button>

          <button
            className="px-2 text-red-500 rounded outline-none group focus-visible:ring ring-blue-500"
            onClick={() => props.marks.deleteCourse(props.idx)}
            aria-label="Delete course"
            title="Delete course"
          >
            <TrashIcon className="w-5 h-5 transition-opacity outline-none opacity-30 group-hover:opacity-100 group-focus:opacity-100 ring-blue-500" />
          </button>
        </h1>

        <Assessments marks={props.marks} assessments={props.course.assessments} idx={props.idx} />
      </div>

      <aside className="flex-1 sm:p-4 md:p-0 xl:ml-8">
        <LineChart
          className="max-w-full min-w-[18rem] sm:min-w-[24rem] md:min-w-[20rem]"
          course={props.course}
        />
      </aside>
    </section>
  );
});

const Assessments = ({
  marks,
  assessments,
  idx,
}: {
  marks: Marks;
  assessments: Assessment[];
  idx: number;
}) => (
  <ul className="space-y-2">
    {assessments.map((assessment, i) => (
      <li key={i} className="flex items-center">
        <Input
          className="w-8 !p-1 font-light text-sm text-center mr-1"
          label="Assessment weighting"
          defaultValue={assessment.weighting}
          onChange={e => {
            const newValue = Number(e.currentTarget.value);
            if (!Number.isNaN(newValue)) marks.changeAssessment(idx, i, { weighting: newValue });
          }}
        />

        <div className="relative flex-1 min-w-[8rem] sm:min-w-[12rem]">
          <Input
            className={`fade-out flex-1 w-full ${
              assessment.name === "Final Exam" ? "text-yellow-600" : ""
            }`}
            label="Assessment name"
            value={assessment.name}
            onChange={e => {
              marks.changeAssessment(idx, i, { name: e.currentTarget.value });
            }}
          />
          <div className="absolute top-0 right-1.5 w-3 h-full bg-gradient-to-r from-transparent to-white"></div>
        </div>

        <Input
          className="ml-2 text-right text-blue-500 w-14 md:w-16"
          label="Assessment mark"
          defaultValue={assessment.mark}
          onChange={e => {
            const newValue = Number(e.currentTarget.value);
            if (!Number.isNaN(newValue)) marks.changeAssessment(idx, i, { mark: newValue });
          }}
        />
        <span className="flex items-center self-end w-10 text-sm font-light">
          /
          <Input
            className="!p-1 w-full"
            label="Asssessment total mark"
            defaultValue={assessment.total}
            onChange={e => {
              const newValue = Number(e.currentTarget.value);
              if (!Number.isNaN(newValue)) marks.changeAssessment(idx, i, { total: newValue });
            }}
          />
        </span>

        <span
          className="w-12 ml-2 text-sm font-light text-center text-indigo-600"
          aria-label="Assessment final percentage"
          title="Assessment final percentage"
        >
          {Math.round((assessment.mark / assessment.total + Number.EPSILON) * 10000) / 100}%
        </span>
      </li>
    ))}

    <FinalMark assessments={assessments} />
    <button
      className="flex justify-center px-5 py-1.5 rounded transition bg-gradient-to-br from-blue-100 to-blue-200 shadow text-indigo-700 outline-none focus-visible:ring ring-blue-500 hover:shadow-md"
      onClick={() => {
        marks.addAssessment(idx);
      }}
      aria-label="Add new assessment"
      title="Add new assessment"
    >
      <PlusIcon className="w-4 h-4" />
    </button>
  </ul>
);

const Input = forwardRef<HTMLInputElement, ComponentProps<"input"> & { label?: string }>(
  ({ label, ...props }, ref) => (
    <input
      ref={ref}
      type="text"
      aria-label={label}
      title={label}
      onKeyDown={e => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        }
      }}
      {...props}
      className={`${
        props.className ?? ""
      } px-1.5 py-1.5 ring-blue-500 rounded-sm transition outline-none hover:shadow focus:ring-2 focus:shadow-md`}
    />
  )
);

const FinalMark = (props: { assessments: Assessment[] }) => {
  const totalMark = props.assessments.reduce((x, y) => x + (y.mark / y.total) * y.weighting, 0);
  const totalTotal = props.assessments.reduce((x, y) => x + y.weighting, 0);

  return (
    <li className="flex items-center">
      <span className="flex-1 font-semibold">Final Mark</span>

      <span className="flex items-center" aria-label="Final mark" title="Final mark">
        <span className="w-16 px-1.5 py-1 ml-4 text-blue-500 font-semibold text-right">
          {Math.round(totalMark * 100) / 100}
        </span>
        <span className="self-end w-10 text-sm">
          /<span className="p-1">{totalTotal}</span>
        </span>
      </span>

      <span
        className="w-12 ml-2 text-sm font-semibold text-center text-indigo-600"
        aria-label="Final mark percentage"
        title="Final mark percentage"
      >
        {Math.round((totalMark / totalTotal + Number.EPSILON) * 10000) / 100}%
      </span>
    </li>
  );
};

const NewCourse = (props: { onClick: () => void }) => (
  <button
    className="group relative flex justify-center w-28 h-8 p-1.5 text-indigo-900 rounded outline-none transition-colors focus-visible:ring ring-blue-500 hover:text-black focus-visible:text-black"
    onClick={props.onClick}
    aria-label="Add new course"
    title="Add new course"
  >
    <div className="underlay text-blue-200 rounded bg-gradient-to-br from-pink-200 to-blue-200 filter blur-sm transition group-hover:blur group-focus-visible:blur group-hover:translate-y-0.5 group-active:blur-none shadow-sm group-hover:shadow-no"></div>
    <div className="transition-opacity rounded opacity-50 underlay bg-gradient-to-br from-pink-200 to-blue-300 group-hover:opacity-100 group-focus-visible:opacity-100"></div>
    <PlusIcon className="h-full" />
  </button>
);

export default SemesterView;
