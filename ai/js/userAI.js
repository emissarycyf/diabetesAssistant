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

let userinfo = null
let userId = 0
let conversationId = null;
let  messageInput = null;
let sendBtn = null;
let chatHistory = [];

window.onload = async function () {
    messageInput = document.getElementById('messageInput');
    sendBtn = document.getElementById('sendBtn');
    // 监听输入框的输入事件
    messageInput.addEventListener('input', function () {
        if (this.value.trim() !== '') {
            sendBtn.classList.remove('hidden');
        } else {
            sendBtn.classList.add('hidden');
        }
    });
    // 清空聊天记录
    document.getElementById('clearChatBtn').addEventListener('click', function () {
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
                const key = `aichat_history_${userId}`;
                localStorage.removeItem(key);
                chatHistory = [];
                Swal.fire(
                    '已清空！',
                    '聊天记录已被清空。',
                    'success'
                );
            }
        });
    });
    // 发送消息
    sendBtn.addEventListener('click', function () {
        const message = messageInput.value.trim();
        if (message !== '') {
            sendMessage(message);
            messageInput.value = '';
            sendBtn.classList.add('hidden');
        }
    });
    // 监听输入框的按键事件
    messageInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' && this.value.trim() !== '') {
            const message = messageInput.value.trim();
            sendMessage(message);
            messageInput.value = '';
            sendBtn.classList.add('hidden');
        }
    });
    userinfo = await getUserRiskInfo()
    userId = userinfo.userId
    const key = `aichat_history_${userId}`;
    const localHistory = localStorage.getItem(key);
    chatHistory = localHistory ? JSON.parse(localHistory) : [];
    chatHistory.forEach(msg => {
        loadMessageToChat(msg);
    });
}
// 保存聊天记录
function saveChatHistory() {
    const key = `aichat_history_${userId}`;
    localStorage.setItem(key, JSON.stringify(chatHistory));
}
function timestampToDate(timestamp) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}
function loadMessageToChat(message) {
    const text = message.text;
    const sender = message.sender;
    const messagesContainer = document.getElementById('messages-container');
    const now = new Date();
    const timeString = timestampToDate(message.timestamp);

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
                            <p class="text-sm text-white text-left">${text}</p>
                        </div>
                    </div>
                    <img src="/img/user.jpg" class="message-avatar object-cover" alt="我的头像">
                </div>`;
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    } else {
        // AI消息
        const messageHTML = `
                <div class="flex items-start">
                    <img src="/img/aichat_logo.png" class="message-avatar object-cover" >
                    <div class="ml-2" style="width:82%">
                        <div class="flex items-center">
                            <span class="text-sm font-medium text-gray-900">AI助手</span>
                            <span class="ml-2 text-xs text-gray-400">${timeString}</span>
                        </div>
                        <div class="mt-1 bg-white rounded-lg shadow-sm px-3 py-2 text-sm  msg">${text}</div>
                    </div>
                </div>`;
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    }

    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
// 添加消息到聊天界面并保存
function addMessageToChat(message) {
    chatHistory.push({
        text: message,
        sender: 'user',
        timestamp: new Date().toISOString()
    });
    saveChatHistory();
    const messagesContainer = document.getElementById('messages-container');
    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    // 用户消息
    const messageHTML = `
                <div class="flex items-start justify-end">
                    <div class="mr-2 text-right">
                        <div class="flex items-center justify-end">
                            <span class="text-xs text-gray-400">${timeString}</span>
                            <span class="ml-2 text-sm font-medium text-gray-900">我</span>
                        </div>
                        <div class="mt-1 bg-primary rounded-lg shadow-sm px-3 py-2 chat-bubble">
                            <p class="text-sm text-white text-left">${message}</p>
                        </div>
                    </div>
                    <img src="${userinfo.avatar_url || "/img/user.jpg"}" class="message-avatar object-cover" alt="我的头像">
                </div>`;
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);

    // 滚动到底部
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
// 发送消息函数
async function sendMessage(message) {
    if (!message.trim()) return;

    // 添加用户消息到聊天界面
    addMessageToChat(message, 'user');
    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    const messagesContainer = document.getElementById('messages-container');
    //加载一个随机数作为id
    const randomId = 'chat_' + Math.floor(Math.random() * 10000);
    // AI消息
    const messageHTML = `
               <div class="flex items-start">
                   <img src="/img/aichat_logo.png" class="message-avatar object-cover">
                    <div class="ml-2" style="width:82%">
                       <div class="flex items-center">
                           <span class="text-sm font-medium text-gray-900">AI助手</span>
                           <span class="ml-2 text-xs text-gray-400">${timeString}</span>
                       </div>
                        <div class="mt-1 bg-white rounded-lg shadow-sm px-3 py-2 msg" text-sm  id="${randomId}"></div>
                   </div>
               </div>`;
    messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
    const messageElement = document.getElementById(randomId)
    fetchAIChatflow(userinfo, message, userId, conversationId, (ans, con_id) => {
        conversationId = con_id
        if (ans && ans != 'done') {
            messageElement.textContent += ans
            // 滚动到底部
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            // 保存聊天记录
        } else {
            chatHistory.push({
                text: messageElement.textContent,
                sender: 'ai',
                timestamp: new Date().toISOString()
            });
            saveChatHistory();
        }
    })
}
