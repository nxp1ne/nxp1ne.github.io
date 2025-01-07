let gameState = {
    money: 5000,
    reputation: 0,
    projects: 0,
    employees: [],
    availableProjects: [],
    activeProjects: [],
    lastUpdate: Date.now()
};

const projectTypes = [
    { 
        name: "Веб-сайт", 
        cost: 1000, 
        duration: 30,
        difficulty: 1,
        icon: "fa-globe"
    },
    { 
        name: "Мобильное приложение", 
        cost: 2500, 
        duration: 45,
        difficulty: 2,
        icon: "fa-mobile-alt"
    },
    { 
        name: "Корпоративная система", 
        cost: 5000, 
        duration: 60,
        difficulty: 3,
        icon: "fa-building"
    },
    {
        name: "ИИ",
        cost: 10000,
        duration: 120,
        difficulty: 4,
        icon: "fa-brain"
    },
    {
        name: "Сервис",
        cost: 10000,
        duration: 120,
        difficulty: 4,
        icon: "fa-server"
    },
    {
        name: "Игра для мобильного устройства",
        cost: 10000,
        duration: 120,
        difficulty: 4,
        icon: "fa-gamepad"
    },
    {
        name: "Портирование игры на другой платформу",
        cost: 25000,
        duration: 500,
        difficulty: 7,
        icon: "fa-code"
    }
];

let musicPlaying = false;
const backgroundMusic = document.getElementById('backgroundMusic');
const volumeSlider = document.getElementById('volumeSlider');
const musicIcon = document.getElementById('musicIcon');

let currentTheme = localStorage.getItem('theme') || 'light';

function showThemeWarning() {
    const warning = document.getElementById('themeWarning');
    if (warning) {
        warning.style.display = 'block';
        warning.classList.remove('hiding');
    }
}

function dismissWarning() {
    const warning = document.getElementById('themeWarning');
    if (warning) {
        warning.classList.add('hiding');
        setTimeout(() => {
            warning.style.display = 'none';
        }, 300);
    }
}

function toggleTheme() {
    try {
        const themeIcon = document.getElementById('themeIcon');
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeIcon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        localStorage.setItem('theme', currentTheme);
        
        if (currentTheme === 'dark') {
            showThemeWarning();
        }
        
    } catch (error) {
        console.error('Ошибка при переключении темы:', error);
        showNotification('Ошибка при переключении темы', 'error');
    }
}

