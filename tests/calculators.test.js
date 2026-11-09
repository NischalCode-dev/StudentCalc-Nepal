const test = require("node:test");
const assert = require("node:assert/strict");
const { calculate } = require("../assets/js/calculators.js");

test("generic GPA tools use credit-weighted grade points", () => {
  for (const kind of ["university-gpa", "cgpa"]) {
    const result = calculate(kind, { subjects: [{ name: "Science", credit: 3, point: 4 }, { name: "English", credit: 1, point: 2 }] });
    assert.equal(result.summary, "3.5 GPA");
    assert.equal(result.rows.length, 2);
  }
});

test("SEE GPA follows the supplied subjects, grade points, and 75/25 split", () => {
  const result = calculate("see-gpa", {
    studentName: "Mina Thapa",
    compulsory: ["English", "Nepali", "Mathematics", "Science", "Social Studies", "Health Population and Environment"].map(name => ({ name, theoryGrade: "A", practicalGrade: "B" })),
    optionals: [
      { name: "Optional Mathematics", theoryGrade: "A+", practicalGrade: "A" },
      { name: "Computer", theoryGrade: "B+", practicalGrade: "B" },
    ],
  });
  assert.equal(result.summary, "3.42 GPA");
  assert.equal(result.studentName, "Mina Thapa");
  assert.equal(result.rows.length, 8);
  assert.equal(result.rows[0].point, 3.4);
  assert.equal(result.rows[6].point, 3.9);
  assert.match(result.formula, /theory grade point x 75/);

  const healthPopulation = calculate("see-gpa", {
    compulsory: ["English", "Nepali", "Mathematics", "Science", "Social Studies", "Health Population and Environment"].map((name, index) => ({ name, theoryGrade: index === 5 ? "B+" : "A", practicalGrade: index === 5 ? "A" : "A" })),
    optionals: [
      { name: "Optional Mathematics", theoryGrade: "A", practicalGrade: "A" },
      { name: "Account", theoryGrade: "A", practicalGrade: "A" },
    ],
  });
  assert.equal(healthPopulation.rows[5].point, 3.3);

  const notGraded = calculate("see-gpa", {
    compulsory: ["English", "Nepali", "Mathematics", "Science", "Social Studies", "Health Population and Environment"].map((name, index) => ({ name, theoryGrade: index === 0 ? "NG" : "A", practicalGrade: "A" })),
    optionals: [
      { name: "Economics", theoryGrade: "A", practicalGrade: "A" },
      { name: "Account", theoryGrade: "A", practicalGrade: "A" },
    ],
  });
  assert.equal(notGraded.summary, "GPA unavailable");
  assert.equal(notGraded.rows[0].point, "N/A");
});

test("NEB GPA uses stream subjects, letter-grade points, and weighted components", () => {
  const science = calculate("neb-gpa", {
    studentName: "Asha Karki",
    stream: "science",
    choice: "Mathematics",
    choiceGrades: { theoryGrade: "A", practicalGrade: "A" },
    compulsory: [
      { name: "English", theoryGrade: "A", practicalGrade: "B" },
      { name: "Nepali", theoryGrade: "B+", practicalGrade: "A" },
    ],
    optionals: [
      { name: "Physics", theoryGrade: "A+", practicalGrade: "A" },
      { name: "Chemistry", theoryGrade: "B", practicalGrade: "B+" },
      { name: "Computer Science", theoryGrade: "A", practicalGrade: "A+" },
    ],
  });
  assert.equal(science.rows.length, 6);
  assert.equal(science.studentName, "Asha Karki");
  assert.equal(science.rows[0].theoryGrade, "A");
  assert.equal(science.rows[0].practicalGrade, "B");
  assert.equal(science.rows.find(row => row.name === "English").credit, 3);
  assert.equal(science.rows.find(row => row.name === "Computer Science").point, 3.8);
  assert.match(science.details, /science stream/);
  assert.match(science.formula, /theory grade point/);

  const management = calculate("neb-gpa", {
    stream: "management",
    choice: "Business Mathematics",
    choiceGrades: { theoryGrade: "B", practicalGrade: "B" },
    compulsory: [
      { name: "English", theoryGrade: "A", practicalGrade: "A" },
      { name: "Nepali", theoryGrade: "A", practicalGrade: "A" },
    ],
    optionals: [
      { name: "Accountancy", theoryGrade: "A", practicalGrade: "A" },
      { name: "Economics", theoryGrade: "A", practicalGrade: "A" },
      { name: "Business Studies", theoryGrade: "A", practicalGrade: "A" },
    ],
  });
  assert.equal(management.rows.length, 6);
  assert.match(management.details, /management stream/);
  assert.throws(() => calculate("neb-gpa", {
    stream: "science", choice: "Mathematics",
    choiceGrades: { theoryGrade: "A", practicalGrade: "A" },
    compulsory: [
      { name: "English", theoryGrade: "A", practicalGrade: "A" },
      { name: "Nepali", theoryGrade: "A", practicalGrade: "A" },
    ],
    optionals: [
      { name: "Physics", theoryGrade: "A", practicalGrade: "A" },
      { name: "Chemistry", theoryGrade: "A", practicalGrade: "A" },
      { name: "Mathematics", theoryGrade: "A", practicalGrade: "A" },
    ],
  }), /both the subject choice and an optional/);
});

