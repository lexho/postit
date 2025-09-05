# PostIt!
## starten
docker run -p 6379:6379 --ulimit memlock=-1 docker.dragonflydb.io/dragonflydb/dragonfly

## node.js starten
npm start

## API
http://localhost:8080/api/postings?hashtag=%22funny%22&sort=desc