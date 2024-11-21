// Create a new file: tasks-and-stats.js

class TaskManager {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('pomodoroTasks')) || [];
        this.setupTaskUI();
        this.renderTasks();
    }

    setupTaskUI() {
        // Add task list container to HTML
        const container = document.querySelector('.container');
        const taskHtml = `
            <div class="task-section">
                <div class="task-input-container">
                    <input type="text" id="newTask" class="task-input" placeholder="Add a new task...">
                    <button id="addTask" class="task-btn">Add Task</button>
                </div>
                <div class="tasks-list"></div>
            </div>
            <div class="statistics-section">
                <h2>Statistics</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Today</h3>
                        <div class="stat-info">
                            <span id="todayPomodoros">0</span> pomodoros
                        </div>
                    </div>
                    <div class="stat-card">
                        <h3>This Week</h3>
                        <div class="stat-info">
                            <span id="weekPomodoros">0</span> pomodoros
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', taskHtml);

        // Add event listeners
        document.getElementById('addTask').addEventListener('click', () => this.addTask());
        document.getElementById('newTask').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
    }

    addTask() {
        const input = document.getElementById('newTask');
        const taskText = input.value.trim();
        
        if (taskText) {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false,
                pomodoros: 0,
                createdAt: new Date()
            };

            this.tasks.unshift(task);
            this.saveTasks();
            this.renderTasks();
            input.value = '';
        }
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    incrementPomodoro(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.pomodoros++;
            this.saveTasks();
            this.renderTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    renderTasks() {
        const tasksList = document.querySelector('.tasks-list');
        tasksList.innerHTML = this.tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <div class="task-checkbox" onclick="taskManager.toggleTask(${task.id})">
                    ${task.completed ? '✓' : ''}
                </div>
                <div class="task-content">
                    <span class="task-text">${task.text}</span>
                    <span class="pomodoro-count">🍅 ${task.pomodoros}</span>
                </div>
                <button class="delete-task" onclick="taskManager.deleteTask(${task.id})">×</button>
            </div>
        `).join('');

        this.updateStatistics();
    }

    updateStatistics() {
        const today = new Date().toDateString();
        const todayPomodoros = this.tasks.reduce((sum, task) => {
            if (new Date(task.createdAt).toDateString() === today) {
                return sum + task.pomodoros;
            }
            return sum;
        }, 0);

        const weekPomodoros = this.tasks.reduce((sum, task) => {
            const taskDate = new Date(task.createdAt);
            const diffTime = Math.abs(new Date() - taskDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= 7) {
                return sum + task.pomodoros;
            }
            return sum;
        }, 0);

        document.getElementById('todayPomodoros').textContent = todayPomodoros;
        document.getElementById('weekPomodoros').textContent = weekPomodoros;
    }

    saveTasks() {
        localStorage.setItem('pomodoroTasks', JSON.stringify(this.tasks));
    }
}

// Add these styles to your existing CSS
const taskStyles = `
    .task-section {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 1rem;
        margin: 1rem 0;
    }

    .task-input-container {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .task-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        margin-bottom: 0.5rem;
        transition: all 0.3s ease;
    }

    .task-item.completed {
        opacity: 0.6;
    }

    .task-checkbox {
        width: 20px;
        height: 20px;
        border: 2px solid var(--primary);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--primary);
    }

    .task-content {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .delete-task {
        background: none;
        border: none;
        color: #ff4444;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.3s;
    }

    .delete-task:hover {
        opacity: 1;
    }

    .statistics-section {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 1rem;
        margin: 1rem 0;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
    }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = taskStyles;
document.head.appendChild(styleSheet);

// Initialize Task Manager
window.taskManager = new TaskManager();
