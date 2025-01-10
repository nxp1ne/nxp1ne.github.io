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
        name: "Веб-программирование",
        cost: 1000,
        duration: 30,
        difficulty: 1,
        icon: "fa-code"
    },
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

const DEV_MODE = true;

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
            "Елена", "Павел", "Ольга", "Андрей", "Наталья", "Владимир", "Дамир", "Артур", "Кирилл", "Александр", "Алексей", "Максим", 
            "Евгений", "Денис", "Илья", "Михаил", "Николай", "Олег", "Павел", "Роман", "Сергей", "Тимур", "Федор", "Юрий", "Ярослав", 
            "Александр", "Андрей", "Артем", "Богдан", "Владислав", "Глеб", "Даниил", "Егор", "Иван", "Кирилл", "Константин", 
            "Леонид", "Макар", "Матвей", "Мирон", "Никита", "Олег", "Павел", "Роман", "Сергей", "Тимур", "Федор", "Юрий", 
            "Ярослав"
        ];
        const surnames = [
            "Иванов", "Петров", "Сидоров", "Смирнов", "Кузнецов",
            "Попов", "Соколов", "Лебедев", "Козлов", "Новиков", "Владимиров", "Омутных", "Югас", "Беляев", "Иванов", "Петров", "Сидоров", "Смирнов", "Кузнецов",
            "Попов", "Соколов", "Лебедев", "Козлов", "Новиков", "Владимиров", "Омутных", "Югас", "Беляев"
        ];
        
        if (!Array.isArray(names) || !Array.isArray(surnames) || names.length === 0 || surnames.length === 0) {
            throw new Error('Ошибка в данных имен сотрудников');
        }

        const randomName = `${names[Math.floor(Math.random() * names.length)]} ${
            surnames[Math.floor(Math.random() * surnames.length)]}`;

        const specialties = ["Frontend", "Backend", "Mobile", "DevOps", "FullStack", "AI", "GameDev", "Service", "Porting", "UI/UX", "Design", "Marketing", "Sales", "HR", "Finance", "Legal", "Project Management", "QA", "Support", "Analytics", "Security", "System-Programming", "Embedded-developers"];
        
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

        gameState.employees.push(newEmployee);
        gameState.money -= 5000;

        updateDisplay();
        updateEmployeesList();
        showNotification('Новый сотрудник нанят!', 'success');
        saveGame();

    } catch (error) {
        console.error('Ошибка при найме сотрудника:', error);
        showNotification('Ошибка при найме сотрудника', 'error');
    }
}

function updateEmployeesList() {
    try {
        const employeesList = document.getElementById('employees-list');
        if (!employeesList) return;

        employeesList.innerHTML = '';
        
        if (!Array.isArray(gameState.employees)) {
            throw new Error('Список сотрудников не инициализирован');
        }

        gameState.employees.forEach(employee => {
            const employeeElement = document.createElement('div');
            employeeElement.className = 'employee';
            
            const stars = '★'.repeat(employee.skill) + '☆'.repeat(5 - employee.skill);
            
            employeeElement.innerHTML = `
                <span>
                    <i class="fas fa-user"></i>
                    ${employee.name}
                    <span class="specialty">${employee.specialty}</span>
                </span>
                <span class="skill-level">${stars}</span>
            `;
            
            employeesList.appendChild(employeeElement);
        });
    } catch (error) {
        console.error('Ошибка при обновлении списка сотрудников:', error);
    }
}

