class ModernKeyboard {
    constructor() {
        this.output = document.getElementById('output');
        this.keyboard = document.getElementById('keyboard');
        this.capsLock = false;
        this.shift = false;
        this.soundEnabled = true;
        this.theme = 'default';
        this.predictionsEnabled = true;
        this.voiceEnabled = false;
        this.wordHistory = [];
        this.commonWords = ['the', 'and', 'you', 'that', 'was', 'for', 'are', 'with', 'his', 'they'];
        this.emojis = ['😀', '😂', '😍', '🤔', '👍', '❤️', '🔥', '💯', '🎉', '🚀', '⭐', '💡', '🎵', '🌟', '✨', '🎯'];
        this.quizMode = false;
        this.learningMode = false;
        this.currentQuiz = null;
        this.quizWords = ['hello', 'world', 'keyboard', 'typing', 'practice', 'speed', 'accuracy', 'learning'];
        this.lessons = [
            { title: 'Home Row Keys', keys: 'asdf jkl;', text: 'asdf jkl; asdf jkl;' },
            { title: 'Top Row Keys', keys: 'qwer tyui op', text: 'qwer tyui op qwer tyui' },
            { title: 'Bottom Row Keys', keys: 'zxcv bnm', text: 'zxcv bnm zxcv bnm' },
            { title: 'Numbers', keys: '1234567890', text: '123 456 789 012 345' },
            { title: 'Common Words', keys: 'the and you', text: 'the quick brown fox jumps' }
        ];
        this.init();
    }

    init() {
        this.createKeyboard();
        this.bindEvents();
        this.setupControls();
        this.loadSettings();
        this.createEmojiPanel();
        this.createPredictionBar();
        this.setupVoiceRecognition();
        this.createQuizModal();
        this.createLearningPanel();
    }

