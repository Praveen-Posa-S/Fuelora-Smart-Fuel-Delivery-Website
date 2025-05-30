// Toggle Settings Dropdown
document.getElementById("settingsBtn").addEventListener("click", function (event) {
    let dropdown = document.getElementById("settingsDropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    event.stopPropagation();
});

window.addEventListener("click", function (event) {
    if (!event.target.closest("#settingsDropdown") && event.target !== document.getElementById("settingsBtn")) {
        document.getElementById("settingsDropdown").style.display = "none";
    }
});

// Profile Modal Toggle
let profileBtn = document.getElementById("profileBtn");
let profileModal = document.getElementById("profileModal");
let settingsModal = document.getElementById("settingsModal");
let closeModal = document.querySelectorAll(".close");

profileBtn.addEventListener("click", function () {
    profileModal.style.display = "block";
    fetchTransactionHistory();
});

closeModal.forEach(btn => {
    btn.addEventListener("click", function () {
        settingsModal.style.display = "none";
        profileModal.style.display = "none";
    });
});

// Settings Modal
const feedbackBtn = document.getElementById("feedbackBtn");
const supportBtn = document.getElementById("supportBtn");
const closeBtn = document.querySelector(".close");

function openSettingsModal(section) {
    settingsModal.style.display = "block";
    document.getElementById("feedbackSection").style.display = "none";
    document.getElementById("supportSection").style.display = "none";
    document.getElementById(section).style.display = "block";
}

feedbackBtn.addEventListener("click", () => openSettingsModal("feedbackSection"));
supportBtn.addEventListener("click", () => openSettingsModal("supportSection"));
closeBtn.addEventListener("click", () => {
    settingsModal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
        settingsModal.style.display = "none";
    }
});

// Submit Feedback
document.getElementById('submitFeedback').addEventListener('click', async function() {
    const feedbackText = document.getElementById('feedbackInput').value;
    const feedbackMessage = document.getElementById('feedbackMessage');
    
    if (!feedbackText.trim()) {
        feedbackMessage.textContent = 'Please enter your feedback';
        feedbackMessage.style.color = 'red';
        return;
    }

    try {
        // Get the authentication token from localStorage
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token); // Debug log
        
        // Get username from localStorage
        const username = localStorage.getItem('userName');
        console.log('Username from localStorage:', username); // Debug log

        const headers = {
            'Content-Type': 'application/json'
        };

        // Only add Authorization header if token exists
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        console.log('Request headers:', headers); // Debug log

        const response = await fetch('http://localhost:5000/api/feedback', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                feedback: feedbackText,
                username: username || 'Anonymous' // Include username in request body as fallback
            })
        });

        const data = await response.json();
        console.log('Response data:', data); // Debug log

        if (response.o) {
            feedbackMessage.textContent = 'Thank you for your feedback!';
            feedbackMessage.style.color = 'green';
            document.getElementById('feedbackInput').value = '';
            
            // Close the feedback modal after 2 seconds
            setTimeout(() => {
                document.getElementById('settingsModal').style.display = 'none';
                feedbackMessage.textContent = '';
            }, 2000);
        } else {
            feedbackMessage.textContent = data.message || 'Error submitting feedback';
            feedbackMessage.style.color = 'red';
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
        feedbackMessage.textContent = 'Error submitting feedback. Please try again.';
        feedbackMessage.style.color = 'red';
    }
});

// Submit Support
document.getElementById("submitSupport").addEventListener("click", function () {
    const supportName = document.getElementById("supportName").value;
    const supportPhone = document.getElementById("supportPhone").value;
    const supportLanguage = document.getElementById("supportLanguage").value;
    const supportMsg = document.getElementById("supportInput").value;
    const supportMessage = document.getElementById("supportMessage");

    // Validate all fields
    if (!supportName.trim() || !supportPhone.trim() || !supportLanguage || !supportMsg.trim()) {
        supportMessage.textContent = "Please fill in all fields";
        supportMessage.style.color = "red";
        return;
    }

    // Validate phone number
    if (!/^\d{10}$/.test(supportPhone)) {
        supportMessage.textContent = "Please enter a valid 10-digit phone number";
        supportMessage.style.color = "red";
        return;
    }

    // Show thank you message and support note
    supportMessage.textContent = 'Thank you for contacting support! Our team will get back to you soon.';
    supportMessage.style.color = 'green';
    document.getElementById("supportName").value = '';
    document.getElementById("supportPhone").value = '';
    document.getElementById("supportLanguage").value = '';
    document.getElementById("supportInput").value = '';
    setTimeout(() => {
        document.getElementById('settingsModal').style.display = 'none';
        supportMessage.textContent = '';
    }, 2000);
});