function generateNewProject() {
    try {
        if (!Array.isArray(projectTypes) || projectTypes.length === 0) {
            throw new Error('Типы проектов не определены');
        }

        const randomType = projectTypes[Math.floor(Math.random() * projectTypes.length)];
        
        if (!randomType) {
            throw new Error('Не удалось выбрать тип проекта');
        }

        const difficultyMultiplier = 1 + (Math.random() * 0.4 - 0.2);
        const costMultiplier = 1 + (Math.random() * 0.4 - 0.2);

        const newProject = {
            id: Date.now(),
            name: randomType.name,
            type: randomType.name,
            cost: Math.round(randomType.cost * costMultiplier),
            duration: Math.round(randomType.duration * difficultyMultiplier),
            difficulty: randomType.difficulty,
            icon: randomType.icon,
            timeLeft: Math.round(randomType.duration * difficultyMultiplier)
        };

        if (!Array.isArray(gameState.availableProjects)) {
            gameState.availableProjects = [];
        }

        if (gameState.availableProjects.length >= 3) {
            gameState.availableProjects.shift();
        }

        gameState.availableProjects.push(newProject);
        updateProjectsList();
        
    } catch (error) {
        console.error('Ошибка при генерации проекта:', error);
    }
}

function updateProjectsList() {
    try {
        const projectsList = document.getElementById('available-projects');
        if (!projectsList) return;

        projectsList.innerHTML = '';
        
        if (!Array.isArray(gameState.availableProjects)) {
            throw new Error('Список проектов не инициализирован');
        }

        if (gameState.availableProjects.length === 0) {
            projectsList.innerHTML = '<div class="no-projects">Нет доступных проектов</div>';
            return;
        }

        gameState.availableProjects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project';
            
            const stars = '★'.repeat(project.difficulty) + '☆'.repeat(5 - project.difficulty);
            
            projectElement.innerHTML = `
                <h3>
                    <i class="fas ${project.icon}"></i>
                    ${project.name}
                </h3>
                <p>Стоимость: $${project.cost.toLocaleString()}</p>
                <p>Длительность: ${project.duration} дней</p>
                <p>Сложность: <span class="skill-level">${stars}</span></p>
                <button onclick="startProject(${project.id})">
                    <i class="fas fa-play"></i>
                    Начать проект
                </button>
            `;
            
            projectsList.appendChild(projectElement);
        });
    } catch (error) {
        console.error('Ошибка при обновлении списка проектов:', error);
    }
}

function startProject(projectId) {
    try {
        const project = gameState.availableProjects.find(p => p.id === projectId);
        
        if (!project) {
            throw new Error('Проект не найден');
        }

        if (gameState.activeProjects.length >= gameState.employees.length) {
            showNotification('Недостаточно свободных сотрудников!', 'error');
            return;
        }

        gameState.availableProjects = gameState.availableProjects.filter(p => p.id !== projectId);
        gameState.activeProjects.push(project);
        
        updateProjectsList();
        updateActiveProjects();
        showNotification('Проект начат!', 'success');
        saveGame();
        
    } catch (error) {
        console.error('Ошибка при запуске проекта:', error);
        showNotification('Ошибка при запуске проекта', 'error');
    }
}

function updateActiveProjects() {
    try {
        const activeProjectsList = document.getElementById('active-projects');
        if (!activeProjectsList) return;

        activeProjectsList.innerHTML = '';
        
        if (!Array.isArray(gameState.activeProjects)) {
            throw new Error('Список активных проектов не инициализирован');
        }

        if (gameState.activeProjects.length === 0) {
            activeProjectsList.innerHTML = '<div class="no-projects">Нет активных проектов</div>';
            return;
        }

        gameState.activeProjects.forEach(project => {
            const projectElement = document.createElement('div');
            projectElement.className = 'project active-project';
            
            const progress = ((project.duration - project.timeLeft) / project.duration) * 100;
            const stars = '★'.repeat(project.difficulty) + '☆'.repeat(5 - project.difficulty);
            
            projectElement.innerHTML = `
                <h3>
                    <i class="fas ${project.icon}"></i>
                    ${project.name}
                </h3>
                <p>Стоимость: $${project.cost.toLocaleString()}</p>
                <p>Осталось: ${Math.ceil(project.timeLeft)} дней</p>
                <p>Сложность: <span class="skill-level">${stars}</span></p>
                <div class="progress-bar">
                    <div class="progress" style="width: ${progress}%"></div>
                </div>
            `;
            
            activeProjectsList.appendChild(projectElement);
        });
    } catch (error) {
        console.error('Ошибка при обновлении активных проектов:', error);
    }
}

