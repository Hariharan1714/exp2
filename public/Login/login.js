function login(e) {
    e.preventDefault();
    console.log(e.target.name);

    const loginDetails = {
        email: e.target.email.value,
        password: e.target.password.value

    }
    console.log(loginDetails)
    axios.post('http://3.24.215.182:3000/user/login',loginDetails).then(response => {
            alert(response.data.message)
            console.log(response.data)
            localStorage.setItem('token', response.data.token)
            window.location.href = "../ExpenseTracker/index.html"
    }).catch(err => {
        console.log(JSON.stringify(err))
        document.body.innerHTML += `<div style="color:red;">${err.message} <div>`;
    })
}

document.getElementById('forgotPasswordBtn').addEventListener('click', function() {
    document.getElementById('forgotPasswordForm').style.display = 'block';
});

document.getElementById('forgotPassword').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('forgotEmail').value;

    try {
        const response = await axios.post('/password/forgotpassword', { email });

        if (response.status === 200) {
            alert('Password reset link has been sent to your email.');
        } else {
            alert('Error sending password reset link.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while sending the password reset link');
    }
});


eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY2MjcwNTE3MX0.wDC7ABZuczLS4Zqv8Yzquqi2bGwX5J_pWqamP7gXS4I


















