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
-   express
-   nodemon
-   mssql
-   cors
-   dotenv
-   jsonwebtoken

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

Requests with header: Authorization = Bearer TOKEN
-   GET /users - get list of all users
-   POST /users/id - get info about one user
-   POST /users (body: username, password, name, surname, lastLogged) - insert user to database
-   PATCH /users/id (body: username, password, name, surname, lastLogged) - update user in database
-   DELETE /users/id - delete user from database
-   PUT /users/:id/picture - update user picture

## Run
-   npm install (install dependencies)
-   npm run dev (run in development mode with nodemon)
-   npm start (production)

## DB documentation
Database: 
-   app

Tables:
-   app.users (username, name, surname, last_logged, account_created, password, id)
-   app.levels (id, level)
-   app.perms (id, user_id |FK|, level_id |FK|)

Views:
-   app.user_data (id, name, surname, last_logged)

Stored Procedures:
-   dbo.insertUser (INPUT: executor, username, password, name, surname, lastLogged, permLevel OUTPUT: response)
-   dbo.alterUser (INPUT: id, executor, username, password, name, surname, lastLogged, permLevel OUTPUT: response)
-   dbo.deleteUser (INPUT: id, executor OUTPUT: response)
-   dbo.loginUser (INPUT: username, password OUTPUT: response, uuid)

User Defined Functions:
-   dbo.checkIfLastAdmin (INPUT: id) - checks if user with given id is last with admin privilege
-   dbo.checkPerms (INPUT: id) - returns privilege name for user with given id
-   dbo.isUsernameAvailable (INPUT: id, username) - checks if username is available
-   dbo.levelId (INPUT: level) - returns id of privilege with given name
-   dbo.userId (INPUT: username) - returns id of user with given username

Triggers:
-   preventLastUserDeletion - prevents deletion of all users from app.users table

Synonyms:
-   dbo.username (for dbo.isUsernameAvailable)