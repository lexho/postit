import { readFileSync } from 'fs';
import { readFile } from 'fs';
import { rename, unlink, writeFile, access, constants } from 'node:fs/promises';
import fs from 'fs';
import readline from 'readline';
import { fromEvent } from 'rxjs';
import { filter, tap, map } from 'rxjs/operators';

const file = './input.txt'

export async function readFileRxJS() {
    console.log("readFileRxJS")
    return new Promise((res, rej) => {
        const filteredItems = [];

        const fileStream = fs.createReadStream(file);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        // Create an RxJS observable from the 'line' event
        const line$ = fromEvent(rl, 'line');

        // Filter lines containing the word 'Alex' and store them in filteredItems array
        line$
            .pipe(
                //filter(line => line.includes('img')),
                tap(line => console.log('Line:', line)),
                map(line => line.trim())
            )
            .subscribe({
                next: line => {
                    let d = line.split("|") //TODO gut so?
                    //const regex1 = /^[a-z]*/
                    //test daten\ strom\ aus\ rosenheim 12345
                    //const regex2 = /[^\\][\s]/
                    // What I did was to create a pattern matching the '\ ' string in first sub-pattern then match anything that is not a ' '. 
                    // I escaped the the '\' too because otherwise writing that string in javascript would just parse them to the escaped character.
                    const regex2 = /((\\\s)|[^\s])+/gi
                    //const first = line.split(regex1)
                    const dataset = line.match(regex2)
                    //console.log("first: " + first)
                    for (let w of dataset) {
                        w = w.replaceAll("\\ ", " ")
                        console.log("word: " + w)
                    }
                    const id = dataset[0]
                    const time = dataset[1]
                    const user = dataset[2]
                    const text = dataset[3].replaceAll("\\ ", " ")
                    filteredItems.push({ id: id, time: time, user: user, text: text })
                },
                error: (error) => { console.log(error) }
            });

        rl.on('close', () => {
            console.log("complete");
            console.log('Filtered items:', filteredItems);
            // You can return or use filteredItems here
            res(filteredItems)
        })
    })

}

export async function writeToFile(storage) {
    let date = new Date()
    let time = date.getHours() + ":" + date.getMinutes()
    const message = `write data to file '${file}'`
    console.log(`${time} ${message}`)

    let lines = ""
    for (let d of storage) {
        //console.log("time: " + d.time)
        //console.log("text: " + d.text)
        let line = ""
        let text = d.text.replaceAll(" ", "\\ ")
        line = `${d.id} ${d.time} ${d.user} ${text}`
        lines += line + "\n"
    }
    lines = lines.substring(0, lines.length - 1)
    //console.log(storage)
    //console.log(lines)
    // writeFile
    // input.txt
    await writeFile('./input.txt', lines)
}