// Toggle between user and admin login fields
const adminToggle = document.getElementById('adminToggle');
const userFields = document.getElementById('userFields');
const adminFields = document.getElementById('adminFields');

adminToggle.addEventListener('change', function() {
    if (adminToggle.checked) {
        userFields.style.display = 'none';
        adminFields.style.display = 'block';
    } else {
        userFields.style.display = 'block';
        adminFields.style.display = 'none';
    }
});

// Toggle between user and admin sign-up fields
const adminSignUpToggle = document.getElementById('adminSignUpToggle');
const userSignUpFields = document.getElementById('userSignUpFields');
const adminSignUpFields = document.getElementById('adminSignUpFields');

adminSignUpToggle.addEventListener('change', function() {
    if (adminSignUpToggle.checked) {
        userSignUpFields.style.display = 'none';
        adminSignUpFields.style.display = 'block';
    } else {
        userSignUpFields.style.display = 'block';
        adminSignUpFields.style.display = 'none';
    }
});

// LOGIN FUNCTIONALITY
document.getElementById("loginBtn").addEventListener("click", async function () {
    const isAdmin = adminToggle.checked;
    let email, password, adminCode;

    if (isAdmin) {
        adminCode = document.getElementById("adminCode").value;
        email = document.getElementById("adminEmail").value;
        password = document.getElementById("adminPassword").value;
        if (!adminCode || !email || !password) {
            document.getElementById("loginMessage").textContent = "Please fill in all admin fields.";
            return;
        }
    } else {
        email = document.getElementById("loginEmail").value;
        password = document.getElementById("loginPassword").value;
    if (!email || !password) {
        document.getElementById("loginMessage").textContent = "Please enter both email and password.";
        return;
        }
    }

    try {
        const endpoint = isAdmin
            ? "http://localhost:5000/api/auth/admin-login"
            : "http://localhost:5000/api/auth/login";
        const body = isAdmin
            ? JSON.stringify({ email, password, adminCode })
            : JSON.stringify({ email, password });
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body
        });

        const data = await response.json();

        if (response.ok && data.token) {
            // Store user/admin data
            localStorage.setItem("token", data.token);
            if (isAdmin) {
                localStorage.setItem("isAdmin", "true");
                localStorage.setItem("adminName", data.admin?.name || email.split('@')[0]);
                localStorage.setItem("adminEmail", email);
                alert("✅ Admin login successful! Welcome, " + (data.admin?.name || email.split('@')[0]));
                window.open('admin.html', '_blank');
                return;
            } else {
                localStorage.setItem("userName", data.name || email.split('@')[0]);
            localStorage.setItem("userEmail", email);
            alert("✅ Login successful! Welcome back, " + (data.name || email.split('@')[0]));
            }
            // Update UI for logged in user (can add admin-specific UI here)
            const profileSection = document.getElementById("profileBtn");
            const settingsDropdown = document.getElementById("settingsDropdown");
            profileSection.innerHTML = `<span>Welcome, ${(isAdmin ? (data.admin?.name || email.split('@')[0]) : (data.name || email.split('@')[0]))}</span>`;
            settingsDropdown.innerHTML = `
                <button id="feedbackBtn" style="width: 100%; padding: 10px; margin: 5px 0; border: none; background-color: white; cursor: pointer; border-radius: 4px; text-align: left;">Feedback</button>
                <button id="supportBtn" style="width: 100%; padding: 10px; margin: 5px 0; border: none; background-color: white; cursor: pointer; border-radius: 4px; text-align: left;">Support</button>
                <button id="orderHistoryBtn" style="width: 100%; padding: 10px; margin: 5px 0; border: none; background-color: white; cursor: pointer; border-radius: 4px; text-align: left;">Order History</button>
                <button id="logoutBtn" style="width: 100%; padding: 10px; margin: 5px 0; border: none; background-color: #ff4757; color: white; cursor: pointer; border-radius: 4px; text-align: left;">Logout</button>
            `;
            document.getElementById("feedbackBtn").addEventListener("click", () => openSettingsModal("feedbackSection"));
            document.getElementById("supportBtn").addEventListener("click", () => openSettingsModal("supportSection"));
            document.getElementById("logoutBtn").addEventListener("click", handleLogout);
            document.getElementById("orderHistoryBtn").addEventListener("click", showOrderHistory);
            document.getElementById("loginForm").style.display = "none";
            document.getElementById("signUpForm").style.display = "none";
        } else {
            document.getElementById("loginMessage").textContent = data.message || "Login failed. Please check your credentials.";
        }
    } catch (error) {
        console.error("Error during login:", error);
        document.getElementById("loginMessage").textContent = "An error occurred. Please try again.";
    }
});

