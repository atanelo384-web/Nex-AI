const chatDisplay = document.getElementById('chat-display');
const userInput = document.getElementById('user-text');
const sendBtn = document.getElementById('send-btn');
const apiKeyInput = document.getElementById('api-key-input');

// Загружаем ключ из памяти браузера при старте
apiKeyInput.value = localStorage.getItem('ai_api_key') || '';

async function callAI() {
    const key = apiKeyInput.value;
    const text = userInput.value;
    
    if (!key) return alert("Пожалуйста, введите API ключ!");
    if (!text) return;

    // Сохраняем ключ
    localStorage.setItem('ai_api_key', key);
    
    // Отображаем сообщение пользователя
    renderMessage(text, 'user-msg');
    userInput.value = '';

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Или "gpt-3.5-turbo"
                messages: [{role: "user", content: text}]
            })
        });

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        renderMessage(aiResponse, 'ai-msg');
    } catch (error) {
        renderMessage("Ошибка: проверьте ключ или соединение.", 'ai-msg');
    }
}

function renderMessage(text, className) {
    const div = document.createElement('div');
    div.className = `message ${className}`;
    div.innerText = text;
    chatDisplay.appendChild(div);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

sendBtn.addEventListener('click', callAI);
// Отправка по Enter
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') callAI();
});
