
// Example 1: Fetch initial setup data (like greetings or suggestions)
export const fetchInitialData = async () => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        greeting: "Welcome to Nexora AI",
        description: "Blazing‑fast AI powered by Groq. Ask me anything — write code, brainstorm ideas, or learn something new.",
        suggestions: [
          { icon: "Code", text: "Write a Python script" },
          { icon: "FileText", text: "Summarize an article" },
          { icon: "Lightbulb", text: "Explain quantum computing" }
        ]
      });
    }, 800);
  });
};

// Example 2: Send a chat message to the API
export const sendChatMessage = async ({ messages, model }) => {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model || 'llama3-8b-8192',
      messages
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch chat completion');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

// Generate a short chat title from the first user message
export const generateChatTitle = async (firstMessage) => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content:
              "You generate short chat titles. Reply with ONLY a 3-6 word title summarizing the user's message. No quotes, no punctuation at the end, no explanation, no extra text.",
          },
          { role: "user", content: firstMessage },
        ],
        temperature: 0.3,
        reasoning_effort: "low",
        max_tokens: 150,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating chat title:', error);
    return 'New Chat';
  }
};

// Example 3: Fetch available models from Groq API
export const fetchModels = async () => {
  const response = await fetch('https://api.groq.com/openai/v1/models', {
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch models');
  }
  
  const data = await response.json();
  
  // Filter out non-text models like Whisper (audio-to-text) or LLaVA (vision)
  // so only pure text-in/text-out chat completion models appear in the dropdown.
  return data.data.filter((model) => 
    !model.id.toLowerCase().includes('whisper') &&
    !model.id.toLowerCase().includes('llava')
  );
};
