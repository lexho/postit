function createPosting(postings, user, time1, text) {
    let child = document.createElement("li")
    let time = document.createElement("div")
    time.setAttribute("class", "time")
    time.textContent = time1

    let user1 = document.createElement("div")
    user1.setAttribute("class", "username")
    user1.innerHTML = "<b>" + user + ":</b>"

    let text1 = document.createElement("div")

    // parse text
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    let htmlText = text.replace(urlRegex, url => `<a href="${url}">${url}</a>`);
    // extract url from text

    //let url = text.match(/img:(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|bmp|webp))/gi);
    let url = text.match(/(https?:\/\/[^\/][^\s]+(\s|(?=\n?$(?!\n))))/gi);
    //console.log(`url: ${url}`)
    if(url ==  null) {
        //console.log("url does not match url pattern")
    } else
        if (isValidUrl(url)) console.log("URL is valid")
        else console.error("URL is invalid", url)

    // links
    //text = text.replace(/link:(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>');
    //text = text.replace(/link:(https?:\/\/[www]?.[a-z]*.[a-z]*[^\s&^.]+(\s|[.]))/g, '<a href="$1">$1</a>');
    //text = text.replace(/link:(https?:\/\/www.google.com\/[^\s&^.&\?&\!&\:&\,&\;]*)/g, '<a href="$1">$1</a>');
    //                    https: //           tourismus.regensburg.de/
    //                                        [a-z]*.   [a-z]*.    [a-z]*\/
    //                                               [a-z.]*
    //text = text.replace(/(https?:\/\/(www)?.?[a-z.]*.[a-z]*\/[^\s&^.&\!&\:&\,&\;]*)/g, '<a href="$1">$1</a>');

    //                             www.           webseite .com         /        terminierung
    // exclude  /(^:?https?:\/\/  (www)?.?         [a-z.]*.[a-z]*  \/?       [^.|^\s|^,|^:|^;]*)/g
    //text = text.replace(/((?!img:)https?:\/\/(www)?.?[a-z.]*.[a-z]*\/?[^\s|^,|^:|^;]*)/g, '<a href="$1">$1</a>');
    //text = text.replace(/(https?:\/\/[a-z.]*^img:$[^\s]*)/g, '<a href="$1">$1</a>');
    // *************************************************************************
    //text = text.replace(/(^(?!img:).*$)/g, '<a href="$1">$1</a>'); //
    // ******************************************************************************
    // https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkORRTylPVKwhNZQ5Lq0s0K2ndzAY4L6pr7A&s
    //text = text.replace(/(\s(?!img:)(https?:\/\/(www)?\.?[a-z.-]*\.[a-z]*\/?[^\s|^,|^;]*))/g, '<a href="$1">$1</a>'); //
    
    //text = text.replace(/^(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>');
    text = text.replace(/link:(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>'); // quite good solution
    
    //text = text.replace(/((?!img:)\s(?!")https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>'); // quite good solution
    
    //text = text.replace(/<\/a>\s[.]/g, '</a>.');
    //text = text.replace(/<\/a>\s[\?]/g, '</a>?'); */

        // images
    // Replace image URLs with <img> tags \s|\r|\n|
    text = text.replace(/img:(https?:\/\/[^\s]+(\s|(?=\n?$(?!\n))))/gi, '<img src="$1" width="100px" height="100px" /> '); // terminated by space or end of string
    //text = text.replace(/img:(https?:\/\/[^\s]+\.(?:jpg|jpeg|png|gif|bmp|webp))/gi, '<img src="$1" width="100px" height="100px" />'); // not every image is terminated by .jpg
    text = text.replace(/img:(data:image\/jpeg;base64,[^\s]+)/g, '<img src="$1" width="100px" height="100px" /> ');
    text = text.replace(/img:(data:image\/png;base64,[^\s]+)/g, '<img src="$1" width="100px" height="100px" /> ');

    text = text.replace(/^(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a> '); // quite good solution ^(?!img:)\s?
    text = text.replace(/\s(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a> ');
    text = text.replace(/link:(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a> ');

    text1.innerHTML = text
    child.appendChild(time)
    child.appendChild(user1)
    child.appendChild(text1)
    postings.appendChild(child)
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (err) {
        return false;
    }
}