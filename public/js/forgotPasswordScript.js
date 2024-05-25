function forgotPasswordForm(){
     let email = $('#email').val();
     console.log("Email for Forgot Password Submitted: ", email );
     postForgotPassword(email);
    }


function postForgotPassword(email) {
  let data={};
  data.email = email;
  $.ajax({
      url: '/forgotPassword',
      data: data,
      type: 'POST',
      success: (result) => {
          console.log(result);
      },
      error: (xhr, status, error) => {
          console.error('Error submitting data:', error);
      }
  });
}

$(document).ready(function(){
  console.log('Click Event Test1');
    
  $('#emailSubmit').click(()=>{
    console.log('Click Event Test2');
      forgotPasswordForm();      
  });
  
});
