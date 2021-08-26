import { makeAutoObservable } from "mobx";
import { create, persist } from "mobx-persist";

export type Assessment = {
  name: string;
  total: number;
  mark: number;
  weighting: number;
};

export type Course = {
  name: string;
  assessments: Assessment[];
  id: number;
};

export type Semester = { name: string; courses: Course[] };

export type Year = { year: string; semesters: Semester[] };

export type Years = Year[];

export class Marks {
  @persist("list") years: Years = [];
  activeYear = 0;
  activeSemester = 0;

  constructor() {
    makeAutoObservable(this);
  }

  get year(): Year | undefined {
    return this.years.length > this.activeYear ? this.years[this.activeYear] : undefined;
  }

  get semesters(): Semester[] {
    return this.year?.semesters ?? [];
  }

  set semesters(semesters: Semester[]) {
    if (this.year === undefined) return;
    this.year.semesters = semesters;
  }

  get semester(): Semester | undefined {
    return this.semesters.length > this.activeSemester
      ? this.semesters[this.activeSemester]
      : undefined;
  }

  get courses(): Course[] {
    return this.semester?.courses ?? [];
  }

  set courses(courses: Course[]) {
    if (this.semester === undefined) return;
    this.semester.courses = courses;
  }

  assessments(year: number, sem: number, course: number): Assessment[] {
    return this.years[year].semesters[sem].courses[course].assessments;
  }

  setYear(year: number) {
    if (this.activeYear === year) return;

    this.activeYear = year;
    this.activeSemester = 0;
  }

  addYear(year: string) {
    this.years = this.years.concat({ year, semesters: [] });
    this.addSemester("Semester 1", this.years.length - 1);
  }

  setYearName(year: number, name: string) {
    this.years[year].year = name;
  }

  deleteYear(year: number) {
    const newYears = [...this.years];
    newYears.splice(year, 1);
    this.years = newYears;
  }

  setSemester(semester: number) {
    this.activeSemester = semester;
  }

  addSemester(semester: string, year?: number) {
    if (year !== undefined) {
      this.years[year].semesters = this.years[year].semesters.concat({
        name: semester,
        courses: [],
      });
    } else {
      this.semesters = this.semesters.concat({ name: semester, courses: [] });
    }
  }

  setSemesterName(semester: number, name: string) {
    this.semesters[semester].name = name;
  }

  deleteSemester(semester: number) {
    const newSemesters = [...this.semesters];
    newSemesters.splice(semester, 1);
    this.semesters = newSemesters;
  }

  addCourse(course: string) {
    const lastId = this.courses[this.courses.length - 1]?.id ?? -1;
    this.courses = this.courses.concat({ name: course, assessments: [], id: lastId + 1 });
    this.addAssessment(this.courses.length - 1);
  }

  setCourseName(course: number, name: string) {
    this.courses[course].name = name;
  }

  deleteCourse(course: number) {
    const newCourses = [...this.courses];
    newCourses.splice(course, 1);
    this.courses = newCourses;
  }

  addAssessment(course: number) {
    const newAssessments = this.courses[course].assessments.slice();
    newAssessments.push({
      name: `Assignment ${newAssessments.length + 1}`,
      total: 100,
      mark: 0,
      weighting: 10,
    });
    this.courses[course].assessments = newAssessments;
  }

  changeAssessment(course: number, assessmentIdx: number, newValues: Partial<Assessment>) {
    const newAssessments = this.courses[course].assessments.slice();
    Object.assign(newAssessments[assessmentIdx], newValues);
    this.courses[course].assessments = newAssessments;
  }

  deleteAssessment(course: number, assessmentIdx: number) {
    const newAssessments = this.courses[course].assessments.slice();
    newAssessments.splice(assessmentIdx, 1);
    this.courses[course].assessments = newAssessments;
  }
}

const hydrate = create({});

export const marks = new Marks();

hydrate("years", marks);
