const get = (url) => {
    return new Promise((resolve, reject) => {
        $.get(url)
            .done(resolve)
            .fail(reject)
    })
};

// Get promise for POST request
const post = (url, data) => {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: resolve,
            error: reject
        });
    });
};

const getMedications = async () => {
    try {
        const res = await get('/dashboard/getAllNotifications');
        return res.data;
    } catch (err) {
        console.error('Error getting medications:', err);
    }
};

$(document).ready(function() {
    getNotificationsToCalendar();
    $('.modal').modal();

    $('#modal-take-button').on('click', async function() {
        buttonAction("Taken");
    });

    $('#modal-skip-button').on('click', async function() {
        buttonAction("Skipped");
    });
});

const getNotificationsToCalendar = async () => {
    try {
        const medications = await getMedications();

        const statusColorMap = {
            'Not taken': '#f39c12', // Orange
            'Taken': '#27ae60', // Green
            'Skipped': '#e74c3c' // Red
        };

        const events = medications ? Object.values(medications).map(notification => ({
            title: notification.medication_name,
            start: `${notification.date}T${notification.time}`,
            color: statusColorMap[notification.status] || '#336e03', // Customize the color if needed
            extendedProps: {
                status: notification.status,
                _id: notification._id,
                date: notification.date,
                time: notification.time
            }
        })) : [];

        var calendarEl = document.getElementById('calendar');
        var calendar = new FullCalendar.Calendar(calendarEl, {
            views: {
                dayGridMonth: {
                    titleFormat: { year: 'numeric', month: '2-digit', day: '2-digit' }
                }
            },
            events: events, 
            eventClick: function(info) {
                if (!info.event) return;

                // Populate the modal with event details
                const { title, extendedProps } = info.event;
                $('#modal-id').text(`${extendedProps._id}`);
                $('#modal-medication-name').text(`${title}`);
                $('#modal-date').text(`${extendedProps.date}`);
                $('#modal-time').text(`${extendedProps.time}`);
                $('#modal-status').text(`${extendedProps.status}`);

                // Show or hide buttons based on status
                if (extendedProps.status === 'Not taken') {
                    $('#action-buttons').show();
                    $('#close-button').hide();
                } else {
                    $('#action-buttons').hide();
                    $('#close-button').show();
                }

                // Open the modal
                $('#medModal').modal('open');
            }
        });

        calendar.render();
    } catch (err) {
        console.error('Error loading medications:', err);
    }
};

const buttonAction = async (status) => {
    const notificationId = $('#modal-id').text();

    try {
        // Send a POST request to update the medication status to "Taken"
        const result = await post('/dashboard/updateNotificationStatus', { notificationId, status: status });
        alert(result.message);
        getNotificationsToCalendar();

        // Close the modal
        $('#medModal').modal('close');
    } catch (err) {
        console.error('Error updating notification status:', err);
    }
};
