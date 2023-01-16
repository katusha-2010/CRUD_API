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

## API

Correct endpoint: api/users;

## Usage:

-   To get all users - GET api/users;
-   To get the user by id - GET api/users/{userId}
-   To create record of new user and store it in database.
    You need to send correct object in body(requirements are below) - POST api/users
-   To update the existing user.
    You need to send correct object in body(requirements are below) - PUT api/users/{userId}
-   To delete existing user from database - DELETE api/users/{userId}

## Users fields should be:

-   username — user's name (string, required),
-   age — user's age (number, required),
-   hobbies — user's hobbies (array of strings or empty array, required)

Example of correct object of user: {username: "Kate", age: 25, hobbies: ["singing","dancing"]}
