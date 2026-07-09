// 表格设置函数
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#007AFF',
                secondary: '#5856D6'
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
// 表格设置函数
function renderObjectTable(data) {
    const container = document.getElementById('dataTableContainer');
    if (!container || !Array.isArray(data) || data.length === 0) return;

    // Create table element
    const table = document.createElement('table');
    table.className = 'w-full min-w-max whitespace-nowrap';

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.className = 'border-b border-gray-200';

    // Get headers from first object keys
    Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.className = 'py-2 px-3 text-left text-sm font-medium text-gray-600';
        th.textContent = key;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    data.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-100';

        Object.values(item).forEach(value => {
            const td = document.createElement('td');
            td.className = 'py-2 px-3 text-sm text-gray-600';
            td.textContent = typeof value === 'object' ? JSON.stringify(value) : value;
            row.appendChild(td);
        });

        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Clear container and append table
    container.innerHTML = '';
    container.appendChild(table);
}
function getOperationLogs() {
    return JSON.parse(localStorage.getItem('operationLogs') || '[]');
}
// Operation log functions
function generateUUID() {
    return crypto.randomUUID();
}

function saveOperationLog(requirement, result) {
    const logs = getOperationLogs();
    logs.push({
        id: generateUUID(),
        requirement,
        result:JSON.stringify(result),
        time: new Date().toLocaleString()
    });
    localStorage.setItem('operationLogs', JSON.stringify(logs));
    displayOperationLogs();
}
function displayOperationLogs() {
    const logs = getOperationLogs();
    const logContainer = document.querySelector('.bg-white.p-4.rounded-lg.card-shadow:last-child .space-y-3');
    logContainer.innerHTML = '';

    logs.slice().reverse().forEach(log => {
        const logItem = document.createElement('div');
        logItem.className = 'flex flex-col space-y-1 p-2 bg-gray-50 rounded';
        logItem.innerHTML = `
                        <div class="flex justify-between">
                            <span class="text-sm font-medium">${log.requirement}</span>
                            <span class="text-xs text-gray-500">${log.time}</span>
                        </div>
                        <div class="text-sm text-gray-600">${JSON.parse(log.result).message}</div>
                    `;
        logItem.addEventListener('click', () => loadLog(log.id));                
        logContainer.appendChild(logItem);
    });
}
function json2Object(str) {
    // 首先去除首位的json'''和'''
    str = str.replace(/^```json|```$/g, '');
    // 然后使用JSON.parse解析字符串为对象
    return JSON.parse(str);
}
//加载请求结果
function loadResult(result) {
    if (result.data) {
        renderObjectTable(result.data)
    }
    if (result.status) {
        document.getElementById('status').innerHTML = result.status;
    }
    if (result.message) {
        document.getElementById('message').innerHTML = result.message;
    }
}
function loadLog(id) {
    const logs = getOperationLogs()
    const log = logs.find(log => log.id === id)
    if (log) {
        loadResult(JSON.parse(log.result))
        document.querySelector('input').value = log.requirement
    }

}
let containerId = ""
window.onload = function () {
    displayOperationLogs()
    //    为按钮添加点击事件
    const button = document.getElementById('btn');
    button.addEventListener('click', function () {
        //    获取输入框内容
        const input = document.querySelector('input');
        const inputValue = input.value;
        //清空输入框
        input.value = '';
        let loading = startLoading("AI智能分析ing")
        fetchChatflow({}, inputValue, "admin", "Bearer app-GjovNjKKvnPAOdzufvRGPEPr").then(res => {
            stopLoading(loading)
            conversationId = res.id;
            let result = json2Object(res.answer)
            saveOperationLog(inputValue, result);
            loadResult(result)


        })
    })
}