function initTheme() {
    try {
        const themeIcon = document.getElementById('themeIcon');
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        if (themeIcon) {
            themeIcon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
        
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (!localStorage.getItem('theme') && prefersDark) {
            currentTheme = 'dark';
            toggleTheme();
        }
    } catch (error) {
        console.error('Ошибка при инициализации темы:', error);
    }
}

function initAudio() {
    try {
        if (backgroundMusic) {
            backgroundMusic.volume = 0.3;
            
            volumeSlider.addEventListener('input', (e) => {
                const volume = e.target.value / 100;
                backgroundMusic.volume = volume;
                updateMusicIcon(volume);
            });

            document.addEventListener('click', function startMusic() {
                if (!musicPlaying) {
                    toggleMusic();
                    document.removeEventListener('click', startMusic);
                }
            }, { once: true });
        }
    } catch (error) {
        console.error('Ошибка инициализации аудио:', error);
    }
}

function toggleMusic() {
    try {
        if (!backgroundMusic) return;

        if (musicPlaying) {
            backgroundMusic.pause();
            musicIcon.className = 'fas fa-volume-mute';
        } else {
            backgroundMusic.play()
                .then(() => {
                    musicIcon.className = 'fas fa-volume-up';
                })
                .catch(error => {
                    console.error('Ошибка воспроизведения:', error);
                    showNotification('Ошибка воспроизведения музыки', 'error');
                });
        }
        musicPlaying = !musicPlaying;
    } catch (error) {
        console.error('Ошибка переключения музыки:', error);
    }
}

function updateMusicIcon(volume) {
    if (!musicIcon) return;
    
    if (volume === 0) {
        musicIcon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        musicIcon.className = 'fas fa-volume-down';
    } else {
        musicIcon.className = 'fas fa-volume-up';
    }
}

function saveGame() {
    try {
        localStorage.setItem('softwareCompanyGame', JSON.stringify(gameState));
    } catch (e) {
        console.error('Ошибка сохранения:', e);
    }
}

function loadGame() {
    try {
        const saved = localStorage.getItem('softwareCompanyGame');
        if (saved) {
            gameState = JSON.parse(saved);
            updateDisplay();
            updateEmployeesList();
            updateProjectsList();
            updateActiveProjects();
        }
    } catch (e) {
        console.error('Ошибка загрузки:', e);
    }
}

function updateDisplay() {
    try {
        const elements = {
            money: document.getElementById('money'),
            reputation: document.getElementById('reputation'),
            projects: document.getElementById('projects')
        };

        Object.entries(elements).forEach(([key, element]) => {
            if (!element) {
                throw new Error(`Элемент ${key} не найден`);
            }
        });

        elements.money.textContent = Math.floor(gameState.money).toLocaleString();
        elements.reputation.textContent = Math.floor(gameState.reputation).toLocaleString();
        elements.projects.textContent = gameState.projects.toString();

        elements.money.style.color = gameState.money < 5000 ? 'var(--danger)' : 'inherit';

    } catch (error) {
        console.error('Ошибка при обновлении дисплея:', error);
    }
}

function hireEmployee() {
    try {
        if (!gameState) {
            throw new Error('Состояние игры не инициализировано');
        }

        if (typeof gameState.money !== 'number') {
            throw new Error('Некорректное значение денег');
        }

        if (gameState.money < 5000) {
            showNotification('Недостаточно денег! Нужно $5000', 'error');
            return;
        }

        const names = [
            "Алексей", "Мария", "Дмитрий", "Анна", "Сергей", 
            "Елена", "Павел", "Ольга", "Андрей", "Наталья"
        ];
        const surnames = [
            "Иванов", "Петров", "Сидоров", "Смирнов", "Кузнецов",
            "Попов", "Соколов", "Лебедев", "Козлов", "Новиков"
        ];
        
        if (!Array.isArray(names) || !Array.isArray(surnames) || names.length === 0 || surnames.length === 0) {
            throw new Error('Ошибка в данных имен сотрудников');
        }

        const randomName = `${names[Math.floor(Math.random() * names.length)]} ${
            surnames[Math.floor(Math.random() * surnames.length)]}`;

        const specialties = ["Frontend", "Backend", "Mobile", "DevOps", "FullStack", "AI", "GameDev", "Service", "Porting", "UI/UX", "Design", "Marketing", "Sales", "HR", "Finance", "Legal", "Project Management", "QA", "Support", "Analytics", "Security"];
        
        if (!Array.isArray(specialties) || specialties.length === 0) {
            throw new Error('Ошибка в данных специальностей');
        }

        const newEmployee = {
            id: Date.now(),
            name: randomName || 'Сотрудник',
            skill: Math.floor(Math.random() * 5) + 1,
            specialty: specialties[Math.floor(Math.random() * specialties.length)],
            hireDate: new Date().toISOString()
        };

        if (!newEmployee.id || !newEmployee.name || !newEmployee.skill) {
            throw new Error('Ошибка при создании сотрудника');
        }

        if (!Array.isArray(gameState.employees)) {
            gameState.employees = [];
        }

        gameState.money -= 5000;
        
        gameState.employees.push(newEmployee);

        updateDisplay();
        updateEmployeesList();
        saveGame();

        showNotification(`Нанят новый сотрудник: ${newEmployee.name}`, 'success');
        
        const employeeAdded = gameState.employees.some(emp => emp.id === newEmployee.id);
        if (!employeeAdded) {
            throw new Error('Сотрудник не был добавлен в список');
        }

    } catch (error) {
        console.error('Ошибка при найме сотрудника:', error);
        showNotification(`Ошибка при найме: ${error.message}`, 'error');
        
        if (gameState && typeof gameState.money === 'number') {
            gameState.money += 5000;
            updateDisplay();
        }
    }
}

function updateEmployeesList() {
    try {
        const list = document.getElementById('employees-list');
        if (!list) {
            throw new Error('Элемент списка сотрудников не найден');
        }

        if (!Array.isArray(gameState.employees)) {
            throw new Error('Некорректный массив сотрудников');
        }

        list.innerHTML = '';
        
        gameState.employees.forEach(employee => {
            if (!employee || !employee.name || typeof employee.skill !== 'number') {
                console.warn('Пропущен некорректный сотрудник:', employee);
                return;
            }

            const skillStars = '⭐'.repeat(Math.min(Math.max(employee.skill, 1), 5));
            const employeeDiv = document.createElement('div');
            employeeDiv.className = 'employee';
            employeeDiv.innerHTML = `
                <div>
                    <i class="fas fa-user-circle"></i>
                    ${employee.name}
                    <span class="specialty">${employee.specialty || 'Разработчик'}</span>
                </div>
                <div class="skill-level" title="Уровень навыка: ${employee.skill}">
                    ${skillStars}
                </div>
            `;
            list.appendChild(employeeDiv);
        });

    } catch (error) {
        console.error('Ошибка при обновлении списка сотрудников:', error);
        showNotification('Ошибка при обновлении списка сотрудников', 'error');
    }
}

function generateNewProject() {
    try {
        if (!Array.isArray(gameState.availableProjects)) {
            gameState.availableProjects = [];
        }

        if (gameState.availableProjects.length >= 3) {
            return;
        }

        if (!Array.isArray(projectTypes) || projectTypes.length === 0) {
            throw new Error('Типы проектов не определены');
        }

        const projectType = projectTypes[Math.floor(Math.random() * projectTypes.length)];
        
        const variation = 0.2;
        const costVariation = 1 + (Math.random() * variation * 2 - variation);
        const durationVariation = 1 + (Math.random() * variation * 2 - variation);

        const newProject = {
            id: Date.now(),
            name: projectType.name,
            cost: Math.round(projectType.cost * costVariation),
            duration: Math.round(projectType.duration * durationVariation),
            difficulty: projectType.difficulty,
            icon: projectType.icon || 'fa-code',
            description: generateProjectDescription(projectType.name),
            requiredSkills: generateRequiredSkills()
        };

        gameState.availableProjects.push(newProject);
        updateProjectsList();
        
        showNotification(`Доступен новый проект: ${newProject.name}`, 'info');

    } catch (error) {
        console.error('Ошибка при генерации проекта:', error);
    }
}

function generateProjectDescription(projectName) {
    const clients = [
        'стартап', 'крупная компания', 'локальный бизнес', 
        'международная корпорация', 'государственное учреждение'
    ];
    const industries = [
        'e-commerce', 'образование', 'здравоохранение', 
        'финансы', 'развлечения', 'логистика'
    ];
    const features = [
        'авторизацией', 'аналитикой', 'интеграцией платежей',
        'чатом', 'административной панелью', 'API'
    ];

    const client = clients[Math.floor(Math.random() * clients.length)];
    const industry = industries[Math.floor(Math.random() * industries.length)];
    const feature = features[Math.floor(Math.random() * features.length)];

    return `${projectName} для ${client} в сфере ${industry} с ${feature}`;
}

function generateRequiredSkills() {
    const skills = ['Frontend', 'Backend', 'Mobile', 'DevOps', 'UI/UX'];
    const requiredCount = Math.floor(Math.random() * 2) + 1;
    const shuffled = skills.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, requiredCount);
}

