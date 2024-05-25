function registerForm() {
  let formData = {};
  formData.user_email = $('#email').val();
  formData.user_password = $('#password').val();
  formData.user_first_name = $('#first_name').val();
  formData.user_last_name = $('#last_name').val();
  formData.user_gender = $('#gender').val();
  const confirmPassword = $('#confirm_password').val();

  if (!validateEmail(formData.user_email)) {
    alert('Please enter a valid email address.');
    return;
  }

  if (formData.user_password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  if (formData.user_password.length < 6) {
    alert('Password should be at least 6 characters long.');
    return;
  }

  if (formData.user_email == "" || 
      formData.user_password == "" || 
      formData.user_first_name == "" ||
      formData.user_last_name == "" || 
      formData.user_gender == ""
  ) {
    alert('Please fill in all required fields.');
    return;
  }

  postRegister(formData);
};

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function postRegister(user) {
  console.log(user);
  $.ajax({
    url: '/auth/register',
    data: JSON.stringify(user),
    type: 'POST',
    contentType: 'application/json',
    dataType: 'json',
    success: (result) => {
      alert(result.message);
      window.location.href = '/user/login';
    },
    error: (xhr, status, error) => {
      let errorMessage = "Error registering: ";
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
  $('#submitRegister').click(() => {
    registerForm();
  });
});
