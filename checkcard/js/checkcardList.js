tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#2196F3',
                secondary: '#64B5F6'
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
// 加载打卡数据
async function loadCheckInData(date) {
    try {
        let loading = startLoading("加载中")
        const userinfo = getUserInfo();
        const listElement = document.getElementById("cardList");
        listElement.innerHTML = "";
        const text = `查询用户id为${userinfo.user_id}，且日期为${date.toISOString().split('T')[0]}的打卡数据`
        const res = await fetchSQLWorkflow(text, userinfo.user_id);
        console.log(res);
        stopLoading(loading)

        for (const item of res.result) {
            let html = `
                <div class="bg-white rounded-xl shadow-md p-8 mx-1 mt-6 card">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-lg font-medium text-gray-800">${item.punch_type}打卡</h2>
                    </div>
                    <div class="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                        <div class="flex items-center">
                            <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                                <img src="/img/card_eat.png" width="42" height="31"/>
                            </div>
                            <div>
                                <h3 class="text-sm font-medium text-gray-800">今日${item.punch_type}</h3>
                                <p class="text-xs text-gray-500">健康${item.punch_type}打卡</p>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <span class="btn">${item.completion_status}</span>
                            <i class="fas fa-chevron-right text-gray-400 w-4 h-4"></i>
                        </div>
                    </div>
                    <div class="show-text">
                        ${item.message}
                    </div>
                </div>
                    `
            listElement.innerHTML += html;
        }

    } catch (error) {
        console.error('加载打卡数据失败:', error);
    }
}
window.onload = function () {
    // 生成日期数据
    const dateContainer = document.getElementById('date-container');
    const today = new Date();
    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    // 初始加载今天的数据
    loadCheckInData(today);
    // 根据屏幕宽度决定显示天数
    const daysToShow = window.innerWidth < 640 ? 7 : 14;

    for (let i = 0; i < daysToShow; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayName = dayNames[date.getDay()];
        const dayNum = date.getDate();
        const isToday = i === 0;

        const dateItem = document.createElement('div');
        dateItem.className = `date-item flex flex-col items-center justify-center px-4 py-2 rounded-button ${isToday ? 'active' : 'bg-white'} shadow-sm`;
        dateItem.innerHTML = `
            <span class="text-xs ${isToday ? '' : 'text-gray-500'}">${dayName}</span>
            <span class="text-sm font-medium">${dayNum}</span>
        `;

        // 添加点击事件
        dateItem.addEventListener('click', function () {
            // 移除所有active类
            document.querySelectorAll('.date-item').forEach(item => {
                item.classList.remove('active');
                item.classList.add('bg-white');
                item.querySelector('span.text-xs').classList.add('text-gray-500');
            });

            // 为当前点击项添加active类
            this.classList.add('active');
            this.classList.remove('bg-white');
            this.querySelector('span.text-xs').classList.remove('text-gray-500');
            // 加载点击日期的数据
            loadCheckInData(date);

        });

        dateContainer.appendChild(dateItem);
    }
    dateContainer.scrollRight += 100;
}