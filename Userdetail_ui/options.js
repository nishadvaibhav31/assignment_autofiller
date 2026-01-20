// Function to load saved user data here we used it so that our options page have the last filled user choice 
const loadData = () => {
        chrome.storage.sync.get(['name', 'email', 'phone', 'skills'], (data) => {
        if (data.name) document.getElementById('name').value = data.name;
        if (data.email) document.getElementById('email').value = data.email;
        if (data.phone) document.getElementById('phone').value = data.phone;
        if (data.skills) document.getElementById('skills').value = data.skills;
        const hasData = data.name || data.email || data.phone || data.skills;
        // adding a reset option 
    if (hasData) {
        document.getElementById('reset').style.display = 'block';
    }
    });
    
};

// Function to save user data that will be filled to other site 
const saveData = () => {
    const data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        skills: document.getElementById('skills').value
    };

    chrome.storage.sync.set(data, () => {
        const status = document.getElementById('status');
        status.textContent = 'Data Saved successfully!';
        setTimeout(() => { status.textContent = ''; }, 2000);
    });
};

const resetData = () => {
    chrome.storage.sync.clear(() => {
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('skills').value = '';

        const status=document.getElementById('status');
        status.textContent = 'Data cleared';
        setTimeout(() => { status.textContent = ''; }, 2000);
        document.getElementById('reset').style.display = 'none';
    });
};
document.addEventListener('DOMContentLoaded', loadData);
document.getElementById('save').addEventListener('click', saveData);
document.getElementById('reset').addEventListener('click', resetData);