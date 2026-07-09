window.onload = function () {
    let loagding = startLoading();
    // 定义病症类型
    var res = null
    // 获取查询的病症类型id
    const searchParams = new URLSearchParams(window.location.search);
    const tpid = searchParams.get('id');
    fetchSQLWorkflow(`查询id为${tpid}的糖尿病类型信息`, "abc")
        .then(data => {
            stopLoading(loagding);
            const res = data.result[0];
            console.log('解析后的数据:', res);

            // DOM更新移到此处确保数据就绪
            if (res) {
                // 更新类型名称
                document.getElementById('type_name').innerText = res.type_name || '糖尿病知识';
                document.getElementById('img').src = res.img
                // 更新发病机制
                document.getElementById('pathogenesis').innerHTML = `
                <p class="text-gray-600 leading-6">${res.pathogenesis || '暂无发病机制说明'}</p>
            `;
                // 更新临床表现
                document.getElementById('manifestation').innerHTML = `
                <p class="text-gray-600 leading-6">${res.manifestation || '暂无临床表现说明'}</p>
            `;
                // 更新治疗方法
                document.getElementById('treatment').innerHTML = `
                <p class="text-gray-600 leading-6">${res.treatment || '暂无治疗方法说明'}</p>
            `;

            }
        })
        .catch(error => {
            stopLoading(loagding);
            console.error(error)
        });
}