// Function to handle logout  
//add a toggle button below each type if off the stock it should refelct in the frontend that no users can order the fuel because its no stock in the bunk
function handleLogout() {
    // Clear all auth-related data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    
    // Show logout success message
    alert("✅ Logged out successfully!");
    
    // Reset UI to default state
    const profileSection = document.getElementById("profileBtn");
    const loginForm = document.getElementById("loginForm");
    const signUpForm = document.getElementById("signUpForm");
    const settingsDropdown = document.getElementById("settingsDropdown");
    
    // Update UI elements
    profileSection.innerHTML = `<span>Login/Register</span>`;
    loginForm.style.display = "block";
    signUpForm.style.display = "none";
    
    // Hide dropdowns and modals
    settingsDropdown.style.display = "none";
    document.getElementById("profileModal").style.display = "none";
    document.getElementById("settingsModal").style.display = "none";
    
    // Reload page to reset all states
    window.location.reload();
}

// Check for existing session on page load
document.addEventListener("DOMContentLoaded", function() {
    // Style login and register buttons
    const loginButton = document.getElementById("loginBtn");
    const signUpButton = document.getElementById("signUpBtn");
    const showLoginButton = document.getElementById("showLogin");
    const showSignUpButton = document.getElementById("showSignUp");

    // Style main action buttons (Login and Sign Up)
    const actionButtonStyle = `
        background-color: #44bd32;
        color: white;
        padding: 12px 24px;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        width: 100%;
        margin: 10px 0;
        transition: background-color 0.3s ease;
    `;

    // Style switch buttons (Show Login/Show Register)
    const switchButtonStyle = `
        background-color: transparent;
        color: #44bd32;
        border: 2px solid #44bd32;
        padding: 8px 16px;
        border-radius: 5px;
        font-size: 14px;
        cursor: pointer;
        margin: 5px 0;
        transition: all 0.3s ease;
    `;

    // Apply styles to buttons
    loginButton.style.cssText = actionButtonStyle;
    signUpButton.style.cssText = actionButtonStyle;
    showLoginButton.style.cssText = switchButtonStyle;
    showSignUpButton.style.cssText = switchButtonStyle;

    // Add hover effects
    [loginButton, signUpButton].forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#3aa528';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#44bd32';
        });
    });

    [showLoginButton, showSignUpButton].forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#44bd32';
            button.style.color = 'white';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = 'transparent';
            button.style.color = '#44bd32';
        });
    });

    // Clear any invalid session data
    if (!localStorage.getItem("token") || !localStorage.getItem("userName")) {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
    }

    // Get profile section
    const profileSection = document.getElementById("profileBtn");
    const loginForm = document.getElementById("loginForm");
    const signUpForm = document.getElementById("signUpForm");
    const settingsDropdown = document.getElementById("settingsDropdown");

    // Initialize UI elements
    settingsDropdown.style.display = "none";
    document.getElementById("profileModal").style.display = "none";
    document.getElementById("settingsModal").style.display = "none";

    // Check if user is logged in with valid data
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");

    if (token && userName && userName !== "undefined") {
        // Valid login state
        profileSection.innerHTML = `<span>Welcome, ${userName}</span>`;
        loginForm.style.display = "none";
        signUpForm.style.display = "none";
        
        // Update settings dropdown with all options including logout
        settingsDropdown.innerHTML = `
            <button id="feedbackBtn" style="width: 100%; padding: 10px; margin: 5px 0; border: none; background-color: white; cursor: pointer; border-radius: 4px; text-align: left;">Feedback</button>
            <button id="supportBtn" style="width: 100%; padding: 10px; margin: 5px 0; border: none; background-color: white; cursor: pointer; border-radius: 4px; text-align: left;">Support</button>
            <button id="orderHistoryBtn" style="width: 100%; padding: 10px; margin: 5px 0; border: none; background-color: white; cursor: pointer; border-radius: 4px; text-align: left;">Order History</button>
            <button id="logoutBtn" style="width: 100%; padding: 10px; margin: 5px 0; border: none; background-color: #ff4757; color: white; cursor: pointer; border-radius: 4px; text-align: left;">Logout</button>
        `;
        
        // Add event listeners for all buttons
        document.getElementById("feedbackBtn").addEventListener("click", () => openSettingsModal("feedbackSection"));
        document.getElementById("supportBtn").addEventListener("click", () => openSettingsModal("supportSection"));
        document.getElementById("logoutBtn").addEventListener("click", handleLogout);
        document.getElementById("orderHistoryBtn").addEventListener("click", showOrderHistory);
    } else {
        // Not logged in or invalid state
        profileSection.innerHTML = `<span>Login/Register</span>`;
        loginForm.style.display = "block";
        signUpForm.style.display = "none";
        
        // Reset settings dropdown to default state
        settingsDropdown.innerHTML = `
            <button id="feedbackBtn" style="width: 100%; padding: 10px; margin: 5px 0; border: none; background-color: white; cursor: pointer; border-radius: 4px; text-align: left;">Feedback</button>
            <button id="supportBtn" style="width: 100%; padding: 10px; margin: 5px 0; border: none; background-color: white; cursor: pointer; border-radius: 4px; text-align: left;">Support</button>
            <button id="orderHistoryBtn" style="width: 100%; padding: 10px; margin: 5px 0; border: none; background-color: white; cursor: pointer; border-radius: 4px; text-align: left;">Order History</button>
        `;
        
        // Add event listeners for default buttons
        document.getElementById("feedbackBtn").addEventListener("click", () => openSettingsModal("feedbackSection"));
        document.getElementById("supportBtn").addEventListener("click", () => openSettingsModal("supportSection"));
        document.getElementById("orderHistoryBtn").addEventListener("click", showOrderHistory);
    }
});

