function resetPasswordForm(){
     let newPassword = $('#newPassword').val();
     console.log("New Password: ", newPassword);
     let url = window.location.href;
     let values = url.split("/")
     let token = values[values.length - 2];
     let id = values[values.length - 1];
     console.log('token:', token);
     console.log('id:',id);
     postResetPassword(token,id,newPassword);
    }


function postResetPassword(token, id, newPassword) {
  let data={};
  data.password=newPassword;
  $.ajax({
      url: `/forgotPassword/${token}/${id}`,
      data: {newPassword},
      type: 'POST',
      success: (result) => {
        window.location.href = "/user/login";
      },
      error: (xhr, status, error) => {
        console.error('Error submitting data:', error);
      }
  });
}


$(document).ready(function(){
  console.log('Click Event Test1');
    
  $('#resetSubmit').click(()=>{
    console.log('Click Event Test2');
      resetPasswordForm();      
  });
  
});
