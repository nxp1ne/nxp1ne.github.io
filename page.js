document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const file = urlParams.get('file');
    
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
        'HexVisuals.jar': {
            name: 'HexVisuals',
            version: '1.0 Beta',
            size: '856 КБ',
            compatibility: '1.17.1 - 1.20.1',
            lastUpdate: '01.06.2024',
            downloadUrl: 'https://github.com/nxp1ne/nxp1ne.github.io/releases/download/HexVisuals.jar/HexVisuals-1.0beta.jar',
            description: 'HexVisuals - это мод для Minecraft, который добавляет красивые визуальные эффекты для заклинаний и магических способностей.',
            badgeType: 'beta',
            badgeText: 'beta',
            features: [
                { icon: '<i class="fas fa-magic"></i>', title: 'Магические эффекты', text: 'Уникальные визуальные эффекты для всех видов магии' },
                { icon: '<i class="fas fa-palette"></i>', title: 'Настройка цветов', text: 'Возможность настроить цвета и интенсивность эффектов' },
                { icon: '<i class="fas fa-bolt"></i>', title: 'Заклинания', text: 'Визуализация заклинаний с уникальными анимациями' },
                { icon: '<i class="fas fa-feather-alt"></i>', title: 'Оптимизация', text: 'Минимальное влияние на производительность игры' }
            ],
            instructions: '<h3><i class="fas fa-info-circle"></i> Специальные инструкции для HexVisuals</h3>' +
                         '<p>После установки используйте команду <code>/hexvisuals help</code> для просмотра всех доступных команд.</p>' +
                         '<p><i class="fas fa-exclamation-triangle"></i> <strong>Важно:</strong> Это бета-версия, возможны небольшие ошибки. Пожалуйста, сообщайте о них разработчику.</p>' +
                         '<p>Для настройки визуальных эффектов используйте файл <code>config.json</code> в папке мода.</p>'
        }
    };

    if (file && pluginInfo[file]) {
        const plugin = pluginInfo[file];
        
        setPluginInfo(plugin);
        setupDownloadHandling(plugin);
        
    } else {
        handleFileNotFound();
    }

    setupAnimations();
});

function setPluginInfo(plugin) {
    document.getElementById('filename').textContent = plugin.name;
    document.getElementById('version').textContent = plugin.version;
    document.getElementById('filesize').textContent = plugin.size;
    document.getElementById('compatibility').textContent = plugin.compatibility;
    document.getElementById('last-update').textContent = plugin.lastUpdate;
    
    document.getElementById('plugin-badge').innerHTML = `<span class="badge ${plugin.badgeType}">${plugin.badgeText}</span>`;
    
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = plugin.downloadUrl;
    
    if (plugin.instructions) {
        document.getElementById('plugin-specific-instructions').innerHTML = plugin.instructions;
    }
    
    renderFeatures(plugin.features);
    
    if (plugin.description) {
        document.querySelector('.file-description').textContent = plugin.description;
    }
}

function renderFeatures(features) {
    const featuresContainer = document.getElementById('plugin-features');
    
    featuresContainer.innerHTML = features.map(feature => `
        <div class="feature-item">
            <div class="feature-icon">${feature.icon}</div>
            <h3 class="feature-title">${feature.title}</h3>
            <p>${feature.text}</p>
        </div>
    `).join('');
}

function setupDownloadHandling(plugin) {
    document.getElementById('downloadLink').addEventListener('click', function() {
        setTimeout(function() {
            const downloadInfo = document.querySelector('.download-info');
            
            const existingMessage = downloadInfo.querySelector('.success-message');
            if (existingMessage) existingMessage.remove();
            
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.innerHTML = `
                <p><i class="fas fa-check-circle"></i> Скачивание началось! Спасибо за выбор наших плагинов.</p>
            `;
            downloadInfo.appendChild(successMessage);
            
            setTimeout(() => successMessage.remove(), 5000);
        }, 1000);
    });
}

function handleFileNotFound() {
    document.getElementById('filename').textContent = 'Файл не найден или не указан';
    document.getElementById('version').textContent = 'Н/Д';
    document.getElementById('filesize').textContent = 'Н/Д';
    document.getElementById('compatibility').textContent = 'Н/Д';
    document.getElementById('last-update').textContent = 'Н/Д';
    document.getElementById('downloadLink').style.display = 'none';
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `
        <p><i class="fas fa-exclamation-circle"></i> Извините, запрошенный плагин не найден. Пожалуйста, выберите плагин из <a href="index.html">списка доступных плагинов</a>.</p>
    `;
    document.querySelector('.download-info').appendChild(errorMessage);
}

function setupAnimations() {
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
    
    const elementsToAnimate = document.querySelectorAll('.feature-item, .additional-info, .support-section');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();
}
