const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');

const conversationHistory = [
    {
        role: "system",
        content: "You are Sup, a friendly and knowledgeable AI tutor from schoolsup.com. Your goal is to make learning fun and accessible. You are patient, encouraging, and you often use light-hearted jokes or fun facts to keep students engaged. You are talking to a student. Keep your answers concise and easy to understand for a young audience (middle to high school). Format your responses with markdown where appropriate for readability."
    }
];

function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Function to add a message to the chat window
function addMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = text;
    chatWindow.appendChild(messageElement);
    scrollToBottom();
    return messageElement;
}

// Function to show a typing indicator
function showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'bot', 'typing');
    typingIndicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    typingIndicator.id = 'typing-indicator';
    chatWindow.appendChild(typingIndicator);
    scrollToBottom();
}

// Function to remove the typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Handle form submission
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = messageInput.value.trim();

    if (userMessage === '') return;

    addMessage('user', userMessage);
    conversationHistory.push({ role: 'user', content: userMessage });
    messageInput.value = '';
    messageInput.focus();

    showTypingIndicator();

    try {
        const messagesToLlm = conversationHistory.slice(-10);

        const completion = await websim.chat.completions.create({
            messages: messagesToLlm,
        });

        const botResponse = completion.content;
        
        conversationHistory.push({ role: 'assistant', content: botResponse });

        removeTypingIndicator();
        addMessage('bot', botResponse);
    } catch (error) {
        console.error('Error fetching AI response:', error);
        removeTypingIndicator();
        addMessage('bot', 'Oops! Something went wrong on my end. Please try again in a moment.');
    }
});

// Initial welcome message
function showWelcomeMessage() {
    const welcomeText = "Hey there! I'm Sup, your friendly AI tutor. Ready to tackle some homework, explore a new topic, or just have a chat? Ask me anything!";
    addMessage('bot', welcomeText);
    conversationHistory.push({ role: 'assistant', content: welcomeText });
}

// Defer welcome message to ensure layout is stable
setTimeout(showWelcomeMessage, 100);

