#!/bin/bash

echo "Start deploy"
ssh -tq root@88.198.50.217 '/bin/bash -l -c "source ~/.nvm/nvm.sh; cd /var/www/html/dexy-usd-bank-ui/;git fetch; git checkout main; git pull --force; yarn; yarn build;"'
echo "Deployed Successfully!"

exit 0
