### End2End testing

We used Cypress to perform the end2end tests.
To run the tests:
1. Create a local MariaDB (using docker: `docker run --name Maria10.3.27 -d -p 3306:3306 -e MYSQL_ROOT_HOST="172.17.0.1" -e MYSQL_USER="root" -e MYSQL_ROOT_PASSWORD="root" mariadb:10.3.27`)
2. Change the values in `databaseCred.ini` according for the root access
3. Change values in `src/controller/database/DatabaseConnection.js` (yeah it's duplicate)
4. Run `npm i`
5. Run `npm run start`
6. Open a new terminal and run `npx cypress open`
