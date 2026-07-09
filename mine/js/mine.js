tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#4F46E5',
                secondary: '#E5E7EB'
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
    const user = getUserInfo()
    console.log(user)
    if (user) {
        document.getElementById('userAvatar').src = user.avatar_url || '/img/user2.png'
        document.getElementById('userName').textContent = user.username || '用户'
        
        // Hide admin menu if not admin
        const adminMenuItem = document.querySelector('#menuList div:nth-child(6)')
        if (adminMenuItem && user.username !== 'admin') {
            adminMenuItem.style.display = 'none'
        }
    }
    
    // Add logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('user')
        top.location.href = '/login.html'
    }) 
}