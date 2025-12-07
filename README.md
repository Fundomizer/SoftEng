# Project setup

## Frontend

This is a guide on how to setup this project

Make sure you have the following packages installed (versions in the list might be outdate):

- @eslint/js@9.38.0
- @types/react-dom@19.2.2
- @types/react@19.2.2
- @vitejs/plugin-react@5.0.4
- eslint-plugin-react-hooks@5.2.0
- eslint-plugin-react-refresh@0.4.24
- eslint@9.38.0
- globals@16.4.0
- react-dom@19.2.0
- react-router-dom@7.9.5
- react@19.2.0
- vite@7.1.11

To run the project run the following:

```
npm run dev
```

Then go to the link provided. You now have access to the front end of the project

## Backend

This project uses a MySQL database so install "wamp" server or software that can host a MySQL database
Import the "schema.sql" file in `./database` folder (idk why there's anoter sql file)

Next up create a `.env` file and insert the following:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=""
DB_NAME=get_faxed_printing_service
PORT=3001
```

Afterwards run the server use:

```
npm run server
```
