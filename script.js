const taskForm = document.querySelector("#form-add");
const taskTitle = document.querySelector("#task-title");
const taskDesc = document.querySelector("#task-desc");
const taskCategory = document.querySelector("#task-category");
const taskPriority = document.querySelector("#task-priority");
const taskDueDate = document.querySelector("#task-due");

const taskFormEdit = document.querySelector("#form-edit");
const taskTitleEdit = document.querySelector("#task-title-edit");
const taskDescEdit = document.querySelector("#task-desc-edit");
const taskCategoryEdit = document.querySelector("#task-category-edit");
const taskPriorityEdit = document.querySelector("#task-priority-edit");
const taskDueDateEdit = document.querySelector("#task-due-edit");

const taskList = document.querySelector("#task-list");
const searchInput = document.querySelector("#search-input");

const categoryFilter = document.querySelector("#filter-category");
const priorityFilter = document.querySelector("#filter-priority");
const sortFilter = document.querySelector("#filter-sort");
const resetBtn = document.querySelector("#btn-reset");
const searchBtn = document.querySelector("#btn-search");

const totalCount = document.querySelector("#all-count");
const totalCurrent = document.querySelector("#all");
const todoCount = document.querySelector("#todo-count");
const inProgressCount = document.querySelector("#inprogress-count");
const completedCount = document.querySelector("#completed-count");

const modalEdit = document.querySelector("#modal-edit");
const modalCloseBtn = document.querySelector("#close-modal-edit");

const today = getLocalDateString(); // сегодняшняя дата

const priorityOrder = {
  high: 3,
  medium: 2,
  low: 1,
};

const statusLabels = {
  todo: "К выполнению",
  inprogress: "В процессе",
  completed: "Завершенные",
};

const priorityLabels = {
  high: "Высокий",
  medium: "Средний",
  low: "Низкий",
};

let tasks = [
  {
    id: 1,
    title: "qwerty",
    desc: "12345desc",
    category: "study",
    priority: "low",
    status: "todo",
    dueDate: getLocalDateString(new Date(Date.now() + 86400000)), // milliseconds
    createdAt: today,
  },
  {
    id: 2,
    title: "qwerty",
    desc: "123456789desc",
    category: "other",
    priority: "low",
    status: "inprogress",
    dueDate: getLocalDateString(new Date(Date.now() + 86400000)),
    createdAt: today,
  },
  {
    id: 3,
    title: "qwerty",
    desc: "54321desc",
    category: "study",
    priority: "high",
    status: "completed",
    dueDate: getLocalDateString(new Date(Date.now() + 86400000)),
    createdAt: today,
  },
];

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskTitle.value.trim();
  const desc = taskDesc.value.trim();
  const category = taskCategory.value;
  const priority = taskPriority.value;
  const due = taskDueDate.value;

  const newTask = {
    id: Date.now(), // ex: 1791988153128 [01.01.1970]
    title: title,
    desc: desc,
    category: category,
    priority: priority,
    status: "todo",
    dueDate: due,
    createdAt: getLocalDateString(),
  };

  tasks.unshift(newTask); // .push()
  taskForm.reset();
  taskPriority.value = "medium";
  taskDueDate.min = getLocalDateString();

  renderApp();
});

function displayTasks(task) {
  return `<div class="task-item">
                <div class="task-item__head">
                  <h3 class="task-item__title">${task.title}</h3>
                  <p class="task-item__desc">${task.desc}</p>
                  <span class="badge badge--${task.priority}">${priorityLabels[task.priority]}</span>
                </div>

                <div class="task-item__details">
                  <p class="task-item__prop">${task.category}</p>
                  <p class="task-item__prop">${statusLabels[task.status]}</p>
                  <p class="task-item__prop">${formatDate(task.dueDate)}</p>
                </div>

                <div class="task-item__actions">
                  <button class="task-item__btn btn btn--edit" type="button" data-id="${task.id}">
                    Изменить
                  </button>
                  <button class="task-item__btn btn btn--delete" type="button" data-id="${task.id}">
                    Удалить
                  </button>
                </div>
              </div>`;
}

