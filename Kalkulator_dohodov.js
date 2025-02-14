// Глобальные переменные
let currentMonth = {
    incomeEntries: [],
    expenseEntries: [],
    incomeTotal: 0,
    expenseTotal: 0
};

let allTime = {
    income: 0,
    expenses: 0
};

let history = [];
let shops = [];

// Добавляем функцию для уведомления
function saveDataWithNotification() {
    saveData();
    showNotification('Данные успешно сохранены!');
}

// Функция показа уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px';
    notification.style.background = '#4CAF50';
    notification.style.color = 'white';
    notification.style.borderRadius = '5px';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
                notification.remove();
    }, 2000);
}

function saveData() {
    const data = {
        currentMonth: {
            ...currentMonth,
            incomeEntries: [...currentMonth.incomeEntries],
            expenseEntries: [...currentMonth.expenseEntries]
        },
        allTime: {
            ...allTime
        },
        history: history.map(entry => ({
            ...entry
        })),
        shops: [...shops]
    };

    try {
        localStorage.setItem('financeData', JSON.stringify(data));
        console.log('Данные сохранены:', data);
        return true;
    } catch (e) {
        console.error('Ошибка сохранения:', e);
        return false;
    }
}

// Модифицированная функция с подтверждением
function saveDataWithNotification() {
    if (saveData()) {
        showNotification('Данные успешно сохранены!');
    }
}

// Добавляем глобальный обработчик ошибок
window.addEventListener('error', function(e) {
    console.error('Глобальная ошибка:', e.error);
    showNotification('Произошла системная ошибка!');
});


// Инициализация при загрузке
window.onload = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    document.getElementById('incomeDate').value = today;
    document.getElementById('expenseDate').value = today;

    loadData();
    updateShopList(); // Инициализация списка магазинов
    updateDisplay();
};

// Загрузка данных
function loadData() {
    try {
        const rawData = localStorage.getItem('financeData');
        if (!rawData) return;

        const data = JSON.parse(rawData);

        // Восстанавливаем currentMonth
        currentMonth = {
            incomeEntries: data.currentMonth?.incomeEntries || [],
            expenseEntries: data.currentMonth?.expenseEntries || [],
            incomeTotal: Number(data.currentMonth?.incomeTotal) || 0,
            expenseTotal: Number(data.currentMonth?.expenseTotal) || 0
        };

        // Восстанавливаем allTime
        allTime = {
            income: Number(data.allTime?.income) || 0,
            expenses: Number(data.allTime?.expenses) || 0
        };

        // Восстанавливаем историю и магазины
        history = Array.isArray(data.history) ? data.history : [];
        shops = Array.isArray(data.shops) ? data.shops : [];

        console.log('Данные загружены:', data);
    } catch (e) {
        console.error('Ошибка загрузки данных:', e);
    }
}

function addIncome() {
    const dateInput = document.getElementById('incomeDate');
    const amountInput = document.getElementById('incomeAmount');

    const date = dateInput.value;
    const amount = parseFloat(amountInput.value);

    if (date && !isNaN(amount)) {
        currentMonth.incomeEntries.push({
            date,
            amount
        });
        currentMonth.incomeTotal += amount;
        allTime.income += amount;

        // Очистка полей
        amountInput.value = '';

        updateDisplay();
        saveData();
    } else {
        alert("Пожалуйста, заполните все поля корректно!");
    }
}

// Инициализация при загрузке
window.onload = () => {
    // Установка даты
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('incomeDate').value = today;
    document.getElementById('expenseDate').value = today;

    // Загрузка данных
    loadData();
    updateShopList();
    updateDisplay();
};

function addExpense() {
    const date = document.getElementById('expenseDate').value;
    const shop = document.getElementById('expenseShop').value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount').value);

    if (date && shop && amount) {
        // Добавляем магазин в список если его нет
        if (!shops.includes(shop)) {
            shops.push(shop);
            updateShopList();
        }

        currentMonth.expenseEntries.push({
            date,
            shop,
            amount
        });
        currentMonth.expenseTotal += amount;
        allTime.expenses += amount;

        // Очистка полей
        document.getElementById('expenseShop').value = '';
        document.getElementById('expenseAmount').value = '';

        updateDisplay();
        saveData();
    }
}



function updateMonth() {
    const monthIndex = document.getElementById('monthSelect').value;
    const monthName = document.getElementById('monthSelect').options[monthIndex].text;

    // Сохранение истории
    history.push({
        month: monthName,
        income: currentMonth.incomeTotal,
        expenses: currentMonth.expenseTotal,
        timestamp: new Date().getTime()
    });

    // Сброс данных текущего месяца
    currentMonth = {
        incomeEntries: [],
        expenseEntries: [],
        incomeTotal: 0,
        expenseTotal: 0
    };

    // Очистка полей ввода
    document.getElementById('incomeAmount').value = ''; // Очищаем сумму дохода
    document.getElementById('expenseShop').value = '';
    document.getElementById('expenseAmount').value = '';

    // Очистка списка магазинов
    shops = [];
    updateShopList();

    const now = new Date();
    document.getElementById('monthSelect').value = now.getMonth();

    updateDisplay();
    saveData();
}

function resetGeneralRemainder() {
    allTime.income = 0;
    allTime.expenses = 0;
    history = [];
    shops = []; // Очищаем список магазинов
    updateShopList();
    updateDisplay();
    saveData();
}

// Новый метод для обновления списка магазинов
function updateShopList() {
    const datalist = document.getElementById('shopList');
    datalist.innerHTML = shops
        .map(shop => `<option value="${shop}">${shop}</option>`)
        .join('');
}

function resetGeneralRemainder() {
    allTime.income = 0;
    allTime.expenses = 0;
    shops = []; // Очищаем список магазинов
    updateShopList();
    history = [];
    updateDisplay();
    saveData();
}

function toggleHistory(type) {
    const historyDiv = document.getElementById(`${type}History`);
    const entries = type === 'income' ?
        currentMonth.incomeEntries :
        currentMonth.expenseEntries;

    historyDiv.innerHTML = entries.map(entry =>
        type === 'income' ?
        `Дата: ${entry.date}, Сумма: ${entry.amount} руб` :
        `Дата: ${entry.date}, Магазин: ${entry.shop}, Сумма: ${entry.amount} руб`
    ).join('<br>');

    historyDiv.style.display = historyDiv.style.display === 'none' ? 'block' : 'none';
}

function updateDisplay() {
    document.getElementById('incomeTotal').value = currentMonth.incomeTotal.toFixed(2);
    document.getElementById('expenseTotal').value = currentMonth.expenseTotal.toFixed(2);

    const currentRemainder = currentMonth.incomeTotal - currentMonth.expenseTotal;
    const generalRemainder = allTime.income - allTime.expenses;

    document.getElementById('currentRemainder').value = currentRemainder.toFixed(2);
    document.getElementById('generalRemainder').value = generalRemainder.toFixed(2);
}
