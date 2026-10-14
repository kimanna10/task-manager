const taskForm = document.querySelector("#form-add");
const taskTitle = document.querySelector("#task-title");
const taskDesc = document.querySelector("#task-desc");
const taskCategory = document.querySelector("#task-category");
const taskPriority = document.querySelector("#task-priority");
const taskDueDate = document.querySelector("#task-due");

const taskList = document.querySelector("#task-list");
const searchInput = document.querySelector("#search-input");

const categoryFilter = document.querySelector("#filter-category");
const priorityFilter = document.querySelector("#filter-priority");
const sortFilter = document.querySelector("#filter-sort");
const resetBtn = document.querySelector("#btn-reset");
const searchBtn = document.querySelector("#btn-search");

const totalCount = document.querySelector("#all-count");
const todoCount = document.querySelector("#todo-count");
const inProgressCount = document.querySelector("#inprogress-count");
const completedCount = document.querySelector("#completed-count");

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
  },
  {
    id: 2,
    title: "qwerty",
    desc: "123456789desc",
    category: "other",
    priority: "low",
    status: "inprogress",
  },
  {
    id: 3,
    title: "qwerty",
    desc: "54321desc",
    category: "study",
    priority: "high",
    status: "completed",
  },
];

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = taskTitle.value.trim();
  const desc = taskDesc.value.trim();
  const category = taskCategory.value;
  const priority = taskPriority.value;

  const newTask = {
    id: Date.now(), // ex: 1791988153128
    title: title,
    desc: desc,
    category: category,
    priority: priority,
    status: "todo",
  };

  tasks.unshift(newTask); // .push()
  taskForm.reset();
  taskPriority.value = "medium";

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
                </div>

                <div class="task-item__actions">
                  <button class="task-item__btn btn btn--delete" type="button" data-id="${task.id}">
                    Удалить
                  </button>
                </div>
              </div>`;
}
// Формирует новый массив задач с фильтрацией и сортирует его
function getVisibleTasks() {
  const query = searchInput.value.trim().toLowerCase(); // Сделать ДЗ => сделать дз
  const selectedCategory = categoryFilter.value;
  const selectedPriority = priorityFilter.value;

  console.log(query === "");

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

  totalCount.textContent = `(${visibleTasks.length})`; // отображаем кол-во задач в HTML

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

  completedCount.textContent = completed;
  todoCount.textContent = todo;
  inProgressCount.textContent = inprogress;
}

function renderApp() {
  renderTasks();
  renderStats();
}

searchBtn.addEventListener("click", () => {
  renderTasks();
});

resetBtn.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "all";
  priorityFilter.value = "all";
  sortFilter.value = "new";
});

renderApp();
