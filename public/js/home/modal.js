document.addEventListener('DOMContentLoaded', function() {
    const registerButton = document.getElementById('registerButton');
    if (registerButton) {
        registerButton.addEventListener('click', function(event) {
            event.preventDefault();  // Prevent the form from submitting the traditional way

            const firstname = document.getElementById('signup-firstname').value;
            const lastname = document.getElementById('signup-lastname').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            
            const formData = JSON.stringify({
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password
            });
        
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/auth/register", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    try {
                        var data = JSON.parse(xhr.responseText);
                        if (xhr.status === 201) {
                            // Redirect to another page after successful registration
                            window.location.href = '/'; 
                        } else {
                            // Handle other statuses, including errors
                            console.error("Error:", data.message);
                            alert(data.message);  // Show an alert with the error message
                        }
                    } catch (error) {
                        console.error("Error parsing JSON:", error);
                        alert("There was an error processing your request.");  // Fallback error message
                    }
                }
            };
            
            xhr.onerror = function () {
                console.error("Network Error");
                alert("Network error, please try again later.");  // Alert user on network error
            };
            
            xhr.send(formData);
        });
    } else {
        console.error("Register button not found");
    }
});


// function prefillLoginForm() {
//     const encryptedEmail = getCookie('rememberEmail');
//     const encryptedPassword = getCookie('rememberPassword'); 

//     console.log(encryptedEmail, encryptedPassword)

//     if (encryptedEmail && encryptedPassword) {
//         loginEmailInput.value = decrypt(encryptedEmail);
//         loginPasswordInput.value = decrypt(encryptedPassword);
//         rememberMeCheckbox.checked = true;
//         console.log("Login form filled")
//     }
// }

// function decrypt(encryptedText) {
//     let textParts = encryptedText.split(':');
//     let iv = Buffer.from(textParts.shift(), 'hex');
//     let encrypted = Buffer.from(textParts.join(':'), 'hex');
//     let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
//     let decrypted = decipher.update(encrypted, 'hex', 'utf8');
//     decrypted += decipher.final('utf8');
//     console.log("Decrypt: ", decrypted)
//     return decrypted;
// }

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
async function encryptText(plainText, key) {
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const encodedText = new TextEncoder().encode(plainText);
    const encryptedContent = await crypto.subtle.encrypt({ name: 'AES-CBC', iv }, key, encodedText);
    const buffer = new Uint8Array(encryptedContent);
    const result = new Uint8Array(iv.byteLength + buffer.byteLength);
    result.set(iv, 0);
    result.set(buffer, iv.byteLength);
    return btoa(String.fromCharCode(...result));
}

async function decryptText(encryptedText, key) {
    const data = atob(encryptedText).split('').map(char => char.charCodeAt(0));
    const iv = new Uint8Array(data.slice(0, 16));
    const encryptedContent = new Uint8Array(data.slice(16));
    const decryptedContent = await crypto.subtle.decrypt({ name: 'AES-CBC', iv }, key, encryptedContent);
    return new TextDecoder().decode(decryptedContent);
}

async function getKey() {
    const rawKey = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode('your-secret-key'),
        'AES-CBC',
        true,
        ['encrypt', 'decrypt']
    );
    return rawKey;
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/;Secure;HttpOnly`;
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const rememberMeCheckbox = document.getElementById('remember-me');
       
    function prefillLoginForm() {
        fetch('/get-decrypted-credentials')
            .then(response => response.json())
            .then(data => {
                if (data.email && data.password) {
                    loginEmailInput.value = data.email;
                    loginPasswordInput.value = data.password;
                    rememberMeCheckbox.checked = true;
                }
            })
            .catch(error => {
                console.error('Error fetching decrypted credentials:', error);
            });
    }

    prefillLoginForm();

    rememberMeCheckbox.addEventListener('change', function() {
        if (!rememberMeCheckbox.checked) {
            loginEmailInput.value = '';
            loginPasswordInput.value = '';
            deleteCookie('rememberEmail');
            deleteCookie('rememberPassword');

            console.log("Delete Get Email cookie", getCookie('rememberEmail'));
            console.log("Delete Get Password cookie", getCookie('rememberPassword'));
        } else {
            // Set cookies on the client-side when remember me is checked
            // const encryptedEmail = encrypt(loginEmailInput.value);
            // const encryptedPassword = encrypt(loginPasswordInput.value);
            setCookie('rememberEmail', response.encryptedEmail, 30);
            setCookie('rememberPassword', response.encryptedPassword, 30);

            console.log("Set Get Email cookie", getCookie('rememberEmail'));
            console.log("Set Get Password cookie", getCookie('rememberPassword'));
        }
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;
        const rememberMe = rememberMeCheckbox.checked;

        const loginData = JSON.stringify({
            email: email,
            password: password,
            rememberMe: rememberMe
        });

        console.log(loginData)

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/auth/login', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log('Response received:', xhr.responseText);  // Log the full response
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (xhr.status === 200) {
                        if (response.success) {
                            console.log('Login successful:', response);
                            alert(response.message)
                            if (rememberMe) {
                                setCookie('rememberEmail', response.encryptedEmail, 30);
                                setCookie('rememberPassword', response.encryptedPassword, 30);
                            }

                           location.reload(); // Reload the page to update the UI
                        } else {
                            console.error('Login failed:', response.message);
                            alert(response.message);  // Show error message to user
                        }
                    } else if (xhr.status === 401){
                        alert(response.message);
                    } else {
                        console.error('Server responded with status:', xhr.status);
                        alert('Login failed. Please try again.');
                    }
                } catch (error) {
                    console.error('Error parsing server response:', error.message);
                    alert('There was a problem with the login response.');
                }
            }
        };

        xhr.onerror = function() {
            console.error('Network error during the login process.');
            alert('Network error. Please check your connection and try again.');
        };

        xhr.send(loginData);
    });

    rememberMeCheckbox.addEventListener('change', function() {
        if (!rememberMeCheckbox.checked) {
            deleteCookie('rememberEmail');
            deleteCookie('rememberPassword');
        }
    });
});
