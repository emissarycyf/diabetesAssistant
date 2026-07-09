tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#3261FF',
                secondary: '#81C784'
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
// Function to add new meal item
function addMeal(type, time, foods) {
    const mealsContainer = document.getElementById('eat');
    const newMeal = document.createElement('div');
    newMeal.className = 'bg-blue-50 p-3 rounded-lg';
    newMeal.innerHTML = `
        <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium">${type}</span>
            <span class="text-xs text-gray-500">${time}</span>
        </div>
        <p class="text-xs text-gray-600">${foods}</p>
    `;
    mealsContainer.appendChild(newMeal);
}

// Function to add new exercise item
function addExercise(name, time, description) {
    const exercisesContainer = document.getElementById('sport');
    const newExercise = document.createElement('div');
    newExercise.className = 'bg-blue-50 p-3 rounded-lg';
    newExercise.innerHTML = `
        <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium">${name}</span>
            <span class="text-xs text-gray-500">${time}</span>
        </div>
        <p class="text-xs text-gray-600">${description}</p>
    `;
    exercisesContainer.appendChild(newExercise);
}
//获取当前日期，格式为YYYY-mm-DD
function getDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function adjustmentScheme() {
    Swal.fire({
        title: '是否要调整方案',
        text: '原先的方案会被删除',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
    }).then((result) => {
        if (result.isConfirmed) {
            top.location.href = 'getScheme.html'
        }
    });
}
function loadData(data) {
    if (data.length == 0) {
        window.location.href = "noscheme.html"
    } else {
        let eatList = []
        let sportList = []

        data.forEach(item => {
            if (item.type == "饮食") {
                eatList.push(item)
            } else {
                sportList.push(item)
            }
        })
        eatList.sort((a, b) => a.order - b.order)
        sportList.sort((a, b) => a.order - b.order)
        eatList.forEach(item => {
            addMeal(item.title, item.time, item.content)
        })
        sportList.forEach(item => {
            addExercise(item.title, item.time, item.content)
        })
        const userinfo = getUserInfo()
    }
}

//获取当前日期，格式为YYYY-mm-DD
function getDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}
function checkIn(type) {
    Swal.fire({
        title: `今天达成了${type}计划了吗`,
        icon: 'question',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: '已达成',
        denyButtonText: '超额完成',
        cancelButtonText: '未达成',
        confirmButtonColor: '#3b82f6', // blue-500
        denyButtonColor: '#22c55e', // green-500
        cancelButtonColor: '#ef4444', // red-500
        input: 'textarea',
        inputPlaceholder: '请填写完成情况说明',
        inputValidator: (value) => {
            // Optional field - no validation needed
            return false;
        }
    }).then((result) => {
        const userinfo = getUserInfo()
        // value为textarea的value
        let value = ''
        let areas = document.getElementsByClassName('swal2-textarea')
        if (areas.length > 0) {
            value = areas[0].value
        }
        let status = ""
        if (result.isConfirmed) {
            status = "已达成"
        } else if (result.isDenied) {
            status = "超额完成"
        } else {
            status = "未达成"
        }
        const text = `为用户id为${userinfo.user_id}的用户添加一条punch_in，message为："${value}"，status为："${status}",type为"${type}"，打卡时间为"${getDate()}"`
        if (type == "饮食") {
            changeCardStatus(document.getElementById("eatBtn"))
        } else {
            changeCardStatus(document.getElementById("sportBtn"))
        }
        fetchSQLWorkflow(text, "system")
            .then(res => {
                if (res.result[0].result > 0) {
                    showFloatingAlert("打卡成功", "success")
                } else {
                    showFloatingAlert("打卡失败", "error")
                }
            })
    });
}
//传入一个button，将文字设置为“已打卡”，并将按钮颜色设置为绿色，点击事件设置为null
function changeCardStatus(element) {
    element.innerHTML = "已打卡"
    element.style.backgroundColor = "#22c55e"
    element.onclick = null
}
window.onload = function () {
    let loading = startLoading()
    let loadDataTotal = 0
    const userinfo = getUserInfo()
    fetchSQLWorkflow(`查询id为${userinfo.user_id}的用户的生活方案数据`, "tourist")
        .then(res => {
            data = res.result
            if (data.length != 0) {
                sessionStorage.setItem("scheme", JSON.stringify(data))
            }
            loadData(data)
            loadDataTotal++
            if (loadDataTotal == 2) {
                stopLoading(loading)
            }
        })
    fetchSQLWorkflow(`查询用户id为${userinfo.user_id}，且日期为${getDate()}打卡数据`, "system")
        .then(res => {
            data = res.result
            console.log(data)
            if (data.length != 0) {
                data.forEach(item => {
                    if (item.punch_type == "饮食") {
                        changeCardStatus(document.getElementById("eatBtn"))
                    } else {
                        changeCardStatus(document.getElementById("sportBtn"))
                    }
                })
            }
            loadDataTotal++
            if (loadDataTotal == 2) {
                stopLoading(loading)
            }
        })



}