function handleCredentialResponse(response) {
    // Decode the JWT token Google returns
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    const email = payload.email;

    if (!email.endsWith('@ucr.edu')) {
    document.getElementById('error-msg').style.display = 'block';
    return;
    }

    // UCR student confirmed — show protected content
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('member-area').style.display = 'block';
    document.getElementById('welcome-msg').textContent = `Welcome, ${payload.name}!`;
}

function signOut() {
    google.accounts.id.disableAutoSelect();
    location.reload();
}