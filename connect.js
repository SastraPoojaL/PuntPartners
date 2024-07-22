document.addEventListener("DOMContentLoaded", () => {
    const fontFamilySelector = document.getElementById('font_family');
    const fontWeightSelector = document.getElementById('font_weight');
    const italicToggle = document.getElementById('italic');
    const editor = document.getElementById('Typing');
    const resetButton = document.getElementById('reset_button');
    const saveButton = document.getElementById('save_button');

    const defaultFontFamily = 'ABeeZee'; 
    const defaultFontWeight = '400'; 
    const defaultItalic = false; 
    fetch('font_selection.json')
        .then(response => response.json())
        .then(fontData => {
            Object.keys(fontData).forEach(font => {
                let option = document.createElement('option');
                option.value = font;
                option.textContent = font;
                fontFamilySelector.appendChild(option);
            });

            const savedText = localStorage.getItem('editorText');
            const savedFontFamily = localStorage.getItem('fontFamily') || defaultFontFamily;
            const savedFontWeight = localStorage.getItem('fontWeight') || defaultFontWeight;
            const savedItalic = JSON.parse(localStorage.getItem('italic')) || defaultItalic;

            if (savedText) editor.value = savedText;
            fontFamilySelector.value = savedFontFamily;
            loadFontWeights(savedFontFamily, fontData);
            fontWeightSelector.value = savedFontWeight;
            italicToggle.checked = savedItalic;

            updateEditorFont();

            function loadFontWeights(fontFamily, fontData) {
                fontWeightSelector.innerHTML = '';
                Object.keys(fontData[fontFamily]).forEach(weight => {
                    let option = document.createElement('option');
                    option.value = weight;
                    option.textContent = weight;
                    fontWeightSelector.appendChild(option);
                });
            }

            // Event listeners
            fontFamilySelector.addEventListener('change', () => {
                loadFontWeights(fontFamilySelector.value, fontData);
                updateEditorFont();
                saveSettings();
            });

            fontWeightSelector.addEventListener('change', () => {
                updateEditorFont();
                saveSettings();
            });

            italicToggle.addEventListener('change', () => {
                updateEditorFont();
                saveSettings();
            });

            editor.addEventListener('input', () => {
                localStorage.setItem('editorText', editor.value);
            });

            resetButton.addEventListener('click', () => {
                editor.value = '';
                fontFamilySelector.value = defaultFontFamily;
                loadFontWeights(defaultFontFamily, fontData);
                fontWeightSelector.value = defaultFontWeight;
                italicToggle.checked = defaultItalic;
                updateEditorFont();
                saveSettings();
            });

            saveButton.addEventListener('click', () => {
                saveSettings();
            });

            function updateEditorFont() {
                const fontFamily = fontFamilySelector.value;
                const fontWeight = fontWeightSelector.value;
                const isItalic = italicToggle.checked;
                const fontVariant = isItalic ? `${fontWeight}italic` : fontWeight;

                const fontURL = fontData[fontFamily][fontVariant];

                if (fontURL) {
                    const newFontFace = new FontFace(fontFamily, `url(${fontURL})`);
                    document.fonts.add(newFontFace);
                    newFontFace.load().then(() => {
                        editor.style.fontFamily = fontFamily;
                        editor.style.fontWeight = fontWeight;
                        editor.style.fontStyle = isItalic ? 'italic' : 'normal';
                    });
                }
                const supportsItalic = fontData[fontFamily].hasOwnProperty(`${fontWeight}italic`);
                italicToggle.disabled = !supportsItalic;
            }

            function saveSettings() {
                localStorage.setItem('fontFamily', fontFamilySelector.value);
                localStorage.setItem('fontWeight', fontWeightSelector.value);
                localStorage.setItem('italic', italicToggle.checked);
                localStorage.setItem('editorText', editor.value);
            }
        })
        .catch(error => {
            console.error('Error loading font data:', error);
        });
});
