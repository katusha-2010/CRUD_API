# CRUD_API

## Setup and Running

Clone this repo:

```console
$ git clone https://github.com/katusha-2010/CRUD_API.git
```

Go to downloaded folder:

```console
$ cd CRUD_API
```

Install dependencies:

```console
$ npm install
```

Start server:

-   running in development mode:

```console
$ npm run start:dev
```

-   running in production mode:

```console
$ npm run start:prod
```

-   running with horizontal scaling for application:

```console
$ npm run start:multi
```

To run tests for the application:

```console
$ npm run test
```

## Usage

-   Create user
-   Read user
-   Update user
-   Delete user

## API

Correct endpoint: api/users;

### Requests:

-   To get all users - GET api/users;
-   To get the user by id - GET api/users/{userId}
-   To create record about new user and store it in database - POST api/users
-   To update the existing user - PUT api/users/{userId}
-   To delete existing user from database - DELETE api/users/{userId}

## Users fields should be:

-   username — user's name (string, required),
-   age — user's age (number, required),
-   hobbies — user's hobbies (array of strings or empty array, required)