    setupControls() {
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        document.getElementById('soundToggle').addEventListener('click', () => this.toggleSound());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearText());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyText());
        document.getElementById('voiceBtn').addEventListener('click', () => this.toggleVoice());
        document.getElementById('predictBtn').addEventListener('click', () => this.togglePredictions());
        document.getElementById('emojiBtn').addEventListener('click', () => this.toggleEmoji());
        document.getElementById('quizBtn').addEventListener('click', () => this.startQuiz());
        document.getElementById('learnBtn').addEventListener('click', () => this.toggleLearning());
    }

    toggleTheme() {
        const themes = ['default', 'dark', 'light'];
        const currentIndex = themes.indexOf(this.theme);
        this.theme = themes[(currentIndex + 1) % themes.length];
        
        document.body.className = this.theme === 'default' ? '' : this.theme;
        this.saveSettings();
        this.playSound(800, 100);
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const btn = document.getElementById('soundToggle');
        btn.textContent = this.soundEnabled ? '🔊' : '🔇';
        this.saveSettings();
        if (this.soundEnabled) this.playSound(600, 100);
    }

    clearText() {
        this.output.value = '';
        this.playSound(400, 150);
    }

    copyText() {
        navigator.clipboard.writeText(this.output.value).then(() => {
            this.showNotification('Text copied!');
            this.playSound(700, 100);
        });
    }

    playSound(frequency, duration) {
        if (!this.soundEnabled) return;
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: rgba(0,0,0,0.8);
            color: white; padding: 10px 20px; border-radius: 5px; z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    saveSettings() {
        localStorage.setItem('keyboardSettings', JSON.stringify({
            theme: this.theme,
            soundEnabled: this.soundEnabled,
            predictionsEnabled: this.predictionsEnabled
        }));
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('keyboardSettings') || '{}');
        this.theme = settings.theme || 'default';
        this.soundEnabled = settings.soundEnabled !== false;
        this.predictionsEnabled = settings.predictionsEnabled !== false;
        
        document.body.className = this.theme === 'default' ? '' : this.theme;
        document.getElementById('soundToggle').textContent = this.soundEnabled ? '🔊' : '🔇';
        document.getElementById('predictBtn').style.opacity = this.predictionsEnabled ? '1' : '0.5';
    }

    createKeyboard() {
        const isMobile = window.innerWidth <= 768;
        const isSmallMobile = window.innerWidth <= 480;
        
        const layout = [
            [
                { key: '`', shift: '~' }, { key: '1', shift: '!' }, { key: '2', shift: '@' }, 
                { key: '3', shift: '#' }, { key: '4', shift: '$' }, { key: '5', shift: '%' }, 
                { key: '6', shift: '^' }, { key: '7', shift: '&' }, { key: '8', shift: '*' }, 
                { key: '9', shift: '(' }, { key: '0', shift: ')' }, { key: '-', shift: '_' }, 
                { key: '=', shift: '+' }, { key: 'Backspace', class: 'function backspace', span: isSmallMobile ? 1 : 2 }
            ],
            [
                { key: 'Tab', class: 'modifier tab', span: isSmallMobile ? 1 : 2 }, { key: 'q' }, { key: 'w' }, 
                { key: 'e' }, { key: 'r' }, { key: 't' }, { key: 'y' }, { key: 'u' }, 
                { key: 'i' }, { key: 'o' }, { key: 'p' }, { key: '[', shift: '{' }, 
                { key: ']', shift: '}' }, { key: '\\', shift: '|' }
            ],
            [
                { key: 'Caps', class: 'modifier caps', span: isSmallMobile ? 1 : 2 }, { key: 'a' }, { key: 's' }, 
                { key: 'd' }, { key: 'f' }, { key: 'g' }, { key: 'h' }, { key: 'j' }, 
                { key: 'k' }, { key: 'l' }, { key: ';', shift: ':' }, { key: "'", shift: '"' }, 
                { key: 'Enter', class: 'function enter', span: isSmallMobile ? 1 : 2 }
            ],
            [
                { key: 'Shift', class: 'modifier shift-left', span: isSmallMobile ? 1 : 2 }, { key: 'z' }, 
                { key: 'x' }, { key: 'c' }, { key: 'v' }, { key: 'b' }, { key: 'n' }, 
                { key: 'm' }, { key: ',', shift: '<' }, { key: '.', shift: '>' }, 
                { key: '/', shift: '?' }, { key: 'Shift', class: 'modifier shift-right', span: isSmallMobile ? 1 : 3 }
            ],
            [
                { key: 'Ctrl', class: 'modifier ctrl', span: isSmallMobile ? 1 : 2 }, { key: 'Alt', class: 'modifier' }, 
                { key: ' ', class: 'space', span: isSmallMobile ? (window.innerWidth <= 360 ? 2 : 3) : 6, display: 'Space' }, 
                { key: 'Alt', class: 'modifier' }, { key: 'Ctrl', class: 'modifier ctrl', span: isSmallMobile ? 1 : 2 }
            ]
        ];

        layout.forEach(row => {
            row.forEach(keyData => {
                const button = document.createElement('button');
                button.className = `key ${keyData.class || ''}`;
                button.textContent = keyData.display || keyData.key;
                button.dataset.key = keyData.key;
                button.dataset.shift = keyData.shift || '';
                
                if (keyData.span) {
                    button.style.gridColumn = `span ${keyData.span}`;
                }

                button.addEventListener('click', () => this.handleKeyPress(keyData.key));
                this.keyboard.appendChild(button);
            });
        });
        
        window.addEventListener('resize', () => {
            if (Math.abs(window.innerWidth - this.lastWidth) > 100) {
                this.lastWidth = window.innerWidth;
                this.keyboard.innerHTML = '';
                this.createKeyboard();
            }
        });
        
        this.lastWidth = window.innerWidth;
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            this.handlePhysicalKey(e);
        });

        document.addEventListener('keyup', (e) => {
            this.removeKeyHighlight(e.key);
        });
    }

    handlePhysicalKey(e) {
        e.preventDefault();
        this.highlightKey(e.key);
        this.handleKeyPress(e.key);
    }

    handleKeyPress(key) {
        const currentValue = this.output.value;
        
        switch(key.toLowerCase()) {
            case 'backspace':
                this.output.value = currentValue.slice(0, -1);
                this.playSound(300, 100);
                break;
            case 'enter':
                this.output.value = currentValue + '\n';
                this.playSound(500, 150);
                break;
            case 'tab':
                this.output.value = currentValue + '\t';
                this.playSound(450, 100);
                break;
            case 'caps':
                this.capsLock = !this.capsLock;
                this.updateCapsLock();
                this.playSound(600, 100);
                break;
            case 'shift':
                this.shift = !this.shift;
                this.updateShift();
                this.playSound(550, 100);
                break;
            case ' ':
                this.output.value = currentValue + ' ';
                this.playSound(400, 80);
                break;
            case 'ctrl':
            case 'alt':
                this.playSound(350, 80);
                break;
            default:
                if (key.length === 1) {
                    let char = key;
                    if (this.capsLock || this.shift) {
                        char = this.getShiftedChar(key);
                    }
                    this.output.value = currentValue + char;
                    this.playSound(Math.random() * 200 + 400, 80);
                    this.updatePredictions();
                    if (this.shift) {
                        this.shift = false;
                        this.updateShift();
                    }
                }
                break;
        }
        
        this.output.scrollTop = this.output.scrollHeight;
    }

    getShiftedChar(key) {
        const shiftMap = {
            '`': '~', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
            '6': '^', '7': '&', '8': '*', '9': '(', '0': ')', '-': '_',
            '=': '+', '[': '{', ']': '}', '\\': '|', ';': ':', "'": '"',
            ',': '<', '.': '>', '/': '?'
        };

        if (shiftMap[key]) {
            return shiftMap[key];
        }
        
        if (key.match(/[a-z]/)) {
            return key.toUpperCase();
        }
        
        return key;
    }

    highlightKey(key) {
        const keyElement = this.findKeyElement(key);
        if (keyElement) {
            keyElement.classList.add('pressed');
        }
    }

    removeKeyHighlight(key) {
        const keyElement = this.findKeyElement(key);
        if (keyElement) {
            keyElement.classList.remove('pressed');
        }
    }

    findKeyElement(key) {
        const normalizedKey = key.toLowerCase();
        return Array.from(this.keyboard.querySelectorAll('.key')).find(el => {
            const elKey = el.dataset.key.toLowerCase();
            return elKey === normalizedKey || 
                   (normalizedKey === ' ' && elKey === ' ') ||
                   (normalizedKey === 'capslock' && elKey === 'caps');
        });
    }

    updateCapsLock() {
        const capsKey = this.keyboard.querySelector('[data-key="Caps"]');
        if (capsKey) {
            capsKey.style.background = this.capsLock ? 
                'linear-gradient(145deg, #ff9800, #f57c00)' : '';
        }
    }

    updateShift() {
        const shiftKeys = this.keyboard.querySelectorAll('[data-key="Shift"]');
        shiftKeys.forEach(key => {
            key.style.background = this.shift ? 
                'linear-gradient(145deg, #ff9800, #f57c00)' : '';
        });
    }

    createEmojiPanel() {
        const panel = document.createElement('div');
        panel.className = 'emoji-panel';
        panel.id = 'emojiPanel';
        
        this.emojis.forEach(emoji => {
            const btn = document.createElement('button');
            btn.className = 'emoji';
            btn.textContent = emoji;
            btn.addEventListener('click', () => {
                this.output.value += emoji;
                this.playSound(500, 100);
            });
            panel.appendChild(btn);
        });
        
        document.querySelector('.controls').style.position = 'relative';
        document.querySelector('.controls').appendChild(panel);
    }

    createPredictionBar() {
        const bar = document.createElement('div');
        bar.className = 'prediction-bar';
        bar.id = 'predictionBar';
        bar.style.display = 'none';
        document.querySelector('.display').appendChild(bar);
    }

    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.output.value += transcript + ' ';
                this.hideVoiceIndicator();
                this.playSound(600, 200);
            };
            
            this.recognition.onerror = () => {
                this.hideVoiceIndicator();
                this.showNotification('Voice recognition error');
            };
        }
    }

    toggleVoice() {
        if (!this.recognition) {
            this.showNotification('Voice recognition not supported');
            return;
        }
        
        if (this.voiceEnabled) {
            this.recognition.stop();
            this.hideVoiceIndicator();
        } else {
            this.recognition.start();
            this.showVoiceIndicator();
        }
        
        this.voiceEnabled = !this.voiceEnabled;
        this.playSound(700, 100);
    }

    togglePredictions() {
        this.predictionsEnabled = !this.predictionsEnabled;
        const bar = document.getElementById('predictionBar');
        bar.style.display = this.predictionsEnabled ? 'flex' : 'none';
        
        const btn = document.getElementById('predictBtn');
        btn.style.opacity = this.predictionsEnabled ? '1' : '0.5';
        
        this.playSound(500, 100);
        this.showNotification(`Predictions ${this.predictionsEnabled ? 'enabled' : 'disabled'}`);
    }

    toggleEmoji() {
        const panel = document.getElementById('emojiPanel');
        panel.classList.toggle('show');
        this.playSound(600, 100);
    }

    showVoiceIndicator() {
        let indicator = document.getElementById('voiceIndicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'voiceIndicator';
            indicator.className = 'voice-indicator';
            indicator.textContent = '🎤';
            document.body.appendChild(indicator);
        }
        indicator.style.display = 'block';
    }

    hideVoiceIndicator() {
        const indicator = document.getElementById('voiceIndicator');
        if (indicator) indicator.style.display = 'none';
    }

    updatePredictions() {
        if (!this.predictionsEnabled) return;
        
        const words = this.output.value.split(' ');
        const currentWord = words[words.length - 1].toLowerCase();
        
        if (currentWord.length < 2) return;
        
        const predictions = this.commonWords
            .filter(word => word.startsWith(currentWord) && word !== currentWord)
            .slice(0, 3);
        
        const bar = document.getElementById('predictionBar');
        bar.innerHTML = '';
        
        predictions.forEach(word => {
            const btn = document.createElement('button');
            btn.className = 'prediction';
            btn.textContent = word;
            btn.addEventListener('click', () => {
                const words = this.output.value.split(' ');
                words[words.length - 1] = word;
                this.output.value = words.join(' ') + ' ';
                this.playSound(450, 100);
                bar.innerHTML = '';
            });
            bar.appendChild(btn);
        });
    }

    createQuizModal() {
        const modal = document.createElement('div');
        modal.className = 'quiz-modal';
        modal.id = 'quizModal';
        modal.innerHTML = `
            <div class="quiz-content">
                <h2>Typing Quiz</h2>
                <div class="quiz-question" id="quizQuestion">Type the word:</div>
                <input type="text" class="quiz-input" id="quizInput" placeholder="Type here...">
                <div class="quiz-buttons">
                    <button class="quiz-btn primary" id="submitQuiz">Submit</button>
                    <button class="quiz-btn secondary" id="closeQuiz">Close</button>
                </div>
                <div id="quizScore">Score: 0/0</div>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('submitQuiz').addEventListener('click', () => this.checkQuizAnswer());
        document.getElementById('closeQuiz').addEventListener('click', () => this.closeQuiz());
        document.getElementById('quizInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.checkQuizAnswer();
        });
    }

    createLearningPanel() {
        const panel = document.createElement('div');
        panel.className = 'learn-panel';
        panel.id = 'learnPanel';
        
        this.lessons.forEach((lesson, index) => {
            const lessonDiv = document.createElement('div');
            lessonDiv.className = 'lesson';
            lessonDiv.innerHTML = `
                <h4>${lesson.title}</h4>
                <p>Keys: ${lesson.keys}</p>
            `;
            lessonDiv.addEventListener('click', () => this.startLesson(index));
            panel.appendChild(lessonDiv);
        });
        
        document.querySelector('.controls').appendChild(panel);
    }

    startQuiz() {
        this.quizMode = true;
        this.currentQuiz = {
            currentWord: 0,
            score: 0,
            total: 5,
            words: this.shuffleArray([...this.quizWords]).slice(0, 5)
        };
        
        document.getElementById('quizModal').style.display = 'flex';
        this.showNextQuizWord();
        this.playSound(600, 100);
    }

    showNextQuizWord() {
        if (this.currentQuiz.currentWord >= this.currentQuiz.total) {
            this.endQuiz();
            return;
        }
        
        const word = this.currentQuiz.words[this.currentQuiz.currentWord];
        document.getElementById('quizQuestion').textContent = `Type: "${word}"`;
        document.getElementById('quizInput').value = '';
        document.getElementById('quizInput').focus();
        document.getElementById('quizScore').textContent = 
            `Score: ${this.currentQuiz.score}/${this.currentQuiz.currentWord}`;
    }

    checkQuizAnswer() {
        const input = document.getElementById('quizInput').value.trim();
        const correctWord = this.currentQuiz.words[this.currentQuiz.currentWord];
        
        if (input.toLowerCase() === correctWord.toLowerCase()) {
            this.currentQuiz.score++;
            this.playSound(700, 150);
            this.showNotification('Correct! ✅');
        } else {
            this.playSound(300, 200);
            this.showNotification(`Wrong! Correct: "${correctWord}" ❌`);
        }
        
        this.currentQuiz.currentWord++;
        setTimeout(() => this.showNextQuizWord(), 1000);
    }

    endQuiz() {
        const percentage = Math.round((this.currentQuiz.score / this.currentQuiz.total) * 100);
        document.getElementById('quizQuestion').innerHTML = 
            `Quiz Complete!<br>Score: ${this.currentQuiz.score}/${this.currentQuiz.total} (${percentage}%)`;
        document.getElementById('quizInput').style.display = 'none';
        document.getElementById('submitQuiz').textContent = 'New Quiz';
        document.getElementById('submitQuiz').onclick = () => {
            document.getElementById('quizInput').style.display = 'block';
            document.getElementById('submitQuiz').textContent = 'Submit';
            document.getElementById('submitQuiz').onclick = () => this.checkQuizAnswer();
            this.startQuiz();
        };
    }

    closeQuiz() {
        document.getElementById('quizModal').style.display = 'none';
        this.quizMode = false;
        this.playSound(400, 100);
    }

    toggleLearning() {
        const panel = document.getElementById('learnPanel');
        panel.classList.toggle('show');
        this.learningMode = panel.classList.contains('show');
        this.playSound(500, 100);
    }

    startLesson(lessonIndex) {
        const lesson = this.lessons[lessonIndex];
        this.output.value = '';
        this.output.placeholder = `Practice: ${lesson.text}`;
        this.showNotification(`Started: ${lesson.title}`);
        this.toggleLearning();
        this.playSound(600, 150);
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}

// Initialize the keyboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ModernKeyboard();
});