import { promptConfig, outputRules } from './info.js';

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
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const mainContent = document.querySelector('main');

    // DOM cho Tab "Ý tưởng"
    const ideaInput = document.getElementById('idea-input');
    const prehistoricCheckboxIdea = document.getElementById('prehistoric-checkbox-idea');
    const optionsContainerIdea = document.querySelector('#creative-options-idea .options-content');
    const faceRefCheckboxIdea = document.getElementById('face-ref-checkbox-idea');

    // DOM cho Tab "Phân tích ảnh"
    const imageAnalysisFileInput = document.getElementById('image-analysis-file');
    const prehistoricCheckboxAnalysis = document.getElementById('prehistoric-checkbox-analysis');
    const optionsContainerAnalysis = document.querySelector('#creative-options-analysis .options-content');
    const analyzeImageBtn = document.getElementById('analyze-image-btn');
    const faceRefCheckboxAnalysis = document.getElementById('face-ref-checkbox-analysis');

    // --- CÁC HÀM TIỆN ÍCH & CỐT LÕI ---

    function showCustomAlert(message, type = 'info') {
        customAlertText.textContent = message;
        customAlertModal.querySelector('.alert-content').className = 'modal-content alert-content ' + type;
        customAlertModal.style.display = 'flex';
    }

    function resetImageUpload(fileInput) {
        const uploadBox = fileInput.closest('.image-upload-box');
        if (!uploadBox) return;
        const preview = uploadBox.querySelector('.image-preview');
        fileInput.value = '';
        if (preview) preview.src = '';
        if (uploadBox) uploadBox.classList.remove('has-image');
        if (analyzeImageBtn) analyzeImageBtn.disabled = true;
    }

    function setupImagePreview(fileInputId) {
        const fileInput = document.getElementById(fileInputId);
        if (!fileInput) return;
        const uploadBox = fileInput.closest('.image-upload-box');
        const preview = uploadBox.querySelector('.image-preview');
        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.src = e.target.result;
                    uploadBox.classList.add('has-image');
                    if (analyzeImageBtn) analyzeImageBtn.disabled = false;
                };
                reader.readAsDataURL(file);
            } else {
                resetImageUpload(fileInput);
            }
        });
    }

    function populateFormWithData(data, template, idPrefix) {
        function traverseAndFill(dataObj, templateObj, pathPrefix) {
            for (const key in dataObj) {
                if (!templateObj || !templateObj[key]) continue;
                const currentPath = `${pathPrefix}-${key.replace(/[^a-zA-Z0-9]/g, '_')}`;
                const currentDataNode = dataObj[key];
                const currentTemplateNode = templateObj[key];
                if (typeof currentTemplateNode.value === 'undefined') {
                    traverseAndFill(currentDataNode, currentTemplateNode, currentPath);
                } else {
                    const valueToSet = currentDataNode.value;
                    if (valueToSet) {
                        if (currentTemplateNode.options) {
                            const radioToSelect = document.querySelector(`input[name="${currentPath}"][value="${valueToSet}"]`);
                            if (radioToSelect) {
                                radioToSelect.checked = true;
                            } else {
                                console.warn(`AI trả về giá trị "${valueToSet}" cho mục ${key}, không phải là một lựa chọn hợp lệ.`);
                            }
                        } else {
                            const element = document.getElementById(currentPath);
                            if (element) {
                                element.value = valueToSet;
                            }
                        }
                    }
                }
            }
        }
        traverseAndFill(data, template, idPrefix);
    }

    async function fileToGenerativePart(file) {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        });
        return { inlineData: { data: await base64EncodedDataPromise, mimeType: file.type } };
    }

    function buildFormFields(obj, pathPrefix) {
        let html = '';
        for (const key in obj) {
            const valueObj = obj[key];
            const currentPath = `${pathPrefix}-${key.replace(/[^a-zA-Z0-9]/g, '_')}`;
            if (typeof valueObj.value === 'undefined') {
                html += `<fieldset><legend>${key}<i class="fas fa-chevron-right arrow-icon"></i></legend><div class="fieldset-content">`;
                html += buildFormFields(valueObj, currentPath);
                html += `</div></fieldset>`;
            } else {
                html += `<div class="form-group"><label for="${currentPath}">${key}</label>`;
                if (valueObj.options) {
                    const options = valueObj.options.split(',').map(opt => opt.trim());
                    html += `<div class="radio-group-container">`;
                    options.forEach((opt, index) => {
                        const radioId = `${currentPath}-${index}`;
                        html += `<div class="radio-option"><input type="radio" id="${radioId}" name="${currentPath}" value="${opt}"><span class="radio-custom"></span><label for="${radioId}">${opt}</label></div>`;
                    });
                    html += `</div>`;
                } else {
                    html += `<input type="text" id="${currentPath}" class="form-control" placeholder="${valueObj.placeholder || ''}">`;
                }
                html += `</div>`;
            }
        }
        return html;
    }

    function renderCreativeOptions(themeKey, container, idPrefix) {
        const themeConfig = promptConfig[themeKey] || promptConfig.general;
        container.innerHTML = buildFormFields(themeConfig, idPrefix);
    }

    function rebuildThemeFromForm(themeKey, idPrefix) {
        const baseTheme = JSON.parse(JSON.stringify(promptConfig[themeKey]));
        function traverseAndUpdate(obj, pathPrefix) {
            for (const key in obj) {
                const currentPath = `${pathPrefix}-${key.replace(/[^a-zA-Z0-9]/g, '_')}`;
                if (typeof obj[key].value === 'undefined') {
                    traverseAndUpdate(obj[key], currentPath);
                } else {
                    if (obj[key].options) {
                        const checkedRadio = document.querySelector(`input[name="${currentPath}"]:checked`);
                        if (checkedRadio) obj[key].value = checkedRadio.value;
                    } else {
                        const element = document.getElementById(currentPath);
                        if (element && element.value) obj[key].value = element.value;
                    }
                }
            }
        }
        traverseAndUpdate(baseTheme, idPrefix);
        return baseTheme;
    }

    function handleAccordionClick(event) {
        if (event.target.closest('input, .radio-option')) return;
        const header = event.target.closest('.options-header, legend');
        if (!header) return;
        event.stopPropagation();
        const content = header.nextElementSibling;
        if (!content) return;
        const isCurrentlyExpanded = header.classList.contains('expanded');
        if (isCurrentlyExpanded) {
            header.classList.remove('expanded');
            content.classList.remove('expanded');
            content.querySelectorAll('legend').forEach(h => h.classList.remove('expanded'));
            content.querySelectorAll('.fieldset-content').forEach(c => c.classList.remove('expanded'));
        } else {
            header.classList.add('expanded');
            content.classList.add('expanded');
        }
    }

    function handleInputChange(event) {
        const radioElement = event.target.closest('input[type="radio"]');
        if (!radioElement) return;
        setTimeout(() => {
            const fieldsetContent = radioElement.closest('.fieldset-content');
            if (fieldsetContent && fieldsetContent.classList.contains('expanded')) {
                const legend = fieldsetContent.previousElementSibling;
                if (legend) legend.classList.remove('expanded');
                fieldsetContent.classList.remove('expanded');
            }
        }, 150);
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
    optionsContainerIdea.parentElement.addEventListener('click', handleAccordionClick);
    optionsContainerAnalysis.parentElement.addEventListener('click', handleAccordionClick);
    optionsContainerIdea.addEventListener('change', handleInputChange);
    optionsContainerAnalysis.addEventListener('change', handleInputChange);

    prehistoricCheckboxIdea.addEventListener('change', () => renderCreativeOptions(prehistoricCheckboxIdea.checked ? 'prehistoric' : 'general', optionsContainerIdea, 'idea'));
    prehistoricCheckboxAnalysis.addEventListener('change', () => renderCreativeOptions(prehistoricCheckboxAnalysis.checked ? 'prehistoric' : 'general', optionsContainerAnalysis, 'analysis'));

    customAlertCloseBtn.addEventListener('click', () => { customAlertModal.style.display = 'none'; });
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

    resetBtn.addEventListener('click', () => {
        ideaInput.value = '';
        prehistoricCheckboxIdea.checked = false;
        faceRefCheckboxIdea.checked = false;
        prehistoricCheckboxAnalysis.checked = false;
        faceRefCheckboxAnalysis.checked = false;
        resetImageUpload(imageAnalysisFileInput);
        renderCreativeOptions('general', optionsContainerIdea, 'idea');
        renderCreativeOptions('general', optionsContainerAnalysis, 'analysis');
        promptOutputContainer.classList.add('hidden');
        const activeTabId = document.querySelector('.tab-pane.active').id;
        if (activeTabId === 'tab-image-analysis') {
            generatePromptBtn.disabled = true;
        }
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabPanes.forEach(pane => pane.classList.toggle('active', pane.id === targetTab));
            if (targetTab === 'tab-image-analysis') {
                generatePromptBtn.disabled = true;
            } else {
                generatePromptBtn.disabled = false;
            }
        });
    });

    mainContent.addEventListener('click', (event) => {
        const deleteBtn = event.target.closest('.delete-image-btn');
        if (deleteBtn) resetImageUpload(deleteBtn.closest('.image-upload-box').querySelector('.file-input'));
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

    if (analyzeImageBtn) {
        analyzeImageBtn.addEventListener('click', async () => {
            const imageFile = imageAnalysisFileInput.files[0];
            if (!imageFile) return showCustomAlert("Vui lòng tải lên một ảnh để phân tích!", 'error');
            const geminiApiKey = localStorage.getItem('geminiApiKey');
            if (!geminiApiKey) return showCustomAlert('Vui lòng vào "Quản lý Khóa API" để nhập Khóa API Gemini!', 'error');
            analyzeImageBtn.disabled = true;
            analyzeImageBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Đang phân tích...`;
            try {
                const themeKey = prehistoricCheckboxAnalysis.checked ? 'prehistoric' : 'general';
                const emptyThemeStructure = promptConfig[themeKey];
                const analysisInstruction = `As an expert image analyst, describe the provided image in detail. Pay close attention to the main subject, background, lighting, and overall style. If the subject is non-human (animal, object), focus on its physical characteristics instead of human attributes (gender, clothing). After your analysis, you MUST format your complete description into a JSON object that strictly follows this structure. Fill every "value" property with your findings. Do not leave any values empty. Your entire response must be ONLY the JSON object. **JSON Structure to use for formatting:** ${JSON.stringify(emptyThemeStructure, null, 2)}`;
                const parts = [{ text: analysisInstruction }, await fileToGenerativePart(imageFile)];
                let responseText = await callGeminiAPI(parts);
                const startIndex = responseText.indexOf('{'),
                    endIndex = responseText.lastIndexOf('}');
                if (startIndex === -1 || endIndex === -1) throw new Error("AI không trả về dữ liệu JSON hợp lệ.");
                const jsonString = responseText.substring(startIndex, endIndex + 1);
                const analysisData = JSON.parse(jsonString);
                populateFormWithData(analysisData, emptyThemeStructure, 'analysis');
                showCustomAlert('Đã phân tích xong! Bạn có thể xem và chỉnh sửa kết quả bên dưới.', 'success');
                const optionsHeader = optionsContainerAnalysis.parentElement.querySelector('.options-header');
                if (optionsHeader && !optionsHeader.classList.contains('expanded')) optionsHeader.click();
                generatePromptBtn.disabled = false;
            } catch (error) {
                showCustomAlert(`Lỗi khi phân tích ảnh: ${error.message}`, 'error');
                generatePromptBtn.disabled = true;
            } finally {
                analyzeImageBtn.disabled = false;
                analyzeImageBtn.innerHTML = `<i class="fas fa-microscope"></i> Phân tích Ảnh`;
            }
        });
    }

    generatePromptBtn.addEventListener('click', async () => {
        promptOutputContainer.classList.add('hidden');
        const activeTabId = document.querySelector('.tab-pane.active').id;
        const geminiApiKey = localStorage.getItem('geminiApiKey');
        if (!geminiApiKey) return showCustomAlert('Vui lòng vào "Quản lý Khóa API" để nhập Khóa API Gemini!', 'error');
        let partsForGemini = [];
        let mainInstruction = '';
        generatePromptBtn.disabled = true;
        generatePromptBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Đang tạo...`;
        try {
            let userFilledTheme;
            let themeKey;
            if (activeTabId === 'tab-idea') {
                const idea = ideaInput.value.trim();
                if (!idea) throw new Error("Vui lòng nhập ý tưởng chính!");
                themeKey = prehistoricCheckboxIdea.checked ? 'prehistoric' : 'general';
                userFilledTheme = rebuildThemeFromForm(themeKey, 'idea');
                mainInstruction = `Your primary task is to write two descriptive paragraphs (one Vietnamese, one English).

                **--- KEY CONTEXT RULE ---**
                The provided JSON Structure (Attributes) defines the **overall theme and context** (e.g., general, prehistoric). You MUST interpret the User's Core Idea **THROUGH THE LENS OF THIS THEME**. If the structure's theme is 'prehistoric', you must describe a prehistoric version of the user's idea. For example, if the idea is "an elephant", you must describe a mammoth or another appropriate prehistoric elephant ancestor, NOT a modern one.

                **User's Core Idea**: "${idea}"
                
                **Attributes (JSON Structure with THEME)**: 
                ${JSON.stringify(userFilledTheme, null, 2)}

                **Your Instructions**:
                1. Apply the **KEY CONTEXT RULE** above.
                2. Creatively fill in any attribute where the "value" is empty (e.g., "value": "") to be consistent with the core idea and the chosen theme.
                3. Synthesize ALL attributes (both pre-filled and the ones you generated) into a single, rich paragraph.
                4. Provide this paragraph in both Vietnamese and English.
                5. Adhere strictly to the Output Rules.
                
                ${outputRules}`;
                partsForGemini.push({ text: mainInstruction });
            } else if (activeTabId === 'tab-image-analysis') {
                themeKey = prehistoricCheckboxAnalysis.checked ? 'prehistoric' : 'general';
                userFilledTheme = rebuildThemeFromForm(themeKey, 'analysis');
                mainInstruction = `You are a creative writer. Based on the detailed information in the following completed JSON object, weave all details into a single, flowing descriptive paragraph (in Vietnamese and English). **JSON Data to Use**: ${JSON.stringify(userFilledTheme, null, 2)} ${outputRules}`;
                partsForGemini.push({ text: mainInstruction });
            }
            const responseText = await callGeminiAPI(partsForGemini);
            const startIndex = responseText.indexOf('{'),
                endIndex = responseText.lastIndexOf('}');
            if (startIndex === -1 || endIndex === -1) throw new Error("AI đã trả về dữ liệu không hợp lệ. Vui lòng thử lại.");
            const jsonString = responseText.substring(startIndex, endIndex + 1);
            const prompts = JSON.parse(jsonString);
            
            let finalEnglishPrompt = prompts.english;
            const isFaceRefChecked = (activeTabId === 'tab-idea') ? faceRefCheckboxIdea.checked : faceRefCheckboxAnalysis.checked;
            
            if (isFaceRefChecked) {
                const mandatorySentence = "If a face reference image is provided, use only the exact face from the reference with 99.99% similarity (facial features, hairstyle, and hair color unchanged). Do NOT copy body shape, outfit, or pose from the reference image. If no reference is given, use the text description below.";
                finalEnglishPrompt = `${mandatorySentence}\n\n${finalEnglishPrompt}`;
            }

            promptOutputVi.textContent = prompts.vietnamese;
            promptOutputEn.textContent = finalEnglishPrompt.trim();
            promptOutputContainer.classList.remove('hidden');
        } catch (error) {
            showCustomAlert(`Lỗi khi tạo prompt: ${error.message}`, 'error');
        } finally {
            const activeTabId = document.querySelector('.tab-pane.active').id;
            if (activeTabId === 'tab-idea' || !generatePromptBtn.disabled) {
                generatePromptBtn.disabled = false;
            }
            generatePromptBtn.innerHTML = `<i class="fas fa-wand-magic-sparkles"></i> Tạo Prompt`;
        }
    });

    // --- KHỞI TẠO BAN ĐẦU ---
    setupImagePreview('image-analysis-file');
    renderCreativeOptions('general', optionsContainerIdea, 'idea');
    renderCreativeOptions('general', optionsContainerAnalysis, 'analysis');

    if (document.querySelector('#tab-image-analysis.active')) {
        generatePromptBtn.disabled = true;
    }
});