// SIGNUP FUNCTIONALITY
document.getElementById("signUpBtn").addEventListener("click", async function () {
    const isAdminSignUp = adminSignUpToggle.checked;
    let name, email, password, adminCode;

    if (isAdminSignUp) {
        name = document.getElementById("adminSignUpName").value;
        email = document.getElementById("adminSignUpEmail").value;
        password = document.getElementById("adminSignUpPassword").value;
        adminCode = document.getElementById("adminSignUpCode").value;
        if (!name || !email || !password || !adminCode) {
            document.getElementById("signUpMessage").textContent = "Please fill in all admin fields.";
            return;
        }
    } else {
        name = document.getElementById("signUpName").value;
        email = document.getElementById("signUpEmail").value;
        password = document.getElementById("signUpPassword").value;
    if (!name || !email || !password) {
        document.getElementById("signUpMessage").textContent = "All fields are required.";
        return;
        }
    }

    try {
        const endpoint = isAdminSignUp
            ? "http://localhost:5000/api/auth/admin-signup"
            : "http://localhost:5000/api/auth/signup";
        const body = isAdminSignUp
            ? JSON.stringify({ name, email, password, adminCode })
            : JSON.stringify({ name, email, password });
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("signUpMessage").textContent = isAdminSignUp
                ? "Admin sign-up successful! Login with your details."
                : "Sign-up successful! Login with your details.";
            setTimeout(() => {
                document.getElementById("loginForm").style.display = "block";
                document.getElementById("signUpForm").style.display = "none";
            }, 1000);
        } else {
            document.getElementById("signUpMessage").textContent = data.message || "Sign-up failed. Please try again.";
        }
    } catch (error) {
        console.error("Error during signup:", error);
        document.getElementById("signUpMessage").textContent = "An error occurred. Please try again.";
    }
});

// SWITCH BETWEEN LOGIN & SIGN-UP
document.getElementById("showSignUp").addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signUpForm").style.display = "block";
});

document.getElementById("showLogin").addEventListener("click", function (event) {
    event.preventDefault();
    document.getElementById("signUpForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
});

// GOOGLE MAP INITIALIZATION
function initMap() {
    let userLocation = { lat: 12.9716, lng: 77.5946 }; // Default: Bangalore
    let map = new google.maps.Map(document.getElementById("map"), {
        zoom: 14,
        center: userLocation,
    });

    new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Your Location",
    });
}

// Base Prices (per liter)
const fuelPrices = {
    'power_petrol': 110,
    'normal_petrol': 110,
    'x95_petrol': 105,
    'diesel': 89
};

const otherCharges = 5; // Other additional charges per liter

// Function to calculate and update price
function calculatePrice() {
    const fuelType = document.getElementById('fuelType').value;
    const quantity = parseInt(document.getElementById('fuelQuantity').value);
    const otherCharges = 10; // ₹10 per liter
    const deliveryFee = 30; // Fixed ₹30 delivery fee
    const bulkDiscountElement = document.getElementById('bulkDiscount');
    const discountAmountElement = document.getElementById('discountAmount');

    let basePrice;
    switch(fuelType) {
        case 'power_petrol':
            basePrice = 110;
            break;
        case 'normal_petrol':
            basePrice = 110;
            break;
        case 'x95_petrol':
            basePrice = 105;
            break;
        case 'diesel':
            basePrice = 89;
            break;
        default:
            basePrice = 0;
    }

    document.getElementById('basePrice').textContent = basePrice;
    document.getElementById('otherCharges').textContent = otherCharges;
    document.getElementById('deliveryFee').textContent = deliveryFee;

    // Calculate subtotal before discount
    const subtotal = ((basePrice + otherCharges) * quantity) + deliveryFee;

    // Apply 5% discount for bulk orders (5L)
    let discount = 0;
    if (quantity === 5) {
        discount = subtotal * 0.1; // 10% discount
        bulkDiscountElement.style.display = 'grid'; // Show discount line
        discountAmountElement.textContent = discount.toFixed(2);
    } else {
        bulkDiscountElement.style.display = 'none'; // Hide discount line
    }

    // Calculate final total price
    const totalPrice = subtotal - discount;
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);

    return totalPrice;
}

