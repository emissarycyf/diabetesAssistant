tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#2563eb',
                secondary: '#60a5fa'
            },
            borderRadius: {
                'none': '0px',
                'sm': '2px',
                DEFAULT: '4px',
                'md': '8px',
                'lg': '12px',
                'xl': '16px',
                '2xl': '20px',
                '3xl': '24px',
                'full': '9999px',
                'button': '4px'
            }
        }
    }
}
window.onload = function() {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginContent = document.getElementById('loginContent');
    const registerContent = document.getElementById('registerContent');

    // 添加空值检查
    if (!loginTab || !registerTab || !loginContent || !registerContent) {
        console.error('One or more elements not found');
        return;
    }

    loginTab.addEventListener('click', () => {
        loginTab.classList.add('text-primary', 'border-primary');
        loginTab.classList.remove('text-gray-400', 'border-gray-200');
        registerTab.classList.add('text-gray-400', 'border-gray-200');
        registerTab.classList.remove('text-primary', 'border-primary');
        loginContent.classList.add('active');
        registerContent.classList.remove('active');
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('text-primary', 'border-primary');
        registerTab.classList.remove('text-gray-400', 'border-gray-200');
        loginTab.classList.add('text-gray-400', 'border-gray-200');
        loginTab.classList.remove('text-primary', 'border-primary');
        registerContent.classList.add('active');
        loginContent.classList.remove('active');
    }); 
}
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username && password) {
        fetchSQLWorkflow(`查询用户名为${username}且密码为${password}的用户信息`, username)
            .then(data => {
                res = data.result
                console.log(res)
                // 没有查到相关的用户
                if (res.length == 0) {
                    showFloatingAlert("用户名或密码错误")
                } else {
                    localStorage.setItem("user", JSON.stringify(res[0]))
                    location.href = "index.html"
                }
            })
    } else {
        showFloatingAlert("请确保表单填写完整", 'warning')
    }
}
function register() {
    const regUsername = document.getElementById("regUsername").value;
    const regPassword = document.getElementById("regPassword").value;
    const secPassword = document.getElementById("secPassword").value;
    if (regUsername && regPassword & secPassword) {
        if (regPassword == secPassword) {
            fetchSQLWorkflow(`创建用户名为'${regUsername}' 密码为'${regPassword}'的用户`, regUsername)
                .then(data => {
                    res = data.result[0].result
                    console.log(res)
                    if (res == 1) {
                        showFloatingAlert("注册成功", 'success')
                    } else if (res.includes("UNIQUE constraint failed")) {
                        showFloatingAlert("注册失败,用户名已存在", 'error')
                    } else {
                        showFloatingAlert("服务器异常" + res, 'error')
                    }
                })
        } else {
            showFloatingAlert("两次输入的密码不一致", 'warning')
        }
    } else {
        showFloatingAlert("请确保表单填写完整", 'warning')
    }
}
