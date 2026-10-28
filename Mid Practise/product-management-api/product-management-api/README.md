# Lab Task 1 - Tech Shop Management API (Version 2)

This second project version uses technology accessories and a new dummy employee dataset throughout the examples, collection, tests, and fresh Postman screenshots.

A complete NestJS application implementing the product and employee CRUD operations in the assignment. Every operation uses a TypeORM repository and a real SQL database. The default is SQLite, saved to `data/shop.sqlite` after each database change.

## Student details - complete before submitting

| Field | Your details |
| --- | --- |
| SL | **[YOUR SL]** |
| Name | **[YOUR FULL NAME]** |
| Student ID | **[YOUR STUDENT ID]** |
| Section | **[YOUR SECTION]** |
| Course | **[YOUR COURSE NAME / CODE]** |

These fields are intentionally blank because the assignment does not supply your personal details.

## Quick start in VS Code

Install **Node.js 24**, which includes npm. Extract the ZIP, then open this `product-management-api` folder in VS Code, or open the provided `.code-workspace` file. Open **Terminal > New Terminal** and run:

```bash
npm ci
npm run start:dev
```

`npm ci` installs the exact dependencies in `package-lock.json`. If you intentionally edit dependencies later, use `npm install` to update the lockfile.

The first start copies `.env.example` to `.env` if it is missing. It preserves an existing `.env`, creates `data/`, connects the database, and creates the `products` and `employees` tables automatically. No global Nest CLI or database server is needed with the default configuration.

- API status: <http://localhost:3000/>
- Interactive Swagger API documentation: <http://localhost:3000/docs>
- OpenAPI JSON: <http://localhost:3000/docs-json>
- Products: <http://localhost:3000/products>
- Employees: <http://localhost:3000/employees>

Keep the terminal running. **Ctrl+C** stops the server. `start:dev` rebuilds and restarts when a source file changes. The application starts with empty tables; use POST to add records. Records remain after restarting.

## Database choice and setup

The PDF says to use the database and ORM taught in class, but does not identify them. This implementation uses **TypeORM**. **SQLite via the sql.js driver** is the default so the project runs without a separate database installation or native compiler. sql.js executes SQLite through WebAssembly; `location` and `autoSave: true` persist actual database tables to `data/shop.sqlite`. HTTP tests verify that the file is a SQLite database and saved records survive closing and reopening the application.

If your instructor requires PostgreSQL or MySQL, the drivers and configuration for both are included. Set the matching variables in your local `.env` and create the database as described below. The supplied execution tests were run using SQLite; PostgreSQL and MySQL require your own running server and credentials.

### Default SQLite

These sample values are already in `.env.example`:

```dotenv
PORT=3000
HOST=127.0.0.1
DB_TYPE=sqlite
DB_DATABASE=./data/shop.sqlite
DB_SYNCHRONIZE=true
DB_LOGGING=false
```

No username or password is required. The SQLite file is generated at startup and is ignored by Git. To reset your local lab data, stop the app, delete `data/shop.sqlite`, then restart. Do this only when you want to remove your own test records.

### PostgreSQL, if required in class

Install and start PostgreSQL, then use pgAdmin or psql to run:

```sql
CREATE DATABASE shop_lab;
```

Set these values in `.env`, using your actual local credentials:

```dotenv
DB_TYPE=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_local_password
DB_NAME=shop_lab
DB_SYNCHRONIZE=true
```

Restart the API. TypeORM creates both tables inside `shop_lab`.

### MySQL, if required in class

Install and start MySQL, then run:

```sql
CREATE DATABASE shop_lab CHARACTER SET utf8mb4;
```

Set these values in `.env`, using your actual local credentials:

```dotenv
DB_TYPE=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_local_password
DB_NAME=shop_lab
DB_SYNCHRONIZE=true
```

Restart the API. Set **all** matching values, including the port, when switching database type. `DB_SYNCHRONIZE=true` is used here for automatic classroom setup; a deployed application should manage schema changes with migrations.