// Add event listeners for price calculation
document.getElementById('calculatePrice').addEventListener('click', calculatePrice);
document.getElementById('fuelType').addEventListener('change', calculatePrice);
document.getElementById('fuelQuantity').addEventListener('input', calculatePrice);

// Proceed to Payment - Place Order
document.getElementById("proceedToPayment").addEventListener("click", function () {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("❌ Please log in to place an order.");
        return;
    }

    // Check if a bunk is selected
    const selectedBunk = document.querySelector('input[name="selectedBunk"]:checked');
    if (!selectedBunk) {
        alert("⚠️ Please select a fuel bunk from the list before proceeding.");
        // Scroll to bunk selection section
        document.getElementById("bunkSelection").scrollIntoView({ behavior: 'smooth' });
        return;
    }

    const selectedFuel = document.getElementById("fuelType").value.trim();
    const quantityInput = document.getElementById("fuelQuantity");
    const quantity = quantityInput ? parseInt(quantityInput.value) : 0;

    // Validate inputs before proceeding
    if (!selectedFuel || selectedFuel === "Select Fuel Type") {
        alert("⚠️ Please select a valid fuel type.");
        return;
    }

    if (!quantity || isNaN(quantity) || quantity < 1 || quantity > 5) {
        alert("⚠️ Please enter a quantity between 1 and 5 liters.");
        return;
    }

    // Apply any offers
    let totalPrice = calculatePrice();

    // Show payment modal
    document.getElementById("modalTotalPrice").textContent = totalPrice.toFixed(2);
    paymentModal.style.display = "block";
    mobileVerification.style.display = "block";
    paymentOptions.style.display = "none";
    upiPaymentSection.style.display = "none";
    cardPaymentSection.style.display = "none";
    codConfirmation.style.display = "none";
});

// Mobile Number Verification
document.getElementById("verifyMobile").addEventListener("click", function() {
    const mobileNumber = document.getElementById("mobileNumber").value;
    const mobileError = document.getElementById("mobileError");
    
    if(mobileNumber.length === 10 && /^\d+$/.test(mobileNumber)) {
        mobileError.style.display = "none";
        mobileVerification.style.display = "none";
        
        // Show payment options and check wallet balance
        paymentOptions.style.display = "block";
        const walletBalance = parseFloat(document.getElementById("walletBalance").textContent.replace('₹', '')) || 0;
        const orderAmount = parseFloat(document.getElementById("modalTotalPrice").textContent);
        
        // Update wallet information in payment section
        document.getElementById("paymentWalletBalance").textContent = walletBalance.toFixed(2);
        document.getElementById("orderAmount").textContent = orderAmount.toFixed(2);
        
        // Always show wallet payment option
        document.getElementById("walletPaymentOption").style.display = "block";
        const useWalletBtn = document.getElementById("useWalletBtn");
        
        if (walletBalance === 0) {
            useWalletBtn.disabled = true;
            useWalletBtn.textContent = "No Balance Available";
            useWalletBtn.style.backgroundColor = "#ccc";
        } else if (walletBalance < orderAmount) {
            useWalletBtn.disabled = true;
            useWalletBtn.textContent = `Insufficient Balance (₹${walletBalance.toFixed(2)} Available)`;
            useWalletBtn.style.backgroundColor = "#ccc";
        } else {
            useWalletBtn.disabled = false;
            useWalletBtn.textContent = "Pay using Wallet";
            useWalletBtn.style.backgroundColor = "#44bd32";
        }
    } else {
        mobileError.style.display = "block";
    }
});

// Add Wallet Payment Handler
document.getElementById("useWalletBtn").addEventListener("click", function() {
    const orderAmount = parseFloat(document.getElementById("modalTotalPrice").textContent);
    const currentBalance = parseFloat(document.getElementById("walletBalance").textContent.replace('₹', ''));
    
    if (currentBalance >= orderAmount) {
        // Update wallet balance
        const newBalance = currentBalance - orderAmount;
        document.getElementById("walletBalance").textContent = `₹${newBalance.toFixed(2)}`;
        
        // Show order confirmation
        showOrderConfirmation("Wallet Payment");
    }
});

// Payment Method Selection
document.getElementById("upiBtn").addEventListener("click", function() {
    paymentOptions.style.display = "none";
    upiPaymentSection.style.display = "block";
});

