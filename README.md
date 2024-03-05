# Quenoftroll Express

## Description

This Aplication create with [Typescript](https://www.typescriptlang.org/).

## Feature

-   Connect to the database before starting the API application. This is necessary to avoid bugs caused by the database connection not being ready yet.
-   This Application connect to databaase [postgressql](https://www.postgresql.org/), [mongodb](https://www.mongodb.com/) and [redis](https://redis.io/)
-   Added the Rate Limitter Express Module to limit the number of requests per IP. This is used to prevent DDoS, DoS, and brute force attacks.
-   Added compression. This is used to make the server faster.
-   Add enable cors
-   Add helmet
-   Add limit request
-   Add limit URLEncode
-   Add idempotency request
-   Implementing string sanitization is essential to protect against XSS attacks

## Installation

```bash
# install pm2
$ npm install pm2 -g
# install package
$ npm install
# or
$ npm i
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# build application
$ npm run build
```

## Create Database

```bash
# up migration
$ npm run db:up

# down migration
$ npm run db:down

# create database and up migration
$ npm run db:setup

# restart database
$ npm run db:restart
```

## Lint

```bash
# run lint
$ npm run lint

# run pretier
$ npm run format
```

## Docker Production

### Creating Docker Volume

```bash
# set volume for place databases
$ docker volume create --name=quen
```

### Backup Database From Docker Volume

```bash
$  docker run --rm -v {volumeName}:/var/lib/postgresql/data -v {volumeName}:/data/db -v {path-to-host-backup-folder} alpine tar -czvf /{nameFile}.tar.gz /var/lib/postgresql/data /data/db

# example
$  docker run --rm -v quen:/var/lib/postgresql/data -v quen:/data/db -v C:\Backup:/backup alpine tar -czvf /backup/quen_backup.tar.gz /var/lib/postgresql/data /data/db
```

### Up File Database Backup To Volume

```bash
$ docker run --rm -v {volumeName}:/var/lib/postgresql/data -v {volumeName}:/data/db -v {path-to-host-backup-folder}:/backup alpine tar -xzvf /backup/{nameFile}.tar.gz -C /

# example
$ docker run --rm -v quen:/var/lib/postgresql/data -v quen:/data/db -v C:\Backup:/backup alpine tar -xzvf /backup/quen_backup.tar.gz -C /
```

### Up Change Docker Compose

```bash
$ docker-compose up --build # watch mode
# or
$ docker-compose up --build -d # background mode
```

### Up Docker Compose

```bash
$ docker-compose up # watch mode
# or
$ docker-compose up -d # background mode
```

### Down Docker Compose

```bash
$ docker-compose down
```

### See Stats Docker

```bash
# check docker status
$ docker stats
```
