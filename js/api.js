const BASE_API = "http://192.168.68.12";
const WORKFLOWS_API_PATH = "/v1/workflows/run";
const CHAT_API_PATH = "/v1/chat-messages"; // Added missing constant

const SQL_AUTH_TOKEN = "Bearer app-ywDAQwqYjDjAIzEY56DMbK9F";
const DD_AUTH_TOKEN = "Bearer app-MxLJNj5TZL8cZcIU3b3rOm1J";
const LP_AUTH_TOKEN = "Bearer app-MNPZP72tn1KwDDsgZGWAFvdj";
const LA_AUTH_TOKEN = "Bearer app-u4gSg0k8D71BVUqo5fZW7rHT";
const AL_AUTH_TOKEN = "Bearer app-6Ki4AAWMvVcsuuMxX8cIioUM";
const AI_CHAT_TOKEN = "Bearer app-hYaCZvAH9qpL2CFvdTJkBlry"

async function fetchWorkflowData(inputs, userId, AUTH_TOKEN) {
    try {
        const headers = new Headers({
            "Authorization": AUTH_TOKEN,
            "Content-Type": "application/json"
        });

        const response = await fetch(`${BASE_API}${WORKFLOWS_API_PATH}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                inputs: inputs,
                response_mode: "blocking",
                user: userId
            }),
            redirect: 'follow'
        });

        // 检查响应状态
        if (!response.ok) {
            throw new Error(`请求失败，状态码：${response.status}`);
        }

        const result = await response.text();
        const responseData = JSON.parse(result);
        try {
            // 添加是否是string的判断
            if (typeof responseData.data.outputs.body === 'string') {
                return JSON.parse(responseData.data.outputs.body);
            }
            return responseData.data.outputs.body;
        } catch (e) {
            throw new Error('body字段解析失败，内容不是有效的JSON');
        }

    } catch (error) {
        console.error('请求处理失败:', error);
        throw new Error(`数据处理失败: ${error.message}`);
    }
}

// 糖尿病检测工作流函数
async function fetchDiabetesDetectionWorkflow(inputs, userId) {
    return await fetchWorkflowData(inputs, userId, DD_AUTH_TOKEN);
}
// Text2sql工作流函数
async function fetchSQLWorkflow(intention, userId) {
    return await fetchWorkflowData({ intention: intention }, userId, SQL_AUTH_TOKEN);
}
// 生活方案定制
async function fetchLifePlansWorkflow(inputs, userId) {
    return await fetchWorkflowData(inputs, userId, LP_AUTH_TOKEN);
}
// 生活建议工作流函数
async function fetchLifeAdviceWorkflow(inputs, userId) {
    return await fetchWorkflowData(inputs, userId, LA_AUTH_TOKEN);
}
//打卡分析工作流
async function fetchAnalysisWorkflow(inputs, userId) {
    return await fetchWorkflowData(inputs, userId, AL_AUTH_TOKEN);
}
// 智能体的调用，包括输入参数，输入信息，用户id、聊天智能体的token值
async function fetchChatflow(inputs, message, userId, CHAT_TOKEN, conversationId = "") {
    try {
        const headers = new Headers({
            "Authorization": CHAT_TOKEN,
            "Content-Type": "application/json"
        });

        const response = await fetch(`${BASE_API}${CHAT_API_PATH}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                inputs: inputs,
                query: message,
                conversation_id: conversationId,
                response_mode: "streaming",
                user: userId
            })
        });
        // 检查响应状态
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 获取响应体的可读流
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let conversation_id = null
        let resultStr = ''
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true }).replace("event: ping","");
            //以data:作为分割，分割出多个字符串
            const chunks = chunk.split('data: ');
            chunks.forEach((ck) => {
                   //判断是否可以转为JSON对象
                try {
                    const data = JSON.parse(ck);
                    if(data.answer){
                        resultStr += data.answer;
                    }
                    if (conversation_id==null&&data.conversation_id) {
                        conversation_id = data.conversation_id;
                    }

                }catch (error) {
                }
            })
        }
        // 返回处理后的结果
        return {
            id: conversation_id,
            answer: resultStr
        };

    } catch (error) {
        console.error('请求处理失败:', error);
        throw new Error(`数据处理失败: ${error.message}`);
    }
}
async function fetchAIChatflow(inputs, message, userId, conversationId = "",  callFunc) {
    try {
        const headers = new Headers({
            "Authorization": AI_CHAT_TOKEN,
            "Content-Type": "application/json"
        });

        const response = await fetch(`${BASE_API}${CHAT_API_PATH}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                inputs: inputs,
                query: message,
                conversation_id: conversationId,
                response_mode: "streaming",
                user: userId
            })
        });
        // 检查响应状态
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 获取响应体的可读流
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let conversation_id = null
        let resultStr = ''
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true }).replace("event: ping","");
            //以data:作为分割，分割出多个字符串
            const chunks = chunk.split('data: ');
            chunks.forEach((ck) => {
                   //判断是否可以转为JSON对象
                try {
                    const data = JSON.parse(ck);
                    if (conversation_id==null&&data.conversation_id) {
                        conversation_id = data.conversation_id;
                    }
                    if(data.answer){
                        callFunc(data.answer, conversation_id);
                    }


                }catch (error) {
                }
            })
        }
        callFunc('done', conversation_id);
        // 返回处理后的结果

    } catch (error) {
        console.error('请求处理失败:', error);
        throw new Error(`数据处理失败: ${error.message}`);
    }
}