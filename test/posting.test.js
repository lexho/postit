/**
 * @jest-environment jsdom
 */

import { createDOM } from './createDOM.js'
import { readFileSync, writeFileSync, copyFileSync, constants } from 'node:fs';
import path from 'node:path';

describe('createDOM', () => {
    beforeEach(() => {

    });

    describe('createDOM links', () => {
        it('should create a <div> with link posting', () => {
            const postings = document.createElement("div")
            const user = "test"
            const time1 = Date.now()
            const text = "Ich bin ein /link:https://tourismus.regensburg.de/erleben-entdecken/fuehrungen-spaziergaenge-und-rundfahrten/in-naechster-naehe."
            const result = createDOM(postings, user, time1, text)
            console.log(postings)
            const tmp = document.createElement("div");
            tmp.appendChild(postings);
            console.log(tmp.innerHTML); // <p>Test</p>
            const postings_str = tmp.innerHTML;
            expect(postings_str).toMatch(/<a href="https:\/\/tourismus.regensburg.de\//)
        });
    });

    describe('createDOM images', () => {
        it('should create a <div> with text posting', () => {
            const postings = document.createElement("div")
            const user = "test"
            const time1 = Date.now()
            const text = "Ich bin ein Text."
            const result = createDOM(postings, user, time1, text)
            console.log(postings)
            const tmp = document.createElement("div");
            tmp.appendChild(postings);
            console.log(tmp.innerHTML); // <p>Test</p>
            const postings_str = tmp.innerHTML;
            expect(postings_str).toMatch(/<div>Ich bin ein Text\.<\/div>/)
        });

        it('should create a <div> with <img> posting 1', () => {
            const postings = document.createElement("div")
            const user = "test"
            const time1 = Date.now()
            const text = `img:https://noe.orf.at/v2/static/oekastatic_orf_at/static/images/site/oeka/20130313/pong-ody.5133411.jpg`
            const result = createDOM(postings, user, time1, text)
            console.log(postings)
            const tmp = document.createElement("div");
            tmp.appendChild(postings);
            console.log(tmp.innerHTML); // <p>Test</p>
            const postings_str = tmp.innerHTML;
            //expect(postings_str).toMatch(/<div>Ich bin ein Text\.<\/div>/)`
            const expected_str = /<img/
            //`<img src=("|').*?\\1/>`
            expect(postings_str).toMatch(expected_str)
        })

        it('should create a <div> with a jpg <img> posting 2', () => {
            const postings = document.createElement("div")
            const user = "test"
            const time1 = Date.now()
            const text = `img:https://noe.orf.at/v2/static/oekastatic_orf_at/static/images/site/oeka/20130313/pong-ody.5133411.jpg`
            const result = createDOM(postings, user, time1, text)
            console.log(postings)
            const tmp = document.createElement("div");
            tmp.appendChild(postings);
            console.log(tmp.innerHTML); // <p>Test</p>
            const postings_str = tmp.innerHTML;
            //expect(postings_str).toMatch(/<div>Ich bin ein Text\.<\/div>/)`
            //let regex = /https:\/\/noe\.orf\.([A-Za-z0-9]+(\/[A-Za-z0-9]+)+)_orf_([A-Za-z0-9]+(\/[A-Za-z0-9]+)+)-([A-Za-z0-9]+(\.[A-Za-z0-9]+)+)/i;
            //const expected_str = /<img src="|'https:\/\/noe\.orf\.([A-Za-z0-9]+(\/[A-Za-z0-9]+)+)_orf_([A-Za-z0-9]+(\/[A-Za-z0-9]+)+)-([A-Za-z0-9]+(\.[A-Za-z0-9]+)+)/i
            const url = /https:\/\/noe.orf.at\/v2\/static\/oekastatic_orf_at\/static\/images\/site\/oeka\/20130313\/pong-ody.5133411.jpg/
            const url1 = "https:\/\/noe.orf.at\/v2\/static\/oekastatic_orf_at\/static\/images\/site\/oeka\/20130313\/pong-ody.5133411.jpg"
            //const expected_str = /<img src="|'/
            const expected_str = /<img src="|'https:\/\/noe.orf.at\/v2\/static\/oekastatic_orf_at\/static\/images\/site\/oeka\/20130313\/pong-ody.5133411.jpg/
            //`<img src=("|').*?\\1/>`
            expect(postings_str).toMatch(expected_str)
            expect(postings_str).toMatch(url)
        })

        it('should create a data:image jpg <img> posting', () => {
            const postings = document.createElement("div")
            const user = "test"
            const time1 = Date.now()
            const text = `img:data:image/jpeg;base64,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" width="100px" height="100px">`
            const result = createDOM(postings, user, time1, text)
            console.log(postings)
            const tmp = document.createElement("div");
            tmp.appendChild(postings);
            const postings_str = tmp.innerHTML;
            const expected_str = /<img src="|'data:image\/jpeg;base64/
            expect(postings_str).toMatch(expected_str)
        })

        it('should create a data:image png <img> posting', () => {
            const postings = document.createElement("div")
            const user = "test"
            const time1 = Date.now()
            const text = `img:data:image/png;base64,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`
            const result = createDOM(postings, user, time1, text)
            console.log(postings)
            const tmp = document.createElement("div");
            tmp.appendChild(postings);
            const postings_str = tmp.innerHTML;
            const expected_str = /<img src="|'data:image\/jpeg;base64/
            expect(postings_str).toMatch(expected_str)
        })

        it('should create a <div> with a gif <img> posting 3', () => {
            const postings = document.createElement("div")
            const user = "test"
            const time1 = Date.now()
            const text = `img:https://64.media.tumblr.com/3f01b6d3238cdaaa4ee913e12ef1dc44/8a2d78f03074ad0a-1f/s540x250/d9c622492101ccfa2523edec7d06311634ff6644.gif`
            const result = createDOM(postings, user, time1, text)
            console.log(postings)
            const tmp = document.createElement("div");
            tmp.appendChild(postings);
            console.log(tmp.innerHTML); // <p>Test</p>
            const postings_str = tmp.innerHTML;
            //expect(postings_str).toMatch(/<div>Ich bin ein Text\.<\/div>/)`
            //let regex = /https:\/\/noe\.orf\.([A-Za-z0-9]+(\/[A-Za-z0-9]+)+)_orf_([A-Za-z0-9]+(\/[A-Za-z0-9]+)+)-([A-Za-z0-9]+(\.[A-Za-z0-9]+)+)/i;
            //const expected_str = /<img src="|'https:\/\/noe\.orf\.([A-Za-z0-9]+(\/[A-Za-z0-9]+)+)_orf_([A-Za-z0-9]+(\/[A-Za-z0-9]+)+)-([A-Za-z0-9]+(\.[A-Za-z0-9]+)+)/i
            const url = /https:\/\/64.media.tumblr.com\/3f01b6d3238cdaaa4ee913e12ef1dc44\/8a2d78f03074ad0a/
            const url1 = "https:\/\/64.media.tumblr.com\/3f01b6d3238cdaaa4ee913e12ef1dc44/8a2d78f03074ad0a-1f\/s540x250\/d9c622492101ccfa2523edec7d06311634ff6644.gif"
            //const expected_str = /<img src="|'/
            const expected_str = /<img src="|'/
            //`<img src=("|').*?\\1/>`
            expect(postings_str).toMatch(expected_str)
            expect(postings_str).toMatch(url)
        })

        it('should create a <div> with a png <img> posting 4', () => {
            const postings = document.createElement("div")
            const user = "test"
            const time1 = Date.now()
            const text = `img:https://people.math.sc.edu/Burkardt/data/png/lena.png`
            const result = createDOM(postings, user, time1, text)
            console.log(postings)
            const tmp = document.createElement("div");
            tmp.appendChild(postings);
            console.log(tmp.innerHTML); // <p>Test</p>
            const postings_str = tmp.innerHTML;
            //expect(postings_str).toMatch(/<div>Ich bin ein Text\.<\/div>/)`
            //let regex = /https:\/\/noe\.orf\.([A-Za-z0-9]+(\/[A-Za-z0-9]+)+)_orf_([A-Za-z0-9]+(\/[A-Za-z0-9]+)+)-([A-Za-z0-9]+(\.[A-Za-z0-9]+)+)/i;
            //const expected_str = /<img src="|'https:\/\/noe\.orf\.([A-Za-z0-9]+(\/[A-Za-z0-9]+)+)_orf_([A-Za-z0-9]+(\/[A-Za-z0-9]+)+)-([A-Za-z0-9]+(\.[A-Za-z0-9]+)+)/i
            const url = /https:\/\/people.math.sc.edu\/Burkardt\/data\/png\/lena.png/
            const url1 = "https:\/\/people.math.sc.edu\/Burkardt\/data\/png\/lena.png"
            //const expected_str = /<img src="|'/
            const expected_str = /<img src="|'https:\/\/people.math.sc.edu\/Burkardt\/data\/png\/lena.png/
            //`<img src=("|').*?\\1/>`
            expect(postings_str).toMatch(expected_str)
            expect(postings_str).toMatch(url)
        })

        it('should create an <img> posting', () => {
            const postings = document.createElement("div")
            const user = "test"
            const time1 = Date.now()
            const text = `img:https://media.gettyimages.com/id/1300341723/de/vektor/bitte-stehen-sie-durch-tv-bildschirmtest-tv-test-muster-streifen-retro-stil.jpg?s=2048x2048&w=gi&k=20&c=ZG2yFfqLK8QgACbtQv91UKPIb3EvpUZbCIVjqdRNROY=`
            const result = createDOM(postings, user, time1, text)
            console.log(postings)
            const tmp = document.createElement("div");
            tmp.appendChild(postings);
            const postings_str = tmp.innerHTML;
            const expected_str = /<img src="|'https:\/\/media.gettyimages.com\/id\/1300341723\/de\/vektor/
            expect(postings_str).toMatch(expected_str)
        })

        it('should create an <img> posting with multiple <img>s', () => {
            const postings = document.createElement("div")
            const user = "test"
            const time1 = Date.now()
            const text = `img:https://people.math.sc.edu/Burkardt/data/png/lena.png img:https://people.math.sc.edu/Burkardt/data/png/lena.png img:https://people.math.sc.edu/Burkardt/data/png/lena.png`
            const result = createDOM(postings, user, time1, text)
            console.log(postings)
            const tmp = document.createElement("div");
            tmp.appendChild(postings);
            const postings_str = tmp.innerHTML;
            const expected_str = /<img src="|'https:\/\/people.math.sc.edu\/Burkardt\/data\/png\/lena.png <img src="|'https:\/\/people.math.sc.edu\/Burkardt\/data\/png\/lena.png <img src="|'https:\/\/people.math.sc.edu\/Burkardt\/data\/png\/lena.png/
            expect(postings_str).toMatch(expected_str)
        })
    });
});