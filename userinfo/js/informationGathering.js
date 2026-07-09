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
window.onload = function () {
    //sessionStorage删除以risk_info_开头的键值对
    for (let i = 0; i < sessionStorage.length; i++) {
        let key = sessionStorage.key(i);
        if (key.startsWith("risk_info_")) {
            sessionStorage.removeItem(key);
        } 
    }
    // 获取url中的disease参数
    const urlParams = new URLSearchParams(window.location.search);
    const disease = urlParams.get('disease');
    const userinfo = getUserInfo();
    // 控制当性别选择女时添加妊娠期选项
    const genderRadios = document.querySelectorAll('input[name="sex"]');
    const pregnancyGroup = document.getElementById('pregnancyGroup');
    genderRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.value === '女') {
                pregnancyGroup.style.display = 'block';
            } else {
                pregnancyGroup.style.display = 'none';
            }
        });
    });
    //重写表单提交方法
    const form = document.getElementById('personalInfoForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        let overlay = startLoading()
        const formData = new FormData(form);
        let data = Object.fromEntries(formData.entries());
        data.userId = userinfo.user_id
        data.disease = disease
        const checkboxes = document.querySelectorAll('input[name="familyHistory"]');
        let selectedOptions = "";
        checkboxes.forEach(checkbox => {
            if (checkbox.checked && checkbox.value != "other") {
                selectedOptions += checkbox.value + ",";
            } else if (checkbox.value == "other") {
                let other = document.getElementById("otherInput").value
                selectedOptions += other + ",";
            }
        });
        if (selectedOptions.length > 0) {
            selectedOptions = "无"
        }
        data.familyHistory = selectedOptions;
        fetchDiabetesDetectionWorkflow(data, "users")
            .then(res => {
                stopLoading(overlay)
                localStorage.setItem("riskInfo", JSON.stringify(res))

                if (res.disease == "否") {
                    window.location.replace("riskOutcome.html")
                } else {
                    window.location.replace("userinfo.html")
                }
            })
            .catch(err => {
                stopLoading(overlay)
            })
        console.log(data);
        // fetchDiabetesDetectionWorkflow()
    });
}