document.getElementById("cardPaymentBtn").addEventListener("click", function() {
    paymentOptions.style.display = "none";
    cardPaymentSection.style.display = "block";
});

document.getElementById("codPaymentBtn").addEventListener("click", function() {
    paymentOptions.style.display = "none";
    codConfirmation.style.display = "block";
});

// Payment Confirmation Handlers
document.getElementById("confirmUpiPayment").addEventListener("click", function() {
    showOrderConfirmation("UPI Payment");
});

document.getElementById("confirmCardPayment").addEventListener("click", function() {
    const cardNumber = document.getElementById("cardNumber").value;
    const cardExpiry = document.getElementById("cardExpiry").value;
    const cardCVV = document.getElementById("cardCVV").value;

    if(cardNumber && cardExpiry && cardCVV) {
        showOrderConfirmation("Card Payment");
    } else {
        alert("Please fill in all card details");
    }
});

document.getElementById("confirmCOD").addEventListener("click", function() {
    showOrderConfirmation("Cash on Delivery");
});

// Show Order Confirmation
function showOrderConfirmation(paymentMethod) {
    const selectedFuel = document.getElementById("fuelType").value;
    const selectedQuantity = document.getElementById("fuelQuantity").value;
    const totalPrice = document.getElementById("modalTotalPrice").textContent;
    const mobileNumber = document.getElementById("mobileNumber").value;
    const selectedBunkElement = document.querySelector('input[name="selectedBunk"]:checked');
    const currentTime = new Date();
    const estimatedDelivery = new Date(currentTime.getTime() + 25*60000); // Add 25 minutes

    if (!selectedBunkElement) {
        alert("Please select a bunk before proceeding.");
        return;
    }

    // Get the bunk's distance from the label's data attribute
    const bunkLabel = document.querySelector(`label[for="${selectedBunkElement.id}"]`);
    const bunkDistance = bunkLabel ? bunkLabel.getAttribute('data-distance') : '';

    // Send order to backend
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login to place an order.");
        return;
    }

    // Map fuel type to valid enum values
    const fuelTypeMap = {
        'power_petrol': 'Regular Fuel',
        'normal_petrol': 'Regular Fuel',
        'x95_petrol': 'Premium Fuel',
        'diesel': 'Diesel'
    };

    // Map payment methods to valid enum values
    const paymentMethodMap = {
        'UPI Payment': 'UPI',
        'Card Payment': 'Card',
        'Cash on Delivery': 'Cash on Delivery',
        'Wallet Payment': 'UPI'  // Map wallet payment to UPI as it's likely processed similarly
    };

    // Validate all required fields
    if (!selectedFuel || !selectedQuantity || !totalPrice || !selectedBunkElement || !paymentMethod || !mobileNumber) {
        alert("Please fill in all required fields.");
        return;
    }

    // Log the order data for debugging
    const orderData = {
        fuelType: fuelTypeMap[selectedFuel.toLowerCase()],
        quantity: parseInt(selectedQuantity),
        totalAmount: parseFloat(totalPrice),
        selectedBunk: {
            name: selectedBunkElement.value,
            distance: bunkDistance || "0 km"
        },
        paymentMethod: paymentMethodMap[paymentMethod],
        mobileNumber: mobileNumber,
        status: "Pending"
    };

    console.log('Sending order:', orderData);

    fetch('http://localhost:5000/api/orders/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                try {
                    const errorData = JSON.parse(text);
                    throw new Error(errorData.message || 'Failed to create order');
                } catch (e) {
                    throw new Error(text || 'Network response was not ok');
                }
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Create transaction record
            const transactionData = {
                amount: parseFloat(totalPrice),
                order_id: data.order._id,
                payment_method: paymentMethodMap[paymentMethod]
            };

            // Create transaction
            return fetch('http://localhost:5000/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(transactionData)
            })
            .then(response => response.json())
            .then(transactionResponse => {
                if (!transactionResponse.success) {
                    throw new Error(transactionResponse.message || 'Failed to create transaction');
                }

                // Show success modal
    paymentModal.style.display = "none";
    orderConfirmationModal.style.display = "block";
                
    document.getElementById("orderSummary").innerHTML = `
                    <div class="order-details">
                        <p><strong>Order ID:</strong> #${data.order._id || 'Pending'}</p>
                        <p><strong>Selected Bunk:</strong> ${selectedBunkElement.value}</p>
                        <p><strong>Distance:</strong> ${bunkDistance}</p>
                        <p><strong>Fuel Type:</strong> ${selectedFuel}</p>
                        <p><strong>Quantity:</strong> ${selectedQuantity}L</p>
                        <p><strong>Total Amount:</strong> ₹${totalPrice}</p>
                        <p><strong>Mobile Number:</strong> ${mobileNumber}</p>
                        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
                        <p><strong>Transaction ID:</strong> #${transactionResponse.data._id}</p>
                        <p><strong>Estimated Delivery:</strong> ${estimatedDelivery.toLocaleTimeString()} (20-25 minutes)</p>
                        <p class="delivery-note">🚛 Our delivery partner will contact you shortly</p>
                    </div>
                `;

                // Update wallet balance if payment was successful
                updateWalletBalance();
            });
        } else {
            throw new Error(data.message || 'Failed to create order');
        }
    })
    .catch(error => {
        console.error('Error creating order or transaction:', error);
        if (error.message.includes('Failed to fetch')) {
            alert("Cannot connect to the server. Please make sure the backend server is running.");
        } else {
            alert("Failed to create order: " + error.message);
        }
    });
}

