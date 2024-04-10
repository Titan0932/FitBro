## Important Notes

- If there's ever weird behavior like error alerts or content not loading, try refreshing the page. When the auth token expires, the API doesn't provide data. I didn't implement the redirect to signin when you change routes. It only happens when you refresh the page.

- Building for the first time may be slow. Please be patient!

- In Development Mode:
  - Loading the page or route for the first time might be slow. But after the initial render, things will be much faster. This is because of Next.js rendering in local mode and also server-side rendering.

- This is a fairly big project so lotta instructions coming down! Thank you for your patience! :)

## Compilation & Run Instructions

### Backend:
1. **Set up DB and the environment**
    - open PgAdming and create the database.

    - open the query tool and:
        - copy + paste sql code from ddl.sql file.
        - copy + paste sql code from dml.sql file to populate db.
    - create a .env file in './backend' and populate the following data:

        -   JWT_SECRET = [YOUR_SECRET_JWT_KEY]
        -   DB_USERNAME = [DB_USER_NAME]
        -   DB_PASSWORD = [DB_PASSWORD]
        -   DB_HOST = localhost     -- let it be localhost
        -   DB_NAME = FITBRO        -- you can name it anything honestly
        -   DB_PORT = [DATABASE_PORT_NUMBER]          

        -   APP_URL = http://localhost:3005         -- let it be this. Make sure this port is available tho pls!
        -   APP_PORT = 3005                         -- let it be this. Make sure this port is available tho pls!
        -   CORS = http://localhost:3000            -- let it be this. Make sure this port is available tho pls!

2. **Run the Backend first:**
   - Open terminal and navigate to `/backend`.
   - Run `npm install` to install dependencies.
   - Run `node server.js`.

### Frontend:
3. **Run Frontend:**
   - Navigate to `/frontend` in the terminal.
   - Run `npm install` to install dependencies.
   - Run `npm run build`. This will take some time but only needs to be run ONCE.
   - Run `npm start`. Once you have built, you can simply run this. No need to rebuild over and over.

   #### If Build Fails:
   - Run `npm run dev`. This will be much slower but will run the application in dev mode!

### Login Info:
- To test out different functionalities, I have loaded user information already.
  - For member login:
    - Email: johndoe@test.com
    - Password: password
  - For trainer login:
    - Email: jasonThompson@test.com
    - Password: password2
  - For admin login:
    - Email: margieThatcher@test.com
    - Password: password3

  - To make things easier, you may consider signing up as both member and admin using Jason Thompson's account and just switch between roles to test combinations of different things.

## File Info

- **DDL and DML files + ORM schema:**
  - Located in `./backend/db`.

- **Test File:**
  - `./backend/test.js`. This contains the SQL code to completely drop and remake the PostgreSQL database schema. Run in PGadmin.

- **Backend APIs:**
  - Located in `./backend/routes`. Routes are divided according to files. Check `server.js` for how they are defined in the app.

- **ER Diagram:**
  - `./ER.vpd.png`.