## Required endpoints

There is no `/api` prefix. Send JSON with `Content-Type: application/json` for POST and PATCH.

| Method | URL | Success | Behavior |
| --- | --- | --- | --- |
| POST | `/products` | 201 | Create and save a product |
| GET | `/products` | 200 | Return all saved products |
| GET | `/products/:id` | 200 | Return one product |
| PATCH | `/products/:id` | 200 | Update one or more product fields |
| DELETE | `/products/:id` | 200 | Delete a product and return its ID |
| POST | `/employees` | 201 | Create and save an employee |
| GET | `/employees` | 200 | Return all saved employees |
| GET | `/employees/:id` | 200 | Return one employee |
| PATCH | `/employees/:id` | 200 | Update one or more employee fields |
| DELETE | `/employees/:id` | 200 | Delete an employee and return its ID |

IDs are positive integers generated by the database. Do not supply `id` in a request body.

### Create product

`POST http://localhost:3000/products`

```json
{
  "name": "Wireless Keyboard",
  "category": "Accessories",
  "price": 1850,
  "quantity": 24
}
```

Example successful response:

```json
{
  "id": 1,
  "name": "Wireless Keyboard",
  "category": "Accessories",
  "price": 1850,
  "quantity": 24
}
```

Create a second product, such as `{"name":"USB-C Hub","category":"Accessories","price":2450,"quantity":18}`, before capturing the GET-all screenshot. Always use IDs actually returned by your database.

### Update product

`PATCH http://localhost:3000/products/1`

```json
{
  "price": 1750,
  "quantity": 20
}
```

Only supplied fields change. GET the same ID afterward to confirm the change.

### Create employee

`POST http://localhost:3000/employees`

```json
{
  "name": "Nadia Ahmed",
  "email": "nadia@example.com",
  "phone": "+8801611122233",
  "password": "Sample5678!",
  "age": 27,
  "yearsOfWorking": 4
}
```

The required dummy password is accepted on creation and update. It is stored as a salted scrypt hash and is omitted from all responses. This project does not add a login system. Use dummy employee data for the lab.

### Update employee

`PATCH http://localhost:3000/employees/1`

```json
{
  "phone": "+8801911122255",
  "yearsOfWorking": 5
}
```

### Validation and errors

- `400 Bad Request`: missing required values, invalid email, invalid ID, unknown fields, null values, empty PATCH, negative price or stock, fractional integer fields, or experience greater than age.
- `404 Not Found`: no row with the requested ID for GET, PATCH, or DELETE.
- `409 Conflict`: an employee email is already registered. Emails are trimmed and lowercased.

Names and categories are trimmed and must not be empty. Product price allows up to two decimal places. Price and quantity may both be zero. Phone numbers remain strings to preserve a leading `+` or `0`. PATCH validates the resulting employee age and experience together.

## Postman and VS Code requests

Import these files in Postman:

1. `postman/Shop-Lab.postman_collection.json`
2. `postman/Local.postman_environment.json`

Select **Shop Lab - Local** as the environment. Start the API first. Run the **Products - screenshot sequence** folder in order, then the employee folder. The collection creates two records, saves the actual IDs into collection variables, verifies responses, updates one record, deletes it, and confirms its absence. Running the sequence again creates new IDs; it does not assume the IDs start at 1.

The collection leaves the second product and employee for the final GET-all evidence. Dummy employees use a new email each run. The sequence therefore works against existing lab data too.

The file `requests.http` also contains examples for VS Code's optional **REST Client** extension. Swagger at `/docs` works without any extension or Postman installation.

## Screenshots

See `screenshots/README.md` for the supplied evidence and reproduction steps. The PDF requires these seven product screenshot filenames:

| File | Required evidence |
| --- | --- |
| `01-create.png` | POST body and saved product response |
| `02-get-all.png` | GET all showing at least two products |
| `03-get-by-id.png` | GET one actual product ID |
| `04-update.png` | PATCH body and successful response |
| `05-confirm-update.png` | GET by ID showing changed values |
| `06-delete.png` | DELETE request and successful response |
| `07-confirm-delete.png` | GET all showing the deleted product is absent |

Every screenshot should show the method, full request URL, response status, and response body. POST and PATCH also show the JSON request body. Refresh screenshots on your own computer if your instructor requires your personal run. Never include database passwords.

## Build, test, and debug

```bash
npm run build
npm test
npm run typecheck
npm run format:check
```

`npm test` builds the application and runs real HTTP tests on a temporary SQLite file. It exercises all ten endpoints, checks validation and error statuses, and reopens the application to verify saved data remains. The tests never modify `data/shop.sqlite`.

For a compiled run:

```bash
npm run build
npm run start:prod
```

For debugging, use VS Code's **Run and Debug > Debug NestJS (watch)** configuration. The project includes VS Code tasks for installation, running, building, and testing.

## Project structure

- `src/main.ts`: start Nest and listen on the configured host and port.
- `src/app.module.ts`: register configuration, database connection, and feature modules.
- `src/config/`: environment validation and database configuration.
- `src/products/`: product module, controller, service, DTOs, and entity.
- `src/employees/`: employee module, controller, service, DTOs, and entity.
- `src/common/`: positive ID parsing and empty-update checks.
- `src/configure-app.ts`: shared input validation and Swagger setup.
- `test/api.test.cjs`: HTTP integration and persistence tests.
- `postman/`: importable collection and local environment.
- `screenshots/`: request and response evidence.
- `data/`: runtime SQLite database; generated database files are excluded from Git and the delivered ZIP.

Controllers handle HTTP routing. Services perform all product and employee database operations through injected repositories. Entities define the database tables. DTOs validate incoming JSON.

## GitHub submission

The PDF uses both `product-management` and `product-management-api`. This package follows the **final submission instruction** and table heading:

```text
Your existing course repository / Mid / Lab task 1 / product-management-api
```

If your instructor confirms the shorter folder name, rename only the project folder and adjust the outer workspace file accordingly.

1. Fill in your student details above.
2. Confirm the database/ORM matches your class requirement.
3. Run the project and tests, and review the screenshots.
4. Copy this project's `Mid` folder into your existing course repository as needed.
5. From that repository root, commit and push:

```bash
git add "Mid/Lab task 1/product-management-api"
git commit -m "Complete Lab Task 1 product and employee CRUD APIs"
git push
```

6. Submit the GitHub link directly to the project folder and confirm the instructor can access it.

Do not commit `node_modules/`, `dist/`, your real `.env`, or generated database files. These are ignored. The project includes `package-lock.json` and `.env.example` as requested. No GitHub repository has been created or pushed on your behalf.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `node` or `npm` is not recognized | Install Node.js 24, then restart VS Code. |
| npm cannot find `package.json` | Open a terminal inside `product-management-api`. |
| Port 3000 is already in use | Stop the other process or change `PORT` in `.env` and the Postman `baseUrl`. |
| A database connection fails after changing settings | Check `DB_TYPE`, server status, database name, port, and credentials. SQLite needs no server. |
| POST or PATCH returns 400 | Use raw JSON, send all required POST fields, keep numbers unquoted, and remove extra fields. |
| GET by ID returns 404 | Use an actual ID returned by POST. A deleted ID stays missing. |
| Employee email returns 409 | Use a different email or run the provided collection, which generates unique demo emails. |

## Framework references

- [NestJS 11 first steps](https://docs.nestjs.com/v11/first-steps)
- [NestJS TypeORM integration](https://docs.nestjs.com/data/typeorm)
- [TypeORM 0.3 SQLite and sql.js persistence](https://v0.typeorm.io/docs/drivers/sqlite/)
