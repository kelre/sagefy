---
layout: docs
title: Setup
---

## Local Development

These instructions assume you are using Mac OS X.

1. Install tools
   1. Install [Docker for Mac](https://www.docker.com/docker-mac).
   2. Install [Homebrew](https://brew.sh/).
   3. Install yarn: `brew install yarn`
2. Grab the code
   1. Clone the repository: `git clone https://github.com/heiskr/sagefy.git`
   2. Enter the directory: `cd sagefy`
3. Start it up: `docker-compose up -d`
4. Get some data
   1. Create database schemas (when first time):
      * `docker exec -it sagefy_postgres_1 psql -U sagefy -a -f /www/sagefy_tables.sql`
      * `docker exec -it sagefy_postgres-test_1 psql -U test -a -f /www/sagefy_tables.sql`
   2. Create dev data: `docker-compose run server python /www/test/dev_data.py`
5. Verify
   1. In your browser, visit `http://localhost/s/`, there should be a welcome message.
   2. In your browser, visit `http://localhost/`, the home page should be working.
   3. Try to sign up for an account.
6. Watch and rebuild: `yarn install && yarn start`

## Some Useful Commands

To shut down local dev:

    docker-compose down --remove-orphans

Watch the local dev logs:

    docker-compose logs --follow

Rebuild the containers (if config change):

    docker-compose up --build -d

Restart a service manually:

    docker-compose restart [servicename_1]

Access Postgres REPL:

    docker exec -it sagefy_postgres_1 psql -U sagefy

Access Redis CLI:

    docker exec -it www_redis_1 redis-cli

Run server tests:

    cd server
    pylint $(find . -iname "*.py") -j 4
    docker-compose run server coverage run --module py.test
    docker-compose run server coverage report --omit="test/*"

Run client tests:

    docker-compose run client yarn test

[Wipe Docker completely](http://bit.ly/2xrbmWb):

    docker rm -f $(docker ps -a -q)
    docker rmi -f $(docker images -q)

## Deploy steps

How to deploy the latest master:

    ++ ssh into the server ++
    ++ back up the database ++
    cd /var/www
    git pull origin master
    cd client
    yarn install
    yarn run deploy
    docker-compose restart server
    docker-compose restart client
    docker-compose restart nginx

## Back up the database

Run:

    ++ ssh into the server ++
    cd /var/www/dbbu
    today=`date '+%Y_%m_%d__%H_%M_%S'`
    docker exec -it www_postgres_1 pg_dump -U sagefy -a sagefy > "sagefy-$today.sql"
    ls -al
    b2 authorize_account xxx xxxxxxxx  # see dashlane
    b2 sync /var/www/dbbu b2:sagefy-dbbu

## Things to fix:

* TODO The server should not know about git
* TODO Set up as a cron job... fix the environment :)
