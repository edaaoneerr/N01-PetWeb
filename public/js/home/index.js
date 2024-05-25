document.addEventListener('DOMContentLoaded', function() {
    // Get all tab elements
    var tabs = document.querySelectorAll('.tabs');

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            // Remove 'active' class from all tabs and adjust header styles
            document.querySelectorAll('.tabs').forEach(function(innerTab) {
                innerTab.classList.remove('active');
                var header = innerTab.querySelector('h6');
                if (header) {
                    header.classList.remove('font-weight-bold');
                    header.classList.add('text-muted');
                }
            });

            // Add 'active' class to the clicked tab and adjust header styles
            this.classList.add('active');
            var activeHeader = this.querySelector('h6');
            if (activeHeader) {
                activeHeader.classList.remove('text-muted');
                activeHeader.classList.add('font-weight-bold');
            }

            // Determine the corresponding fieldset to show
            var next_fs_id = this.id + '1';
            var next_fs = document.getElementById(next_fs_id);

            // Hide all fieldsets and show the one corresponding to the clicked tab
            document.querySelectorAll('fieldset').forEach(function(fs) {
                fs.classList.remove('show');
                fs.style.display = 'none'; // Hide fieldset
            });

            if (next_fs) {
                next_fs.classList.add('show');
                next_fs.style.display = 'block'; // Show fieldset
            }
        });
    });
});
function viewProduct(productId) {
    window.location.href = `product-detail.html?productId=${productId}`;
}

document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault();  // Prevent the default link behavior
        
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "/auth/logout", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    try {
                        var data = JSON.parse(xhr.responseText);
                        if (xhr.status === 201) {
                            // Redirect to the homepage after successful logout
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

            xhr.send();  // Send the request
        });
    } else {
        console.error("Logout button not found");
    }
});