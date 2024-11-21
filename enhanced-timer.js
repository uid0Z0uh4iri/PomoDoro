// enhanced-timer.js
class EnhancedPomodoroTimer extends PomodoroTimer {
    constructor() {
        super();
        this.setupProgressRing();
        this.setupSoundEffects();
        this.setupCustomControls();
    }

    setupProgressRing() {
        // Add progress ring container
        const timerContainer = document.querySelector('.timer-container');
        timerContainer.innerHTML = `
            <svg class="progress-ring" width="300" height="300">
                <circle
                    class="progress-ring__circle"
                    stroke="#6366f1"
                    stroke-width="8"
                    fill="transparent"
                    r="120"
                    cx="150"
                    cy="150"/>
            </svg>
            <div class="timer">25:00</div>
        `;

        this.circle = document.querySelector('.progress-ring__circle');
        this.timerDisplay = document.querySelector('.timer');
        
        // Calculate circle properties
        const radius = this.circle.r.baseVal.value;
        this.circumference = radius * 2 * Math.PI;
        this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.circle.style.strokeDashoffset = this.circumference;
    }

    setupCustomControls() {
        // Add settings panel
        const container = document.querySelector('.container');
        const controlsHtml = `
            <div class="settings-panel">
                <div class="duration-control">
                    <label>Work Duration (minutes):</label>
                    <input type="number" id="workDuration" value="25" min="1" max="60">
                </div>
                <div class="duration-control">
                    <label>Sound:</label>
                    <button class="sound-toggle active" id="soundToggle">
                        🔊
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('afterbegin', controlsHtml);

        // Setup event listeners
        document.getElementById('workDuration').addEventListener('change', (e) => {
            const newDuration = parseInt(e.target.value);
            if (newDuration > 0 && newDuration <= 60) {
                this.timeLeft = newDuration * 60;
                this.updateDisplay();
            }
        });

        document.getElementById('soundToggle').addEventListener('click', (e) => {
            e.target.classList.toggle('active');
            this.soundEnabled = e.target.classList.contains('active');
        });
    }

    updateDisplay() {
        super.updateDisplay();
        // Update progress ring
        const offset = this.circumference - (this.timeLeft / (25 * 60)) * this.circumference;
        this.circle.style.strokeDashoffset = offset;
    }

    setupSoundEffects() {
        this.soundEnabled = true;
        this.sounds = {
            tick: new Audio('data:audio/wav;base64,UklGRnQGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YU8GAAC...'), // shortened for brevity
            complete: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YVEGAAC...')  // shortened for brevity
        };
    }

    updateTimer() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            if (this.soundEnabled && this.timeLeft % 60 === 0) {
                this.sounds.tick.play();
            }
            this.updateDisplay();
        } else {
            this.completePomodoro();
        }
    }

    completePomodoro() {
        super.completePomodoro();
        if (this.soundEnabled) {
            this.sounds.complete.play();
        }
    }
}

// Initialize the enhanced timer
document.addEventListener('DOMContentLoaded', () => {
    window.pomodoro = new EnhancedPomodoroTimer();
});
