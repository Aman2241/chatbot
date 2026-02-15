// Initialize Mermaid
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

// Expose function for inline onclick
window.fillInput = function (text) {
    const input = document.getElementById('user-input');
    input.value = text;
    input.focus();
}

document.addEventListener('DOMContentLoaded', () => {
    const chatBody = document.getElementById('chat-body');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const logBody = document.getElementById('logic-logs');

    const responses = {
        "order": {
            text: "Order #8821 is currently in transit. 🚚\n\n**Status:** Departed Distribution Center\n**Location:** Chicago, IL\n**Time:** 08:30 AM today\n**ETA:** Tomorrow by 2:00 PM",
            logs: [
                { type: 'info', msg: '[NLP] Intent detected: TRACK_ORDER' },
                { type: 'action', msg: '[API] GET /tms/orders/8821' },
                { type: 'success', msg: '[DB] Order found: Status=In_Transit' },
                { type: 'info', msg: '[NLG] Generating status summary...' }
            ]
        },
        "wismo": {
            text: "I can help with that. Please provide your **Tracking Number** or **Order ID**.",
            logs: [
                { type: 'info', msg: '[NLP] Intent detected: QUERY_STATUS' },
                { type: 'action', msg: '[SLOT] Missing entity: order_id' },
                { type: 'info', msg: '[DM] Requesting user for ID...' }
            ]
        },
        "delay": {
            text: "I checked the route for Order #8821. ⚠️\n\nThere is a reported weather delay on I-80. We have automatically updated the ETA to **4:00 PM** (+2 hours).",
            logs: [
                { type: 'info', msg: '[NLP] Intent detected: CHECK_DELAY' },
                { type: 'action', msg: '[API] GET /weather/route/I-80' },
                { type: 'action', msg: '[WARN] Severe Weather Alert detected' },
                { type: 'success', msg: '[TMS] Updated ETA calculation' }
            ]
        },
        "reschedule": {
            text: "I can reschedule that for you. Available slots for tomorrow:\n\n1. 10:00 AM - 12:00 PM\n2. 02:00 PM - 04:00 PM\n\nWhich works best?",
            logs: [
                { type: 'info', msg: '[NLP] Intent detected: RESCHEDULE' },
                { type: 'action', msg: '[API] Check availability driver_id=55' },
                { type: 'success', msg: '[DB] Found 2 slots' }
            ]
        },
        "default": {
            text: "I didn't quite catch that. Could you please provide your Order ID or ask about tracking?",
            logs: [
                { type: 'info', msg: '[NLP] Low confidence score (0.42)' },
                { type: 'action', msg: '[Fallback] Triggering default response' }
            ]
        }
    };

    function addLog(type, msg) {
        const div = document.createElement('div');
        div.className = `log-entry ${type}`;
        div.innerText = msg;
        logBody.appendChild(div);
        logBody.scrollTop = logBody.scrollHeight;
    }

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        // Allow formatting
        msgDiv.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTyping() {
        const id = 'typing-' + Date.now();
        const div = document.createElement('div');
        div.className = 'typing';
        div.id = id;
        div.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
        chatBody.appendChild(div);
        chatBody.scrollTop = chatBody.scrollHeight;
        return id;
    }

    function removeTyping(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        userInput.value = '';

        // Simulate AI Brain processing immediately
        addLog('info', '[System] Processing user input...');

        const typingId = showTyping();

        // Determine Response
        const lower = text.toLowerCase();
        let selected = responses.default;

        if (lower.includes('8821') || lower.includes('track')) selected = responses.order;
        else if (lower.includes('where')) selected = responses.wismo;
        else if (lower.includes('delay') || lower.includes('late')) selected = responses.delay;
        else if (lower.includes('reschedule')) selected = responses.reschedule;

        // Simulate Log Stream over time
        let logDelay = 200;
        selected.logs.forEach((log, index) => {
            setTimeout(() => {
                addLog(log.type, log.msg);
            }, logDelay * (index + 1));
        });

        // Response Delay
        setTimeout(() => {
            removeTyping(typingId);
            addMessage(selected.text, 'bot');
        }, 1500);
    }

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
});
