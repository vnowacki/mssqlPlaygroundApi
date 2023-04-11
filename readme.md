# NODE API for mssql and DHTMLX widgets playground

## Docker for mssql
-   download and install docker desktop app
-   sudo docker pull mcr.microsoft.com/mssql/server:2019-latest
-   docker run -d --name example_sql_server -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=password' -p 1433:1433 mcr.microsoft.com/mssql/server:2019-latest
-   docker ps -a
-   sudo npm install -g sql-cli
-   mssql -u sa -p password

## Restore database in docker
-   sudo docker exec -it example_sql_server mkdir /var/opt/mssql/backup
-   sudo docker cp database.bak example_sql_server:/var/opt/mssql/backup
-   enable Preview Features in Azure Data Studio (Settings -> Workbench)
-   click Manage on connection and then Restore option
-   choose file from /var/opt/mssql/backup

## Packages
-   npm i express
-   npm i --save-dev nodemon
-   npm i mssql
-   npm i cors
-   npm i dotenv
-   npm i jsonwebtoken

## In case of problems
-   npm cache clean --force

## MSSql Documentation
-   [github.com/tediousjs/node-mssql](https://github.com/tediousjs/node-mssql)

## Generating example tokens for env
-   require('crypto').randomBytes(64).toString('hex')

## API documentation
-   POST /auth (body: username, password) - authenticate user
-   POST /auth/token (body: token) - refresh token
-   DELETE /auth - logout, delete refresh token

-   GET /users - get list of all users
-   POST /users/id - get info about one user
-   POST /users (body: username, password, name, surname, lastLogged) - insert user to database
-   PATCH /users/id (body: username, password, name, surname, lastLogged) - update user in database
-   DELETE /users/id - delete user from database