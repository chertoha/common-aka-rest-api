
## Running the app

Create `.env` file by `.env.example` template and set env variables

Start app and database:
```bash
$ docker-compose up -d --build
```

Run database migrations:
```bash
docker exec -it common-aka-rest-api-api-1 npm run migration:run
```

App is available on `localhost:3000`


## Create user 

Start app in repl mode using command:

```bash
npm run start:repl
```


And then call user seed using command in terminal:

```bash
get(UserSeed).run({ name: '<username>', email: '<email>', password: 'password' })
```