tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#3B82F6',
                secondary: '#64748B'
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

window.onload = async function () {
    try {
        // Check if we have existing user data
        let userData = {};
        const loadingOverlay = startLoading('正在获取用户信息...');

        try {
            userData = await getUserRiskInfo();

            // If all fields are empty, show edit form
            if (!userData) {
                document.getElementById('userInfo').innerHTML = `
                <div class="p-6 rounded-lg">
                    <h2 class="text-xl font-medium mb-4">尚未填写健康信息</h2>
                    <p class="mb-6">请填写您的健康信息以获取糖尿病风险评估</p>
                    <div class="flex justify-end">
                        <button onclick="window.location.replace('diabetesinfo.html')" 
                            class="bg-black text-white px-6 py-3 rounded-button hover:bg-blue-700 transition-all">
                            <i class="fas fa-edit mr-2"></i>
                            立即填写
                        </button>
                    </div>
                </div>
            `;
            } else {
                // 安全更新元素内容
                const updateElement = (id, content) => {
                    const el = document.getElementById(id);
                    if (el) el.textContent = content;
                };

                // 更新基本信息
                updateElement('userAge', `${userData.age} 岁` || '未填写');
                updateElement('userGender', userData.sex || '未填写');
                updateElement('familyHistory', userData.family_history || '无');

                // 更新身体数据
                updateElement('height', `${userData.height}` || '未测量');
                updateElement('weight', `${userData.weight}` || '未测量');
                updateElement('waistline', `${userData.waistline}` || '未测量');
                updateElement('systolicPressure', `${userData.systolicPressure}` || '未测量');

                // 更新糖尿病病情数据
                updateElement('disease', userData.disease || '未评估');
                updateElement('message', userData.message || '暂无风险评估建议');
            }
        } catch (error) {
            console.error('获取用户信息失败:', error);
            document.getElementById('userInfo').style.display = 'none';
            document.getElementById('editForm').style.display = 'block';
        } finally {
            stopLoading(loadingOverlay);
        }

    } catch (error) {
        console.error('请求失败:', error);
    }
}