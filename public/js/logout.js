document.getElementById('logoutButton').addEventListener('click', async () => {
  const response = await fetch('/auth/logout', {
    method: 'POST',
    credentials: 'same-origin',
  });

  if (response.ok) {
    window.location.href = '/'; // Redirect to login page after Logout
  } else {
    alert('Logout failed');
  }
});
