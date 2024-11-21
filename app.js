// app.js
class PomodoroTimer {
    constructor() {
        // Éléments du DOM
        this.timerDisplay = document.querySelector('.timer');
        this.startButton = document.getElementById('start');
        this.pauseButton = document.getElementById('pause');
        this.resetButton = document.getElementById('reset');
        this.taskInput = document.querySelector('.task-input');

        // Variables du timer
        this.timeLeft = 25 * 60; // 25 minutes en secondes
        this.timerId = null;
        this.isRunning = false;

        // Stats
        this.todayStats = {
            pomodorosCompleted: 0,
            totalWorkTime: 0,
            productivity: 0
        };

        // Initialisation des événements
        this.initializeEventListeners();
        this.loadStats();
    }

    initializeEventListeners() {
        this.startButton.addEventListener('click', () => this.startTimer());
        this.pauseButton.addEventListener('click', () => this.pauseTimer());
        this.resetButton.addEventListener('click', () => this.resetTimer());

        // Demander la permission pour les notifications
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }

    startTimer() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startButton.disabled = true;
            this.timerId = setInterval(() => this.updateTimer(), 1000);
        }
    }

    pauseTimer() {
        this.isRunning = false;
        this.startButton.disabled = false;
        clearInterval(this.timerId);
    }

    resetTimer() {
        this.pauseTimer();
        this.timeLeft = 25 * 60;
        this.updateDisplay();
    }

    updateTimer() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateDisplay();
        } else {
            this.completePomodoro();
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    completePomodoro() {
        this.pauseTimer();
        this.showNotification();
        this.updateStats();
        this.saveStats();
    }

    showNotification() {
        if (Notification.permission === 'granted') {
            new Notification('Pomodoro Terminé!', {
                body: 'Temps de faire une pause!',
                icon: '/icon.png'
            });
        }
    }

    updateStats() {
        this.todayStats.pomodorosCompleted++;
        this.todayStats.totalWorkTime += 25;
        this.todayStats.productivity = Math.min(
            (this.todayStats.pomodorosCompleted * 100) / 8, 
            100
        );
        this.displayStats();
    }

    displayStats() {
        const statCards = document.querySelectorAll('.stat-value');
        statCards[0].textContent = this.todayStats.pomodorosCompleted;
        statCards[1].textContent = `${Math.round(this.todayStats.productivity)}%`;
        statCards[2].textContent = `${this.todayStats.totalWorkTime}m`;
    }

    saveStats() {
        localStorage.setItem('pomodoroStats', JSON.stringify(this.todayStats));
    }

    loadStats() {
        const savedStats = localStorage.getItem('pomodoroStats');
        if (savedStats) {
            this.todayStats = JSON.parse(savedStats);
            this.displayStats();
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const pomodoro = new PomodoroTimer();
});
