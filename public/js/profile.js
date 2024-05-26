document.addEventListener('DOMContentLoaded', function() {
    // Fetch user data and populate the profile info
    fetch('/profile/details')
      .then(response => response.json())
      .then(data => {
        document.getElementById('display_first_name').textContent = data.user_first_name;
        document.getElementById('display_last_name').textContent = data.user_last_name;
        document.getElementById('display_email').textContent = data.user_email;
        document.getElementById('user_first_name').value = data.user_first_name;
        document.getElementById('user_last_name').value = data.user_last_name;
        document.getElementById('user_email').value = data.user_email;
      })
      .catch(error => console.error('Error fetching user data:', error));

    // Open modal
    document.getElementById('openModal').addEventListener('click', function() {
      document.getElementById('modal').style.display = 'flex';
    });

    // Close modal
    document.getElementById('closeModal').addEventListener('click', function() {
      document.getElementById('modal').style.display = 'none';
    });

    // Handle form submission
    document.getElementById('profileForm').addEventListener('submit', function(event) {
      event.preventDefault();

      const formData = new FormData(this);
      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      fetch('/profile/updateprofile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(result => {
        alert(result.message);
        // Update the displayed profile info
        document.getElementById('display_first_name').textContent = data.user_first_name;
        document.getElementById('display_last_name').textContent = data.user_last_name;
        document.getElementById('display_email').textContent = data.user_email;
        // Close the modal
        document.getElementById('modal').style.display = 'none';
      })
      .catch(error => console.error('Error updating profile:', error));
    });
  });
