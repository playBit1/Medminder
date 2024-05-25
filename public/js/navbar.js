document.addEventListener('DOMContentLoaded', function() {
    // Load the navbar
    fetch('/views/nav/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;
            // Initialize dropdowns after navbar is loaded
            var elemsDropdown = document.querySelectorAll('.dropdown-trigger');
            M.Dropdown.init(elemsDropdown, { coverTrigger: false, constrainWidth: false });

      // Initialize sidenav after navbar is loaded
      var elemsSidenav = document.querySelectorAll('.sidenav');
      M.Sidenav.init(elemsSidenav);

            // Load notifications into the dropdown
            var notificationsDropdown = document.getElementById('notifications-dropdown');
            var notificationTemplate = document.getElementById('notification-template').innerHTML;
            notificationsDropdown.innerHTML = notificationTemplate;
        });

    // Placeholder function for handling medication actions
    window.handleMedicationAction = function(action, medicationId) {
        // Your code to handle take/skip action
        console.log(action, medicationId);
    };
});
