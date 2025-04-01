document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const file = urlParams.get('file');
    
    // Объект с подробной информацией о плагинах
    const pluginInfo = {
        'ElysiumHeads.jar': {
            name: 'ElysiumHeads',
            version: '1.2 Release',
            size: '1.4 МБ',
            compatibility: '1.16.5 - 1.20.1',
            lastUpdate: '15.07.2024',
            downloadUrl: 'https://github.com/nxp1ne/nxp1ne.github.io/releases/download/ElysiumHeads.jar/ElysiumHeads-1.2-Release.jar',
            description: 'Плагин ElysiumHeads позволяет игрокам получать головы с уникальными текстурами, включая головы мобов, игроков и декоративные головы с разными дизайнами.',
            badgeType: 'new',
            badgeText: 'release',
            features: [
                { icon: '<i class="fas fa-skull"></i>', title: 'Головы игроков', text: 'Получение голов убитых игроков с их оригинальными скинами' },
                { icon: '<i class="fas fa-paint-brush"></i>', title: 'Декоративные головы', text: 'Доступ к сотням уникальных декоративных голов для строительства' },
                { icon: '<i class="fas fa-sliders-h"></i>', title: 'Гибкая настройка', text: 'Полностью настраиваемые шансы выпадения и параметры плагина' }
            ],
            instructions: '<h3><i class="fas fa-info-circle"></i> Специальные инструкции для ElysiumHeads</h3>' +
                          '<p>После установки используйте команду <code>/heads help</code> для просмотра всех доступных команд плагина.</p>' +
                          '<p>Основные команды:</p>' +
                          '<ul>' +
                          '<li><code>/heads give &lt;игрок&gt; &lt;моб&gt;</code> - выдать голову определенного моба игроку</li>' +
                          '<li><code>/heads menu</code> - открыть меню со всеми доступными головами</li>' +
                          '<li><code>/heads reload</code> - перезагрузить конфигурацию плагина</li>' +
                          '</ul>' +
                          '<p>Настройте шансы выпадения голов в файле <code>config.yml</code>.</p>'
        },
        'PlayerMoney.jar': {
            name: 'PlayerMoney',
            version: '1.1 Beta',
            size: '856 КБ',
            compatibility: '1.17.1 - 1.20.1',
            lastUpdate: '01.06.2024',
            downloadUrl: 'https://github.com/nxp1ne/nxp1ne.github.io/releases/download/PlayerMoney.jar/PlayerPointer-1.1beta.jar',
            description: 'PlayerMoney - это экономический плагин, который позволяет создать внутриигровую экономику с возможностью перевода денег между игроками, создания магазинов и многое другое.',
            badgeType: 'beta',
            badgeText: 'beta',
            features: [
                { icon: '<i class="fas fa-coins"></i>', title: 'Экономика', text: 'Система внутриигровой валюты и транзакций' },
                { icon: '<i class="fas fa-store"></i>', title: 'Магазины', text: 'Создание и управление магазинами игроков' },
                { icon: '<i class="fas fa-university"></i>', title: 'Банковская система', text: 'Депозиты, снятие средств и проценты' },
                { icon: '<i class="fas fa-plug"></i>', title: 'API интеграция', text: 'Интеграция с другими плагинами через API' }
            ],
            instructions: '<h3><i class="fas fa-info-circle"></i> Специальные инструкции для PlayerMoney</h3>' +
                         '<p>После установки используйте команду <code>/money help</code> для просмотра всех доступных команд.</p>' +
                         '<p><i class="fas fa-exclamation-triangle"></i> <strong>Важно:</strong> Это бета-версия, возможны небольшие ошибки. Пожалуйста, сообщайте о них разработчику.</p>'
        }
    };

    if (file && pluginInfo[file]) {
        const plugin = pluginInfo[file];
        
        // Установка основной информации
        document.getElementById('filename').textContent = `${plugin.name}`;
        document.getElementById('version').textContent = plugin.version;
        document.getElementById('filesize').textContent = plugin.size;
        document.getElementById('compatibility').textContent = plugin.compatibility;
        document.getElementById('last-update').textContent = plugin.lastUpdate;
        
        // Добавление бейджа
        const badgeHtml = `<span class="badge ${plugin.badgeType}">${plugin.badgeText}</span>`;
        document.getElementById('plugin-badge').innerHTML = badgeHtml;
        
        // Установка ссылки на скачивание
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = plugin.downloadUrl;
        
        // Заполнение специфических инструкций для плагина
        if (plugin.instructions) {
            document.getElementById('plugin-specific-instructions').innerHTML = plugin.instructions;
        }
        
        // Заполнение секции с фичами плагина
        const featuresContainer = document.getElementById('plugin-features');
        let featuresHTML = '';
        
        plugin.features.forEach(feature => {
            featuresHTML += `
                <div class="feature-item">
                    <div class="feature-icon">${feature.icon}</div>
                    <h3 class="feature-title">${feature.title}</h3>
                    <p>${feature.text}</p>
                </div>
            `;
        });
        
        featuresContainer.innerHTML = featuresHTML;
        
        // Добавление описания плагина, если оно есть
        if (plugin.description) {
            document.querySelector('.file-description').textContent = plugin.description;
        }
        
        // Добавим поведение при нажатии на кнопку скачивания
        downloadLink.addEventListener('click', function() {
            // Показать сообщение об успешном скачивании через 1 секунду
            setTimeout(function() {
                const downloadInfo = document.querySelector('.download-info');
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.innerHTML = `
                    <p><i class="fas fa-check-circle"></i> Скачивание началось! Спасибо за выбор наших плагинов.</p>
                `;
                downloadInfo.appendChild(successMessage);
                
                // Удалить сообщение через 5 секунд
                setTimeout(function() {
                    successMessage.remove();
                }, 5000);
            }, 1000);
        });
        
    } else {
        // Если файл не найден или не указан
        document.getElementById('filename').textContent = 'Файл не найден или не указан';
        document.getElementById('version').textContent = 'Н/Д';
        document.getElementById('filesize').textContent = 'Н/Д';
        document.getElementById('compatibility').textContent = 'Н/Д';
        document.getElementById('last-update').textContent = 'Н/Д';
        document.getElementById('downloadLink').style.display = 'none';
        
        // Добавим сообщение об ошибке
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <p><i class="fas fa-exclamation-circle"></i> Извините, запрошенный плагин не найден. Пожалуйста, выберите плагин из <a href="index.html">списка доступных плагинов</a>.</p>
        `;
        document.querySelector('.download-info').appendChild(errorMessage);
    }

    // Добавим анимацию для элементов при скролле
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.feature-item, .additional-info, .support-section');
        
        elements.forEach(element => {
            const position = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (position < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Изначально установим стили для анимации
    const elementsToAnimate = document.querySelectorAll('.feature-item, .additional-info, .support-section');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Вызываем функцию при загрузке страницы и скролле
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Вызываем сразу для видимых элементов
});
