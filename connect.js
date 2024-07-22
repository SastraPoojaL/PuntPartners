document.addEventListener("DOMContentLoaded", () => {
    const fontFamilySelector = document.getElementById('font_family');
    const fontWeightSelector = document.getElementById('font_weight');
    const italicToggle = document.getElementById('italic');
    const resetButton = document.getElementById('reset_button');

    const defaultFontFamily = 'ABeeZee'; // Set your default font family
    const defaultFontWeight = '400'; // Set your default font weight
    const defaultItalic = false; // Set default italic status

    // Populate font family selector
    Object.keys(fontData).forEach(font => {
        let option = document.createElement('option');
        option.value = font;
        option.textContent = font;
        fontFamilySelector.appendChild(option);
    });

    // Load saved settings
    const savedText = localStorage.getItem('editorText');
    const savedFontFamily = localStorage.getItem('fontFamily');
    const savedFontWeight = localStorage.getItem('fontWeight');
    const savedItalic = localStorage.getItem('italic');

    if (savedText) editor.value = savedText;
    if (savedFontFamily) {
        fontFamilySelector.value = savedFontFamily;
        loadFontWeights(savedFontFamily);
    }
    if (savedFontWeight) fontWeightSelector.value = savedFontWeight;
    if (savedItalic) italicToggle.classList.toggle('active', savedItalic === 'true');

    updateEditorFont();

    // Populate font weight selector
    function loadFontWeights(fontFamily) {
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
        loadFontWeights(fontFamilySelector.value);
        updateEditorFont();
        saveSettings();
    });

    fontWeightSelector.addEventListener('change', () => {
        updateEditorFont();
        saveSettings();
    });

    italicToggle.addEventListener('click', () => {
        italicToggle.classList.toggle('active');
        updateEditorFont();
        saveSettings();
    });

    editor.addEventListener('input', () => {
        localStorage.setItem('editorText', editor.value);
    });

    resetButton.addEventListener('click', () => {
        editor.value = '';
        fontFamilySelector.value = defaultFontFamily;
        loadFontWeights(defaultFontFamily);
        fontWeightSelector.value = defaultFontWeight;
        italicToggle.classList.toggle('active', defaultItalic);
        updateEditorFont();
        saveSettings();
    });

    function updateEditorFont() {
        const fontFamily = fontFamilySelector.value;
        const fontWeight = fontWeightSelector.value;
        const isItalic = italicToggle.classList.contains('active');
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

        // Check if italic is supported for the selected font weight
        const supportsItalic = fontData[fontFamily].hasOwnProperty(`${fontWeight}italic`);
        italicToggle.disabled = !supportsItalic;
    }

    function saveSettings() {
        localStorage.setItem('fontFamily', fontFamilySelector.value);
        localStorage.setItem('fontWeight', fontWeightSelector.value);
        localStorage.setItem('italic', italicToggle.classList.contains('active'));
    }
});

