document.addEventListener('DOMContentLoaded', function() {
    function populateCategoryDropdown() {
        fetch('/admin/categories')
            .then(response => response.json())
            .then(categories => {
                const categoryDropdown = document.getElementById('articleCategory');
                categoryDropdown.innerHTML = ''; // Clear existing options
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.categoryId;
                    option.textContent = category.categoryName;
                    categoryDropdown.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching categories:', error));
    }

    populateCategoryDropdown();

    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');

    // Add Category Form
    const addCategoryForm = document.getElementById('addCategoryForm');
    const categoryNameInput = document.getElementById('categoryName');

    addCategoryForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const categoryName = categoryNameInput.value;

        const categoryData = JSON.stringify({
            categoryName: categoryName,
        });

        console.log("Category data: ", categoryData)

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/admin/add-category', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('CSRF-Token', csrfToken); // Set CSRF token in the request header

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log('Response received:', xhr.responseText);  // Log the full response
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (xhr.status === 201) {
                        if (response.success) {
                            console.log('Category adding successful:', response);
                            loadSection('categories');
                            closeModal('addCategoryModal');

                        } else {
                            console.error('Category adding failed:', response.message);
                            alert(response.message);  // Show error message to user
                        }
                    }
                    else {
                        console.error('Server responded with status:', xhr.status);
                        alert('Category adding failed. Please try again.');
                    }
                } catch (error) {
                    console.error('Error parsing server response:', error.message);
                    alert('There was a problem with the category response.');
                }
            }
        };

        xhr.onerror = function() {
            console.error('Network error during the category adding process.');
            alert('Network error. Please check your connection and try again.');
        };

        xhr.send(categoryData);
    });

    // Add Product Form
    const addProductForm = document.getElementById('addProductForm');
    addProductForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(addProductForm);
        const productData = {};

        formData.forEach((value, key) => {
            productData[key] = value;
        });

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/admin/add-product', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (xhr.status === 201) {
                        if (response.success) {
                            showMessage('success', response.message);
                            loadSection('products');
                            closeModal('addProductModal');
                        } else {
                            showMessage('danger', response.message);
                        }
                    } else {
                        showMessage('danger', 'Product adding failed. Please try again.');
                    }
                } catch (error) {
                    showMessage('danger', 'There was a problem with the product response.');
                }
            }
        };

        xhr.onerror = function() {
            showMessage('danger', 'Network error. Please check your connection and try again.');
        };

        xhr.send(JSON.stringify(productData));
    });

    // Add Article Form
    const addArticleForm = document.getElementById('addArticleForm');
    addArticleForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(addArticleForm);
        const articleData = {};

        formData.forEach((value, key) => {
            articleData[key] = value;
        });

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/admin/add-article', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('CSRF-Token', csrfToken); // Set CSRF token in the request header

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (xhr.status === 201) {
                        if (response.success) {
                            showMessage('success', response.message);
                            loadSection('articles');
                            closeModal('addArticleModal');
                        } else {
                            showMessage('danger', response.message);
                        }
                    } else {
                        showMessage('danger', 'Article adding failed. Please try again.');
                    }
                } catch (error) {
                    showMessage('danger', 'There was a problem with the article response.');
                }
            }
        };

        xhr.onerror = function() {
            showMessage('danger', 'Network error. Please check your connection and try again.');
        };

        xhr.send(JSON.stringify(articleData));
    });

    // Add User Form
    const addUserForm = document.getElementById('addUserForm');
    addUserForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(addUserForm);
        const userData = {};

        formData.forEach((value, key) => {
            userData[key] = value;
        });

        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/admin/add-user', true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (xhr.status === 201) {
                        if (response.success) {
                            showMessage('success', response.message);
                            loadSection('admins');
                            closeModal('addUserModal');
                        } else {
                            showMessage('danger', response.message);
                        }
                    } else {
                        showMessage('danger', 'User adding failed. Please try again.');
                    }
                } catch (error) {
                    showMessage('danger', 'There was a problem with the user response.');
                }
            }
        };

        xhr.onerror = function() {
            showMessage('danger', 'Network error. Please check your connection and try again.');
        };

        xhr.send(JSON.stringify(userData));
    });
});

