tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#304FFF',
                secondary: '#10B981'
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
let doc = null
let userId = 1
let conversationId = null;
let inputs = {
    "userId": "123",
    "sex": "male",
    "age": 30,
    "height": 175,
    "weight": 70,
    "familyHistory": "none",
    "waistline": 80,
    "systolicPressure": 120,
    "isPregnancy": "no",
    "disease": "no"
}
let historyMessage = [];
// 从localStorage加载医生信息
function getDoctorFromStorage() {
    const stored = localStorage.getItem('currentDoctor');
    return stored ? JSON.parse(stored) : null;
}

// 更新医生信息显示
function updateDoctorInfo(doctor) {
    if (!doctor) return;
    console.log(doctor)
    document.querySelector('.doctor-avatar').alt = `${doctor.doctor_name} 医师头像`;
    document.querySelector('.doctor-avatar').src = doctor.image_url;
    document.querySelector('h2').textContent = `${doctor.doctor_name} 医师`;
    document.querySelector('p').textContent = `${doctor.department} ${doctor.title}`;

    // 更新所有消息中的医生名称
    document.querySelectorAll('.text-gray-900').forEach(el => {
        if (el.textContent.includes('张明远')) {
            el.textContent = el.textContent.replace('张明远', `${doctor.doctor_name}`);
        }
    });
    // 遍历所有的img标签，检查alt属性是否包含医师头像
    document.querySelectorAll('img').forEach(img => {
        if (img.alt.includes('医师头像')) {
            // 如果alt包含医师头像，则更新src属性为医生的头像URL
            img.src = doctor.image_url;
        }
    });


}

// 保存聊天记录
function saveChatHistory() {
    if (!doc) return;
    const key = `chat_history_${doc.info_id}`;
    localStorage.setItem(key, JSON.stringify(historyMessage));
    localStorage.setItem("conversationId",conversationId)
}
function timestampToDate(timestamp) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}
// 加载并显示历史消息
function loadChatHistory() {
    const messagesContainer = document.getElementById('messages-container');
    historyMessage.forEach(msg => {
        const timeString = timestampToDate(msg.timestamp);
        const message = msg.text;
        if (msg.sender === 'user') {
            // 用户消息
            const messageHTML = `
            <div class="flex items-start justify-end">
                <div class="mr-2 text-right">
                    <div class="flex items-center justify-end">
                        <span class="text-xs text-gray-400">${timeString}</span>
                        <span class="ml-2 text-sm font-medium text-gray-900">我</span>
                    </div>
                    <div class="mt-1 bg-primary rounded-lg shadow-sm px-3 py-2 chat-bubble">
                        <p class="text-sm text-white">${message}</p>
                    </div>
                </div>
                <img src="/img/user.jpg" class="message-avatar object-cover" alt="我的头像">
            </div>`;
            messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        } else {
            // 医生消息
            const messageHTML = `
            <div class="flex items-start">
                <img src="/img/doc1.jpg" class="message-avatar object-cover" alt="医师头像">
            <div class="ml-2" style="width:82%">
                    <div class="flex items-center">
                        <span class="text-sm font-medium text-gray-900">${doc ? doc.doctor_name : '张明远'} 医师</span>
                        <span class="ml-2 text-xs text-gray-400">${timeString}</span>
                    </div>
                <div class="mt-1 bg-white rounded-lg shadow-sm px-3 py-2 msg text-sm ">${message}</div>
                </div>
            </div>`;
            messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        }
    });
}

