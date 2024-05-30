document.getElementById('logoutButton').addEventListener('click', async () => {
  const userConfirmed = confirm('Are you sure you want to log out?');

  if (userConfirmed) {
    const response = await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
    });

    if (response.ok) {
      alert('Logout successfully.');
      window.location.href = '/';
    } else {
      alert('Logout failed');
    }
  } else {
    alert('Logout canceled.');
  }
});
