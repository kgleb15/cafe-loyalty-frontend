document.addEventListener('DOMContentLoaded', async function() {
  // Проверяем авторизацию
  if (!checkAuth()) {
    return;
  }
  
  try {
    // Получаем данные пользователя
    const userData = await fetchAPI('/balance');
    
    // Отображаем имя пользователя
    document.getElementById('userName').textContent = userData.name;
    
    // Отображаем баланс
    document.getElementById('userBalance').textContent = userData.balance;
    
    // Генерируем QR-код
    generateQRCode(userData);
    
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    // Если ошибка авторизации, перенаправляем на страницу входа
    if (error.message.includes('авторизации') || error.message.includes('token')) {
      logout();
    }
  }
});

// Функция для генерации QR-кода
function generateQRCode(userData) {
  const qrCodeElement = document.getElementById('qrCode');
  
  // Создаем данные для QR-кода (ID пользователя и токен)
  const user = JSON.parse(localStorage.getItem('user'));
  const qrData = JSON.stringify({
    userId: user.id,
    name: userData.name,
    token: localStorage.getItem('token').substring(0, 10) + '...' // Для безопасности берем только часть токена
  });
  
  // Генерируем QR-код
  QRCode.toCanvas(qrCodeElement, qrData, {
    width: 250,
    margin: 1,
    color: {
      dark: '#4a154b',
      light: '#ffffff'
    }
  }, function(error) {
    if (error) {
      console.error('Ошибка при генерации QR-кода:', error);
    }
  });
}