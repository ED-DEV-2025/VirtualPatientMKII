function initIndexPage() {
  const startBtn = document.getElementById('startBtn');
  startBtn.addEventListener('click', async () => {
    const fileInput = document.getElementById('caseFile');
    const apiKey = document.getElementById('apiKey').value.trim();
    if (!fileInput.files.length) {
      alert('Please upload a patient case file.');
      return;
    }
    if (!apiKey) {
      alert('Please enter your OpenAI API key.');
      return;
    }

    const file = fileInput.files[0];
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      localStorage.setItem('caseData', JSON.stringify(data));
      localStorage.setItem('apiKey', apiKey);
      window.location.href = 'vsp.html';
    } catch (err) {
      alert('Invalid JSON file.');
    }
  });
}

function createSystemPrompt(caseData) {
  return `You are ${caseData.name}, a ${caseData.age} year old patient. Background: ${caseData.background}. Symptoms: ${caseData.symptoms}. Speak in a ${caseData.tone} manner and show a ${caseData.personality} personality. True diagnosis: ${caseData.trueDiagnosis}. Description for context: ${caseData.description}. Stay in character as the patient at all times.`;
}

function initVspPage() {
  const chatDiv = document.getElementById('chat');
  const input = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');

  const stored = localStorage.getItem('caseData');
  const apiKey = localStorage.getItem('apiKey');
  if (!stored || !apiKey) {
    chatDiv.textContent = 'Missing case data or API key.';
    return;
  }
  const caseData = JSON.parse(stored);
  const systemPrompt = createSystemPrompt(caseData);
  const messages = [{ role: 'system', content: systemPrompt }];

  function appendMessage(text, cls) {
    const div = document.createElement('div');
    div.className = 'msg ' + (cls || '');
    div.textContent = text;
    chatDiv.appendChild(div);
    chatDiv.scrollTop = chatDiv.scrollHeight;
  }

  async function sendMessage() {
    const userText = input.value.trim();
    if (!userText) return;
    appendMessage('You: ' + userText, 'user');
    input.value = '';
    messages.push({ role: 'user', content: userText });
    try {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: messages
        })
      });
      const data = await resp.json();
      const reply = data.choices[0].message.content;
      messages.push({ role: 'assistant', content: reply });
      appendMessage('VSP: ' + reply);
    } catch (err) {
      appendMessage('Error contacting OpenAI API.');
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
}