// 页面加载时初始化
window.onload = async function () {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    // 优先从URL获取医生信息，没有则从localStorage加载
    doc = getDoctorFromStorage();

    // 加载用户风险数据
    try {
        const userRiskInfo = await getUserRiskInfo();
        if (userRiskInfo) {
            console.log(userRiskInfo)
            inputs = {
                "userId": userRiskInfo.userId.toString() || "123",
                "sex": userRiskInfo.sex || "male",
                "age": userRiskInfo.age || 30,
                "height": userRiskInfo.height || 175,
                "weight": userRiskInfo.weight || 70,
                "familyHistory": userRiskInfo.familyHistory || "none",
                "waistline": userRiskInfo.waistline || 80,
                "systolicPressure": userRiskInfo.systolicPressure || 120,
                "isPregnancy": userRiskInfo.isPregnancy || "no",
                "disease": userRiskInfo.disease || "no"
            };
        }
    } catch (error) {
        console.error('加载用户风险数据失败:', error);
        // 使用默认输入值继续
    }
    updateDoctorInfo(doc);
    if (doc) {
        const key = `chat_history_${doc.info_id}`;
        const history = localStorage.getItem(key);
        historyMessage = history ? JSON.parse(history) : [];
        if (historyMessage.length === 0) {
            loadStartMessage()
        } else {
            loadChatHistory()
        }
        conid = localStorage.getItem("conversationId")
        if(conid)conversationId=conid
    }
    messageInput.addEventListener('input', function () {
        if (this.value.trim() !== '') {
            sendBtn.classList.remove('hidden');
        } else {
            sendBtn.classList.add('hidden');
        }
    });
    // 清空聊天记录
    document.getElementById('clearChatBtn').addEventListener('click', function () {
        if (doc) {
            Swal.fire({
                title: '确定要清空聊天记录吗？',
                text: "此操作无法撤销！",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#304FFF',
                cancelButtonColor: '#d33',
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then((result) => {
                if (result.isConfirmed) {
                    // 清空聊天界面
                    document.getElementById('messages-container').innerHTML = '';
                    // 清空本地存储的聊天记录
                    const key = `chat_history_${doc.info_id}`;
                    historyMessage = []
                    conversationId = null
                    localStorage.setItem("conversationId",null)
                    localStorage.setItem(key, JSON.stringify(historyMessage));

                    Swal.fire(
                        '已清空！',
                        '聊天记录已被清空。',
                        'success'
                    );
                    loadStartMessage()
                }
            });
        }
    });

    sendBtn.addEventListener('click', function () {
        const message = messageInput.value.trim();
        if (message !== '') {
            sendMessage(message);
            messageInput.value = '';
            sendBtn.classList.add('hidden');
        }
    });
    messageInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && this.value.trim() !== '') {
            const message = messageInput.value.trim();
            sendMessage(message);
            messageInput.value = '';
            sendBtn.classList.add('hidden');
        }
    });
}





// 添加消息到聊天界面并保存
function addMessageToChat(message, sender) {
    // 保存到历史记录
    if (doc) {
        historyMessage.push({
            text: message,
            sender: sender,
            timestamp: new Date().toISOString()
        });
        saveChatHistory();
    }
    const messagesContainer = document.getElementById('messages-container');
    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    if (sender === 'user') {
        // 用户消息
        const messageHTML = `
        <div class="flex items-start justify-end">
            <div class="mr-2 text-right">
                <div class="flex items-center justify-end">
                    <span class="text-xs text-gray-400">${timeString}</span>
                    <span class="ml-2 text-sm font-medium text-gray-900">我</span>
                </div>
                <div class="mt-1 bg-primary rounded-lg shadow-sm px-3 py-2 chat-bubble">
                    <p class="text-sm text-white">${message}</p>
                </div>
            </div>
            <img src="/img/user.jpg" class="message-avatar object-cover" alt="我的头像">
        </div>`;
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    } else {
        // 医生消息
        const messageHTML = `
        <div class="flex items-start">
            <img src="${doc ? doc.image_url :'/img/doc1.jpg'}" class="message-avatar object-cover" alt="医师头像">
            <div class="ml-2" style="width:82%">
                <div class="flex items-center">
                    <span class="text-sm font-medium text-gray-900">${doc ? doc.doctor_name : '张明远'} 医师</span>
                    <span class="ml-2 mr-2 text-xs text-gray-400">${timeString}</span>
                </div>
                <div class="mt-1 bg-white rounded-lg shadow-sm px-3 py-2 msg text-sm text-grey-800 text-sm">${message}</div>
            </div>
        </div>`;
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    }

    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
function loadStartMessage() {
    if (doc) {
        let startMessage = `你好，我是${doc.doctor_name},${doc.introduction}`
        addMessageToChat(startMessage, 'doctor')
    }
}
// 发送消息函数
async function sendMessage(message) {
    if (!message.trim()) return;

    // 添加用户消息到聊天界面
    addMessageToChat(message, 'user');
    showLoading()
    try {
        // 调用API获取医生回复
        const response = await fetchChatflow(
            inputs, // 空输入参数
            message,
            userId,
            doc.chat_token,
            conversationId
        );
        hideLoading()
        // 更新会话ID
        if (response.id) {
            conversationId = response.id;
        }

        // 添加医生回复到聊天界面
        if (response.answer) {
            console.log(response.answer)
            let answer = response.answer.trim();
            addMessageToChat(response.answer, 'doctor');
        }
    } catch (error) {
        console.error(error)
        addMessageToChat('抱歉，获取医生回复时出错，请稍后再试', 'doctor');
    }
}
/**
 * 在聊天列表中显示医生正在输入的提示信息。
 */
function showLoading() {
    // 构建加载提示的 HTML 字符串
    const loadingMessage = `
                <div class="text-center text-xs text-gray-400 my-4">
                    医生正在输入...
                </div>
            `;
    // 将加载提示添加到聊天列表的末尾
    document.getElementById('messages-container').insertAdjacentHTML('beforeend', loadingMessage);
}

/**
 * 隐藏聊天列表中的医生正在输入的提示信息。
 */
function hideLoading() {
    // 获取加载提示的 DOM 元素
    const loadingElement = document.querySelector('.text-center')
    // 如果存在加载提示元素，则移除它
    if (loadingElement) {
        loadingElement.remove();
    }
}
