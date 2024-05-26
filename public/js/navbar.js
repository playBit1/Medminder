document.addEventListener('DOMContentLoaded', function () {
  // Load the navbar
  fetch('/views/nav/navbar.html')
    .then((response) => response.text())
    .then((data) => {
      document.getElementById('navbar-container').innerHTML = data;

      // Initialize dropdowns after navbar is loaded
      var elemsDropdown = document.querySelectorAll('.dropdown-trigger');
      M.Dropdown.init(elemsDropdown, {
        coverTrigger: false,
        constrainWidth: false,
      });

      // Initialize sidenav after navbar is loaded
      var elemsSidenav = document.querySelectorAll('.sidenav');
      M.Sidenav.init(elemsSidenav);

      // Load notifications into the dropdown
      var notificationsDropdown = document.getElementById(
        'notifications-dropdown'
      );
      if (notificationsDropdown) {
        console.log('Dropdown element found');

        // Establish socket connection
        var socket = io();

        // Listen for notifications from the server
        socket.on('notifications', function (notifications) {
          console.log('New notifications received:', notifications);

          // Sort notifications to have non-Taken ones at the top
          notifications.sort((a, b) => {
            if (a.status === 'Not taken' && b.status !== 'Not taken') return -1;
            if (a.status !== 'Not taken' && b.status === 'Not taken') return 1;
            return 0;
          });

          notifications.forEach((notification) => {
            const notificationItem = document.createElement('li');
            notificationItem.innerHTML = `
                            <div class="notification">
                                <div class="notification-header">
                                    <i class="material-icons">notifications_none</i>
                                    <span>${
                                      notification.title ||
                                      notification.medication_name
                                    }</span>
                                </div>
                                <div class="notification-body">
                                    <span>${notification.date} at ${
              notification.time
            }</span>
                                </div>
                                <div class="status ${notification.status
                                  .toLowerCase()
                                  .replace(' ', '-')}">
                                    <i class="material-icons">
                                        ${
                                          notification.status === 'Taken'
                                            ? 'check_circle'
                                            : notification.status === 'Skipped'
                                            ? 'cancel'
                                            : 'notifications_none'
                                        }
                                    </i>
                                    <span>${notification.status}</span>
                                </div>
                                ${
                                  notification.status === 'Not taken'
                                    ? `
                                <div class="notification-actions">
                                    <button onclick="handleMedicationAction('Taken', '${notification._id}')">Taken</button>
                                    <button onclick="handleMedicationAction('Skipped', '${notification._id}')">Skipped</button>
                                </div>
                                `
                                    : ''
                                }
                            </div>
                        `;
            notificationsDropdown.insertBefore(
              notificationItem,
              notificationsDropdown.firstChild
            ); // Insert at the top
          });
        });
      }

      // Function for handling medication actions
      window.handleMedicationAction = function (action, notificationId, index) {
        console.log(
          `Handling action: ${action} for notificationId: ${notificationId} at index: ${index}`
        );
        fetch(`/notify/taken/${notificationId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            notificationId: notificationId,
            status: action,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              throw response;
            }
            return response.json();
          })
          .then((data) => {
            console.log('Action response:', data);

            // Find the notification item and update its status
            const notificationsDropdown = document.getElementById(
              'notifications-dropdown'
            );
            const notificationItems =
              notificationsDropdown.getElementsByTagName('li');
            const notificationItem = notificationItems[index];

            if (notificationItem) {
              const statusDiv = notificationItem.querySelector('.status');
              const actionsDiv = notificationItem.querySelector(
                '.notification-actions'
              );

              if (statusDiv && actionsDiv) {
                statusDiv.className = 'status ' + action.toLowerCase();
                statusDiv.innerHTML = `
                                <i class="material-icons">${
                                  action === 'taken' ? 'check_circle' : 'cancel'
                                }</i>
                                <span>${
                                  action.charAt(0).toUpperCase() +
                                  action.slice(1)
                                }</span>
                            `;
                actionsDiv.remove();
              }

              // Move the notification item one place down
              if (index < notificationItems.length - 1) {
                notificationsDropdown.insertBefore(
                  notificationItem.nextElementSibling,
                  notificationItem
                );
              }
            }
          })
          .catch((error) => {
            console.error('Error handling action:', error);
            error
              .text()
              .then((errorMessage) =>
                console.error('Server error response:', errorMessage)
              );
          });
      };
    });

  // Fetch user data
  fetch('/profile/details')
    .then((response) => response.json())
    .then((data) => {
      const firstName = data.user_first_name || '';
      const lastName = data.user_last_name || '';
      const initials = `${firstName.charAt(0)}${lastName.charAt(
        0
      )}`.toUpperCase();
      document.getElementById('initialsCircle').textContent = initials;
    })
    .catch((error) => console.error('Error fetching user data:', error));
});