function completeProject(project) {
    try {
        if (!project) {
            throw new Error('Проект не определен');
        }

        gameState.money += project.cost;
        gameState.reputation += project.difficulty;
        gameState.projects++;

        showNotification(`Проект завершен! +$${project.cost.toLocaleString()}`, 'success');
        updateDisplay();
        saveGame();
        
    } catch (error) {
        console.error('Ошибка при завершении проекта:', error);
    }
}

function showNotification(message, type = 'info') {
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

function developEmployee(employeeId) {
    const employee = gameState.employees.find(emp => emp.id === employeeId);
    if (employee && employee.skill < 5) {
        const cost = 1000 * employee.skill;
        if (gameState.money >= cost) {
            employee.skill++;
            gameState.money -= cost;
            updateDisplay();
        }
    }
}

function calculateProjectBonus(project) {
    return project.cost * (0.1 + (project.difficulty * 0.05));
}

function calculateMonthlyExpenses() {
    const employeeSalaries = gameState.employees.reduce((total, emp) => 
        total + (1000 * emp.skill), 0);
    const officeRent = 2000 + (gameState.employees.length * 200);
    return employeeSalaries + officeRent;
}

function addStatistics() {
    const stats = {
        monthlyIncome: [],
        projectSuccess: [],
        employeeEfficiency: []
    };
}

function updateHiringCost() {
    const baseCost = 5000;
    const multiplier = 1 + (gameState.employees.length * 0.1);
    return Math.round(baseCost * multiplier);
}

function calculateProjectRisks(project) {
    const teamSkill = calculateTeamEfficiency();
    const riskFactor = project.difficulty / teamSkill;
    const failChance = riskFactor * 0.1;
    return Math.min(failChance, 0.5);
}

const cheatCodes = {
    'youaregod': () => {
        gameState.money = 999999999;
        gameState.reputation = 999999;
        gameState.employees.forEach(emp => emp.skill = 5);
        gameState.activeProjects.forEach(project => {
            project.timeLeft = 1;
        });
        showNotification('Режим бога активирован!', 'success');
        updateDisplay();
        updateEmployeesList();
    },
    'moneymoney': () => {
        gameState.money += 100000;
        showNotification('Добавлено $100,000!', 'success');
    },
    'reputation': () => {
        gameState.reputation += 50;
        showNotification('Репутация повышена на 50!', 'success');
    },
    'skillup': () => {
        gameState.employees.forEach(emp => {
            emp.skill = Math.min(emp.skill + 1, 5);
        });
        showNotification('Навыки всех сотрудников повышены!', 'success');
        updateEmployeesList();
    },
    'godmode': () => {
        gameState.money = 999999999;
        gameState.reputation = 999999;
        gameState.employees.forEach(emp => emp.skill = 5);
        showNotification('Режим бога активирован!', 'success');
        updateDisplay();
        updateEmployeesList();
    },
    'fastproject': () => {
        if (gameState.activeProjects.length > 0) {
            gameState.activeProjects.forEach(project => {
                project.timeLeft = 1;
            });
            showNotification('Все активные проекты почти завершены!', 'success');
        }
    }
};

let cheatInput = '';
let cheatTimeout;

document.addEventListener('keypress', (e) => {
    if (!DEV_MODE) return;
    
    clearTimeout(cheatTimeout);
    
    cheatInput += e.key.toLowerCase();
    
    Object.keys(cheatCodes).forEach(code => {
        if (cheatInput.includes(code)) {
            cheatCodes[code]();
            cheatInput = '';
            return;
        }
    });
    
    cheatTimeout = setTimeout(() => {
        cheatInput = '';
    }, 2000);
});