function updateProjectsList() {
    try {
        const list = document.getElementById('available-projects');
        if (!list) {
            throw new Error('Элемент списка проектов не найден');
        }

        if (!Array.isArray(gameState.availableProjects)) {
            throw new Error('Некорректный массив проектов');
        }

        list.innerHTML = '';
        
        if (gameState.availableProjects.length === 0) {
            list.innerHTML = '<div class="no-projects">Ожидаем новые проекты...</div>';
            return;
        }

        gameState.availableProjects.forEach(project => {
            if (!project || !project.name) {
                console.warn('Пропущен некорректный проект:', project);
                return;
            }

            const projectDiv = document.createElement('div');
            projectDiv.className = 'project';
            projectDiv.innerHTML = `
                <h3><i class="fas ${project.icon}"></i> ${project.name}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-details">
                    <p><i class="fas fa-coins"></i> Стоимость: $${project.cost}</p>
                    <p><i class="fas fa-clock"></i> Длительность: ${project.duration} сек.</p>
                    <p><i class="fas fa-star"></i> Сложность: ${project.difficulty}/3</p>
                </div>
                <div class="required-skills">
                    <p>Требуемые навыки:</p>
                    ${project.requiredSkills.map(skill => 
                        `<span class="skill-tag">${skill}</span>`
                    ).join('')}
                </div>
                <button onclick="startProject(${project.id})">
                    <i class="fas fa-play"></i>
                    Взять проект
                </button>
            `;
            list.appendChild(projectDiv);
        });

    } catch (error) {
        console.error('Ошибка при обновлении списка проектов:', error);
        showNotification('Ошибка при обновлении списка проектов', 'error');
    }
}

