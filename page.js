document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const file = urlParams.get('file');
    
    // Объект с версиями для каждого файла
    const fileVersions = {
        'gangReg.jar': '1.0release',
        'PlayerMoney.jar': '1.1beta',
    };

    // Объект с размерами для каждого файла
    const fileRazmer = {
        'gangReg.jar': '1.2 МБ',
        'PlayerMoney.jar': '856 КБ',
    };

    // Объект со ссылками для скачивания
    const fileDownload = {
        'gangReg.jar': 'https://github.com/nxp1ne/nxp1ne.github.io/releases/download/GangReg.jar/GangRegister-1.0-Release.jar',
        'PlayerMoney.jar': 'https://github.com/nxp1ne/nxp1ne.github.io/releases/download/PlayerMoney.jar/PlayerPointer-1.1beta.jar',
    };

    if (file) {
        document.getElementById('filename').textContent = `Вы выбрали файл: ${file}`;
        // Отображаем версию файла
        const version = fileVersions[file] || 'Неизвестно';
        document.getElementById('version').textContent = version;
        // Отображаем размер файла
        const razmer = fileRazmer[file] || 'Неизвестно';
        document.getElementById('filesize').textContent = razmer;
        
        // Устанавливаем ссылку на скачивание из списка fileDownload
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = fileDownload[file] || '#';
    } else {
        document.getElementById('filename').textContent = 'Файл не найден.';
        document.getElementById('version').textContent = 'Н/Д';
        document.getElementById('filesize').textContent = 'Н/Д';
        document.getElementById('downloadLink').style.display = 'none';
    }
});
