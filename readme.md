## IMPORTANT NOTES

- If there's ever weird behavior: error alerts/ content not loading, refresh the page. WHen the auth token expires, the api doesnt give data. I didnt implement the redirect to signin when you change routes. Only when you refresh, it is checked.

- Building for the first time is kinda slow. Pls be patient!! :)

- IN DEV MODE: 
    If loading the page/route for the first time it might be a little slow to load. But after initial render, things will be much faster. This is because of Next.js rendering in local mode and also serverside rendering.


## Compilation & Run instructions

    - Run the Backend first:
        - open terminal and navigate to /backend.
        - run `npm install`  -- install dependencies
        - run ` node server.js `

    - Run frontend:
        - Navigate to /frontend in the terminal.
        - run `npm install`  -- install dependencies
        - run ` npm run build`   -- This will take some time but only needs to be run ONCE
        - run ` npm start`          -- Once you have build, you can simply run this. No need to rebuild over and over.

        # if build fails:
            - run `npm run dev`    -- This will be much slower but will run the application in dev mode!


## File info

    - DDL and DML files + ORM schema:
        - in ./backend/db
    
    - Test file:
        - ./backend/test.js  -- THis has the SQL code to completely drop and remake the postgres db schema. Run in PGadmin

    - The backend APIS:
        - ./backend/routes -- Routes are divided according to files. Check server.js for how they are defined in the app.

    - ER diagram:
        - ./ER.vpd.png