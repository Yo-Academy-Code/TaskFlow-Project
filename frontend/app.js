// --- 1. переключение ---
const navButtons = document.querySelectorAll('.nav-btn');
const tabSections = document.querySelectorAll('.tab-section');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;

        navButtons.forEach(b => b.classList.remove('active'));
        tabSections.forEach(sec => sec.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(`tab-${targetTab}`).classList.add('active');

        if (targetTab === 'progress') {
            updateProgress();
        }
    });
});

// --- данные ---
let tasks = JSON.parse(localStorage.getItem('taskflow_tasks')) || [];
let habits = JSON.parse(localStorage.getItem('taskflow_habits')) || [];

function saveData() {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
    localStorage.setItem('taskflow_habits', JSON.stringify(habits));
    updateProgress();
}

// --- фильтр даты ---
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskDateInput = document.getElementById('task-date');
const taskList = document.getElementById('task-list');
const filterDateInput = document.getElementById('filter-date');
const clearFilterBtn = document.getElementById('clear-filter');

taskDateInput.valueAsDate = new Date();

function renderTasks() {
    taskList.innerHTML = '';
    const selectedFilterDate = filterDateInput.value;

    const filteredTasks = selectedFilterDate
        ? tasks.filter(t => t.date === selectedFilterDate)
        : tasks;

    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<li style="color: var(--text-muted); justify-content: center;">Задач пока нет</li>';
        return;
    }

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <label class="item-left">
                <input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleTask(${task.id})">
                <span class="${task.done ? 'item-done' : ''}">${task.text}</span>
            </label>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span class="task-date-tag">📅 ${task.date}</span>
                <button class="delete-btn" onclick="deleteTask(${task.id})">✕</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = taskInput.value.trim();
    const date = taskDateInput.value;
    if (!text || !date) return;

    tasks.push({ id: Date.now(), text, date, done: false });
    taskInput.value = '';
    saveData();
    renderTasks();
});

window.toggleTask = function(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    saveData();
    renderTasks();
};

window.deleteTask = function(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveData();
    renderTasks();
};

filterDateInput.addEventListener('change', renderTasks);
clearFilterBtn.addEventListener('click', () => {
    filterDateInput.value = '';
    renderTasks();
});

// --- привычки ---
const habitForm = document.getElementById('habit-form');
const habitInput = document.getElementById('habit-input');
const habitList = document.getElementById('habit-list');

function renderHabits() {
    habitList.innerHTML = '';

    if (habits.length === 0) {
        habitList.innerHTML = '<li style="color: var(--text-muted); justify-content: center;">Привычек пока нет</li>';
        return;
    }

    habits.forEach(habit => {
        const li = document.createElement('li');
        li.innerHTML = `
            <label class="item-left">
                <input type="checkbox" ${habit.done ? 'checked' : ''} onchange="toggleHabit(${habit.id})">
                <span class="${habit.done ? 'item-done' : ''}">${habit.text}</span>
            </label>
            <button class="delete-btn" onclick="deleteHabit(${habit.id})">✕</button>
        `;
        habitList.appendChild(li);
    });
}

habitForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = habitInput.value.trim();
    if (!text) return;

    habits.push({ id: Date.now(), text, done: false });
    habitInput.value = '';
    saveData();
    renderHabits();
});

window.toggleHabit = function(id) {
    habits = habits.map(h => h.id === id ? { ...h, done: !h.done } : h);
    saveData();
    renderHabits();
};

window.deleteHabit = function(id) {
    habits = habits.filter(h => h.id !== id);
    saveData();
    renderHabits();
};

// --- прогресс---
function updateProgress() {
    // Задачи
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.done).length;
    const taskPercent = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

    document.getElementById('tasks-stat-text').textContent = `${doneTasks} из ${totalTasks} (${taskPercent}%)`;
    document.getElementById('tasks-progress-bar').style.width = `${taskPercent}%`;

    // привычки
    const totalHabits = habits.length;
    const doneHabits = habits.filter(h => h.done).length;
    const habitPercent = totalHabits ? Math.round((doneHabits / totalHabits) * 100) : 0;

    document.getElementById('habits-stat-text').textContent = `${doneHabits} из ${totalHabits} (${habitPercent}%)`;
    document.getElementById('habits-progress-bar').style.width = `${habitPercent}%`;
}

// --- настройки ---
const themeToggleBtn = document.getElementById('theme-toggle');
const resetDataBtn = document.getElementById('reset-data');

if (localStorage.getItem('taskflow_theme') === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggleBtn.textContent = 'Включить светлую тему';
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('taskflow_theme', isDark ? 'dark' : 'light');
    themeToggleBtn.textContent = isDark ? 'Включить светлую тему' : 'Включить тёмную тему';
});

resetDataBtn.addEventListener('click', () => {
    if (confirm('Точно удалить все задачи и привычки?')) {
        tasks = [];
        habits = [];
        saveData();
        renderTasks();
        renderHabits();
    }
});

// Первый запуск при загрузке страницы
renderTasks();
renderHabits();
updateProgress();

const dialog = document.getElementById('login-dialog');

document.getElementById('auth-btn').onclick = () => dialog.showModal();

document.getElementById('close-dialog').onclick = () => dialog.close();

// сюда потом добавить отправку на сервер
document.getElementById('login-form').onsubmit = (e) => {
    e.preventDefault();
    dialog.close();
};