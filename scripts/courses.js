const courses = [
  {
    subject: "CSE",
    number: 110,
    title: "Introduction to Programming",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.",
    technology: ["Python"],
    completed: false,
  },
  {
    subject: "WDD",
    number: 130,
    title: "Web Fundamentals",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.",
    technology: ["HTML", "CSS"],
    completed: false,
  },
  {
    subject: "CSE",
    number: 111,
    title: "Programming with Functions",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call, debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.",
    technology: ["Python"],
    completed: false,
  },
  {
    subject: "CSE",
    number: 210,
    title: "Programming with Classes",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.",
    technology: ["C#"],
    completed: false,
  },
  {
    subject: "WDD",
    number: 131,
    title: "Dynamic Web Fundamentals",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.",
    technology: ["HTML", "CSS", "JavaScript"],
    completed: false,
  },
  {
    subject: "WDD",
    number: 231,
    title: "Frontend Web Development I",
    credits: 2,
    certificate: "Web and Computer Programming",
    description:
      "This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.",
    technology: ["HTML", "CSS", "JavaScript"],
    completed: false,
  },
];

const courseList = document.querySelector("#course-list");
const courseSummary = document.querySelector("#course-summary");
const filterButtons = document.querySelectorAll(".filter-button");

function renderCourses(filter = "all") {
  if (!courseList || !courseSummary) {
    return;
  }

  const displayedCourses =
    filter === "all"
      ? courses
      : courses.filter((course) => course.subject === filter);

  courseList.replaceChildren();

  displayedCourses.forEach((course) => {
    const card = document.createElement("article");
    card.className = `course-card${course.completed ? " is-complete" : ""}`;

    const topline = document.createElement("div");
    topline.className = "course-card__topline";

    const code = document.createElement("span");
    code.textContent = `${course.subject} ${course.number}`;

    const credits = document.createElement("span");
    credits.textContent = `${course.credits} credits`;
    topline.append(code, credits);

    const title = document.createElement("h3");
    title.className = "course-card__title";
    title.textContent = course.title;

    const details = document.createElement("p");
    details.className = "course-card__details";
    details.textContent = course.technology.join(" · ");

    const status = document.createElement("span");
    status.className = "course-card__status";
    status.textContent = course.completed ? "Completed" : "In progress";

    card.append(topline, title, details, status);
    courseList.append(card);
  });

  const totalCredits = displayedCourses.reduce(
    (total, course) => total + course.credits,
    0,
  );
  const courseLabel = displayedCourses.length === 1 ? "course" : "courses";
  courseSummary.textContent = `${displayedCourses.length} ${courseLabel} · ${totalCredits} credits`;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const { filter } = button.dataset;
    if (!filter) {
      return;
    }

    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });

    renderCourses(filter);
  });
});

renderCourses();