// Close Modal Handlers
document.querySelectorAll(".close").forEach(closeBtn => {
    closeBtn.addEventListener("click", function() {
        // Get the closest parent modal
        const modal = this.closest('.modal');
        
        // If we're in the UPI section, card section, or COD section, go back to payment options
        if (upiPaymentSection.style.display === "block" || 
            cardPaymentSection.style.display === "block" || 
            codConfirmation.style.display === "block") {
            upiPaymentSection.style.display = "none";
            cardPaymentSection.style.display = "none";
            codConfirmation.style.display = "none";
            paymentOptions.style.display = "block";
            return;
        }
        
        // If we're in payment options, go back to mobile verification
        if (paymentOptions.style.display === "block") {
            paymentOptions.style.display = "none";
            mobileVerification.style.display = "block";
            return;
        }

        // If we're in mobile verification or order confirmation, close the entire modal
        modal.style.display = "none";
    });
});

document.getElementById("closeOrderModal").addEventListener("click", function() {
    orderConfirmationModal.style.display = "none";
    // Reset form
    document.getElementById("mobileNumber").value = "";
    document.getElementById("cardNumber").value = "";
    document.getElementById("cardExpiry").value = "";
    document.getElementById("cardCVV").value = "";
});

// -----------------------------
// OFFERS & DISCOUNTS SYSTEM 🎉
// -----------------------------

let walletBalance = 0; // Initial wallet balance
let ordersCount = 0;   // To track orders for loyalty rewards

// Function to apply offers when ordering fuel
function applyOffers(quantity, price) {
    let discount = 0;

    // First-Time User Offer
    if (localStorage.getItem("firstOrder") === null) {
        discount = price * 0.10; // 10% OFF
        document.getElementById("offerMessage").textContent = "🎉 First Order Offer: 10% OFF applied!";
        localStorage.setItem("firstOrder", "used"); // Mark first order as used
    }
    // Bulk Purchase Discount (5% OFF on 5L orders)
    else if (quantity === 5) {
        discount = price * 0.05;
        document.getElementById("offerMessage").textContent = "🏷️ Bulk Order Discount: 5% OFF applied!";
    }

    let finalPrice = price - discount;
    return finalPrice;
}

// Update Wallet Balance UI
function updateWalletBalance() {
    document.getElementById("walletBalance").textContent = ` ₹${walletBalance}`;
}

// -----------------------------
// UPDATED REFERRAL SYSTEM 📲
// -----------------------------

// Update referral button event listener
document.getElementById('referralLink').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
        alert('Please login to use the referral feature.');
        // Open the profile modal to show login form
        document.getElementById('profileBtn').click();
        return;
    }

    const referralEmail = prompt('Enter your friend\'s email to refer:');
    
    if (!referralEmail || referralEmail.trim() === '') {
        alert('Please enter a valid email address for referral.');
        return;
    }

    // Store the pending referral in localStorage with referrer's info
    const pendingReferrals = JSON.parse(localStorage.getItem('pendingReferrals') || '[]');
    const userName = localStorage.getItem("userName");
    pendingReferrals.push({
        email: referralEmail,
        referredBy: userName,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('pendingReferrals', JSON.stringify(pendingReferrals));
    
    alert('Referral invitation sent successfully! You will receive ₹50 when your friend signs up.');
});

// Check if a referred user has placed an order
function checkReferralBonus(userNumber) {
    if (localStorage.getItem(`referred_${userNumber}`) === "pending") {
        walletBalance += 50; // Add ₹50 only after first order
        localStorage.setItem(`referred_${userNumber}`, "used");
        updateWalletBalance();
        alert("🎁 Referral Bonus: ₹50 added to your wallet!");
    }
}

