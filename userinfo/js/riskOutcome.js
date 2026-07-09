tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#4A90E2',
                secondary: '#FFA500'
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
function extractContent(str) {
    const regex = /【([^】]+)】/;
    const match = str.match(regex);
    const extracted = match ? match[1] : null;
    const remainingText = match ? str.replace(regex, '') : str;
    return {
        extracted: extracted,
        remainingText: remainingText
    };
}
window.onload = async function () {
   // 通过LocalStorage获取风险信息，并加载到界面中
const riskInfo = localStorage.getItem('riskInfo')
if (riskInfo) {
    const riskInfoObj = JSON.parse(riskInfo)
    const result = riskInfoObj.result
    console.log(result)

    let obj = extractContent(result)
    document.getElementById('resultSpan').textContent = obj.extracted
    document.getElementById('resultText').textContent = `您目前处于${obj.extracted}风险水平`
    document.getElementById('messageDiv').innerHTML = obj.remainingText

} 
}