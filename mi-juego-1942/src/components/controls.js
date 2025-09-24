const keysPressed = new Set();

function handleKeydown(e) {
    const key = e.key.toLowerCase();
    keysPressed.add(key);
    if (key === ' ') {
        e.preventDefault();
    }
}

function handleKeyup(e) {
    keysPressed.delete(e.key.toLowerCase());
}

export function setupControls() {
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('keyup', handleKeyup);
    
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);
}

export function getKeysPressed() {
    return keysPressed;
}