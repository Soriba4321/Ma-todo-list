// script.js

const form = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filters button');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText !== '') {
    addTask(taskText);
    taskInput.value = '';
  }
});

function addTask(text) {
  const task = {
    id: Date.now(),
    text,
    done: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  saveTasks();
  displayTasks();
}

function displayTasks() {
  taskList.innerHTML = '';

  let filteredTasks = tasks;

  if (currentFilter === 'todo') {
    filteredTasks = tasks.filter((task) => !task.done);
  } else if (currentFilter === 'done') {
    filteredTasks = tasks.filter((task) => task.done);
  }

  // tri par date de création (plus récente en bas)
  filteredTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  filteredTasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.done ? ' done' : '');
    li.dataset.id = task.id;

    li.innerHTML = `
      <span contenteditable="true" class="task-text">${task.text}</span>
      <div>
        <button class="toggle">✔️</button>
        <button class="delete">🗑️</button>
      </div>
    `;

    // Événement : marquer comme faite
    li.querySelector('.toggle').addEventListener('click', () => toggleDone(task.id));

    // Événement : supprimer
    li.querySelector('.delete').addEventListener('click', () => deleteTask(task.id));

    // Événement : modification inline
    li.querySelector('.task-text').addEventListener('blur', (e) => {
      editTask(task.id, e.target.textContent.trim());
    });

    taskList.appendChild(li);
  });
}

function toggleDone(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.done = !task.done;
    saveTasks();
    displayTasks();
  }
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  displayTasks();
}

function editTask(id, newText) {
  const task = tasks.find((t) => t.id === id);
  if (task && newText !== '') {
    task.text = newText;
    saveTasks();
  }
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Gestion des filtres
filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    displayTasks();
  });
});

// Affichage initial
displayTasks();