function loadSection(section) {
    fetch(`/admin/${section}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('section-content').innerHTML = generateTable(section, data);
        })
        .catch(error => console.error('Error loading section:', error));
}

function generateTable(section, data) {
    let tableHeader = '';
    let tableRows = '';

    if (section === 'articles') {
        tableHeader = '<th>No.</th><th>Title</th><th>Date & Time</th><th>Action</th>';
        data.forEach((item, index) => {
            tableRows += `<tr>
                <td>${index + 1}</td>
                <td>${item.articleTitle}</td>
                <td>${item.createdAt}</td>
                <td>
                    <a href="blog/article/${item.articleId}" class="btn btn-info">Preview</a>
                    <button onclick="deleteItem('articles', '${item.articleId}')" class="btn btn-danger">Delete</button>
                </td>
            </tr>`;
        });
    } else if (section === 'categories') {
        tableHeader = '<th>No.</th><th>Name</th><th>Action</th>';
        data.forEach((item, index) => {
            tableRows += `<tr>
                <td>${index + 1}</td>
                <td>${item.categoryName}</td>
                <td>
                    <a href="/blog/category/${item.categoryId}" class="btn btn-info">Preview</a>
                    <button onclick="deleteItem('categories', '${item.categoryId}')" class="btn btn-danger">Delete</button>
                </td>
            </tr>`;
        });
    } else if (section === 'admins') {
        tableHeader = '<th>No.</th><th>Email</th><th>Action</th>';
        data.forEach((item, index) => {
            tableRows += `<tr>
                <td>${index + 1}</td>
                <td>${item.userEmail}</td>
                <td>
                    <a href="/admin/user/${item.userId}" class="btn btn-info">Preview</a>
                    <button onclick="deleteItem('admins', '${item.userId}')" class="btn btn-danger">Delete</button>
                </td>
            </tr>`;
        });
    } else if (section === 'products') {
        tableHeader = '<th>No.</th><th>Name</th><th>Price</th><th>Action</th>';
        data.forEach((item, index) => {
            tableRows += `<tr>
                <td>${index + 1}</td>
                <td>${item.productName}</td>
                <td>${item.productPrice}</td>
                <td>
                    <a href="product-detail?productId=${item.productId}" class="btn btn-info">Preview</a>
                    <button onclick="deleteItem('products', '${item.productId}')" class="btn btn-danger">Delete</button>
                </td>
            </tr>`;
        });
    }

    return `<h2>${capitalizeFirstLetter(section)}</h2>
        <table>
            <thead>
                <tr>${tableHeader}</tr>
            </thead>
            <tbody>${tableRows}</tbody>
        </table>`;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Utility functions to open and close modals
function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Utility function to show success or error messages
function showMessage(type, message) {
    const messageBox = document.createElement('div');
    messageBox.className = `alert alert-${type}`;
    messageBox.innerText = message;
    document.body.appendChild(messageBox);
    setTimeout(() => {
        document.body.removeChild(messageBox);
    }, 3000);
}

// Update the deleteItem function to use the correct method and URL structure
function deleteItem(section, id) {
    const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
    if(confirm('Are you sure you want to delete this item?')) {
        const xhr = new XMLHttpRequest();
        let url = '';
        if (section === "categories") {
            url = `/admin/delete-${section.slice(0, -3)}y/${id}`;
        } else {
            url = `/admin/delete-${section.slice(0, -1)}/${id}`;
        }
        xhr.open('DELETE', url, true);
        xhr.setRequestHeader('CSRF-Token', csrfToken); // Set CSRF token in the request header

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (xhr.status === 200) {
                        if (response.success) {
                            showMessage('success', 'Item deleted successfully');
                            loadSection(section);
                        } else {
                            showMessage('danger', 'Error deleting item');
                        }
                    } else {
                        showMessage('danger', 'Error deleting item');
                    }
                } catch (error) {
                    showMessage('danger', 'Error processing the delete response.');
                }
            }
        };

        xhr.onerror = function() {
            showMessage('danger', 'Network error. Please check your connection and try again.');
        };

        xhr.send();
    } else {
        console.log("User denied.");
        showMessage('danger', 'Deletion cancelled.');
    }
}
