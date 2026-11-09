(function () {
  "use strict";

  const tools = [
    { id: "neb-gpa", slug: "neb-gpa-calculator", title: "NEB GPA Calculator", category: "GPA & grades", description: "Calculate an NEB GPA estimate with Science or Management subjects and component grades." },
    { id: "see-gpa", slug: "see-gpa-calculator", title: "SEE GPA Calculator", category: "GPA & grades", description: "Calculate SEE GPA from six compulsory subjects, two optional subjects, and 75/25 component grades." },
    { id: "university-gpa", slug: "university-gpa-calculator", title: "University GPA Calculator", category: "GPA & grades", description: "Calculate semester GPA from course grades and credit hours." },
    { id: "cgpa", slug: "cgpa-calculator", title: "CGPA Calculator", category: "GPA & grades", description: "Combine semester GPAs accurately using each semester's credit hours." },
    { id: "attendance", slug: "attendance-calculator", title: "Attendance Calculator", category: "Attendance", description: "Check attendance percentage, attended classes, and absences at a glance." },
    { id: "bunk", slug: "bunk-calculator", title: "Bunk Calculator", category: "Attendance", description: "Find the maximum additional classes you can miss while meeting your target." },
    { id: "attendance-recovery", slug: "attendance-recovery-calculator", title: "Attendance Recovery Calculator", category: "Attendance", description: "Find how many consecutive classes you need to attend to reach a target." },
    { id: "percentage", slug: "percentage-calculator", title: "Percentage Calculator", category: "Exam tools", description: "Convert obtained marks into a percentage with a clear calculation." },
    { id: "final-marks", slug: "final-marks-calculator", title: "Final Marks Calculator", category: "Exam tools", description: "Estimate the final exam score needed to reach your overall target." },
    { id: "average", slug: "average-marks-calculator", title: "Average Marks Calculator", category: "Exam tools", description: "Work out the average across multiple subject marks." },
    { id: "grade", slug: "grade-calculator", title: "Grade Calculator", category: "Exam tools", description: "Convert a mark into a grade using thresholds you configure." },
    { id: "age", slug: "age-calculator", title: "Age Calculator", category: "Date & planning", description: "Calculate your calendar age in years, months, and days." },
    { id: "date-difference", slug: "date-difference-calculator", title: "Date Difference Calculator", category: "Date & planning", description: "Count calendar days between two dates." },
    { id: "countdown", slug: "exam-countdown-calculator", title: "Exam Countdown Calculator", category: "Date & planning", description: "See how many days remain until an exam." },
    { id: "study-time", slug: "study-time-calculator", title: "Study Time Calculator", category: "Date & planning", description: "Divide available study time across your subjects." },
    { id: "assignment-deadline", slug: "assignment-deadline-calculator", title: "Assignment Deadline Calculator", category: "Date & planning", description: "Check how many days remain before an assignment is due." },
  ];

  const pageCopy = {
    "neb-gpa": ["Build your marksheet by stream and subject.", "Choose Science or Management, select your subject choice and three optional subjects, then enter theory and practical/internal grades. GPA uses NEB letter-grade points, component mark weights, and subject credits."],
    "see-gpa": ["Build your SEE marksheet from component grades.", "Enter theory and practical grades for six compulsory subjects and two optional subjects. The supplied grade-point chart is applied with 75% theory and 25% practical weighting; NG has no grade point."],
    "university-gpa": ["Calculate GPA from your classes.", "Use the standard 4.0 letter-grade scale or enter grade points from your school's scale. Each class is weighted by its credits."],
    cgpa: ["Combine semesters by the credits they represent.", "Add each semester GPA with its corresponding total credit hours. Credit-weighting gives a more accurate cumulative result than averaging semester GPAs equally."],
    attendance: ["Know exactly where your attendance stands.", "Enter the number of classes conducted and the classes you attended. The result includes your missed classes and the percentage formula."],
    bunk: ["Plan absences around a target you choose.", "This estimate finds the largest whole number of additional classes you can miss without falling below your selected attendance percentage."],
    "attendance-recovery": ["Turn an attendance shortfall into a clear plan.", "Find the smallest number of consecutive classes you need to attend to reach your target, assuming no additional classes are missed."],
    percentage: ["A quick, dependable marks-to-percentage conversion.", "Enter obtained marks and the maximum marks. The result shows your percentage and the exact formula used."],
    "final-marks": ["Set a realistic target for your final examination.", "Use your internal score as a percentage of its component and enter the final exam's share of the overall grade. Your institution may use a different assessment structure."],
    average: ["See the mean of your subject marks in seconds.", "Add one mark per subject. Every subject is weighted equally; use a course-specific GPA calculator when credit values differ."],
    grade: ["Use the grade boundaries that apply to your course.", "Configure grade labels and minimum percentage thresholds yourself. No school or national grading scale is assumed."],
    age: ["Calculate calendar age with a selected reference date.", "Enter a date of birth and optionally choose the date to calculate against. Leap years and calendar month lengths are accounted for."],
    "date-difference": ["Count the days between any two dates.", "The result is the absolute calendar-day difference; the starting date is not counted as an extra day."],
    countdown: ["Turn an exam date into a clear day count.", "Choose the exam date to see the days remaining, or how long ago it was. Dates are calculated locally in your browser."],
    "study-time": ["Make a simple, balanced study-time split.", "Divide the available minutes evenly across subjects. Breaks are not included in the allocated study time."],
    "assignment-deadline": ["Keep the next due date in view.", "Choose the assignment deadline to see how many calendar days remain or whether the date has passed."],
  };

  const learningNotes = {
    "neb-gpa": ["A+ maps to 4.0 grade points, A to 3.6, and each subject combines theory and practical/internal components using its mark split before credit weighting.", "Does the result replace an official transcript? No. Use it as an estimate and confirm your subject credits and current grading rules with your school."],
    "see-gpa": ["A theory grade of A (3.60) and practical grade of B (2.80) produce (3.60 x 75 + 2.80 x 25) / 100 = 3.40 for that subject.", "What happens if any component is NG? NG has no grade point in the supplied table, so the overall GPA is reported as unavailable."],
    "university-gpa": ["A 4-credit course at 3.5 and a 2-credit course at 4.0 produce (14 + 8) / 6 = 3.67.", "Why enter credits? Courses with more credits contribute more to a weighted semester GPA."],
    cgpa: ["A 15-credit semester at 3.4 and a 12-credit semester at 3.8 give (51 + 45.6) / 27 = 3.58.", "Should semester GPAs be averaged equally? Only when their credits are equal; otherwise credit-weight them."],
    attendance: ["If you attended 18 of 24 classes, 18 / 24 x 100 = 75% attendance, with 6 classes missed.", "Does this include cancelled classes? Enter only classes your institution counts as conducted."],
    bunk: ["With 18 attended out of 20 and an 80% target, two more absences leave 18 / 22 = 81.82%.", "Does the result include a safety margin? No. Keep a buffer for timetable or policy changes."],
    "attendance-recovery": ["At 5 attended of 10, reaching 75% takes 10 straight attended classes: 15 / 20 = 75%.", "What if I miss another class? Recalculate using the updated conducted and attended totals."],
    percentage: ["45 marks out of 60 is 45 / 60 x 100 = 75%.", "Can I enter decimal marks? Yes, decimal values are supported."],
    "final-marks": ["With 80% internally, a 40% internal share, and a 70% target, the final target is (70 - 32) / 0.60 = 63.33%.", "What if the target is impossible? The result says so when more than 100% is required on the final."],
    average: ["Marks of 80, 90, and 70 have an average of (80 + 90 + 70) / 3 = 80.", "Are subjects weighted by credits? No. This tool gives every entered mark equal weight."],
    grade: ["At 72 out of 100, a configured B threshold of 60% matches, while an A threshold of 80% does not.", "Are the default boundaries official? No. Edit them to match your current course requirements."],
    age: ["A birth date of 1 January 2000 calculated on 1 January 2025 is 25 years, 0 months, 0 days.", "Can I calculate age on a past date? Yes. Use the optional calculation date field."],
    "date-difference": ["From 28 February to 1 March 2024 is 2 calendar days because 2024 is a leap year.", "Is the start date counted? The displayed difference counts elapsed days, not both endpoints inclusively."],
    countdown: ["An exam on 10 November calculated on 31 October has 10 calendar days remaining.", "Does the calculator use my time zone? Date-only values are read locally in your browser."],
    "study-time": ["125 minutes shared across 3 subjects gives 41 whole study minutes per subject, with 2 minutes left over.", "Are breaks included? No. Add break time separately when planning your session."],
    "assignment-deadline": ["If an assignment is due tomorrow, the result shows one day until the deadline.", "What does an overdue result mean? The selected due date is earlier than today's local calendar date."],
  };

  const rootPath = document.body.dataset.root || "";
  const byId = id => tools.find(tool => tool.id === id);
  const linkFor = tool => `${rootPath}calculators/${tool.slug}.html`;
  const iconFor = id => ({ "neb-gpa": "G", "see-gpa": "S", "university-gpa": "U", cgpa: "C", attendance: "%", bunk: "B", "attendance-recovery": "+", percentage: "%", "final-marks": "F", average: "A", grade: "#", age: "D", "date-difference": "↔", countdown: "T", "study-time": "M", "assignment-deadline": "!" })[id] || "+";

  function renderShell() {
    const header = document.querySelector("[data-site-header]");
    const footer = document.querySelector("[data-site-footer]");
    if (header) header.innerHTML = `<div class="nav-wrap"><a class="brand" href="${rootPath}index.html" aria-label="StudentCalc Nepal home"><span class="brand-mark">S</span><span>StudentCalc<span class="brand-nepal"> Nepal</span></span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu"><span></span><span></span></button><nav class="site-nav" id="site-nav" aria-label="Main navigation"><a href="${rootPath}index.html">Home</a><a href="${rootPath}index.html#calculators">GPA Calculators</a><a href="${rootPath}index.html#attendance">Attendance</a><a href="${rootPath}index.html#exam-tools">Other Calculators</a><a href="${rootPath}guides/index.html">Study Guides</a><a href="${rootPath}about.html">About Us</a></nav></div>`;
    if (footer) footer.innerHTML = `<div class="footer-main"><div class="footer-brand"><a class="brand" href="${rootPath}index.html"><span class="brand-mark">S</span><span>StudentCalc<span class="brand-nepal"> Nepal</span></span></a><p>Smart Calculations for Smarter Students.</p><p class="footer-note">Independent study tools. Always confirm grading and attendance rules with your institution.</p></div><div class="footer-links"><strong>StudentCalc</strong><a href="${rootPath}about.html">About Us</a><a href="${rootPath}contact.html">Contact Us</a><a href="${rootPath}guides/index.html">Study Guides</a></div><div class="footer-links"><strong>Policies</strong><a href="${rootPath}privacy-policy.html">Privacy Policy</a><a href="${rootPath}terms.html">Terms and Conditions</a><a href="${rootPath}disclaimer.html">Disclaimer</a></div></div><div class="footer-bottom"><span>© <span data-year></span> StudentCalc Nepal</span><span>Made for clearer study planning.</span></div>`;
    document.querySelectorAll("[data-year]").forEach(node => { node.textContent = new Date().getFullYear(); });
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector(".site-nav");
    if (toggle && nav) toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    });
  }

  function card(tool, index) {
    return `<a class="tool-card" href="${linkFor(tool)}" data-tool-card data-search="${tool.title.toLowerCase()} ${tool.category.toLowerCase()} ${tool.description.toLowerCase()}" style="--card-order:${index % 8}"><span class="tool-icon" aria-hidden="true">${iconFor(tool.id)}</span><span class="tool-category">${tool.category}</span><strong>${tool.title}</strong><span class="tool-description">${tool.description}</span><span class="card-arrow" aria-hidden="true">↗</span></a>`;
  }

  function renderCatalog() {
    document.querySelectorAll("[data-tool-catalog]").forEach(container => {
      const category = container.dataset.toolCatalog;
      const list = category === "recent" ? tools.slice(-4).reverse() : category ? tools.filter(tool => tool.category === category) : tools;
      container.innerHTML = list.map((tool, index) => card(tool, index)).join("");
    });
  }

  function initSearch() {
    const input = document.querySelector("[data-tool-search]");
    const results = document.querySelector("[data-search-results]");
    if (!input || !results) return;
    input.addEventListener("input", () => {
      const query = input.value.trim().toLowerCase();
      if (!query) { results.hidden = true; results.replaceChildren(); return; }
      const matches = tools.filter(tool => `${tool.title} ${tool.category} ${tool.description}`.toLowerCase().includes(query));
      results.hidden = false;
      results.replaceChildren();
      if (!matches.length) {
        const empty = document.createElement("p"); empty.className = "search-empty"; empty.textContent = "No calculators match yet. Try “GPA”, “attendance”, or “marks”."; results.append(empty); return;
      }
      matches.forEach(tool => {
        const link = document.createElement("a"); link.href = linkFor(tool); link.textContent = tool.title;
        const type = document.createElement("span"); type.textContent = tool.category;
        link.append(type); results.append(link);
      });
    });
  }

  const field = (name, label, type = "number", attrs = "") => `<label class="field"><span>${label}</span><input name="${name}" type="${type}" ${attrs} required></label>`;
  const rowTemplate = (id, index) => {
    const isCgpa = id === "cgpa";
    const nameLabel = isCgpa ? "Semester" : "Subject";
    const gradeControl = isCgpa ? "" : `<label class="field"><span>Grade label</span><select name="grade" required><option value="">Select</option><option>A+</option><option>A</option><option>B+</option><option>B</option><option>C+</option><option>C</option><option>D</option><option>NG</option></select></label>`;
    const components = isCgpa ? "" : `<div class="component-data"><span class="component-heading">Optional theory + practical points (averaged equally)</span><label class="field"><span>Theory points</span><input name="theoryPoint" type="number" min="0" max="10" step="any" placeholder="Leave both blank to use grade point"></label><label class="field"><span>Practical points</span><input name="practicalPoint" type="number" min="0" max="10" step="any" placeholder="Leave both blank to use grade point"></label></div>`;
    const pointField = `<label class="field"><span>${isCgpa ? "Semester GPA" : "Grade point"}</span><input name="point" type="number" min="0" max="10" step="any" placeholder="From your scale"></label>`;
    return `<div class="subject-row" data-subject-row><div class="subject-main${isCgpa ? " cgpa-main" : ""}"><label class="field"><span>${nameLabel} name</span><input name="name" type="text" placeholder="${nameLabel} ${index + 1}" maxlength="60"></label>${gradeControl}<button class="icon-button remove-subject" type="button" aria-label="Remove ${nameLabel.toLowerCase()}" title="Remove row">−</button></div><div class="subject-data">${pointField}${field("credit", isCgpa ? "Semester credits" : "Credit hours", "number", 'min="0.001" step="any" value="1"')}</div>${components}</div>`;
  };

  const gradeScaleRow = (label, minimum) => `<div class="grade-scale-row" data-grade-row><label class="field"><span>Grade label</span><input name="gradeLabel" value="${label}" maxlength="12" required></label><label class="field"><span>Minimum percentage</span><input name="gradeMin" type="number" min="0" max="100" step="any" value="${minimum}" required></label><button class="icon-button remove-grade" type="button" aria-label="Remove grade boundary" title="Remove boundary">−</button></div>`;

  const cgpaSemesterRow = index => `<div class="cgpa-semester-row" data-cgpa-semester-row><div class="cgpa-index-badge" aria-hidden="true">${index + 1}</div><label class="cgpa-field"><span>Semester name</span><input name="name" type="text" placeholder="Semester ${index + 1}" maxlength="60"></label><label class="cgpa-field"><span>GPA (0–10)</span><input name="point" type="number" min="0" max="10" step="any" placeholder="e.g. 3.5" required></label><label class="cgpa-field"><span>Credits</span><input name="credit" type="number" min="0.001" step="any" placeholder="e.g. 15" required></label><button class="cgpa-remove-button" type="button" aria-label="Remove semester" title="Remove semester">×</button></div>`;
  const cgpaFormMarkup = () => `<div class="cgpa-section-header"><h2>Semester results</h2><p>Use the GPA and credits from your transcript. GPA scale: 0–10.</p></div><div class="cgpa-semester-table"><div class="cgpa-table-header" aria-hidden="true"><span>Semester name</span><span>GPA (0–10)</span><span>Credits</span></div><div class="cgpa-semester-list" data-subject-list>${cgpaSemesterRow(0)}${cgpaSemesterRow(1)}</div><button class="cgpa-add-semester" type="button" data-add-subject>+ Add semester</button></div>`;
  const updateCgpaSemesterNumbers = list => list.querySelectorAll("[data-cgpa-semester-row]").forEach((row, index) => {
    row.querySelector(".cgpa-index-badge").textContent = String(index + 1);
    row.querySelector('[name="name"]').placeholder = `Semester ${index + 1}`;
  });

  const universityGrades = [["A+", 4], ["A", 4], ["A-", 3.7], ["B+", 3.3], ["B", 3], ["B-", 2.7], ["C+", 2.3], ["C", 2], ["C-", 1.7], ["D+", 1.3], ["D", 1], ["F", 0]];
  const universityGradeOptions = `<option value="">Grade</option>${universityGrades.map(([grade, point]) => `<option value="${point}">${grade}</option>`).join("")}`;
  const universityCreditsOptions = `<option value="">—</option>${[1, 2, 3, 4, 5, 6].map(credit => `<option value="${credit}">${credit}</option>`).join("")}<option value="other">Other</option>`;
  const universityCourseRow = index => `<div class="university-course-row" data-university-course><label class="university-course-name"><span class="visually-hidden">Course name (optional)</span><input name="course" type="text" maxlength="60" placeholder="e.g. ${["ENG 101", "MATH 121", "PSY 201", "BIO 110"][index % 4]}"></label><button class="university-remove-course" type="button" aria-label="Remove course">×</button><label class="university-grade-field"><span class="visually-hidden">Grade</span><select class="university-grade-select" name="grade" required>${universityGradeOptions}</select><input class="university-grade-points" name="customPoint" type="number" min="0" max="10" step="any" placeholder="Grade points" hidden></label><label class="university-credit-field"><span class="visually-hidden">Credits</span><select class="university-credit-select" name="credit" required>${universityCreditsOptions}</select><input class="university-custom-credit" type="number" min="0.001" step="any" placeholder="Credits" hidden></label></div>`;
  const universitySemester = index => `<section class="university-semester" data-university-semester><header class="university-semester-heading"><label><span class="visually-hidden">Semester name</span><input name="semesterName" type="text" maxlength="60" placeholder="Semester ${index + 1}" aria-label="Semester ${index + 1} name"></label><button class="university-remove-semester" type="button" aria-label="Remove semester">Remove semester</button></header><div class="university-course-header" aria-hidden="true"><span>Course (optional)</span><span>Grade</span><span>Credits</span></div><div class="university-course-list" data-university-course-list>${Array.from({ length: 4 }, (_, row) => universityCourseRow(row)).join("")}</div></section>`;
  const universityFormMarkup = () => `<div class="university-scale-note"><span data-university-scale-label>Standard 4.0 scale</span><button class="university-scale-toggle" type="button" data-university-scale-toggle>Use your school's scale</button><span class="university-custom-scale-note" hidden>Enter grade points from 0 to 10.</span></div><div class="university-semester-list" data-university-semester-list>${universitySemester(0)}</div><div class="university-add-actions"><button class="university-add-course" type="button" data-add-university-course>+ Add class</button><button class="university-add-semester" type="button" data-add-university-semester>+ Add semester</button></div>`;
  const setUniversityScale = (form, custom) => {
    form.dataset.scaleMode = custom ? "custom" : "standard";
    form.querySelector("[data-university-scale-label]").textContent = custom ? "Your school's scale" : "Standard 4.0 scale";
    form.querySelector("[data-university-scale-toggle]").textContent = custom ? "Use standard 4.0 scale" : "Use your school's scale";
    form.querySelector(".university-custom-scale-note").hidden = !custom;
    form.querySelectorAll("[data-university-course]").forEach(row => {
      const standard = row.querySelector(".university-grade-select");
      const customPoint = row.querySelector(".university-grade-points");
      standard.hidden = custom;
      standard.required = !custom;
      customPoint.hidden = !custom;
      customPoint.required = custom;
    });
  };
  const updateUniversitySemesterNames = list => list.querySelectorAll("[data-university-semester]").forEach((semester, index) => {
    semester.querySelector('[name="semesterName"]').placeholder = `Semester ${index + 1}`;
    semester.querySelector('[name="semesterName"]').setAttribute("aria-label", `Semester ${index + 1} name`);
  });

  const nebGradeOptions = `<option value="">Select Grade</option>${["A+", "A", "B+", "B", "C+", "C", "D", "NG"].map(grade => `<option value="${grade}">${grade}</option>`).join("")}`;
  const nebGradeField = (name, label) => `<label class="field"><span>${label}</span><select name="${name}" required>${nebGradeOptions}</select></label>`;
  const nebSubjectCard = (title, type, selectMarkup = "") => `<section class="neb-subject-card" data-neb-subject-card="${type}"><h3>${title}</h3>${selectMarkup}<div class="neb-grade-fields"><label class="field"><span>Theory (75)</span><select name="theoryGrade" required>${nebGradeOptions}</select></label><label class="field"><span>Practical/Internal (25)</span><select name="practicalGrade" required>${nebGradeOptions}</select></label></div></section>`;
  const nebSelect = (name, label, options, placeholder) => `<label class="field"><span>${label}</span><select name="${name}" required><option value="">${placeholder}</option>${options.map(option => `<option value="${option}">${option}</option>`).join("")}</select></label>`;
  const nebOptionalOptions = stream => stream === "science"
    ? ["Physics", "Chemistry", "Biology", "Computer Science", "Mathematics", "Statistics", "Environmental Science"]
    : ["Accountancy", "Economics", "Business Studies", "Computer Science", "Hotel Management", "Marketing", "Business Mathematics", "Mathematics", "Finance"];
  const nebChoiceOptions = stream => stream === "science" ? ["Mathematics", "Biology"] : ["Business Mathematics", "Social Studies and Life Skills Education"];

  function nebFormMarkup() {
    const optionals = [1, 2, 3].map(index => nebSubjectCard(`Optional ${["I", "II", "III"][index - 1]}`, `optional-${index}`, nebSelect(`optional${index}`, "Subject", [], "Select Subject"))).join("");
    return `<div class="neb-student-fields"><label class="field"><span>Student Name</span><input name="studentName" type="text" placeholder="Enter your full name" maxlength="80"></label>${nebSelect("stream", "Stream", ["science", "management"], "Choose Stream")}</div><p class="neb-note">Choose a stream and optional subjects, then fill every grade to calculate an instant marksheet.</p><h3 class="neb-group-heading">Compulsory subjects</h3><div class="neb-subject-grid neb-compulsory-grid">${nebSubjectCard("English", "compulsory-english")}${nebSubjectCard("Nepali", "compulsory-nepali")}${nebSubjectCard("Subject Choice", "choice", nebSelect("choice", "Subject", [], "Choose a stream first"))}</div><h3 class="neb-group-heading">Optional Subjects (Choose 3)</h3><div class="neb-subject-grid">${optionals}</div>`;
  }

  function nebResultMarkup() {
    return `<section class="result-panel neb-marksheet" data-result hidden aria-live="polite"><header class="neb-sheet-header"><div><span class="eyebrow">STUDENTCALC NEPAL · NEB GPA STATEMENT</span><h2>Academic Marksheet</h2></div><div class="neb-gpa-score"><span>Grade Point Average</span><strong data-result-summary></strong></div></header><div class="neb-sheet-meta"><span>Student <strong data-neb-result-student></strong></span><span>Stream <strong data-neb-result-stream></strong></span><span>Subjects <strong>6</strong></span></div><div class="neb-result-table-wrap"><table class="neb-result-table"><thead><tr><th>Subject</th><th>Theory</th><th>Practical/Internal</th><th>Credits</th><th>Grade Point</th><th>Weighted Points</th></tr></thead><tbody data-result-rows></tbody></table></div><p class="neb-result-details" data-result-details></p><div class="formula"><span>CALCULATION</span><p data-result-formula></p></div><footer class="neb-sheet-footer"><span>Estimate only · Confirm grades and credit values with your school.</span><button class="button button-quiet" type="button" data-print-result aria-label="Print marksheet">Print marksheet</button></footer></section>`;
  }

  const seeCompulsorySubjects = ["English", "Nepali", "Mathematics", "Science", "Social Studies", "Health Population and Environment"];
  const seeOptionalSubjects = [["Optional Mathematics", "Economics", "Population"], ["Account", "Computer"]];

  function seeFormMarkup() {
    const compulsory = seeCompulsorySubjects.map((subject, index) => nebSubjectCard(subject, `see-compulsory-${index}`)).join("");
    const optionals = seeOptionalSubjects.map((options, index) => nebSubjectCard(`Optional Subject ${index + 1}`, `see-optional-${index + 1}`, nebSelect(`seeOptional${index + 1}`, "Optional Subject", options, "Select Subject"))).join("");
    const gradeRows = [
      ["A+", "4.00", "67.5–75", "22.5–25"], ["A", "3.60", "60–67.49", "20–22.49"],
      ["B+", "3.20", "52.5–59.99", "17.5–19.99"], ["B", "2.80", "45–52.49", "15–17.49"],
      ["C+", "2.40", "37.5–44.99", "12.5–14.99"], ["C", "2.00", "30–37.49", "10–12.49"],
      ["D", "1.60", "26.25–29.99", "8.75–9.99"], ["NG", "N/A", "Below 26.25", "Below 8.75"],
    ].map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("");
    return `<label class="field see-student-name"><span>Student Name</span><input name="studentName" type="text" placeholder="Enter your full name" maxlength="80"></label><p class="neb-note">Enter theory and practical grades for all six compulsory subjects and both optional subjects.</p><h3 class="neb-group-heading">Compulsory Subjects</h3><div class="neb-subject-grid see-compulsory-grid">${compulsory}</div><h3 class="neb-group-heading">Optional Subjects</h3><div class="neb-subject-grid see-optional-grid">${optionals}</div><details class="see-grade-scale"><summary>SEE grade-point scale</summary><div class="neb-result-table-wrap"><table class="neb-result-table"><thead><tr><th>Grade</th><th>Grade Point</th><th>Theory (75 marks)</th><th>Practical (25 marks)</th></tr></thead><tbody>${gradeRows}</tbody></table></div></details>`;
  }

  function seeResultMarkup() {
    return `<section class="result-panel neb-marksheet" data-result hidden aria-live="polite"><header class="neb-sheet-header"><div><span class="eyebrow">STUDENTCALC NEPAL · SEE GPA STATEMENT</span><h2>Academic Marksheet</h2></div><div class="neb-gpa-score"><span>Grade Point Average</span><strong data-result-summary></strong></div></header><div class="neb-sheet-meta"><span>Student <strong data-see-result-student></strong></span><span>Examination <strong>SEE</strong></span><span>Subjects <strong>8</strong></span></div><div class="neb-result-table-wrap"><table class="neb-result-table"><thead><tr><th>Subject</th><th>Theory Grade</th><th>Practical Grade</th><th>Grade Point</th></tr></thead><tbody data-result-rows></tbody></table></div><p class="neb-result-details" data-result-details></p><div class="formula"><span>CALCULATION</span><p data-result-formula></p></div><footer class="neb-sheet-footer"><span>Estimate only · Confirm the grading scale with your school.</span><button class="button button-quiet" type="button" data-print-result aria-label="Print marksheet">Print marksheet</button></footer></section>`;
  }

  function formMarkup(id) {
    if (id === "neb-gpa") return nebFormMarkup();
    if (id === "see-gpa") return seeFormMarkup();
    if (id === "cgpa") return cgpaFormMarkup();
    if (id === "university-gpa") return universityFormMarkup();
    if (["neb-gpa", "see-gpa", "university-gpa", "cgpa"].includes(id)) return `<div class="scale-note"><strong>Use your institution's scale.</strong> Enter grade points and credits exactly as provided. This generic weighted-average tool does not represent an official NEB, SEE, or university grading table.</div><div class="subject-list" data-subject-list>${rowTemplate(id, 0)}${rowTemplate(id, 1)}</div><button class="text-button" type="button" data-add-subject>+ Add ${id === "cgpa" ? "semester" : "subject"}</button>`;
    if (id === "attendance") return `${field("total", "Total classes conducted", "number", 'min="1" step="1"')}${field("attended", "Classes attended", "number", 'min="0" step="1"')}`;
    if (id === "bunk" || id === "attendance-recovery") return `${field("total", "Total classes conducted", "number", 'min="1" step="1"')}${field("attended", "Classes attended", "number", 'min="0" step="1"')}${field("target", "Target attendance (%)", "number", 'min="0.01" max="100" step="any" value="75"')}`;
    if (id === "percentage") return `${field("obtained", "Obtained marks", "number", 'min="0" step="any"')}${field("total", "Total marks", "number", 'min="0.001" step="any"')}`;
    if (id === "final-marks") return `${field("internal", "Internal score (%)", "number", 'min="0" max="100" step="any"')}${field("weight", "Final exam weightage (%)", "number", 'min="0.01" max="100" step="any"')}${field("required", "Required overall marks (%)", "number", 'min="0" max="100" step="any"')}`;
    if (id === "average") return `<div class="subject-list" data-mark-list><div class="subject-row mark-row"><label class="field"><span>Subject 1 marks</span><input name="mark" type="number" min="0" step="any" required></label></div><div class="subject-row mark-row"><label class="field"><span>Subject 2 marks</span><input name="mark" type="number" min="0" step="any" required></label></div></div><button class="text-button" type="button" data-add-mark>+ Add subject</button>`;
    if (id === "grade") return `<p class="scale-note">Set minimum percentage boundaries to match your course. These editable defaults are examples only, not an official grading scale.</p>${field("marks", "Obtained marks", "number", 'min="0" step="any"')}${field("total", "Total marks", "number", 'min="0.001" step="any"')}<div class="grade-scale" data-grade-scale>${gradeScaleRow("A", 80)}${gradeScaleRow("B", 60)}${gradeScaleRow("C", 40)}</div><button class="text-button" type="button" data-add-grade>+ Add grade boundary</button>`;
    if (id === "age") return `${field("birth", "Date of birth", "date")}${field("asOf", "Calculate age on (optional)", "date", "") .replace(" required>", ">").replace("<span>Calculate age on (optional)</span>", "<span>Calculate age on (optional)</span>")}`;
    if (id === "date-difference") return `${field("start", "Start date", "date")}${field("end", "End date", "date")}`;
    if (id === "countdown") return field("exam", "Exam date", "date");
    if (id === "assignment-deadline") return field("due", "Assignment deadline", "date");
    if (id === "study-time") return `${field("minutes", "Available study time (minutes)", "number", 'min="1" step="1"')}${field("subjects", "Number of subjects", "number", 'min="1" step="1"')}`;
    return "";
  }

  function readForm(form, id) {
    const data = new FormData(form);
    const get = name => data.get(name);
    if (id === "cgpa") {
      return {
        gradingSystem: get("gradingSystem"),
        subjects: [...form.querySelectorAll("[data-cgpa-semester-row]")].map((row, index) => ({
          name: row.querySelector('[name="name"]').value.trim() || `Semester ${index + 1}`,
          point: row.querySelector('[name="point"]').value,
          credit: row.querySelector('[name="credit"]').value,
        })),
      };
    }
    if (id === "university-gpa") {
      const customScale = form.dataset.scaleMode === "custom";
      const subjects = [...form.querySelectorAll("[data-university-semester]")].flatMap((semester, semesterIndex) => {
        const semesterName = semester.querySelector('[name="semesterName"]').value.trim() || `Semester ${semesterIndex + 1}`;
        return [...semester.querySelectorAll("[data-university-course]")].map((row, courseIndex) => {
          const courseName = row.querySelector('[name="course"]').value.trim() || `Class ${courseIndex + 1}`;
          return {
            name: `${semesterName} · ${courseName}`,
            point: customScale ? row.querySelector('[name="customPoint"]').value : row.querySelector('[name="grade"]').value,
            credit: row.querySelector(".university-credit-select").value === "other"
              ? row.querySelector(".university-custom-credit").value
              : row.querySelector(".university-credit-select").value,
          };
        });
      });
      return { subjects };
    }
    if (id === "see-gpa") {
      const readSubject = (card, name) => ({
        name,
        theoryGrade: card.querySelector('[name="theoryGrade"]').value,
        practicalGrade: card.querySelector('[name="practicalGrade"]').value,
      });
      return {
        studentName: get("studentName"),
        compulsory: seeCompulsorySubjects.map((name, index) => readSubject(form.querySelector(`[data-neb-subject-card="see-compulsory-${index}"]`), name)),
        optionals: [1, 2].map(index => {
          const card = form.querySelector(`[data-neb-subject-card="see-optional-${index}"]`);
          return readSubject(card, card.querySelector(`[name="seeOptional${index}"]`).value);
        }),
      };
    }
    if (id === "neb-gpa") {
      const readSubject = card => ({
        name: card.dataset.subjectName || card.querySelector('[name="choice"], [name^="optional"]')?.value || "",
        theoryGrade: card.querySelector('[name="theoryGrade"]').value,
        practicalGrade: card.querySelector('[name="practicalGrade"]').value,
      });
      const choiceCard = form.querySelector('[data-neb-subject-card="choice"]');
      return {
        studentName: get("studentName"),
        stream: get("stream"),
        choice: get("choice"),
        choiceGrades: readSubject(choiceCard),
        compulsory: ["English", "Nepali"].map(name => {
          const card = form.querySelector(`[data-neb-subject-card="compulsory-${name.toLowerCase()}"]`);
          return { ...readSubject(card), name };
        }),
        optionals: [1, 2, 3].map(index => {
          const card = form.querySelector(`[data-neb-subject-card="optional-${index}"]`);
          return { ...readSubject(card), name: card.querySelector(`[name="optional${index}"]`).value };
        }),
      };
    }
    if (["neb-gpa", "see-gpa", "university-gpa", "cgpa"].includes(id)) return { subjects: [...form.querySelectorAll("[data-subject-row]")].map((row, index) => ({ name: row.querySelector('[name="name"]').value.trim() || `Subject ${index + 1}`, grade: row.querySelector('[name="grade"]').value, credit: row.querySelector('[name="credit"]').value, point: row.querySelector('[name="point"]').value, theoryPoint: row.querySelector('[name="theoryPoint"]').value, practicalPoint: row.querySelector('[name="practicalPoint"]').value })) };
    if (id === "average") return { marks: data.getAll("mark") };
    if (id === "grade") return { marks: get("marks"), total: get("total"), scale: [...form.querySelectorAll("[data-grade-row]")].map(row => ({ label: row.querySelector('[name="gradeLabel"]').value, min: row.querySelector('[name="gradeMin"]').value })) };
    if (id === "attendance" || id === "bunk" || id === "attendance-recovery") return { total: get("total"), attended: get("attended"), target: get("target") };
    if (id === "percentage") return { obtained: get("obtained"), total: get("total") };
    if (id === "final-marks") return { internal: get("internal"), weight: get("weight"), required: get("required") };
    if (id === "age") return { birth: get("birth"), asOf: get("asOf") };
    if (id === "date-difference") return { start: get("start"), end: get("end") };
    if (id === "countdown") return { exam: get("exam") };
    if (id === "assignment-deadline") return { due: get("due") };
    if (id === "study-time") return { minutes: get("minutes"), subjects: get("subjects") };
    return {};
  }

  function initCalculator() {
    const mount = document.querySelector("[data-calculator]");
    if (!mount || !window.StudentCalc) return;
    const id = mount.dataset.calculator;
    const tool = byId(id);
    if (!tool) return;
    const copy = pageCopy[id];
    if (id === "neb-gpa" || id === "see-gpa") mount.classList.add("neb-calculator");
    if (id === "cgpa") mount.classList.add("cgpa-calculator");
    if (id === "university-gpa") mount.classList.add("university-gpa-calculator");
    document.title = `${tool.title} | StudentCalc Nepal`;
    const learning = learningNotes[id];
    const formActions = id === "cgpa"
      ? '<div class="cgpa-form-actions"><button class="button button-primary" type="submit">Calculate CGPA</button><button class="button button-quiet" type="reset">Reset</button></div>'
      : id === "university-gpa"
        ? '<div class="university-form-actions"><button class="button button-primary" type="submit">Calculate GPA</button><button class="button button-quiet" type="reset">Reset</button></div>'
      : '<div class="form-actions"><button class="button button-primary" type="submit">Calculate <span aria-hidden="true">→</span></button><button class="button button-quiet" type="reset">Reset</button></div>';
    const breadcrumb = `<div class="breadcrumb"><a href="${rootPath}index.html">Home</a><span>/</span><a href="${rootPath}index.html#calculators">Calculators</a><span>/</span><span>${tool.title}</span></div>`;
    const cgpaMarkup = `${breadcrumb}<div class="cgpa-page"><h1>${tool.title}</h1><section class="calculator-panel" aria-label="CGPA calculator"><form data-calc-form novalidate>${formMarkup(id)}<div class="form-error" role="alert" aria-live="polite" hidden></div>${formActions}</form><section class="result-panel cgpa-result" data-result hidden aria-live="polite"><span class="eyebrow">Your CGPA</span><strong data-result-summary></strong><p data-result-details></p><ul class="cgpa-result-list" data-result-rows></ul></section></section></div>`;
    const universityMarkup = `${breadcrumb}<div class="university-page"><h1>${tool.title}</h1><p class="university-page-lead">Enter each class's grade and credits to calculate your semester GPA.</p><section class="calculator-panel" aria-label="University GPA calculator"><form data-calc-form novalidate>${formMarkup(id)}<div class="form-error" role="alert" aria-live="polite" hidden></div>${formActions}</form><section class="result-panel university-result" data-result hidden aria-live="polite"><span class="eyebrow">Your GPA</span><strong data-result-summary></strong><p data-result-details></p><div class="result-rows" data-result-rows></div><div class="formula"><span>FORMULA</span><p data-result-formula></p></div></section></section></div>`;
    const standardMarkup = `${breadcrumb}<div class="calculator-layout"><section class="calculator-intro"><span class="eyebrow">${tool.category}</span><h1>${tool.title}</h1><p class="lead">${copy[0]}</p><p>${copy[1]}</p><div class="trust-note"><span aria-hidden="true">✓</span> Free to use. Your entries stay in this browser.</div></section><section class="calculator-panel" aria-labelledby="form-title"><div class="panel-heading"><div><span class="eyebrow">STUDENT TOOL</span><h2 id="form-title">Enter your details</h2></div><span class="panel-mark">${iconFor(id)}</span></div><form data-calc-form novalidate>${formMarkup(id)}<div class="form-error" role="alert" aria-live="polite" hidden></div>${formActions}</form><section class="result-panel" data-result hidden aria-live="polite"><span class="eyebrow">YOUR RESULT</span><strong data-result-summary></strong><p data-result-details></p><div class="result-rows" data-result-rows></div><div class="formula"><span>FORMULA</span><p data-result-formula></p></div></section></section></div><section class="article-content"><div><span class="eyebrow">THE METHOD</span><h2>How this calculator works</h2><p>${copy[1]}</p><h3>Formula used</h3><p class="formula-inline" data-article-formula></p><h3>Worked example</h3><p>${learning[0]}</p><h3>How to use it</h3><ol><li>Enter values from your records or course requirements.</li><li>Select <strong>Calculate</strong> to see the result and breakdown.</li><li>Check the formula and confirm any institution-specific rules with your school.</li></ol><h3>Frequently asked question</h3><details class="tool-faq"><summary>${learning[1].split("?")[0]}?</summary><p>${learning[1].split("?").slice(1).join("?").trim()}</p></details></div><aside class="article-aside"><span class="eyebrow">GOOD TO KNOW</span><p>Calculations run locally in your browser. We do not submit your entries to a server.</p><a href="${rootPath}guides/index.html">Browse study guides <span aria-hidden="true">↗</span></a></aside></section><section class="related-tools"><div class="section-heading"><div><span class="eyebrow">KEEP GOING</span><h2>Related calculators</h2></div></div><div class="tool-grid" data-related-tools></div></section>`;
    mount.innerHTML = id === "cgpa" ? cgpaMarkup : id === "university-gpa" ? universityMarkup : standardMarkup;
    const formula = id === "neb-gpa" ? "Subject point = (theory grade point x theory marks + practical/internal grade point x practical/internal marks) / 100. GPA = sum(subject point x subject credits) / total credits." : id === "see-gpa" ? "Subject point = (theory grade point x 75 + practical grade point x 25) / 100. GPA = sum of all subject points / total subjects. NG has no grade point." : id.includes("gpa") || id === "cgpa" ? "GPA = sum(grade point x credit hours) / sum(credit hours). Theory and practical points, when both provided, are averaged equally for that subject. The grade label does not set a grade point; enter your institution's value." : id === "attendance" ? "Attendance % = attended classes / conducted classes x 100." : id === "bunk" ? "Maximum missed classes = floor(attended / target rate - conducted)." : id === "attendance-recovery" ? "Required classes = ceil((target rate x conducted - attended) / (1 - target rate))." : id === "percentage" ? "Percentage = obtained marks / total marks x 100." : id === "final-marks" ? "Required final = (target overall - internal x internal weight) / final exam weight." : id === "average" ? "Average = sum of marks / number of subjects." : id === "grade" ? "Grade is determined by the configured minimum percentage thresholds." : id === "age" ? "Calendar age = the difference between birth date and calculation date." : id === "date-difference" ? "Date difference = absolute calendar days between two dates." : id === "countdown" || id === "assignment-deadline" ? "Days remaining = selected date - today's date." : "Minutes per subject = floor(total available study minutes / subjects).";
    const articleFormula = mount.querySelector("[data-article-formula]");
    if (articleFormula) articleFormula.textContent = formula;
    const relatedTools = mount.querySelector("[data-related-tools]");
    if (relatedTools) relatedTools.innerHTML = tools.filter(other => other.category === tool.category && other.id !== id).slice(0, 3).map((other, index) => card(other, index)).join("");
    if (id === "neb-gpa") mount.querySelector("[data-result]").outerHTML = nebResultMarkup();
    if (id === "see-gpa") mount.querySelector("[data-result]").outerHTML = seeResultMarkup();
    const form = mount.querySelector("[data-calc-form]");
    if (id === "university-gpa") setUniversityScale(form, false);
    const error = mount.querySelector("[data-calc-form] .form-error");
    const result = mount.querySelector("[data-result]");
    form.addEventListener("submit", event => {
      event.preventDefault(); error.hidden = true; error.textContent = "";
      if (!form.reportValidity()) return;
      try {
        const answer = window.StudentCalc.calculate(id, readForm(form, id));
        mount.querySelector("[data-result-summary]").textContent = answer.summary;
        mount.querySelector("[data-result-details]").textContent = answer.details;
        const formulaOutput = mount.querySelector("[data-result-formula]");
        if (formulaOutput) formulaOutput.textContent = answer.formula;
        const rows = mount.querySelector("[data-result-rows]"); rows.replaceChildren();
        if (id === "neb-gpa") {
          mount.querySelector("[data-neb-result-student]").textContent = answer.studentName;
          mount.querySelector("[data-neb-result-stream]").textContent = answer.stream.charAt(0).toUpperCase() + answer.stream.slice(1);
        }
        if (id === "see-gpa") mount.querySelector("[data-see-result-student]").textContent = answer.studentName;
        (answer.rows || []).forEach(row => {
          if (id === "cgpa") {
            const item = document.createElement("li");
            item.textContent = `${row.name}: GPA ${row.point} · ${row.credit} credits · ${row.weighted} weighted points`;
            rows.append(item);
          } else if (id === "neb-gpa") {
            const item = document.createElement("tr");
            [row.name, row.theoryGrade, row.practicalGrade, row.credit, row.point, row.weighted].forEach(value => {
              const cell = document.createElement("td"); cell.textContent = value; item.append(cell);
            });
            rows.append(item);
          } else if (id === "see-gpa") {
            const item = document.createElement("tr");
            [row.name, row.theoryGrade, row.practicalGrade, row.point].forEach(value => {
              const cell = document.createElement("td"); cell.textContent = value; item.append(cell);
            });
            rows.append(item);
          } else {
            const item = document.createElement("p"); item.textContent = `${row.name}${row.grade ? ` (${row.grade})` : ""}: ${row.credit} credits x ${row.point} points = ${row.weighted} weighted points`; rows.append(item);
          }
        });
        result.hidden = false;
      } catch (issue) { error.textContent = issue.message; error.hidden = false; result.hidden = true; }
    });
    form.addEventListener("reset", () => {
      requestAnimationFrame(() => {
        error.hidden = true; result.hidden = true;
        if (id === "neb-gpa") {
          form.querySelectorAll('[name="choice"], [name^="optional"]').forEach(select => {
            select.replaceChildren(new Option(select.name === "choice" ? "Choose a stream first" : "Select Subject", ""));
          });
        }
        if (id === "cgpa") {
          const list = form.querySelector("[data-subject-list]");
          if (list) list.innerHTML = `${cgpaSemesterRow(0)}${cgpaSemesterRow(1)}`;
        }
        if (id === "university-gpa") {
          const list = form.querySelector("[data-university-semester-list]");
          if (list) list.innerHTML = universitySemester(0);
          setUniversityScale(form, false);
        }
        for (const selector of ["[data-subject-list]", "[data-mark-list]"]) {
          const list = form.querySelector(selector);
          if (!list || id === "cgpa") continue;
          while (list.children.length > 2) list.lastElementChild.remove();
        }
        form.querySelectorAll("[data-grade-row]").forEach((row, index) => { if (index >= 3) row.remove(); });
      });
    });
    form.addEventListener("click", event => {
      if (event.target.closest("[data-add-university-course]")) {
        const semester = form.querySelector("[data-university-semester-list] [data-university-semester]:last-child");
        const list = semester.querySelector("[data-university-course-list]");
        list.insertAdjacentHTML("beforeend", universityCourseRow(list.children.length));
        setUniversityScale(form, form.dataset.scaleMode === "custom");
      }
      if (event.target.closest("[data-add-university-semester]")) {
        const list = form.querySelector("[data-university-semester-list]");
        list.insertAdjacentHTML("beforeend", universitySemester(list.children.length));
        updateUniversitySemesterNames(list);
        setUniversityScale(form, form.dataset.scaleMode === "custom");
      }
      if (event.target.closest(".university-remove-course")) {
        const list = event.target.closest("[data-university-course-list]");
        if (list.children.length > 1) event.target.closest("[data-university-course]").remove();
      }
      if (event.target.closest(".university-remove-semester")) {
        const list = form.querySelector("[data-university-semester-list]");
        if (list.children.length > 1) {
          event.target.closest("[data-university-semester]").remove();
          updateUniversitySemesterNames(list);
        }
      }
      if (event.target.closest("[data-university-scale-toggle]")) {
        setUniversityScale(form, form.dataset.scaleMode !== "custom");
      }
      if (event.target.closest("[data-add-subject]")) {
        const list = mount.querySelector("[data-subject-list]");
        if (!list) return;
        if (id === "cgpa") {
          const count = list.querySelectorAll("[data-cgpa-semester-row]").length;
          list.insertAdjacentHTML("beforeend", cgpaSemesterRow(count));
          updateCgpaSemesterNumbers(list);
          return;
        }
        list.insertAdjacentHTML("beforeend", rowTemplate(id, mount.querySelectorAll("[data-subject-row]").length));
      }
      if (event.target.closest("[data-add-mark]")) {
        const count = mount.querySelectorAll("[name=mark]").length + 1;
        const row = document.createElement("div"); row.className = "subject-row mark-row";
        const label = document.createElement("label"); label.className = "field"; const text = document.createElement("span"); text.textContent = `Subject ${count} marks`;
        const input = document.createElement("input"); input.name = "mark"; input.type = "number"; input.min = "0"; input.step = "any"; input.required = true; label.append(text, input); row.append(label); mount.querySelector("[data-mark-list]").append(row);
      }
      if (event.target.closest("[data-add-grade]")) mount.querySelector("[data-grade-scale]").insertAdjacentHTML("beforeend", gradeScaleRow("", ""));
      if (event.target.closest(".remove-grade")) {
        const list = mount.querySelector("[data-grade-scale]"); if (list.children.length > 1) event.target.closest("[data-grade-row]").remove();
      }
      if (event.target.closest(".remove-subject")) {
        const list = mount.querySelector("[data-subject-list]"); if (id === "cgpa") {
          const row = event.target.closest("[data-cgpa-semester-row]"); if (row && list.querySelectorAll("[data-cgpa-semester-row]").length > 1) row.remove();
        } else if (list && list.children.length > 1) event.target.closest("[data-subject-row]").remove();
      }
      if (event.target.closest(".cgpa-remove-button")) {
        const row = event.target.closest("[data-cgpa-semester-row]"); const list = mount.querySelector("[data-subject-list]"); if (row && list && list.querySelectorAll("[data-cgpa-semester-row]").length > 1) { row.remove(); updateCgpaSemesterNumbers(list); }
      }
    });
    if (id === "university-gpa") form.addEventListener("change", event => {
      if (event.target.matches(".university-credit-select")) {
        const customCredit = event.target.closest("[data-university-course]").querySelector(".university-custom-credit");
        const isCustom = event.target.value === "other";
        customCredit.hidden = !isCustom;
        customCredit.required = isCustom;
      }
    });
    const printButton = mount.querySelector("[data-print-result]");
    if (printButton) printButton.addEventListener("click", () => window.print());
    if (id === "neb-gpa") form.addEventListener("change", event => {
      if (event.target.name === "stream") {
        const stream = event.target.value;
        const choice = form.querySelector('[name="choice"]');
        const optionalSelects = [1, 2, 3].map(index => form.querySelector(`[name="optional${index}"]`));
        const replaceOptions = (select, options, placeholder) => {
          select.replaceChildren(new Option(placeholder, ""), ...options.map(value => new Option(value, value)));
        };
        replaceOptions(choice, stream ? nebChoiceOptions(stream) : [], stream ? "Select Subject" : "Choose a stream first");
        optionalSelects.forEach(select => replaceOptions(select, stream ? nebOptionalOptions(stream) : [], "Select Subject"));
      }
      if (event.target.matches('[name="choice"], [name^="optional"]')) {
        const card = event.target.closest("[data-neb-subject-card]");
        const split = ["Computer Science", "Hotel Management"].includes(event.target.value) ? ["Theory (50)", "Practical/Internal (50)"] : ["Theory (75)", "Practical/Internal (25)"];
        card.querySelectorAll(".neb-grade-fields .field span").forEach((label, index) => { label.textContent = split[index]; });
      }
    });
  }

  renderShell(); renderCatalog(); initSearch(); initCalculator();
})();