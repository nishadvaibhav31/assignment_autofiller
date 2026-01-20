// Here we are defining possible keywords for name ,email,phone and skills 
const FIELD_KEYWORDS = {
    name: ['fullname', 'full name', 'fname', 'first name', 'candidate', 'name'],
    email: ['email', 'e-mail', 'mail'],
    phone: ['phone', 'mobile', 'cell', 'contact','phoneno'],
    skills: ['skill', 'experience', 'cover', 'qualif', 'qualification','skills']
};

// we are determining type of input  based on keywords
function getFieldType(input) {
    const text = (
        (input.id || '') + ' ' +
        (input.name || '') + ' ' +
        (input.placeholder || '') + ' ' +
        (input.type || '')
    ).toLowerCase();
    // no need to auto fill these types 
    if (['hidden', 'file', 'submit'].includes(input.type)) return null;

    // Loop  throught each field 
    for (const [field, keywords] of Object.entries(FIELD_KEYWORDS)) {
        if (keywords.some(keyword => text.includes(keyword))) return field;
    }

    return null;
}

// Scan page for relevant inputs and return array 
function scanInputs() {
    return Array.from(document.querySelectorAll('input, textarea'))
        .filter(input => getFieldType(input) !== null);
}

// Filling the inputs with saved user data
function autofill(inputs) {
    chrome.storage.sync.get(['name', 'email', 'phone', 'skills'], (data) => {
        inputs.forEach(input => {
            const type = getFieldType(input);

            // Fill if we have matching data and field is empty
            if (type && data[type] && !input.value) {
                input.value = data[type];
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });
    });
}

// Show simple popup div in the website 
function showPopup(inputs) {
    if (document.getElementById('autofill-popup')) return;

    const popup = document.createElement('div');
    popup.id = 'autofill-popup';
    popup.innerHTML = `
        <p>Job Form Detected!</p>
        <button id="btn-fill">Autofill</button>
        <button id="btn-cancel">Cancel</button>
    `;
    popup.style = `
        position: fixed; top: 20px; right: 20px; 
        background: white; border: 1px solid #ccc; padding: 10px; 
        z-index: 999999; border-radius: 5px; text-align: center;
    `;
    document.body.appendChild(popup);

    document.getElementById('btn-fill').onclick = () => {
        autofill(inputs);
        popup.remove();
    };
    document.getElementById('btn-cancel').onclick = () => popup.remove();
}

// Main entry point
function init() {
    const inputs = scanInputs();
    if (inputs.length > 0) showPopup(inputs);
}

// Run on page load
init();
