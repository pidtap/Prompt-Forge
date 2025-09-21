import { promptConfig, outputRules } from './info.js';

// Bản đồ dịch thuật để Việt hóa giao diện
const translationMap = {
    "modern_human": "Con người Hiện đại",
    "prehistoric_human": "Con người Tiền sử",
    "modern_creature": "Sinh vật Hiện đại",
    "prehistoric_creature": "Sinh vật Tiền sử",
    "landscape_scene": "Phong cảnh / Môi trường"
};


document.addEventListener('DOMContentLoaded', () => {
    // --- Lấy các phần tử DOM ---
    const generatePromptBtn = document.getElementById('generate-prompt-btn');
    const resetBtn = document.getElementById('reset-btn');
    const promptOutputContainer = document.getElementById('prompt-output-container');
    const promptOutputVi = document.getElementById('prompt-output-vi');
    const promptOutputEn = document.getElementById('prompt-output-en');
    const copyPromptBtn = document.getElementById('copy-prompt-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const modal = document.getElementById('settings-modal');
    const closeBtn = document.querySelector('.modal .close-btn');
    const geminiApiKeyInput = document.getElementById('gemini-api-key-input');
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');
    const customAlertModal = document.getElementById('custom-alert-modal');
    const customAlertText = document.getElementById('custom-alert-text');
    const customAlertCloseBtn = document.getElementById('custom-alert-close-btn');

    // DOM cho giao diện mới
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const branchSelector = document.getElementById('prompt-branch-selector');
    const ideaInput = document.getElementById('idea-input');
    const imageFileInput = document.getElementById('image-file-input');
    const imageDropzone = document.getElementById('image-dropzone');
    const mainContent = document.querySelector('main');

    // --- CÁC HÀM TIỆN ÍCH & CỐT LÕI ---

    function showCustomAlert(message, type = 'info') {
        customAlertText.textContent = message;
        customAlertModal.querySelector('.alert-content').className = 'modal-content alert-content ' + type;
        customAlertModal.style.display = 'flex';
    }

    function formatDisplayName(key) {
        return translationMap[key] || key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    
    async function fileToGenerativePart(file) {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        });
        return { inlineData: { data: await base64EncodedDataPromise, mimeType: file.type } };
    }
    
    function setupImagePreview() {
        const preview = imageDropzone.querySelector('.image-preview');
        imageFileInput.addEventListener('change', () => {
            const file = imageFileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.src = e.target.result;
                    imageDropzone.classList.add('has-image');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    function resetImageUpload() {
        const preview = imageDropzone.querySelector('.image-preview');
        imageFileInput.value = '';
        if (preview) preview.src = '';
        imageDropzone.classList.remove('has-image');
    }

    function populateSelector() {
        const branchKeys = Object.keys(promptConfig).filter(key => key !== 'common');
        branchKeys.forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = formatDisplayName(key);
            branchSelector.appendChild(option);
        });
    }

    async function callGeminiAPI(parts) {
        const geminiApiKey = localStorage.getItem('geminiApiKey');
        if (!geminiApiKey) throw new Error('Vui lòng vào "Quản lý Khóa API" để nhập Khóa API Gemini!');
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

    // --- CÀI ĐẶT EVENT LISTENERS ---
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabPanes.forEach(pane => pane.classList.toggle('active', pane.id === targetTab));
        });
    });

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
    customAlertCloseBtn.addEventListener('click', () => { customAlertModal.style.display = 'none'; });
    
    resetBtn.addEventListener('click', () => {
        ideaInput.value = '';
        resetImageUpload();
        branchSelector.selectedIndex = 0;
        promptOutputContainer.classList.add('hidden');
        if (!document.querySelector('#tab-idea').classList.contains('active')) {
            tabButtons[0].click();
        }
        // Reset các dropdown tùy chọn
        document.querySelectorAll('.tech-options-grid select').forEach(select => select.selectedIndex = 0);
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
    
    mainContent.addEventListener('click', (event) => {
        const deleteBtn = event.target.closest('.delete-image-btn');
        if (deleteBtn) {
            resetImageUpload();
        }
    });

    generatePromptBtn.addEventListener('click', async () => {
        promptOutputContainer.classList.add('hidden');
        const activeTabId = document.querySelector('.tab-pane.active').id;
        const geminiApiKey = localStorage.getItem('geminiApiKey');
        if (!geminiApiKey) return showCustomAlert('Vui lòng vào "Quản lý Khóa API" để nhập Khóa API Gemini!', 'error');

        generatePromptBtn.disabled = true;
        generatePromptBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Đang tạo...`;
        
        try {
            const selectedBranchKey = branchSelector.value;
            const emptyStructure = {
                common: promptConfig.common,
                [selectedBranchKey]: promptConfig[selectedBranchKey]
            };

            // *** LẤY DỮ LIỆU TÙY CHỌN KỸ THUẬT TỪ NGƯỜI DÙNG ***
            const tabSuffix = activeTabId.includes('idea') ? 'idea' : 'image';
            const userPreferences = {
                "Style": document.getElementById(`style-${tabSuffix}`).value,
                "Layout": document.getElementById(`layout-${tabSuffix}`).value,
                "Viewing Angle": document.getElementById(`angle-${tabSuffix}`).value,
                "Aspect Ratio": document.getElementById(`ratio-${tabSuffix}`).value,
                "Quality": document.getElementById(`quality-${tabSuffix}`).value,
            };

            // Tạo chuỗi chỉ chứa các tùy chọn người dùng đã chọn
            let preferencesText = "";
            const chosenPreferences = Object.entries(userPreferences)
                .filter(([key, value]) => value) // Lọc ra những cái có giá trị
                .map(([key, value]) => `- ${key}: ${value}`)
                .join("\n");

            if (chosenPreferences) {
                preferencesText = `\n**User's Technical Preferences (IMPORTANT: You MUST follow these):**\n${chosenPreferences}\n`;
            }

            let partsForGemini = [];
            let mainInstruction = '';

            if (activeTabId === 'tab-idea') {
                const idea = ideaInput.value.trim();
                if (!idea) throw new Error("Vui lòng nhập ý tưởng chính!");
                
                mainInstruction = `You are an expert prompt engineer. Your task is to expand a user's simple idea into a detailed specification.
                
                **User's Core Idea:** "${idea}"
                **Contextual Theme:** "${selectedBranchKey}"
                ${preferencesText}
                **Instructions:**
                1. Analyze the user's idea, contextual theme, and especially their technical preferences if provided.
                2. Mentally fill out the JSON structure below with creative details that match all the inputs.
                3. Use ALL details from your mental model to write two rich, descriptive paragraphs (one Vietnamese, one English). The final English prompt must incorporate the user's technical preferences.
                4. Adhere strictly to the Output Rules.

                **JSON Structure Guide:** ${JSON.stringify(emptyStructure, null, 2)}
                ${outputRules}`;
                partsForGemini.push({ text: mainInstruction });

            } else if (activeTabId === 'tab-image') {
                const imageFile = imageFileInput.files[0];
                if (!imageFile) throw new Error("Vui lòng tải lên một hình ảnh!");
                
                mainInstruction = `You are an expert image analyst and prompt engineer. Your task is to analyze a user's image and describe it in extreme detail.

                **Contextual Theme:** "${selectedBranchKey}"
                ${preferencesText}
                **Instructions:**
                1. Thoroughly analyze the provided image.
                2. If the user provided technical preferences, you must creatively reinterpret the image according to those preferences. For example, if they chose "Anime style", describe the image as if it were an anime scene. If they chose a new aspect ratio, describe what might be visible in the wider/taller frame.
                3. Mentally fill out the JSON structure below based on your analysis and the user's preferences.
                4. Use ALL details to write two rich, descriptive paragraphs (one Vietnamese, one English).
                5. Adhere strictly to the Output Rules.

                **JSON Structure Guide:** ${JSON.stringify(emptyStructure, null, 2)}
                ${outputRules}`;
                
                const imagePart = await fileToGenerativePart(imageFile);
                partsForGemini.push({ text: mainInstruction }, imagePart);
            }

            // Gọi API và hiển thị kết quả
            const responseText = await callGeminiAPI(partsForGemini);
            const startIndex = responseText.indexOf('{');
            const endIndex = responseText.lastIndexOf('}');
            if (startIndex === -1 || endIndex === -1) throw new Error("AI đã trả về dữ liệu không hợp lệ. Vui lòng thử lại.");
            
            const jsonString = responseText.substring(startIndex, endIndex + 1);
            const prompts = JSON.parse(jsonString);

            promptOutputVi.textContent = prompts.vietnamese;
            promptOutputEn.textContent = prompts.english.trim();
            promptOutputContainer.classList.remove('hidden');

        } catch (error) {
            showCustomAlert(`Lỗi khi tạo prompt: ${error.message}`, 'error');
        } finally {
            generatePromptBtn.disabled = false;
            generatePromptBtn.innerHTML = `<i class="fas fa-wand-magic-sparkles"></i> Tạo Prompt`;
        }
    });

    // --- KHỞI TẠO BAN ĐẦU ---
    populateSelector();
    setupImagePreview();
});