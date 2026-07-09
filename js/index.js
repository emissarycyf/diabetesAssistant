window.onload = function () {
    // 导航栏点击处理
    document.querySelectorAll('.tab-bar a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // 移除所有active样式
            document.querySelectorAll('.tab-bar a').forEach(el => {
                el.classList.remove('text-primary', 'active');
                el.classList.add('text-gray-500');
            });

            // 添加当前active样式
            link.classList.add('text-primary', 'active');
            link.classList.remove('text-gray-500');

            // 加载对应页面
            const targetPage = link.getAttribute('data-target');
            document.querySelector('iframe').src = targetPage;
        });
    });
}