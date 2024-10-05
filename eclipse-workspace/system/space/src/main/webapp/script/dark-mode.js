document.addEventListener("DOMContentLoaded", function() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle, .dark-mode-client, .dark-mode-new, .dark-mode-out, .dark-mode-list');
    const body = document.body;

    // Dark Mode Toggle Functionality
    const savedMode = localStorage.getItem('darkMode') || 'light';
    const isDarkMode = savedMode === 'dark';

    body.classList.toggle('dark-mode', isDarkMode);
    updateIcon();

    darkModeToggle.addEventListener('click', () => {
        const isDarkMode = body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', isDarkMode ? 'dark' : 'light');
        updateIcon();
    });

    function updateIcon() {
        const icon = darkModeToggle.querySelector('i');
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            icon.style.color = 'white';
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            icon.style.color = ''; // Reset to default color
        }
    }
});
