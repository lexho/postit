import express from 'express';
import cors from 'cors';
import { from } from 'rxjs';
import { filter, map, toArray } from 'rxjs/operators';
//import { readFromFile, readFileRxJS, writeToFile, getAll, saveAll } from './storage.js'
//import { getAll, save, saveAll, saveDB, ip_address as redis_ip_address, port as redis_port } from './storage_redis.js'
import { readFileRxJS, writeToFile } from './storage_textfile.js'

const app = express();
app.use(express.json())
app.use(cors())
app.use(express.static('public'))

let count = 0

/*
    <li><div class="time">01:11</div><div>eins</div></li>
    <li><div class="time">01:12</div><div>zwei</div></li>
    <li><div class="time">01:13</div><div>drei</div></li>
    */
let storage = [];
init();

async function init() {
  //readFromFile().then(
  storage = await readFileRxJS();
  //storage = await getAll();
  //storage = await getAll();
  /*getAll().then((data) => {
    console.log(data)
    storage = data
    //readStdIn();
  })*/
  /*storage = getAll().then(() => {
    console.log("redis done");
    //console.log("storage: ");
    //console.log(storage);
  })*/

  /*  (data) => {
      storage = data
      console.log(storage)
    }
  ).catch((error) => {
    console.error('An error occured: ', error.message)
  })*/
}

app.get('/api/', (req, res) => {
  res.end("use /api/postings/")
})

app.get('/api/postings/', async (req, res) => {
  console.log("GET " + req.originalUrl)
  count++
  let hashtag1
  if (typeof req.query.hashtag == "string") {
    hashtag1 = req.query.hashtag
    console.log("hashtag: " + hashtag1)
  } else {
    hashtag1 = ""
  }
  const hashtag = hashtag1

  let sort1
  if (typeof req.query.sort == "string") {
    sort1 = req.query.sort
  } else {
    sort1 = ""
  }
  const sort = sort1
  console.log("sort:" + sort)
  //const storage = await getAll()
  //console.log("storage: " + storage)
  console.log("storage: " + storage.length + " items loaded")
  console.log("storage", storage)



  //true ? "yes" : "no"
  //sort == "desc" ? arr.sort((a, b) => b.id - a.id) : arr.sort((a, b) => a.id - b.id)

    from(storage)
      .pipe(
        filter(item => item.text && item.text.toLowerCase().includes(hashtag)),
        map(item => ({ ...item, text: item.text.trim() })),
        toArray(),
        map((arr) => sort == "desc" ? arr.sort((a, b) => b.time - a.time) : arr.sort((a, b) => a.time - b.time)) // Sort by id
      )
      .subscribe(filtered => {
        //console.log('Filtered storage:', filtered);
        res.json(filtered);
        // You can use the filtered array here
      });

});


app.post('/api', (req, res) => {
  console.log("POST " + req.originalUrl)
  //console.log('time: ' + req.body.time)
  //console.log('text: ' + req.body.text)
  const text = req.body.text;

  let time = JSON.parse(JSON.stringify(new Date(req.body.time)))
  let user = req.body.user
  //time1.setHours(time1.getHours() + offset); // set local timezone offset for docker
  //let adjustedTimestamp = (timestampInMillis - timezoneOffsetInMillis) / 1000;
  //time1 = new Date(parseInt(adjustedTimestamp))

  //console.log('time1: '+ time1)
  //console.log(time1.getHours())
  //console.log(time1.getMinutes())
  /*let hours
  let minutes
  if(time1.getHours() < 10) hours = '0'+time1.getHours(); else hours = time1.getHours()
  if(time1.getMinutes() < 10) minutes = '0'+time1.getMinutes(); else minutes = time1.getMinutes()
  //const time = hours + ':' + minutes
  const time = time1.getTime()*/

  //console.log('time: '+ time)
  const item = { id: 0, user: user, time: time, text: text }
  //save(item)
  storage.push(item)
  console.log("storage", storage)
})

setInterval(async () => {
  await writeToFile(storage);
}, 15 * 60 * 1000) // every 15 minutes*/

const ip_address = "localhost"
const port = 8080

const server = app.listen(port, () => {
  console.log("************** POST IT! **************")
  console.log("express yourself!")
  //console.log('PostIt erreichbar unter http://localhost:8080');
  console.log(`API: http://${ip_address}:${port}/api/`)
  console.log("**************************************")
  console.log()
});

// Using a single function to handle multiple signals
async function handle(signal) {
  console.log(`Received ${signal}`);
  // can i force redis to write down the data?
  await writeToFile(storage);
  process.exit(0); // Exit the process gracefully
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);