const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
const planner = document.getElementById("planner");
const darkModeToggle = document.getElementById("toggle-dark-mode");
const tasks = {};

// Load / Save Tasks
function loadTasks(day) {
  const stored = localStorage.getItem(`week-planner-${day}`);
  return stored ? JSON.parse(stored) : [];
}

function saveTasks(day, data) {
  localStorage.setItem(`week-planner-${day}`, JSON.stringify(data));
}

// Create Task Element
function createTaskElement(taskText, day, index, isDone = false) {
  const div = document.createElement("div");
  div.className = "task" + (isDone ? " done" : "");
  div.innerHTML = `
    <span>${taskText}</span>
    <div class="task-buttons">
      <button class="done-btn" title="Concluir">✔</button>
      <button class="delete-btn" title="Remover">✖</button>
    </div>
  `;

  // Event listeners
  div.querySelector(".done-btn").addEventListener("click", () => {
    tasks[day][index].done = !tasks[day][index].done;
    saveTasks(day, tasks[day]);
    renderPlanner();
  });

  div.querySelector(".delete-btn").addEventListener("click", () => {
    tasks[day].splice(index, 1);
    saveTasks(day, tasks[day]);
    renderPlanner();
  });

  return div;
}

// Render entire planner
function renderPlanner() {
  planner.innerHTML = "";

  days.forEach(day => {
    const col = document.createElement("div");
    col.className = "day-column";
    col.innerHTML = `<h2>${day}</h2>`;

    tasks[day] = loadTasks(day);

    tasks[day].forEach((task, i) => {
      const taskEl = createTaskElement(task.text, day, i, task.done);
      col.appendChild(taskEl);
    });

    // Add task input
    const inputWrap = document.createElement("div");
    inputWrap.className = "add-task";
    inputWrap.innerHTML = `
      <input type="text" placeholder="Nova tarefa..." aria-label="Nova tarefa para ${day}">
      <button>Adicionar</button>
      <div class="extra-actions">
        <button class="mark-all">✔ Todos</button>
        <button class="clear-day">🗑 Limpar</button>
      </div>
    `;

    const input = inputWrap.querySelector("input");
    const button = inputWrap.querySelector("button");

    button.addEventListener("click", () => {
      const value = input.value.trim();
      if (value) {
        tasks[day].push({ text: value, done: false });
        saveTasks(day, tasks[day]);
        renderPlanner();
      }
    });

    // Extra: Marcar todas como concluídas
    inputWrap.querySelector(".mark-all").addEventListener("click", () => {
      tasks[day].forEach(t => t.done = true);
      saveTasks(day, tasks[day]);
      renderPlanner();
    });

    // Extra: Limpar dia
    inputWrap.querySelector(".clear-day").addEventListener("click", () => {
      if (confirm(`Tem certeza que deseja limpar todas as tarefas de ${day}?`)) {
        tasks[day] = [];
        saveTasks(day, tasks[day]);
        renderPlanner();
      }
    });

    col.appendChild(inputWrap);
    planner.appendChild(col);
  });
}

// Dark mode toggle
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  darkModeToggle.textContent = document.body.classList.contains("dark-mode")
    ? "☀️ Modo Claro"
    : "🌙 Modo Escuro";
});

// Initial render
renderPlanner();
