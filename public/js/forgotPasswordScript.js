function forgotPasswordForm() {
  let email = $('#email').val();
  postForgotPassword(email);
}

function postForgotPassword(email) {
  let data = {};
  data.email = email;
  alert('The form is submitted. Please wait for a few seconds.');
  $.ajax({
    url: '/forgotPassword/sendEmail',
    data: data,
    type: 'POST',
    success: (result) => {
      alert(result.message);
      window.location.reload();
    },
    error: (xhr, status, error) => {
      let errorMessage = 'Error submitting: ';
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
    },
  });
}

$(document).ready(function () {
  $('#emailSubmit').click(() => {
    forgotPasswordForm();
  });
});
