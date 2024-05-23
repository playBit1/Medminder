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
            if (notificationsDropdown) {
                console.log('Dropdown element found');
                fetch('http://localhost:3000/notify')
                .then(response => response.json())
                .then(data => {
                    console.log('Data fetched:', data);
                    const notifications = data.notifications;
                    notificationsDropdown.innerHTML = ''; // Clear existing content

                    notifications.forEach(notification => {
                        const notificationItem = document.createElement('li');
                        notificationItem.innerHTML = `
                            <div class="notification">
                                <div class="notification-header">
                                    <i class="material-icons">notifications_none</i>
                                    <span>${notification.medication_name}</span>
                                </div>
                                <div class="notification-body">
                                    <span>${notification.date} at ${notification.time}</span>
                                </div>
                                <div class="status ${notification.status.toLowerCase().replace(' ', '-')}">
                                    <i class="material-icons">
                                        ${notification.status === 'Taken' ? 'check_circle' : notification.status === 'Skipped' ? 'cancel' : 'notifications_none'}
                                    </i>
                                    <span>${notification.status}</span>
                                </div>
                            </div>
                        `;
                        notificationsDropdown.appendChild(notificationItem);
                    });
                })
                .catch(error => {
                    console.error('Error fetching notifications:', error);
                });
            }

            // Placeholder function for handling medication actions
            window.handleMedicationAction = function(action, medicationId) {
                // Your code to handle take/skip action
                console.log(action, medicationId);
            };
        });
});
