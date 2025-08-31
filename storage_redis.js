import { createClient } from "redis";
import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
/*rl.question(`What's your name?`, name => {
  console.log(`Hi ${name}!`);
  rl.close();
});*/

export const ip_address = "localhost"
export const port = 6379
const client = await createClient(
  {
    url: `redis://${ip_address}:${port}`,
  }
)
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

function end() {
  client.destroy();
}

export async function get(id) {
  const value = await client.get(id);
  return value;
  /*return new Promise((resolve, reject) => {
    client.get(id, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });*/
}

export async function getAll() {
  try {
    const keys = await client.keys('*');
    const values = await Promise.all(keys.map(async (key) => {
      const value = await get(key);
      return JSON.parse(value)
      //return { id: value.id, time: value.time, text: value.text};
    }));
    //console.log(values)
    return values;
  } catch (error) {
    console.error("Error fetching all data:", error);
    throw error;
  }
}


export function saveAll(storage) {
  let date = new Date()
  let time = date.getHours() + ":" + date.getMinutes()
  const message = `write data to dragonflydb`
  console.log(`${time} ${message}`)
  for (let d of storage) {
    save(d)
  }
}

export function save(item) {
  return new Promise((resolve, reject) => {
    if (!item.id) {
      item.id = Date.now();
    }
    console.log(`store item: ${item.id} ${JSON.stringify(item)}`)
    client.set(String(item.id), JSON.stringify(item), (error) => {
      if (error) {
        reject(error);
      } else {
        console.log("item stored successfully!")
        resolve();
      }
    });
  });
}

export async function saveDB(callback) {
  let date = new Date()
  console.log(date.toISOString() + " save DB to disk ");
  let timeoutID = setTimeout(() => {
    console.log("SAVE command reply:", "TIMEOUT")
    callback();
  }, 3000);
  try {
    const reply = await client.sendCommand(['SAVE']);
    console.log("SAVE command reply:", reply);
    clearTimeout(timeoutID);
  } catch (error) {
    console.error("Error executing SAVE:", error);
  }
}

/*getAll().then((data) => {
    console.log(data)
    readStdIn();
})*/
//save({"id": 100, title: "Super 8", year: "1701"})