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

This project uses a MySQL database, run via **WAMP**. Install it from [wampserver.com](https://www.wampserver.com/en/) and start it (only its MySQL + phpMyAdmin are needed, not Apache).

Import `database/get_faxed.sql` via phpMyAdmin ([http://localhost/phpmyadmin/](http://localhost/phpmyadmin/) → Import → Choose File → Go) - this creates the database and seeds it with test accounts.

Next, copy `.env.example` to `.env`. Leave `DB_PASSWORD` blank unless you've changed WAMP's default (passwordless) MySQL root user:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=""
DB_NAME=get_faxed_printing_service
PORT=3001
```

Port 3001 will be what port the backend will be serving and where the frontend will be looking for resources

Afterwards run the server use:

```
npm run server
```

New here? See [QUICKSTART.md](./QUICKSTART.md) for the full step-by-step setup guide, or the [User Manual](./Get%20Faxed%20Printing%20Service%20User%20Manual.md) for how to use the app once it's running.