// Loyalty Rewards (₹100 cashback after every 5 orders)
function checkLoyaltyRewards() {
    let userPhoneNumber = prompt("📲 Enter your mobile number to proceed:");
    // Check if the user clicked "Cancel" or entered an empty string
    if (mobileNumber === null || mobileNumber.trim() === "") {
        alert("Mobile number is required to proceed with the order.");
        return; // Stop further execution
    }
checkReferralBonus(userPhoneNumber);

    ordersCount++;
    if (ordersCount % 5 === 0) {
        walletBalance += 100; // Add ₹100 cashback
        alert("🎁 Loyalty Reward: ₹100 cashback added to your wallet!");
        updateWalletBalance();
    }
}

function fetchOrderStatus() {
    fetch("https://your-backend-url.com/api/order-status") // Replace with actual API URL
        .then(response => response.json())
        .then(data => {
            document.getElementById("orderStatusText").textContent = `Current Status: ${data.status}`;
        })
        .catch(error => console.error("Error fetching order status:", error));
}

// Poll for status updates every 5 seconds
setInterval(fetchOrderStatus, 5000);

// Fetch initial status when the page loads
fetchOrderStatus();

function fetchWalletBalance() {
    fetch("https://your-backend-url.com/api/wallet") // Replace with actual API URL
        .then(response => response.json())
        .then(data => {
            document.getElementById("walletBalance").textContent = data.balance;
        })
        .catch(error => console.error("Error fetching wallet balance:", error));
}

// Fetch and display transaction history
async function fetchTransactionHistory() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const response = await fetch('http://localhost:5000/api/transactions/user', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        
        if (data.success) {
            const transactionList = document.getElementById("transactionList");
            if (!transactionList) return;

            if (data.data.length === 0) {
                transactionList.innerHTML = '<li class="no-transactions">No transactions found</li>';
                return;
            }

            transactionList.innerHTML = data.data.map(transaction => `
                <li class="transaction-item">
                    <div class="transaction-header">
                        <span class="transaction-id">ID: #${transaction._id}</span>
                        <span class="transaction-date">${new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                    <div class="transaction-details">
                        <p><strong>Amount:</strong> ₹${transaction.amount}</p>
                        <p><strong>Payment Method:</strong> ${transaction.payment_method}</p>
                        
                    </div>
                </li>
            `).join('');
        }
    } catch (error) {
        console.error('Error fetching transaction history:', error);
    }
}

// Call fetchTransactionHistory when profile modal is opened
document.getElementById("profileBtn").addEventListener("click", function() {
    fetchTransactionHistory();
});

// Fetch wallet balance & transactions when the page loads
fetchWalletBalance();

document.addEventListener("DOMContentLoaded", function () {
    const bunkListContainer = document.getElementById("bunkList");

    // Dummy data for nearby bunks (Replace with API or real data)
    const nearbyBunks = [
        { id: 1, name: "Indian Oil  ", distance: "2.5 km" },
        { id: 2, name: "Shell  ", distance: "3.2 km" },
        { id: 3, name: "Hindustan Petroleum", distance: "3.8 km" }
    ];

    function renderBunkOptions() {
        bunkListContainer.innerHTML = ""; // Clear previous data
        nearbyBunks.forEach((bunk, index) => {
            const bunkOption = document.createElement("div");
            bunkOption.innerHTML = `
                <input type="radio" id="bunk${index}" name="selectedBunk" value="${bunk.name}">
                <label for="bunk${index}" data-distance="${bunk.distance}">${bunk.name}</label>
            `;
            bunkListContainer.appendChild(bunkOption);
        });
    }

    // Call function to render bunk options
    renderBunkOptions();
});

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
});

// Add Order History Functionality
async function showOrderHistory() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login to view your order history");
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/orders/my-orders', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch order history');
        }

        const data = await response.json();
        const orders = data.orders || [];
        
        // Sort orders by date (newest first) and take the 5 most recent
        const recentOrders = orders
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
        
        // Create a modal to display order history
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Recent Orders</h2>
                <p class="order-history-note">Showing your 5 most recent orders</p>
                <div class="order-history-container">
                    ${recentOrders.length > 0 ? recentOrders.map(order => `
                        <div class="order-item">
                            <p><strong>Order ID:</strong> #${order._id}</p>
                            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                            <p><strong>Fuel Type:</strong> ${order.fuelType}</p>
                            <p><strong>Quantity:</strong> ${order.quantity}L</p>
                            <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
                            <p><strong>Status:</strong> <span class="order-status ${order.orderStatus.toLowerCase()}">${order.orderStatus}</span></p>
                        </div>
                    `).join('') : '<p class="no-orders">No orders found</p>'}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = "block";

        // Close modal when clicking the close button
        modal.querySelector('.close').onclick = function() {
            modal.style.display = "none";
            modal.remove();
        };

        // Close modal when clicking outside
        window.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
                modal.remove();
            }
        };
    } catch (error) {
        console.error('Error fetching order history:', error);
        alert('Failed to fetch order history. Please try again later.');
    }
}