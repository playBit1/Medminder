function resetPasswordForm() {
  let newPassword = $('#newPassword').val();
  let confirmNewPassword = $('#confirmNewPassword').val();
  
  if (newPassword.length < 6) {
    alert('Password should be at least 6 characters long.');
    return;
  }

  // Password match validation
  if (newPassword !== confirmNewPassword) {
    alert('Passwords do not match. Please try again.');
    return;
  }

  let values = window.location.pathname.split("/");
  let token = values[values.length - 2];
  let id = values[values.length - 1];

  postResetPassword(token, id, newPassword);
}

function postResetPassword(token, id, newPassword) {
  let data = { newPassword: newPassword };
  $.ajax({
    url: `/forgotPassword/${token}/${id}`,
    data: JSON.stringify(data),
    type: 'POST',
    contentType: 'application/json',
    success: (result) => {
      alert('Password reset successfully. You will be redirected to the login page.');
      window.location.href = "/user/login";
    },
    error: (xhr, status, error) => {
      let errorMessage = "Error submitting: ";
      try {
        let response = JSON.parse(xhr.responseText);
        if (response.message) {
          errorMessage += response.message;
        } else {
          errorMessage += xhr.responseText;
        }
      } catch (e) {
        errorMessage += xhr.responseText;
      }
      alert(errorMessage);
    }
  });
}

$(document).ready(function() {
  $('#resetSubmit').click(() => {
    resetPasswordForm();
  });
});
