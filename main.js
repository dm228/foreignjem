const iframe = document.querySelector('.twitch-embed iframe');
        const currentHost = window.location.hostname;
        if (iframe && currentHost) {
            const currentSrc = iframe.getAttribute('src');
            iframe.setAttribute('src', currentSrc.replace('YOUR_DOMAIN_HERE', currentHost));
        } else if (iframe) {
            const currentSrc = iframe.getAttribute('src');
            iframe.setAttribute('src', currentSrc.replace('&parent=YOUR_DOMAIN_HERE', ''));
        }

        // --- Gemini API Integration ---
        const hypeButton = document.getElementById('hype-button');
        const ideaButton = document.getElementById('idea-button');
        const ideaInput = document.getElementById('idea-input');
        const modal = document.getElementById('gemini-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalText = document.getElementById('modal-text');
        const modalCloseButton = document.getElementById('modal-close-button');

        const showModal = (title, content) => {
            modalTitle.textContent = title;
            modalText.innerHTML = content;
            modal.classList.add('visible');
        };

        const hideModal = () => {
            modal.classList.remove('visible');
        };

        const callGeminiAPI = async (prompt) => {
            showModal("Generating...", '<div class="loader"></div>');
            
            let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
            const payload = { contents: chatHistory };
            const apiKey = ""; // API key is handled by the environment
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.statusText}`);
                }

                const result = await response.json();
                
                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    return result.candidates[0].content.parts[0].text;
                } else {
                    console.error("Unexpected API response structure:", result);
                    return "Sorry, I couldn't think of anything right now. Please try again!";
                }
            } catch (error) {
                console.error("Error calling Gemini API:", error);
                return "An error occurred. Please check the console and try again later.";
            }
        };

        hypeButton.addEventListener('click', async () => {
            const prompt = "Generate a short, energetic, and creative hype message for a TikTok battle for a streamer named ForeignJem. Her fans are called the 'Diamond Mine'. Keep it under 150 characters and use lots of emojis. Make it exciting!";
            const result = await callGeminiAPI(prompt);
            showModal("✨ Hype Message ✨", result);
        });

        ideaButton.addEventListener('click', async () => {
            const topic = ideaInput.value.trim();
            if (!topic) {
                showModal("Error", "Please enter a topic for stream ideas.");
                return;
            }
            const prompt = `Generate 3 creative and fun stream or TikTok video ideas for a streamer named ForeignJem. The ideas should be related to the topic: "${topic}". She is known for her energetic personality and her community is called the Diamond Mine. Format the response as a numbered list.`;
            const result = await callGeminiAPI(prompt);
            showModal("✨ Stream Ideas ✨", result);
        });

        modalCloseButton.addEventListener('click', hideModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal();
            }
        });