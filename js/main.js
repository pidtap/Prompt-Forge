document.addEventListener('DOMContentLoaded', () => {
    // --- Lấy các phần tử DOM ---
    const generatePromptBtn = document.getElementById('generate-prompt-btn');
    const promptOutputContainer = document.getElementById('prompt-output-container');
    const promptOutputVi = document.getElementById('prompt-output-vi');
    const promptOutputEn = document.getElementById('prompt-output-en');
    const copyPromptBtn = document.getElementById('copy-prompt-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const modal = document.getElementById('settings-modal');
    const closeBtn = document.querySelector('.close-btn');
    const geminiApiKeyInput = document.getElementById('gemini-api-key-input');
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');
    const customAlertModal = document.getElementById('custom-alert-modal');
    const customAlertText = document.getElementById('custom-alert-text');
    const customAlertCloseBtn = document.getElementById('custom-alert-close-btn');
    const alertContent = customAlertModal.querySelector('.alert-content');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const mainContent = document.querySelector('main');
    const ideaInput = document.getElementById('idea-input');
    const prehistoricCheckboxIdea = document.getElementById('prehistoric-checkbox-idea');
    const imageAnalysisFileInput = document.getElementById('image-analysis-file');
    const analysisOptions = document.getElementById('analysis-options');
    const changeStyleSelect = document.getElementById('change-style-select');
    const changeDetailsTextarea = document.getElementById('change-details-textarea');
    const prehistoricCheckboxAnalysis = document.getElementById('prehistoric-checkbox-analysis');

    // --- CÁC HÀM TIỆN ÍCH ---
    function showCustomAlert(message, type = 'info') {
        customAlertText.textContent = message;
        alertContent.className = 'modal-content alert-content ' + type;
        customAlertModal.style.display = 'flex';
    }

    function resetImageUpload(fileInput) {
        const uploadBox = fileInput.closest('.image-upload-box');
        if (!uploadBox) return;
        const preview = uploadBox.querySelector('.image-preview');
        const filenameLabel = uploadBox.querySelector('.file-label span');
        fileInput.value = '';
        if(preview) preview.src = '';
        if(uploadBox) uploadBox.classList.remove('has-image');
        if (filenameLabel) filenameLabel.textContent = filenameLabel.dataset.defaultText || '...';
        if (fileInput.id === 'image-analysis-file') analysisOptions.classList.add('hidden');
    }

    function setupImagePreview(fileInputId) {
        const fileInput = document.getElementById(fileInputId);
        if (!fileInput) return;
        const uploadBox = fileInput.closest('.image-upload-box');
        const preview = uploadBox.querySelector('.image-preview');
        const filenameLabel = uploadBox.querySelector('.file-label span');
        if (filenameLabel) filenameLabel.dataset.defaultText = filenameLabel.textContent;
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.src = e.target.result;
                    uploadBox.classList.add('has-image');
                    if (fileInputId === 'image-analysis-file') analysisOptions.classList.remove('hidden');
                };
                reader.readAsDataURL(file);
                if (filenameLabel) filenameLabel.textContent = file.name;
            } else {
                resetImageUpload(fileInput);
            }
        });
    }

    async function fileToGenerativePart(file) {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        });
        return { inlineData: { data: await base64EncodedDataPromise, mimeType: file.type } };
    }
    
    // --- CÀI ĐẶT EVENT LISTENERS BAN ĐẦU ---
    customAlertCloseBtn.addEventListener('click', () => { customAlertModal.style.display = 'none'; });
    window.addEventListener('click', (event) => { if (event.target == customAlertModal || event.target == modal) { customAlertModal.style.display = 'none'; modal.style.display = 'none'; } });
    
    settingsBtn.addEventListener('click', () => {
        geminiApiKeyInput.value = localStorage.getItem('geminiApiKey') || '';
        modal.style.display = 'flex';
    });
    
    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    
    saveApiKeyBtn.addEventListener('click', () => {
        localStorage.setItem('geminiApiKey', geminiApiKeyInput.value.trim());
        modal.style.display = 'none';
        showCustomAlert('Khóa API Gemini đã được lưu!', 'success');
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const targetTab = button.getAttribute('data-tab');
            tabPanes.forEach(pane => pane.classList.toggle('active', pane.id === targetTab));
        });
    });
    ['image-analysis-file'].forEach(setupImagePreview);
    mainContent.addEventListener('click', (event) => {
        const deleteBtn = event.target.closest('.delete-image-btn');
        if (deleteBtn) {
            const uploadBox = deleteBtn.closest('.image-upload-box');
            const fileInput = uploadBox.querySelector('.file-input');
            resetImageUpload(fileInput);
        }
    });

    // --- LOGIC GỌI API (TÁCH BIỆT) ---
    async function callGeminiAPI(parts) {
        const geminiApiKey = localStorage.getItem('geminiApiKey');
        if (!geminiApiKey) {
            throw new Error('Vui lòng vào "Quản lý Khóa API" để nhập Khóa API Gemini!');
        }
        const model = 'gemini-1.5-flash-latest';
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`;
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts }] }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message || 'Lỗi từ API Gemini.');
        }
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    // --- CHỨC NĂNG CHÍNH: TẠO PROMPT ---
    generatePromptBtn.addEventListener('click', async () => {
        promptOutputContainer.classList.add('hidden');
        
        const geminiApiKey = localStorage.getItem('geminiApiKey');
        if (!geminiApiKey) {
            return showCustomAlert('Vui lòng vào "Quản lý Khóa API" để nhập Khóa API Gemini!', 'error');
        }

        let partsForGemini = [];
        
        try {
            const outputRequirement = `\n\n**Output Rules**:\n1. For each language, combine all descriptions into a single, continuous block of text. **Absolutely DO NOT include any titles, headings, or markdown bullet points** (like "Face:", "Body:", etc.) in the final output.\n2. You MUST reply with ONLY a valid JSON object containing two keys: "vietnamese" and "english". Do not include markdown formatting like \`\`\`json.`;

            const generalStructure = `
                Your task is to generate a detailed, flowing paragraph. Start with a concise summary sentence (e.g., "Ultra-realistic portrait of a..."). Then, seamlessly weave in the following details into the subsequent sentences:
                - **Subject Description**: Describe the face (shape, skin, eyes, nose, lips, expression), hair (style, color, accessories), body & physique (estimated age, height, weight, build like slender, muscular, etc.), and clothing & accessories (detailed description of materials, patterns, and items like jewelry or weapons).
                - **Pose & Action**: Clearly describe the subject's posture and what they are doing.
                - **Background**: Detail the surrounding environment, objects, and overall atmosphere.
                - **Style & Lighting**: List keywords for the artistic style (e.g., ultra-realistic, cinematic, photorealistic 8K) and the lighting (e.g., soft natural daylight, dramatic lighting).
                - **Negative Prompt**: List keywords to avoid (e.g., cartoon, anime, blurry, low quality, watermark, text).`;

            const prehistoricHumanStructure = `
                Your task is to generate a detailed, flowing paragraph with a scientific tone. Start with a concise summary sentence (e.g., "Prehistoric hominin, paleoanthropological reconstruction of..."). Then, seamlessly weave in the following details into the subsequent sentences:
                - **Subject Description (Morphology)**: Describe the head & face (scientific features like supraorbital torus, sloping forehead, prognathic jaw), hair & fur (wild, unkept), and body (overall build like short and stocky, primitive proportions like long arms/short legs, stooped posture).
                - **Clothing & Tools**: Describe primitive clothing (animal hides) and tools (stone, wood).
                - **Pose & Action**: Describe their stance, posture, or actions like hunting or tool-making.
                - **Background**: Detail the prehistoric environment like a cave entrance, savanna, or forest.
                - **Style & Lighting**: List keywords like: scientific anthropological reconstruction, gritty realism, hyper-detailed, raw natural lighting.
                - **Negative Prompt**: List keywords to avoid (e.g., modern human, handsome symmetrical face, gym body, clean skin, cartoon).`;

            const prehistoricAnimalStructure = `
                Your task is to generate a detailed, flowing paragraph with a paleontological tone. Start with a concise summary sentence (e.g., "Prehistoric dinosaur, Tyrannosaurus rex, paleontological reconstruction..."). Then, seamlessly weave in the following details:
                - **Subject Description (Anatomy)**: Describe the species, skull, teeth/tusks, skin (scales, fur, feathers), body (massive, powerful, robust), limbs, and tail.
                - **Pose & Action**: Describe its action, such as roaring, hunting, walking, or standing dominantly.
                - **Background**: Detail the prehistoric environment, such as a Jurassic jungle, Ice Age tundra, lush plains with volcanoes.
                - **Style & Lighting**: List keywords like: scientific paleoart realism, cinematic photorealism, hyper-detailed, dramatic shadows, natural lighting.
                - **Negative Prompt**: List keywords to avoid (e.g., fantasy dragon, cartoon, toy-like, modern animals, unrealistic anatomy).`;

            let mainInstruction;
            const activeTabId = document.querySelector('.tab-pane.active').id;

            if (activeTabId === 'tab-idea') {
                const idea = ideaInput.value.trim();
                if (!idea) return showCustomAlert("Vui lòng nhập ý tưởng của bạn!", 'error');
                const usePrehistoric = prehistoricCheckboxIdea.checked;

                if (usePrehistoric) {
                     mainInstruction = `Analyze the user's idea: "${idea}". The user wants a PREHISTORIC theme.
                    First, determine if the subject is a PREHISTORIC HUMAN (hominin) or a PREHISTORIC ANIMAL/DINOSAUR.
                    - If the subject is an animal or dinosaur (e.g., 'T-rex', 'mammoth', 'sabertooth'), you MUST use the 'Prehistoric Animal Structure'.
                    - If the subject is a human or hominin (e.g., 'Neanderthal', 'caveman', 'Homo erectus'), you MUST use the 'Prehistoric Human Structure'.
                    - If unsure, analyze the keywords to make the best choice.

                    Here are the structures:
                    ---
                    [Prehistoric Human Structure]: ${prehistoricHumanStructure}
                    ---
                    [Prehistoric Animal Structure]: ${prehistoricAnimalStructure}
                    ---
                    ${outputRequirement}`;
                } else {
                    mainInstruction = `Based on the user's idea: "${idea}", you MUST strictly follow the 'General Structure' to generate the prompt.\n\n[General Structure]: ${generalStructure}\n${outputRequirement}`;
                }
                partsForGemini.push({ text: mainInstruction });

            } else if (activeTabId === 'tab-image-analysis') {
                // ... (logic for image analysis remains the same)
                const imageFile = imageAnalysisFileInput.files[0];
                if (!imageFile) return showCustomAlert("Vui lòng tải lên một ảnh!", 'error');
                const newStyle = changeStyleSelect.value;
                const otherChanges = changeDetailsTextarea.value.trim();
                const usePrehistoric = prehistoricCheckboxAnalysis.checked;
                let structureToUse;

                if (usePrehistoric) {
                    // For image analysis, we simplify and default to the human structure if prehistoric is checked.
                    // A more advanced version could analyze the image content.
                    structureToUse = `First, analyze the image content. Based on the content and the user's request, decide if the 'Prehistoric Human Structure' or 'Prehistoric Animal Structure' is more appropriate, then use it. \n[Prehistoric Human Structure]:${prehistoricHumanStructure}\n[Prehistoric Animal Structure]:${prehistoricAnimalStructure}`;
                } else {
                    structureToUse = `Use the 'General Structure'.\n[General Structure]:${generalStructure}`;
                }

                let analysisRequest = `The user has provided an image to generate a new prompt.`;
                if (newStyle || otherChanges) {
                    analysisRequest += ` Incorporate these modifications: New Style: ${newStyle||'N/A'}, Other Changes: ${otherChanges||'N/A'}`;
                }
                mainInstruction = `As an expert image analyst, analyze the image and the user's request. ${analysisRequest}\nYou MUST strictly follow the chosen structure to build the final prompt:\n${structureToUse}\n${outputRequirement}`;
                partsForGemini.push({ text: mainInstruction });
                partsForGemini.push(await fileToGenerativePart(imageFile));
            }
        } catch (error) {
            return showCustomAlert(`Lỗi xử lý file: ${error.message}`, 'error');
        }

        generatePromptBtn.disabled = true;
        generatePromptBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Đang tạo...`;
        try {
            const responseText = await callGeminiAPI(partsForGemini);
            
            const startIndex = responseText.indexOf('{');
            const endIndex = responseText.lastIndexOf('}');
            if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
                throw new Error("AI đã trả về dữ liệu không hợp lệ. Vui lòng thử lại.");
            }
            const jsonString = responseText.substring(startIndex, endIndex + 1);
            const prompts = JSON.parse(jsonString);
            
            const mandatorySentence = "If a face reference image is provided, use only the exact face from the reference with 99.99% similarity (facial features, hairstyle, and hair color unchanged). Do NOT copy body shape, outfit, or pose from the reference image. If no reference is given, use the text description below.";

            const firstNewlineIndex = prompts.english.indexOf('\n');
            let finalEnglishPrompt;

            if (firstNewlineIndex !== -1) {
                const firstLine = prompts.english.substring(0, firstNewlineIndex);
                const restOfPrompt = prompts.english.substring(firstNewlineIndex + 1);
                finalEnglishPrompt = `${firstLine}\n\n${mandatorySentence}\n\n${restOfPrompt}`;
            } else {
                finalEnglishPrompt = `${prompts.english}\n\n${mandatorySentence}`;
            }

            promptOutputVi.textContent = prompts.vietnamese;
            promptOutputEn.textContent = finalEnglishPrompt.replace(/Negative Prompt:/gi, "--no").trim();

            promptOutputContainer.classList.remove('hidden');
        } catch (error) {
            showCustomAlert(`Lỗi khi tạo prompt: ${error.message}`, 'error');
        } finally {
            generatePromptBtn.disabled = false;
            generatePromptBtn.innerHTML = `<i class="fas fa-wand-magic-sparkles"></i> Tạo Prompt`;
        }
    });

    copyPromptBtn.addEventListener('click', () => {
        if (!promptOutputEn.textContent) return;
        navigator.clipboard.writeText(promptOutputEn.textContent).then(() => {
            copyPromptBtn.innerHTML = '<i class="fas fa-check"></i>';
            copyPromptBtn.classList.add('copied');
            setTimeout(() => {
                copyPromptBtn.innerHTML = '<i class="far fa-copy"></i>';
                copyPromptBtn.classList.remove('copied');
            }, 1500);
        });
    });
});