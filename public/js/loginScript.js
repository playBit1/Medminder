
function loginForm() {
  let formData = {};
  
  formData.user_email = $('#email').val();
  formData.user_password = $('#password').val();

  if (formData.user_email == "" || formData.user_password == "") {
    alert('Please fill in all required fields.');
    return;
  }
      
  postLogin(formData);
}

function postLogin(user) {
  $.ajax({
    url: '/auth/login',
    data: user,
    type: 'POST',
    success: (result) => {
      alert(result.message);
      window.location.href = '/dashboard';
    },
    error: (xhr, status, error) => {
      alert('Error logging in: User ' + error);
    }
  });
}

$(document).ready(function(){
  $('#loginSubmit').click(()=>{
    loginForm();
  });
});

