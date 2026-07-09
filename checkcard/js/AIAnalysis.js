tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#3B82F6',
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
// Function to update progress
function updateProgress(percent) {
    const progressCircle = document.querySelector('.progress-circle');
    const percentText = document.querySelector('.progress-percent');
    console.log(progressCircle)
    console.log(percentText)

    // Calculate stroke-dashoffset (283 is the circumference)
    const offset = 283 - (283 * percent / 100);
    progressCircle.style.strokeDashoffset = offset;
    percentText.textContent = `${percent}%`;

    // Update color based on percentage
    if (percent < 40) {
        progressCircle.style.stroke = '#EF4444'; // red
        percentText.classList.remove('text-primary', 'text-green-500');
        percentText.classList.add('text-red-500');
    } else if (percent >= 40 && percent <= 70) {
        progressCircle.style.stroke = '#3B82F6'; // blue
        percentText.classList.remove('text-red-500', 'text-green-500');
        percentText.classList.add('text-primary');
    } else {
        progressCircle.style.stroke = '#10B981'; // green
        percentText.classList.remove('text-red-500', 'text-primary');
        percentText.classList.add('text-green-500');
    }
}
// 移除图表相关代码
window.onload = function () {
    updateProgress(0);
    let userInfo = getUserInfo();
    let loading = startLoading("AI智能分析ing")
    fetchAnalysisWorkflow({ userId: userInfo.user_id }, userInfo.user_id)
        .then(res => {
            stopLoading(loading)
            console.log(res)
            document.getElementById("completionStatus").innerHTML = res.completionStatus;
            document.getElementById("evaluate").innerHTML = res.evaluate;
            document.getElementById("suggestion").innerHTML = res.suggestion;
            // res.process去掉%，转数字
            res.process = parseInt(res.process.replace("%", ""));
            console.log(res.process)
            updateProgress(res.process);
        })
}