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
                        let notifications = data.notifications;

                        // Sort notifications to have non-Taken ones at the top
                        notifications.sort((a, b) => {
                            if (a.status === 'Not taken' && b.status !== 'Not taken') return -1;
                            if (a.status !== 'Not taken' && b.status === 'Not taken') return 1;
                            return 0;
                        });

                        notificationsDropdown.innerHTML = ''; // Clear existing content

                        notifications.forEach((notification, index) => {
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
                                    ${notification.status === 'Not taken' ? `
                                    <div class="notification-actions">
                                        <button onclick="handleMedicationAction('taken', '${notification._id}', ${index})">Taken</button>
                                        <button onclick="handleMedicationAction('skipped', '${notification._id}', ${index})">Skipped</button>
                                    </div>
                                    ` : ''}
                                </div>
                            `;
                            notificationsDropdown.appendChild(notificationItem);
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching notifications:', error);
                        error.text().then(errorMessage => console.error('Server error response:', errorMessage));
                    });
            }

            // Function for handling medication actions
            window.handleMedicationAction = function(action, medicationId, index) {
                console.log(`Handling action: ${action} for medicationId: ${medicationId} at index: ${index}`);
                fetch(`http://localhost:3000/notify/taken/${medicationId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: action })
                })
                .then(response => {
                    if (!response.ok) {
                        throw response;
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Action response:', data);

                    // Find the notification item and update its status
                    const notificationsDropdown = document.getElementById('notifications-dropdown');
                    const notificationItems = notificationsDropdown.getElementsByTagName('li');
                    const notificationItem = notificationItems[index];

                    if (notificationItem) {
                        const statusDiv = notificationItem.querySelector('.status');
                        const actionsDiv = notificationItem.querySelector('.notification-actions');

                        if (statusDiv && actionsDiv) {
                            statusDiv.className = 'status ' + action.toLowerCase();
                            statusDiv.innerHTML = `
                                <i class="material-icons">${action === 'taken' ? 'check_circle' : 'cancel'}</i>
                                <span>${action.charAt(0).toUpperCase() + action.slice(1)}</span>
                            `;
                            actionsDiv.remove();
                        }

                        // Move the notification item one place down
                        if (index < notificationItems.length - 1) {
                            notificationsDropdown.insertBefore(notificationItem.nextElementSibling, notificationItem);
                        }
                    }
                })
                .catch(error => {
                    console.error('Error handling action:', error);
                    error.text().then(errorMessage => console.error('Server error response:', errorMessage));
                });
            };
        });

    // Fetch user data
    fetch('/profile/details')
        .then(response => response.json())
        .then(data => {
            const firstName = data.user_first_name || '';
            const lastName = data.user_last_name || '';
            const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
            document.getElementById('initialsCircle').textContent = initials;
        })
        .catch(error => console.error('Error fetching user data:', error));
});
