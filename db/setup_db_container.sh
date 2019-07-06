docker build -t "mymongo" .
docker run -itd -p 27017-27019:27017-27019 --name mongodb mymongo
