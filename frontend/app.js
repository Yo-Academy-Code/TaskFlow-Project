document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    const habitForm = document.getElementById('habit-form');
    const habitInput = document.getElementById('habit-input');
    const habitList = document.getElementById('habit-list');

    taskForm.addEventListener('sumbit', (e) => {
        e.preventDefault();
        const text = taskInput.value.trim();
        if (text) {
            addItem(taskList, text);
            taskInput.value = '';
        }
    });
    habitForm.addEventListener('sumbit', (e) => {
        e.preventDefault();
        const text = habitInput.value.trim();
        if (text) {
            addItem(habitList, text);
            habitInput.value = '';
        }
    });

    function addItem(listElement, text) {
        const li = document.createElement('li');
        li.textContent = text;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.style.background = 'transparent';
        deleteBtn.style.border = 'none';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.float = 'right';
        deleteBtn.style.fontSize = '16px';
        deleteBtn.style.color = '#64748b';
        
        deleteBtn.addEventListener('click', () => {
            li.remove();
        });

        li.appendChild(deleteBtn);
        listElement.appendChild(li);
    }
}); 