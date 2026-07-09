let docList = [];
// Helper functions for SessionStorage
function getCachedData(key) {
    const cached = sessionStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    // Cache expires after 1 hour (3600000 ms)
    if (Date.now() - timestamp > 3600000) {
        sessionStorage.removeItem(key);
        return null;
    }
    return data;
}

function setCachedData(key, data) {
    const cache = {
        data,
        timestamp: Date.now()
    };
    sessionStorage.setItem(key, JSON.stringify(cache));
}

// Load doctors data
async function loadDoctors() {
    try {
        const cacheKey = 'doctors_data';
        let data = getCachedData(cacheKey);
        
        if (!data) {
            data = await fetchSQLWorkflow('获取医生列表', 'current_user');
            setCachedData(cacheKey, data);
        }
        const container = document.getElementById('doctors-container');
        container.innerHTML = data.result.map(doctor => `
                    <div class="doctor-card flex-shrink-0 w-32 h-56 bg-white rounded-lg p-3 flex flex-col">
                        <div class="flex flex-col items-center space-y-3">
                            <div class="relative mb-3">
                                <img src="${doctor.image_url || '/img/doc1.png'}" 
                                     alt="${doctor.doctor_name}" class="w-20 h-20 rounded-full object-cover border-2 border-blue-500">
                                <div class="absolute bottom-0 left-0 right-0 bg-white text-primary text-xs text-center py-[1px] font-normal">
                                    ${doctor.title || '专科医师'}
                                </div>
                            </div>
                            <h3 class="text-sm font-semibold text-gray-800 text-center mb-2">${doctor.doctor_name}</h3>
                            <p class="text-xs text-gray-500 mb-3 text-center">${doctor.department || '内分泌科'}</p>
                            <button class="py-1 bg-white text-primary text-xs rounded-button btn consult-btn" 
                                    data-token="${doctor.chat_token}"
                                    data-doctor="${doctor.info_id}">
                                立即咨询
                            </button>
                        </div>
                    </div>
                `).join('');
        docList = data.result
    } catch (error) {
        console.error('加载医生数据失败:', error);
        document.getElementById('doctors-container').innerHTML =
            '<div class="text-center py-10 w-full text-red-500">加载医生数据失败，请稍后重试</div>';
    }
}

// Load articles data
async function loadArticles() {
    try {
        const cacheKey = 'articles_data';
        let data = getCachedData(cacheKey);

        if (!data) {
            data = await fetchSQLWorkflow('查询3篇文章信息', 'current_user');
            setCachedData(cacheKey, data);
        }
        const container = document.getElementById('articles-container');
        console.log('Fetched doctors:', data);

        container.innerHTML = data.result.map(article => `
                    <div class="article-item px-4 py-3" onclick = "top.location.href='article.html?id=${article.article_id}'">
                        <div class="flex">
                            <div class="w-20 h-20 rounded-lg overflow-hidden mr-3">
                                <img src="${article.cover_url || '/img/a1.jpg'}" 
                                     alt="${article.title}" class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1">
                                <h3 class="text-sm font-semibold text-gray-800 mb-1">${article.title}</h3>
                                <p class="text-xs text-gray-500 mb-2 line-clamp-2">${article.content.substring(0, 20) + "..." || '暂无简介'}</p>
                                <div class="flex items-center text-xs text-gray-400">
                                    <i class="fas fa-eye mr-1"></i>
                                    <span>${article.views || '0'} 浏览</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('');
    } catch (error) {
        console.error('加载文章数据失败:', error);
        document.getElementById('articles-container').innerHTML =
            '<div class="text-center py-10 text-red-500">加载文章数据失败，请稍后重试</div>';
    }
}

// Load diabetes types data
async function loadTypes() {
    try {
        const cacheKey = 'diabetes_types_data';
        let data = getCachedData(cacheKey);

        if (!data) {
            data = await fetchSQLWorkflow('获取糖尿病类型', 'current_user');
            setCachedData(cacheKey, data);
        }
        const container = document.getElementById('types-container');

        container.innerHTML = data.result.map(type => `
                    <div class="category-item bg-white rounded-lg overflow-hidden" onclick="top.location.href='diabetes.html?id=${type.type_id}'">
                        <div class="h-24 overflow-hidden">
                            <img src="${type.img || '/img/t1.jpg'}" 
                                 alt="${type.type_name}" class="w-full h-full object-cover">
                        </div>
                        <div class="p-3">
                            <h3 class="text-sm font-semibold text-gray-800 mb-1">${type.type_name}</h3>
                            <p class="text-xs text-gray-500 line-clamp-2">${type.pathogenesis || '暂无描述'}</p>
                        </div>
                    </div>
                `).join('');
    } catch (error) {
        console.error('加载糖尿病类型数据失败:', error);
        document.getElementById('types-container').innerHTML =
            '<div class="text-center py-10 col-span-2 text-red-500">加载糖尿病类型数据失败，请稍后重试</div>';
    }
}

// Handle consultation button clicks
function setupConsultButtons() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('consult-btn')) {
            const id = e.target.getAttribute('data-doctor');
            console.log(id)
            docList.forEach((doc)=>{
                if(doc.info_id == id){
                    localStorage.setItem('currentDoctor', JSON.stringify(doc));
                } 
            })
            // 跳转到聊天页面并传递医生信息
            top.location.href = `../chat/chat.html`;
        }
    });
}
window.onload = function () {
    // 初始化轮播图
    const swiper = new Swiper('.swiper', {
        loop: true,
        autoplay: {
            delay: 3000,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
    loadDoctors();
    loadArticles();
    loadTypes();
    setupConsultButtons();
}
