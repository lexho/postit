# PostIt!
## setup database and install Node.js packages
```
docker run -p 6379:6379 --ulimit memlock=-1 docker.dragonflydb.io/dragonflydb/dragonfly
npm install
```

## start PostIt!-App
```npm start```

## open in Web-Browser
```http://localhost:8080/```

## API
```http://localhost:8080/api/postings?hashtag=funny&sort=desc```
