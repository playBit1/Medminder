
function loginForm() {
  let formData = {};
  
  formData.user_email = $('#email').val();
  formData.user_password = $('#password').val();
      
  console.log("Form Data Submitted: ", formData);
  postLogin(formData);
}

function postLogin(user) {
  $.ajax({
      url: '/auth/login',
      data: user,
      type: 'POST',
      success: (result) => {
          console.log(result.data);
          console.log('Data submitted successfully:', user); // Log the submitted data
          console.log('Server response:', result.data);
          window.location.href = '/dashboard';
      },
      error: (xhr, status, error) => {
          console.error('Error submitting data:', error); // Log any errors
          
      }
  });
}


$(document).ready(function(){
  console.log('Click Event Test1');
  //$('.modal').modal();
  //$('#clickMeButton').click(()=>{});
  
  $('#loginSubmit').click(()=>{
    console.log('Click Event Test2');
      loginForm();
      
  });
  
});

