// Initialize Mermaid with custom theme
mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
        darkMode: true,
        background: '#0a192f',
        primaryColor: '#112240',
        primaryTextColor: '#ccd6f6',
        primaryBorderColor: '#64ffda',
        lineColor: '#8892b0',
        secondaryColor: '#112240',
        tertiaryColor: '#112240'
    }
});

// Chat Simulation Script
document.addEventListener('DOMContentLoaded', () => {
    const chatBody = document.getElementById('chat-body');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    const cannedResponses = {
        "default": "I can verify that for you. Please provide your Order ID.",
        "order": "Order #8821 is currently in transit. Last scan: 'Departed Distribution Center, Chicago' at 08:30 AM. EDA: Tomorrow by 2 PM.",
        "wismo": "To track your order, simply reply with your tracking number or Order ID.",
        "delay": "I see a potential weather delay on Route I-80. We have updated the ETA to +2 hours to be safe.",
        "human": "I understand. I am connecting you with a human agent now. Please hold for a moment... (Agent Sarah joined)"
    };

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        msgDiv.innerHTML = `<p>${text}</p>`;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        // User Message
        addMessage(text, 'user');
        userInput.value = '';

        // Bot Logic Simulation
        setTimeout(() => {
            const lowerText = text.toLowerCase();
            let response = cannedResponses.default;

            if (lowerText.includes('order') || lowerText.includes('track') || lowerText.includes('#')) {
                response = cannedResponses.order;
            } else if (lowerText.includes('where')) {
                response = cannedResponses.wismo;
            } else if (lowerText.includes('delay') || lowerText.includes('late')) {
                response = cannedResponses.delay;
            } else if (lowerText.includes('human') || lowerText.includes('agent')) {
                response = cannedResponses.human;
            }

            addMessage(response, 'bot');
        }, 1000); // 1s delay for realism
    }

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
});
