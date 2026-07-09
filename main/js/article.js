tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#4A90E2',
                secondary: '#81B3F3'
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
    let loading = startLoading();
    try {
        // 获取url上的article_id
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');
        fetchSQLWorkflow(`查询id为${articleId}的文章信息`, "system")
            .then(res => {
                data = res.result
                let article = data[0]
                console.log(article)
                // Update dynamic content
                document.querySelector('img').src = article.cover_url;
                document.querySelector('img').alt = article.title;
                document.querySelector('h1.text-xl').textContent = article.title;
                document.querySelector('span.ml-2').textContent = article.author;
                document.querySelector('span.time').textContent = article.publish_time;
                document.querySelector('.article-content').innerHTML = article.content;
                stopLoading(loading);

            })
    } catch (error) {
        console.error('Error loading article:', error);
        stopLoading(loading);
        showFloatingAlert("加载文章失败，请稍后重试。", "error");
    }
}