function startProject(projectId) {
    const project = gameState.availableProjects.find(p => p.id === projectId);
    if (!project) return; 
    if (gameState.employees.length > 0) {
        const teamEfficiency = calculateTeamEfficiency();
        
        const adjustedDuration = calculateProjectDuration(project, teamEfficiency);
        
        gameState.availableProjects = gameState.availableProjects.filter(p => p.id !== projectId);
        
        const activeProject = {
            ...project,
            timeLeft: adjustedDuration,
            originalDuration: adjustedDuration,
            startTime: Date.now(),
            progress: 0,
            assignedTeam: [...gameState.employees]
        };
        
        gameState.activeProjects.push(activeProject);
        
        showNotification(`Проект начат! Расчетное время: ${adjustedDuration} сек.`);
        updateProjectsList();
        updateActiveProjects();
    } else {
        alert('Нужно нанять хотя бы одного разработчика!');
    }
}

function calculateTeamEfficiency() {
    return gameState.employees.reduce((total, employee) => {
        return total + employee.skill;
    }, 0);
}

function calculateProjectDuration(project, teamEfficiency) {
    if (!project || teamEfficiency <= 0) {
        return project?.duration || 30;
    }
    
    const efficiencyMultiplier = teamEfficiency / (project.difficulty * 2);
    const adjustedDuration = Math.max(
        Math.round(project.duration / efficiencyMultiplier),
        Math.ceil(project.duration * 0.3)
    );
    return isFinite(adjustedDuration) ? adjustedDuration : project.duration;
}

function updateActiveProjects() {
    const activeProjectsDiv = document.getElementById('active-projects');
    if (!activeProjectsDiv) return;

    activeProjectsDiv.innerHTML = '';
    gameState.activeProjects.forEach(project => {
        const progressPercentage = ((project.originalDuration - project.timeLeft) / project.originalDuration) * 100;
        const teamEfficiency = project.assignedTeam.reduce((sum, emp) => sum + emp.skill, 0);
        
        activeProjectsDiv.innerHTML += `
            <div class="project active-project">
                <h3><i class="fas ${project.icon}"></i> ${project.name}</h3>
                <p><i class="fas fa-clock"></i> Осталось: ${Math.max(0, project.timeLeft)} сек.</p>
                <p><i class="fas fa-users"></i> Команда: ${project.assignedTeam.length} чел.</p>
                <p><i class="fas fa-bolt"></i> Эффективность команды: ${teamEfficiency}</p>
                <div class="progress-bar">
                    <div class="progress" style="width: ${Math.min(100, progressPercentage)}%"></div>
                </div>
            </div>
        `;
    });
}

function completeProject(project) {
    gameState.money += project.cost;
    gameState.reputation += project.difficulty;
    gameState.projects++;
    
    showNotification(`Проект "${project.name}" завершен! +$${project.cost}`);
    
    updateDisplay();
}

