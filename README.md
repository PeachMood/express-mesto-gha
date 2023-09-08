# Mesto API 📸
Сервер для работы с фотографиями. Проект выполнен в рамках дипломной работы по курсу "Веб-разработчик" от Яндекс Практикум.

## API
<table>
  <tr>
    <th>Метод</th>
    <th>Путь</th>
    <th>Описание</th>
  </tr>
  <tr>
    <td>GET</td>
    <td>/users</td>
    <td>возвращает всех пользователей из базы</td>
  </tr
  <tr>
    <td>GET</td>
    <td>/users/:userId</td>
    <td>возвращает пользователя по _id</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/users</td>
    <td>создаёт пользователя с переданными в теле запроса name , about и avatar</td>
  </tr>
  <tr>
    <td>PATCH</td>
    <td>/users/me</td>
    <td>обновляет профиль пользователя</td>
  </tr>
  <tr>
    <td>PATCH</td>
    <td>/users/me/avatar</td>
    <td>обновляет аватар пользователя</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/cards</td>
    <td>возвращает все карточки из базы</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/cards</td>
    <td>создаёт карточку с переданными в теле запроса name и link , устанавливает поле owner для
карточки</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/cards/:cardId</td>
    <td>удаляет карточку по _id</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/cards/:cardId/likes</td>
    <td>ставит лайк карточке</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/cards/:cardId/likes</td>
    <td>убирает лайк с карточки</td>
  </tr>
</table>

## Технологии
![Технологии](https://skillicons.dev/icons?i=nodejs,express,mongodb,postman)

## Начало работы
#### Требования
Для работы приложения необходимо установить:
* [Node.js](https://nodejs.org/ru/blog/release/v18.12.0) 18.12+
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (обычно идет с Node.js)
* [MongoDB](https://www.mongodb.com/docs/manual/installation/) 4.4+

#### Установка
1. Установите npm пакеты
   ```
   npm install
   ```
2. Создайте файл .env в корневой директории проекта и пропишите в нем настройки приложения и базы данных, например:
   ```
   NODE_ENV=production
   JWT_SECRET=jwt-secret
   MONGO_HOST=localhost
   MONGO_PORT=27017
   MONGO_DB=mestodb
   ```
#### Запуск
1. Запустите MongoDB
   
   Windows: 
   ```
   mongod
   ```
   macOS:
   ```
   mongod
   или
   brew services start mongodb-community@version
   ``` 
   Linux:
   ```
   sudo systemctl status mongod 
   или
   sudo service mongod start
   ```
3. Запустите приложение в одном из режимов
   
   Development:
   ```
   npm run dev
   ```
   Production:
   ```
   npm run start
   ```
