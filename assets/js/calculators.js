(function (root) {
  "use strict";

  const finite = (value, label, options = {}) => {
    const number = Number(value);
    if (value === "" || value === null || !Number.isFinite(number)) {
      throw new Error(`${label} must be a valid number.`);
    }
    if (options.min !== undefined && number < options.min) throw new Error(`${label} must be at least ${options.min}.`);
    if (options.max !== undefined && number > options.max) throw new Error(`${label} must be no more than ${options.max}.`);
    return number;
  };

  const wholeNumber = (value, label, options = {}) => {
    const number = finite(value, label, options);
    if (!Number.isInteger(number)) throw new Error(`${label} must be a whole number.`);
    return number;
  };

  const dateValue = (value, label) => {
    if (!value) throw new Error(`${label} is required.`);
    const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!parts) throw new Error(`${label} must be a valid date.`);
    const date = new Date(0);
    date.setFullYear(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
    date.setHours(0, 0, 0, 0);
    if (date.getFullYear() !== Number(parts[1]) || date.getMonth() !== Number(parts[2]) - 1 || date.getDate() !== Number(parts[3])) throw new Error(`${label} must be a valid date.`);
    return date;
  };

  const round = (value, places = 2) => Number(value.toFixed(places));

  const nebStreams = {
    science: {
      compulsory: ["English", "Nepali"],
      choices: ["Mathematics", "Biology"],
      optional: ["Physics", "Chemistry", "Biology", "Computer Science", "Mathematics", "Statistics", "Environmental Science"],
    },
    management: {
      compulsory: ["English", "Nepali"],
      choices: ["Business Mathematics", "Social Studies and Life Skills Education"],
      optional: ["Accountancy", "Economics", "Business Studies", "Computer Science", "Hotel Management", "Marketing", "Business Mathematics", "Mathematics", "Finance"],
    },
  };

  const nebGradePoints = { "A+": 4, A: 3.6, "B+": 3.2, B: 2.8, "C+": 2.4, C: 2, D: 1.6, NG: 0 };

  const calculateNeb = input => {
    const stream = nebStreams[input.stream];
    if (!stream) throw new Error("Choose Science or Management stream.");
    const compulsory = input.compulsory || [];
    const optionals = input.optionals || [];
    const choice = input.choice;
    if (!stream.choices.includes(choice)) throw new Error(`Choose a valid ${input.stream} subject choice.`);
    if (compulsory.length !== 2 || stream.compulsory.some(name => !compulsory.some(subject => subject.name === name))) {
      throw new Error("Enter grades for English and Nepali.");
    }
    if (optionals.length !== 3) throw new Error("Choose and grade exactly three optional subjects.");
    const optionalNames = optionals.map(subject => subject.name);
    if (new Set(optionalNames).size !== optionalNames.length) throw new Error("Choose three different optional subjects.");
    if (optionalNames.some(name => !stream.optional.includes(name))) throw new Error(`Choose optional subjects from the ${input.stream} stream list.`);
    if (optionalNames.includes(choice)) throw new Error("A subject cannot be both the subject choice and an optional subject.");

    const subjects = [...compulsory, { ...input.choiceGrades, name: choice }, ...optionals];
    let weightedPoints = 0;
    let totalCredits = 0;
    const rows = subjects.map(subject => {
      const label = subject.name;
      const theoryGrade = subject.theoryGrade;
      const practicalGrade = subject.practicalGrade;
      if (!Object.hasOwn(nebGradePoints, theoryGrade) || !Object.hasOwn(nebGradePoints, practicalGrade)) {
        throw new Error(`${label} needs valid theory and practical/internal grades.`);
      }
      const theoryMax = label === "Computer Science" || label === "Hotel Management" ? 50 : 75;
      const practicalMax = 100 - theoryMax;
      const point = (nebGradePoints[theoryGrade] * theoryMax + nebGradePoints[practicalGrade] * practicalMax) / 100;
      const credit = label === "English" || label === "Nepali" || label === "Social Studies and Life Skills Education" ? 3 : 5;
      const weighted = credit * point;
      totalCredits += credit;
      weightedPoints += weighted;
      return { name: label, grade: `${theoryGrade} / ${practicalGrade}`, theoryGrade, practicalGrade, credit, point: round(point, 3), weighted: round(weighted, 3) };
    });
    return {
      summary: `${round(weightedPoints / totalCredits, 2)} GPA`,
      details: `${round(weightedPoints, 3)} weighted grade points / ${totalCredits} total credits (${input.stream} stream)`,
      studentName: String(input.studentName || "").trim() || "Student",
      stream: input.stream,
      rows,
      formula: "Subject grade point = (theory grade point x theory marks + practical/internal grade point x practical/internal marks) / 100. GPA = sum(subject grade point x subject credits) / total credits. NEB letter-grade points are used.",
    };
  };

  const seeGradePoints = { "A+": 4, A: 3.6, "B+": 3.2, B: 2.8, "C+": 2.4, C: 2, D: 1.6, NG: null };
  const seeOptionalSubjects = {
    optional1: ["Optional Mathematics", "Economics", "Population"],
    optional2: ["Account", "Computer"],
  };

  const normalizeSeeSubjectName = name => String(name).replace(/,/g, "").replace(/\s+/g, " ").trim().toLowerCase();

  const calculateSee = input => {
    const compulsoryNames = ["English", "Nepali", "Mathematics", "Science", "Social Studies", "Health Population and Environment"];
    const compulsory = input.compulsory || [];
    const optionals = input.optionals || [];
    if (compulsory.length !== compulsoryNames.length || compulsoryNames.some(name => !compulsory.some(subject => normalizeSeeSubjectName(subject.name) === normalizeSeeSubjectName(name)))) {
      throw new Error("Enter grades for all six compulsory SEE subjects.");
    }
    if (optionals.length !== 2) throw new Error("Choose and grade both optional subjects.");
    const normalizedOptional1 = seeOptionalSubjects.optional1.map(normalizeSeeSubjectName);
    const normalizedOptional2 = seeOptionalSubjects.optional2.map(normalizeSeeSubjectName);
    if (!normalizedOptional1.includes(normalizeSeeSubjectName(optionals[0].name)) || !normalizedOptional2.includes(normalizeSeeSubjectName(optionals[1].name))) {
      throw new Error("Choose optional subjects from the provided SEE subject lists.");
    }
    const subjects = [...compulsory, ...optionals];
    const rows = subjects.map(subject => {
      const { theoryGrade, practicalGrade } = subject;
      if (!Object.hasOwn(seeGradePoints, theoryGrade) || !Object.hasOwn(seeGradePoints, practicalGrade)) {
        throw new Error(`${subject.name} needs valid theory and practical grades.`);
      }
      const point = theoryGrade === "NG" || practicalGrade === "NG"
        ? null
        : (seeGradePoints[theoryGrade] * 75 + seeGradePoints[practicalGrade] * 25) / 100;
      return { name: subject.name, theoryGrade, practicalGrade, point: point === null ? "N/A" : round(point, 3) };
    });
    const hasNotGraded = rows.some(row => row.point === "N/A");
    const totalSubjects = rows.length;
    const gpa = hasNotGraded ? null : rows.reduce((sum, row) => sum + row.point, 0) / totalSubjects;
    return {
      summary: gpa === null ? "GPA unavailable" : `${round(gpa, 2)} GPA`,
      details: hasNotGraded ? "At least one component is NG, which has no grade point in the supplied SEE scale." : `Average of ${totalSubjects} equally weighted subjects using the supplied SEE grade-point scale.`,
      studentName: String(input.studentName || "").trim() || "Student",
      rows,
      formula: "Subject grade point = (theory grade point x 75 + practical grade point x 25) / 100. GPA = sum of all subject grade points / number of subjects. NG has no grade point and makes the GPA unavailable.",
    };
  };

  const calculate = (kind, input) => {
    switch (kind) {
      case "neb-gpa":
        return calculateNeb(input);
      case "see-gpa":
        return calculateSee(input);
      case "university-gpa":
      case "cgpa": {
        const subjects = input.subjects || [];
        if (!subjects.length) throw new Error("Add at least one subject or semester.");
        let weightedPoints = 0;
        let credits = 0;
        let hasComponents = false;
        const rows = subjects.map((subject, index) => {
          const label = subject.name || `Subject ${index + 1}`;
          const credit = finite(subject.credit, `${label} credit`, { min: 0.000001 });
          let point;
          const hasTheory = subject.theoryPoint !== undefined && subject.theoryPoint !== "";
          const hasPractical = subject.practicalPoint !== undefined && subject.practicalPoint !== "";
          if (hasTheory || hasPractical) {
            if (!hasTheory || !hasPractical) throw new Error(`${label} needs both theory and practical grade points, or neither.`);
            hasComponents = true;
            const theoryPoint = finite(subject.theoryPoint, `${label} theory grade point`, { min: 0, max: 10 });
            const practicalPoint = finite(subject.practicalPoint, `${label} practical grade point`, { min: 0, max: 10 });
            point = (theoryPoint + practicalPoint) / 2;
          } else {
            point = finite(subject.point, `${label} grade point`, { min: 0, max: 10 });
          }
          const weighted = credit * point;
          credits += credit;
          weightedPoints += weighted;
          return { name: label, grade: subject.grade || "", credit, point: round(point, 3), weighted: round(weighted, 3) };
        });
        return {
          summary: `${round(weightedPoints / credits, 2)} GPA`,
          details: `${round(weightedPoints, 3)} weighted grade points / ${round(credits, 3)} total credits`,
          rows,
          formula: `GPA = sum(grade point x credit hours) / sum(credit hours).${hasComponents ? " Theory and practical points are averaged equally for rows with both values entered." : ""}`,
        };
      }
      case "attendance": {
        const total = wholeNumber(input.total, "Total classes", { min: 1 });
        const attended = wholeNumber(input.attended, "Classes attended", { min: 0, max: total });
        return { summary: `${round(attended / total * 100)}% attendance`, details: `${attended} attended, ${total - attended} missed, ${total} conducted`, formula: "Attendance percentage = (classes attended / classes conducted) x 100." };
      }
      case "bunk": {
        const total = wholeNumber(input.total, "Total classes", { min: 1 });
        const attended = wholeNumber(input.attended, "Classes attended", { min: 0, max: total });
        const target = finite(input.target, "Target attendance", { min: 0.01, max: 100 });
        const safe = Math.max(0, Math.floor(attended / (target / 100) - total + 1e-10));
        return { summary: safe ? `${safe} more class${safe === 1 ? "" : "es"} may be missed` : "No more classes can be missed", details: `Current attendance: ${round(attended / total * 100)}%. Target: ${round(target)}%.`, formula: "Largest whole number x satisfying attended / (conducted + x) >= target percentage." };
      }
      case "attendance-recovery": {
        const total = wholeNumber(input.total, "Total classes", { min: 1 });
        const attended = wholeNumber(input.attended, "Classes attended", { min: 0, max: total });
        const target = finite(input.target, "Target attendance", { min: 0.01, max: 100 });
        if (target === 100) {
          if (attended < total) return { summary: "100% cannot be reached after past absences", details: "Attending every future class can improve attendance, but the missed classes remain in the total.", formula: "Recovery target = (attended + future classes attended) / (conducted + future classes attended)." };
          return { summary: "0 consecutive classes to attend", details: "Attendance is already 100%; continue attending to maintain it.", formula: "Current attendance = classes attended / classes conducted x 100." };
        }
        const required = Math.max(0, Math.ceil((target / 100 * total - attended) / (1 - target / 100)));
        return { summary: `${required} consecutive class${required === 1 ? "" : "es"} to attend`, details: `After attending ${required}, attendance will be ${round((attended + required) / (total + required) * 100)}%.`, formula: "Smallest whole number x satisfying (attended + x) / (conducted + x) >= target percentage." };
      }
      case "percentage": {
        const obtained = finite(input.obtained, "Obtained marks", { min: 0 });
        const total = finite(input.total, "Total marks", { min: 0.000001 });
        if (obtained > total) throw new Error("Obtained marks cannot exceed total marks.");
        return { summary: `${round(obtained / total * 100)}%`, details: `${obtained} out of ${total} marks`, formula: "Percentage = (obtained marks / total marks) x 100." };
      }
      case "final-marks": {
        const internal = finite(input.internal, "Internal marks", { min: 0, max: 100 });
        const weight = finite(input.weight, "Final exam weightage", { min: 0.01, max: 100 });
        const required = finite(input.required, "Required overall marks", { min: 0, max: 100 });
        const examNeeded = (required - internal * (1 - weight / 100)) / (weight / 100);
        const clamped = Math.max(0, examNeeded);
        return { summary: examNeeded > 100 ? "Target is not reachable" : `${round(clamped)}% on the final exam`, details: `You need ${round(clamped)} out of 100 on the final exam to reach ${round(required)} overall.`, formula: "Overall = internal score x (1 - exam weight) + exam score x exam weight." };
      }
      case "average": {
        const marks = (input.marks || []).map((value, index) => finite(value, `Mark ${index + 1}`, { min: 0 }));
        if (!marks.length) throw new Error("Enter at least one mark.");
        const total = marks.reduce((sum, mark) => sum + mark, 0);
        return { summary: `${round(total / marks.length)} average marks`, details: `${marks.length} subjects, ${round(total)} combined marks`, formula: "Average = sum of marks / number of subjects." };
      }
      case "grade": {
        const marks = finite(input.marks, "Obtained marks", { min: 0 });
        const total = finite(input.total, "Total marks", { min: 0.000001 });
        if (marks > total) throw new Error("Obtained marks cannot exceed total marks.");
        const percent = marks / total * 100;
        const scale = (input.scale || []).map((row, index) => ({ label: String(row.label || "").trim(), min: finite(row.min, `Grade row ${index + 1} minimum`, { min: 0, max: 100 }) })).sort((a, b) => b.min - a.min);
        if (!scale.length || scale.some(row => !row.label)) throw new Error("Add grade labels and minimum percentages to the grading scale.");
        const match = scale.find(row => percent >= row.min);
        return { summary: match ? `Grade ${match.label}` : "Below the configured grade scale", details: `${round(percent)}% (${marks} of ${total})`, formula: "Percentage = obtained marks / total marks x 100; grade uses your configured minimum thresholds." };
      }
      case "age": {
        const birth = dateValue(input.birth, "Birth date");
        const today = input.asOf ? dateValue(input.asOf, "Calculation date") : new Date();
        if (birth > today) throw new Error("Birth date cannot be after the calculation date.");
        let years = today.getFullYear() - birth.getFullYear();
        let months = today.getMonth() - birth.getMonth();
        let days = today.getDate() - birth.getDate();
        if (days < 0) { months -= 1; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
        if (months < 0) { years -= 1; months += 12; }
        return { summary: `${years} years, ${months} months, ${days} days`, details: `Age calculated as of ${today.toLocaleDateString()}.`, formula: "Calendar age is calculated from the birth date to the selected date." };
      }
      case "date-difference": {
        const start = dateValue(input.start, "Start date");
        const end = dateValue(input.end, "End date");
        const days = Math.round((end - start) / 86400000);
        return { summary: `${Math.abs(days)} days`, details: days < 0 ? "The end date is before the start date." : "The start date is not counted as an extra day.", formula: "Date difference = absolute number of calendar days between the two dates." };
      }
      case "countdown":
      case "assignment-deadline": {
        const isDeadline = kind === "assignment-deadline";
        const date = dateValue(isDeadline ? input.due : input.exam, isDeadline ? "Assignment deadline" : "Exam date");
        const today = input.asOf ? dateValue(input.asOf, "Calculation date") : new Date();
        const days = Math.ceil((date - today) / 86400000);
        const dayCount = Math.abs(days);
        const summary = days < 0 ? `${isDeadline ? "Overdue by" : ""} ${dayCount} ${dayCount === 1 ? "day" : "days"}${isDeadline ? "" : " since the exam"}`.trim() : days === 0 ? (isDeadline ? "Due today" : "Exam day is today") : `${days} ${days === 1 ? "day" : "days"} ${isDeadline ? "until deadline" : "remaining"}`;
        return { summary, details: `${isDeadline ? "Deadline" : "Exam date"}: ${date.toLocaleDateString()}.`, formula: "Time remaining = calendar-day difference from today to the selected date." };
      }
      case "study-time": {
        const minutes = finite(input.minutes, "Available study minutes", { min: 1 });
        const subjects = wholeNumber(input.subjects, "Number of subjects", { min: 1 });
        const study = Math.floor(minutes / subjects);
        return { summary: `${study} minutes per subject`, details: `${minutes - study * subjects} unallocated minutes.`, formula: "Study time per subject = floor(available study minutes / number of subjects)." };
      }
      default:
        throw new Error("This calculator is not available.");
    }
  };

  const api = { calculate };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.StudentCalc = api;
})(typeof globalThis !== "undefined" ? globalThis : this);