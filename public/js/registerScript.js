
function registerForm() {
  let formData = {};
  formData.user_first_name = $('#first_name').val();
  formData.user_last_name = $('#last_name').val();
  formData.user_gender = $('#gender').val();
  formData.user_email = $('#email').val();
  formData.user_password = $('#password').val();
      
  console.log("Form Data Submitted: ", formData);
  postRegister(formData);
}

function postRegister(user) {
  $.ajax({
      url: '/registerUser',
      data: user,
      type: 'POST',
      success: (result) => {
          console.log(result.data);
          console.log('Data submitted successfully:', user); // Log the submitted data
          console.log('Server response:', result.data);
          location.reload();
      },
      error: (xhr, status, error) => {
          console.error('Error submitting data:', error); // Log any errors
          // Handle the error
      }
  });
}


$(document).ready(function(){
  console.log('Click Event Test1');
  //$('.modal').modal();
  //$('#clickMeButton').click(()=>{});
  
  $('#registerSubmit').click(()=>{
    console.log('Click Event Test2');
      registerForm();
      
  });
  
});