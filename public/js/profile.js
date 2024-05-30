$(document).ready(function () {
  // Initialize the modal
  $('.modal').modal();

  // Fetch User data and populate the profile info
  $.get('/profile/details', function (data) {
    $('#display_first_name').text(data.user_first_name);
    $('#display_last_name').text(data.user_last_name);
    $('#display_email').text(data.user_email);
    $('#user_first_name').val(data.user_first_name);
    $('#user_last_name').val(data.user_last_name);
    $('#user_email').val(data.user_email);

    // Activate labels if the input fields have values
    if (data.user_first_name) {
      $('label[for="user_first_name"]').addClass('active');
    }
    if (data.user_last_name) {
      $('label[for="user_last_name"]').addClass('active');
    }
    if (data.user_email) {
      $('label[for="user_email"]').addClass('active');
    }
  }).fail(function (error) {
    console.error('Error fetching user data:', error);
  });

  // Open modal
  $('#openModal').on('click', function () {
    $('#profileModal').modal('open');
  });

  // Handle form submission
  $('#profileForm').on('submit', function (event) {
    event.preventDefault();

    const data = {
      user_first_name: $('#user_first_name').val(),
      user_last_name: $('#user_last_name').val(),
      user_email: $('#user_email').val(),
    };

    $.ajax({
      url: '/profile/updateprofile',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function (result) {
        alert(result.message);
        // Update the displayed profile info
        $('#display_first_name').text(data.user_first_name);
        $('#display_last_name').text(data.user_last_name);
        $('#display_email').text(data.user_email);

        // Prevent value and label overlap
        $('label[for="user_first_name"]').addClass('active');
        $('label[for="user_last_name"]').addClass('active');
        $('label[for="user_email"]').addClass('active');

        // Close the modal
        $('#profileModal').modal('close');
      },
      error: function (error) {
        console.error('Error updating profile:', error);
      },
    });
  });
});
