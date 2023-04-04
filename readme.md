# NODE API for mssql and DHTMLX widgets playground

## Docker for mssql
-   download and install docker desktop app
-   sudo docker pull mcr.microsoft.com/mssql/server:2019-latest
-   docker run -d --name example_sql_server -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=password' -p 1433:1433 mcr.microsoft.com/mssql/server:2019-latest
-   docker ps -a
-   sudo npm install -g sql-cli
-   mssql -u sa -p password

## Packages
-   npm i express
-   npm i --save-dev nodemon
-   npm i mssql
-   npm i cors

## Documentation
-   [github.com/tediousjs/node-mssql](https://github.com/tediousjs/node-mssql)

## In case of problems
-   npm cache clean --force