tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#4F46E5',
                secondary: '#818CF8'
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
                'button': '4px',
            }
        }
    }
}
function getLifeScheme() {
    // 获取个人信息
    const age = document.getElementById('age').textContent;
    const sex = document.getElementById('sex').textContent;
    const height = document.getElementById('height').textContent;
    const weight = document.getElementById('weight').textContent;
    const disease = document.getElementById('disease').textContent;

    // 获取生活习惯
    const selects = document.querySelectorAll('select');
    const sleepSchedule = selects[0].value;
    const cookingFreq = selects[1].value;
    const dietPreference = selects[2].value;
    const exerciseHabits = selects[3].value;
    const drinkingHabits = selects[4].value;

    // 验证生活习惯数据
    if (sleepSchedule === '请选择' || cookingFreq === '请选择' ||
        dietPreference === '请选择' || exerciseHabits === '请选择' ||
        drinkingHabits === '请选择') {
        Swal.fire({
            title: '请完善生活习惯信息',
            text: '所有生活习惯选项都需要选择',
            icon: 'warning'
        });
        return null;
    }
    const userInfo = `个人信息:
                        年龄: ${age}
                        性别: ${sex}
                        身高: ${height}
                        体重: ${weight}
                        是否患病: ${disease}
                        `
    const habit = `生活习惯:
                        作息时间: ${sleepSchedule}
                        做饭频率: ${cookingFreq}
                        饮食口味: ${dietPreference}
                        `
    // 获取要保持的习惯
    const suggestion = document.querySelector('textarea').value;
    const userinfo = getUserInfo()
    const data = {userInfo,habit,suggestion,userId:userinfo.user_id}
    const loading = startLoading("正在生成方案")
    fetchLifePlansWorkflow(data,userinfo.user_id)
        .then(res => {
            stopLoading(loading)
            console.log(res)
            if (res.length > 0) {
                //通过swal显示方案生成成功提示，点击则跳转至方案详情页
                Swal.fire({
                    title: '方案生成成功',
                    text: '点击确认跳转至方案详情页',
                    icon: 'success',
                    confirmButtonText: '确定',
                }).then((result) => {
                if (result.isConfirmed) {
                    top.location.replace('scheme.html')
                }
            });
            }else{
                Swal.fire({
                    title: '方案生成失败',
                    text: '请稍后再试',
                    icon:'error',
                    confirmButtonText: '确定',
                })
            }

        })

}
window.onload = function () {
    let loading = startLoading("正在加载用户信息")
    sessionStorage.removeItem('scheme')
    let riskInfo = null
    getUserRiskInfo().then(ri => {
        stopLoading(loading)
        riskInfo = ri
        console.log(riskInfo)
        if (riskInfo) {
            console.log(riskInfo)
            document.getElementById('age').textContent = riskInfo.age
            document.getElementById('sex').textContent = riskInfo.sex
            document.getElementById('height').textContent = riskInfo.height + "cm"
            document.getElementById('weight').textContent = riskInfo.weight + "kg"
            document.getElementById('disease').textContent = riskInfo.disease

        } else {
            Swal.fire({
                title: '请先添加用户信息',
                text: '点击确认跳转至添加用户信息页面',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then((result) => {
                if (result.isConfirmed) {
                    top.location.href = '/userinfo/userinfo.html'
                }
            });
        }
    })

}