function formatDate(dateString) {
  // dateString => 2026-10-22
  if (!dateString) {
    return "Нет срока выполнения";
  }
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // 22/10/2026
  // 22.10.2026
  // 2026.10.22
}
// Формирует новый массив задач с фильтрацией и сортирует его
function getVisibleTasks() {
  const query = searchInput.value.trim().toLowerCase(); // Сделать ДЗ => сделать дз
  const selectedCategory = categoryFilter.value;
  const selectedPriority = priorityFilter.value;

  const selectedSort = sortFilter.value;

  let result = tasks.filter((task) => {
    const matchSearch =
      query === "" ||
      task.title.toLowerCase().includes(query) ||
      task.desc.toLowerCase().includes(query);

    const matchCategory =
      selectedCategory === "all" || task.category === selectedCategory;

    const matchPriority =
      selectedPriority === "all" || task.priority === selectedPriority;

    return matchSearch && matchCategory && matchPriority;
  });

  if (selectedSort === "priority") {
    result.sort((a, b) => {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  if (selectedSort === "new") {
    result.sort((a, b) => {
      return b.id - a.id;
    });
  }

  return result;
}

function renderTasks() {
  const visibleTasks = getVisibleTasks(); // получаем все отфильтрованные и отсортированные задачи

  totalCurrent.textContent = `(${visibleTasks.length})`; // отображаем кол-во задач в HTML

  if (visibleTasks.length === 0) {
    taskList.innerHTML = '<p class="no-res">задач не найдено...</p>';
    return;
  }

  taskList.innerHTML = visibleTasks.map(displayTasks).join("");
}

function renderStats() {
  const total = tasks.length;

  const completed = tasks.filter((task) => {
    return task.status === "completed";
  }).length;

  const todo = tasks.filter((task) => {
    return task.status === "todo";
  }).length;

  const inprogress = tasks.filter((task) => {
    return task.status === "inprogress";
  }).length;

  totalCount.textContent = total;
  completedCount.textContent = completed;
  todoCount.textContent = todo;
  inProgressCount.textContent = inprogress;
}

function renderApp() {
  renderTasks();
  renderStats();
}

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`; // => 2026-10-16
}

searchBtn.addEventListener("click", () => {
  renderTasks();
});

resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "all";
  priorityFilter.value = "all";
  sortFilter.value = "new";
  renderTasks();
});

taskList.addEventListener("click", (event) => {
  const button = event.target.closest(".btn");
  if (!button) {
    return;
  }

  if (button.classList.contains("btn--delete")) {
    deleteTask(button);
    renderApp(); // display tasks
  } else if (button.classList.contains("btn--edit")) {
    updateTask(button);
  }
});

function deleteTask(buttonDelete) {
  const taskId = Number(buttonDelete.dataset.id); // ex: task id = 3
  tasks = tasks.filter((task) => {
    return task.id !== taskId;
  });
}

let editTaskId = null;
function updateTask(buttonUpdate) {
  const taskId = Number(buttonUpdate.dataset.id);
  const task = tasks.find((task) => {
    return task.id === taskId;
  });
  if (!task) {
    return;
  }
  editTaskId = task.id;
  taskTitleEdit.value = task.title;
  taskDescEdit.value = task.desc;
  taskCategoryEdit.value = task.category;
  taskPriorityEdit.value = task.priority;
  taskDueDateEdit.value = task.dueDate;

  modalEdit.classList.add("opened");
}
modalCloseBtn.addEventListener("click", () => {
  modalEdit.classList.remove("opened");
});

taskFormEdit.addEventListener("submit", (event) => {
  event.preventDefault();

  const task = tasks.find((task) => {
    return task.id === editTaskId;
  });

  if (!task) {
    return;
  }

  task.title = taskTitleEdit.value.trim();
  task.desc = taskDescEdit.value.trim();
  task.category = taskCategoryEdit.value;
  task.priority = taskPriorityEdit.value;
  task.dueDate = taskDueDateEdit.value;

  editTaskId = null;
  modalEdit.classList.remove("opened");

  renderApp();
});

modalEdit.addEventListener("click", (event) => {
  if (event.target === modalEdit) {
    modalEdit.classList.remove("opened");
  }
});
renderApp(); // display tasks

const dateExample = new Date("2026-10-02");
console.log(dateExample.getFullYear()); // 2026
console.log(dateExample.getMonth()); // 9 index
console.log(dateExample.getDate()); // 2

console.log(getLocalDateString()); // 2026-09-16

// getDay() => day of the week
// sun=0 mon=1 tue=2 wen=3 thu=4 fri=5 sat=6

// 10 => october
// [jan=0, feb=2, march, apl]
// 1, 2, 3, 4
