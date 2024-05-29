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

      // Get the notification bell icon element
      const notificationBellIcon = document.getElementById(
        'change-notification-icon'
      );

      let notificationIconState = localStorage.getItem('notificationIconState');
      let notificationInfoState = localStorage.getItem('notificationInfoState');

      //console.log(notificationIconState, 'hallo');

      //console.log(notificationInfoState);

      // Load notifications into the dropdown
      var notificationsDropdown = document.getElementById(
        'notifications-dropdown'
      );

      if (notificationIconState == 'notifications_active') {
        notificationBellIcon.textContent = notificationIconState;
      } else {
        notificationBellIcon.textContent = 'notifications_none';
      }

      notificationBellIcon.addEventListener('click', function () {
        notificationBellIcon.textContent = 'notifications_none';
        localStorage.setItem('notificationIconState', 'notifications_none');
      });

      if (notificationsDropdown) {
        var socket = io();

        // Listen for notifications from the server
        socket.on('notifications', function (notifications) {
          console.log('New notifications received:', notifications);

          // Sort Notifications to have non-Taken ones at the top
          notifications.sort((a, b) => {
            if (a.status === 'Not taken' && b.status !== 'Not taken') return -1;
            if (a.status !== 'Not taken' && b.status === 'Not taken') return 1;
            return 0;
          });

          notifications.forEach((notification) => {
            if (notification.status === 'Not taken') {
              notificationBellIcon.textContent = 'notifications_active';
              localStorage.setItem(
                'notificationIconState',
                'notifications_active'
              );
            }

            const notificationItem = document.createElement('li');
            notificationItem.innerHTML = `<div>
          <div
            style="
              width: 320px;
              border-bottom: 1px solid rgba(143, 143, 143, 0.753);
              padding: 10px;
              margin: 0px 0px;
              color: black;
            ">
            <div style="display: flex; align-items: center">
              <div>
                <i
                  class="material-icons"
                  style="
                    opacity: 0.7;
                    padding-right: 10px;
                    margin-bottom: 20px;
                    font-size: 30px;
                  "
                  >notifications_none</i
                >
                <i></i>
              </div>

              <div style="all: unset">
                <div style="padding-left: 15px; padding-bottom: 10px">
                  <p
                    style="
                      height: 35px;
                      padding: 0px;
                      margin: 0px;
                      font-size: 19px;
                      font-weight: 500;
                    ">
                    ${notification.medication_name}
                  </p>

                  <p
                    style="
                      height: 10px;
                      opacity: 0.8;
                      font-size: 16px;
                      margin-top: 0px;
                      margin-bottom: 0px;
                      padding-bottom: 30px;
                    ">
                    ${notification.date} at ${notification.time}
                  </p>
                </div>

                <div>
                  <a
                    class="blue lighten-1 white-text waves-effect waves-light btn-small z-depth-1"
                    style="
                      height: max-content;
                      border-radius: 20px;
                      padding: 0px 25px;
                    "
                    onclick="handleMedicationAction('Taken', '${notification._id}')">
                    Take</a
                  >
                  <a
                    class="red lighten-1 white-text waves-effect waves-light btn-small z-depth-1"
                    style="
                      height: max-content;
                      border-radius: 20px;
                      padding: 0px 25px;
                    "
                    onclick="handleMedicationAction('Skipped', '${notification._id}')">
                    Skip</a
                  >
                </div>
              </div>
            </div>
          </div>
          <div
            style="
              width: 320px;
              background: white;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              padding: 0px;
              margin: 0px 0px 0px 0px;
            "></div>
        </div>
                        `;

            localStorage.setItem('notificationInfoState', notificationItem);
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