test("attendance percentage, bunk limit, and recovery count use integer classes", () => {
  assert.equal(calculate("attendance", { total: 20, attended: 15 }).summary, "75% attendance");
  assert.equal(calculate("bunk", { total: 20, attended: 18, target: 80 }).summary, "2 more classes may be missed");
  assert.equal(calculate("bunk", { total: 20, attended: 20, target: 80 }).summary, "5 more classes may be missed");
  assert.equal(calculate("attendance-recovery", { total: 10, attended: 5, target: 75 }).summary, "10 consecutive classes to attend");
  assert.equal(calculate("attendance-recovery", { total: 10, attended: 10, target: 100 }).summary, "0 consecutive classes to attend");
});

test("marks tools calculate percentages, final targets, averages, and configured grades", () => {
  assert.equal(calculate("percentage", { obtained: 45, total: 60 }).summary, "75%");
  assert.equal(calculate("final-marks", { internal: 80, weight: 60, required: 70 }).summary, "63.33% on the final exam");
  assert.equal(calculate("average", { marks: [80, 90, 70] }).summary, "80 average marks");
  assert.equal(calculate("grade", { marks: 72, total: 100, scale: [{ label: "A", min: 80 }, { label: "B", min: 60 }, { label: "C", min: 40 }] }).summary, "Grade B");
});

test("date and study tools return finite useful results", () => {
  assert.equal(calculate("age", { birth: "2000-02-29", asOf: "2024-02-29" }).summary, "24 years, 0 months, 0 days");
  assert.equal(calculate("date-difference", { start: "2024-02-28", end: "2024-03-01" }).summary, "2 days");
  assert.equal(calculate("countdown", { exam: "2026-11-10", asOf: "2026-10-31" }).summary, "10 days remaining");
  assert.equal(calculate("assignment-deadline", { due: "2026-10-30", asOf: "2026-10-31" }).summary, "Overdue by 1 day");
  assert.equal(calculate("study-time", { minutes: 125, subjects: 3 }).summary, "41 minutes per subject");
});

test("invalid values fail clearly instead of producing non-finite results", () => {
  assert.throws(() => calculate("percentage", { obtained: 61, total: 60 }), /cannot exceed/);
  assert.throws(() => calculate("attendance", { total: 0, attended: 0 }), /at least 1/);
  assert.throws(() => calculate("cgpa", { subjects: [{ credit: 0, point: 3 }] }), /credit must be at least/);
  assert.throws(() => calculate("age", { birth: "2027-01-01", asOf: "2026-01-01" }), /cannot be after/);
  assert.throws(() => calculate("date-difference", { start: "2024-02-31", end: "2024-03-01" }), /valid date/);
  const impossibleRecovery = calculate("attendance-recovery", { total: 10, attended: 9, target: 100 });
  assert.doesNotMatch(impossibleRecovery.summary, /Infinity|NaN|undefined/);
});