function showNotification(message, type = 'success') {
    if (!message) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
        ${message}
    `;
    
    const oldNotifications = document.querySelectorAll(`.notification.${type}`);
    oldNotifications.forEach(n => n.remove());

    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 500);
    }, 3000);
}

function gameLoop() {
    try {
        const currentTime = Date.now();
        const deltaTime = (currentTime - gameState.lastUpdate) / 1000;
        gameState.lastUpdate = currentTime;

        if (deltaTime > 5 || deltaTime <= 0) {
            console.warn('Пропущено слишком много времени или некорректное значение:', deltaTime);
            return;
        }

        if (Array.isArray(gameState.activeProjects)) {
            gameState.activeProjects = gameState.activeProjects.filter(project => {
                if (!project || typeof project.timeLeft !== 'number') {
                    return false;
                }

                project.timeLeft -= deltaTime;
                
                if (project.timeLeft <= 0) {
                    completeProject(project);
                    return false;
                }
                return true;
            });
        }

        requestAnimationFrame(() => {
            updateDisplay();
            updateActiveProjects();
            updateProjectsList();
        });

    } catch (error) {
        console.error('Ошибка в игровом цикле:', error);
    }
}

function UpMoneyForHireEmployee() {
    if (gameState.developers > 40) {
        gameState.moneyForHireEmployee = 50000;
    }
    else if (gameState.developers > 30) {
        gameState.moneyForHireEmployee = 10000;
    }
    else if (gameState.developers > 20) {
        gameState.moneyForHireEmployee = 5000;
    }
    else if (gameState.developers > 10) {
        gameState.moneyForHireEmployee = 2000;
    }
    else if (gameState.developers > 4) {
        gameState.moneyForHireEmployee = 1000;
    }
}

function validateGameState() {
    try {
        if (!gameState) {
            gameState = {
                money: 5000,
                reputation: 0,
                projects: 0,
                employees: [],
                availableProjects: [],
                activeProjects: [],
                lastUpdate: Date.now()
            };
        }

        gameState.money = Number(gameState.money) || 5000;
        gameState.reputation = Number(gameState.reputation) || 0;
        gameState.projects = Number(gameState.projects) || 0;
        gameState.employees = Array.isArray(gameState.employees) ? gameState.employees : [];
        gameState.availableProjects = Array.isArray(gameState.availableProjects) ? gameState.availableProjects : [];
        gameState.activeProjects = Array.isArray(gameState.activeProjects) ? gameState.activeProjects : [];
        gameState.lastUpdate = Number(gameState.lastUpdate) || Date.now();

        return true;
    } catch (error) {
        console.error('Ошибка валидации состояния игры:', error);
        return false;
    }
}

function initGame() {
    try {
        validateGameState();
        loadGame();
        initAudio();
        initTheme();
        
        updateDisplay();
        updateEmployeesList();
        updateProjectsList();
        updateActiveProjects();
        
        generateNewProject();
        
        window.gameIntervals = {
            gameLoop: setInterval(gameLoop, 1000),
            projectGenerator: setInterval(generateNewProject, 10000),
            autoSave: setInterval(saveGame, 30000)
        };
        
        showNotification('Игра успешно загружена!', 'success');
    } catch (error) {
        console.error('Ошибка инициализации игры:', error);
        showNotification('Ошибка при запуске игры', 'error');
    }
}

function clearGameIntervals() {
    if (window.gameIntervals) {
        Object.values(window.gameIntervals).forEach(interval => clearInterval(interval));
    }
}

window.addEventListener('load', initGame);
window.addEventListener('beforeunload', clearGameIntervals);
window.addEventListener('error', (e) => {
    console.error('Глобальная ошибка:', e);
    showNotification('Произошла ошибка в игре', 'error');
});

function restartGame() {
    try {
        clearGameIntervals();
        gameState = {
            money: 5000,
            reputation: 0,
            projects: 0,
            employees: [],
            availableProjects: [],
            activeProjects: [],
            lastUpdate: Date.now()
        };
        localStorage.removeItem('softwareCompanyGame');
        initGame();
        showNotification('Игра перезапущена!', 'success');
    } catch (error) {
        console.error('Ошибка при перезапуске игры:', error);
        showNotification('Ошибка при перезапуске игры', 'error');
    }
}

function checkGameState() {
    try {
        if (!gameState || !window.gameIntervals) {
            console.warn('Обнаружено некорректное состояние игры, перезапуск...');
            restartGame();
            return false;
        }
        return true;
    } catch (error) {
        console.error('Ошибка при проверке состояния игры:', error);
        return false;
    }
}

setInterval(checkGameState, 5000);
