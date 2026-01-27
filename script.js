class ModernKeyboard {
    constructor() {
        this.output = document.getElementById('output');
        this.keyboard = document.getElementById('keyboard');
        this.capsLock = false;
        this.shift = false;
        this.init();
    }

    init() {
        this.createKeyboard();
        this.bindEvents();
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
        
        // Add resize listener for responsive updates
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
                break;
            case 'enter':
                this.output.value = currentValue + '\n';
                break;
            case 'tab':
                this.output.value = currentValue + '\t';
                break;
            case 'caps':
                this.capsLock = !this.capsLock;
                this.updateCapsLock();
                break;
            case 'shift':
                this.shift = !this.shift;
                this.updateShift();
                break;
            case ' ':
                this.output.value = currentValue + ' ';
                break;
            case 'ctrl':
            case 'alt':
                // Modifier keys - no action needed
                break;
            default:
                if (key.length === 1) {
                    let char = key;
                    if (this.capsLock || this.shift) {
                        char = this.getShiftedChar(key);
                    }
                    this.output.value = currentValue + char;
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
}

// Initialize the keyboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ModernKeyboard();
});