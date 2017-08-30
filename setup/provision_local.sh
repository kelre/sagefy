#!/usr/bin/env bash

#### Initialize ###############################################################

sudo apt-get -y update
# sudo apt-get -y upgrade
# sudo apt-get -y install language-pack-en
# sudo apt-get -y autoremove

#### Get Code #################################################################

sudo apt-get -y install git

#### Aliases ##################################################################

sudo rm -rf /var/www
sudo ln -fs /vagrant /var/www
cd /var/www

# Prod:
# sudo mkdir /var/www
# sudo chown -R annina www

#### Python ###################################################################

sudo apt-get -y install python3-dev
sudo apt-get -y install python3-setuptools
sudo apt-get -y install python3-pip
sudo pip3 install -r /var/www/server/requirements.txt
sudo pip3 install pytest coverage flake8

#### Postgres #################################################################

sudo add-apt-repository "deb http://apt.postgresql.org/pub/repos/apt/ xenial-pgdg main"
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get -y install postgresql-9.6 postgresql-contrib
sudo -u postgres createdb sagefy
sudo -u postgres createdb test
sudo -u postgres psql -U postgres -d sagefy -a -f /var/www/setup/sagefy_tables.sql
sudo -u postgres psql -U postgres -d test -a -f /var/www/setup/sagefy_tables.sql
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"

#### Elasticsearch ############################################################

# Securing ElasticSearch: http://do.co/2f3vNPZ
sudo apt-get -y install openjdk-8-jre-headless
sudo apt-get update
wget https://download.elastic.co/elasticsearch/release/org/elasticsearch/distribution/deb/elasticsearch/2.3.1/elasticsearch-2.3.1.deb
sudo dpkg -i elasticsearch-2.3.1.deb
sudo systemctl enable elasticsearch.service
#...nano...
sudo systemctl start elasticsearch


#### Kibana ###################################################################

# TODO-2 Enable Kibana
# cd ~
# wget https://download.elasticsearch.org/kibana/kibana/kibana-4.0.0-beta3.tar.gz
# tar xvf kibana-4.0.0-beta3.tar.gz
# sudo mkdir -p /var/www/kibana
# sudo cp -R ~/kibana-4.0.0-beta3/* /var/www/kibana/
# rm kibana-4.0.0-beta3.tar.gz
# rm -R kibana-4.0.0-beta3
# cd /var/www/kibana
# ulimit -v unlimited
# TO RUN: ./bin/kibana
# cd /var/www

#### Redis ####################################################################

# Securing Redis: do.co/1nfZxt2
sudo apt-get -y install redis-server
# Renaming Dangerous Commands
sudo tee -a /etc/redis/redis.conf <<- EOM
rename-command FLUSHDB ""
# rename-command FLUSHALL ""
rename-command KEYS ""
rename-command CONFIG ""
rename-command SHUTDOWN ""
rename-command BGREWRITEAOF ""
rename-command BGSAVE ""
rename-command SAVE ""
rename-command DEBUG ""
EOM
# Setting Data Directory Ownership and File Permissions
sudo chmod 700 /var/lib/redis
sudo chown redis:root /etc/redis/redis.conf
sudo chmod 600 /etc/redis/redis.conf
sudo service redis-server restart

#### Client Tooling ###########################################################

sudo apt-get -y update
sudo apt-get -y install software-properties-common
sudo apt-get -y install python-software-properties python g++ make
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
cd /var/www/client
sudo npm install
npm run deploy
# pm2 start /var/www/client/app/index.server.js

#### Server ###################################################################

cd /var/www
sudo apt-get -y install uwsgi
sudo apt-get -y install nginx

# sudo uwsgi --stop /tmp/uwsgi-master.pid
# sudo uwsgi --ini /var/www/setup/uwsgi_local.ini
# sudo nginx -s stop
# sudo nginx -c /var/www/setup/nginx.conf

# TODO-1 Setup file system monitoring do.co/1GfDGYN
# TODO-1 Setup Digital Ocean private networking do.co/1nrFJE3
# TODO-1 Setup loggly
# TODO-1 Setup automated backups (especially of PostgresQL)
# TODO-1 setup auto updating on ubuntu
# TODO-2 Re-read bit.ly/1mERm9F

echo "Hooray! Provisioned."
echo "For script and style watching, run npm start."
echo "Be sure to update config.py if needed"
