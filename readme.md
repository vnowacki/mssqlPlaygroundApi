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

### Requests with header: Authorization = Bearer TOKEN
-   GET /users - get list of all users
-   POST /users/id - get info about one user
-   POST /users (body: executor, username, password, name, surname, lastLogged) - insert user to database
-   PATCH /users/id (body: executor, username, password, name, surname, lastLogged) - update user in database
-   DELETE /users/id - delete user from database
-   PUT /users/:id/picture (accepts only formData with BLOB) - update user picture
-   DELETE /users/:id/picture - delete user picture

-   GET /products - get list of all products
-   GET /products/:id - get info about product with given id
-   POST /products (body: executor, name, description, quantity, price, weight, sellStartDate, category) - insert product to database
-   PATCH /products/:id (body: executor, name, description, quantity, price, weight, sellStartDate, sellEndDate, category) - update one product data
-   DELETE /products/:id - delete one product
-   PUT /products/:id/picture (formData: name, picture in BLOB) - add product photo
-   DELETE /products/:id/picture/:pic - delete one product photo
-   DELETE /products/:id/picture - delete all product photos
-   GET /products/categories - get list of all categories

-   GET /orders - get list of all orders with user and product info
-   GET /orders/:id - get one order info
-   PUT /orders (body: productID, userID, quantity) - add order
-   DELETE /orders/:id - delete order
-   PATCH /orders/:id/status - update only order status

## Run
-   npm install (install dependencies)
-   npm run dev (run in development mode with nodemon)
-   npm start (production)

## DB documentation
### Database: 
-   app

### Tables:
-   app.users (id, username, name, surname, last_logged, account_created, password, picture) - stores app users with profile picture (BLOB)
-   app.levels (id, level) - available levels of permissions
-   app.perms (id, user_id |FK|, level_id |FK|) - assigned permissions

-   app.products (productID, name, description, quantity, price, weight, sellStartDate, sellEndDate, lastModified, category |FK|) - stores products
-   app.pictures (id, productID, filename, picture) - pictures (BLOBs) assigned to products
-   app.categories (id, name, description) - product categories
-   app.orders (id, productID |FK|, userID |FK|, quantity, orderDate, status |enum of 'pending', 'paid', 'ready', 'sent', 'delivered'|) - stores ordering data

### Views:
-   app.user_data (id, name, surname, last_logged) - info for app toolbar

### Stored Procedures:
-   dbo.insertUser (INPUT: executor, username, password, name, surname, lastLogged, permLevel OUTPUT: status) - inserts user when there is no other with the same username, sets permissions level
-   dbo.alterUser (INPUT: id, executor, username, password, name, surname, lastLogged, permLevel OUTPUT: status) - modifies user data and permissions level, checks if the user is the last with admin privileges
-   dbo.deleteUser (INPUT: id, executor OUTPUT: status) - deletes user with its permissions entry (by FK cascade)
-   dbo.loginUser (INPUT: username, password OUTPUT: status, uuid) - checks if user can log in with provided credentials, updates data of last successfull login
-   dbo.insertProduct (INPUT: executor, name, description, quantity, price, weight, sellStartDate, category OUTPUT: status, productID) - inserts product when there is no other with the same name in the same category, checks permissions before inserting
-   dbo.alterProduct (INPUT: id, executor, name, description, quantity, price, weight, sellEndDate, category OUTPUT: status) - alters all product data except sellStartDate, checks permissions, updates last modification date
-   dbo.deleteProduct (INPUT: id, executor OUTPUT: status) - deletes product entirely, checks permissions, refuses deletion of products found in app.orders table

### User Defined Functions:
-   dbo.checkIfLastAdmin (INPUT: id) - checks if user with given id is last with admin privilege
-   dbo.checkPerms (INPUT: id) - returns privilege name for user with given id
-   dbo.isUsernameAvailable (INPUT: id, username) - checks if username is available
-   dbo.levelId (INPUT: level) - returns id of privilege with given name
-   dbo.userId (INPUT: username) - returns id of user with given username
-   dbo.findCategoryId (INPUT: category) - returns id of given category name
-   dbo.findProductByParams (INPUT: category, name) - checks if there is a product with given name in given category

### Triggers:
-   preventLastUserDeletion - prevents deletion of all users from app.users table

### Synonyms:
-   dbo.username (for dbo.isUsernameAvailable)