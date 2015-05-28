# This script install all the packages required to run this test script on an Ubuntu EC2 host.

sudo apt-get update
sudo apt-get install nodejs-legacy
sudo apt-get install nodejs
sudo apt-get install npm
sudo apt-get install git

sudo apt-get install build-essential g++ flex bison gperf ruby perl \
  libsqlite3-dev libfontconfig1-dev libicu-dev libfreetype6 libssl-dev \
  libpng-dev libjpeg-dev python
git clone git://github.com/ariya/phantomjs.git
cd phantomjs
git checkout 2.0
./build.sh

sudo npm -g install casperjs
