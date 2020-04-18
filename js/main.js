const menu = document.querySelector('.menu-icon');
const mobileNav = document.querySelector('.mobile-nav_panel');
var submitButton = document.querySelector('#myForm');
var shortenBtn = document.querySelector('.btn-submit');
var inputField = document.querySelector('.input-field');
var mainContainer = document.getElementById("myData");




menu.addEventListener('click', function() {
    mobileNav.classList.toggle('show');
    
    

    if(mobileNav.classList.contains('show')) {
        menu.setAttribute('class', 'close-icon')
        menu.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>'
    } else {
        menu.classList.remove('show');
        menu.removeAttribute('class', 'close-icon')
        menu.innerHTML = '<i class="fa fa-bars menu-icon" aria-hidden="true"></i>'
    }   

})





function postLink(input) {
    fetch('https://rel.ink/api/links/', {
        method: 'POST',
        headers: {
           
            'Accept': 'application/json, text/plain, /*/',
            "Content-type": "application/json",
             
        },
        body: JSON.stringify({
            url: input
        })
    })
    .then((res) => res.json())
    .then(data =>  {
        getShortLink(data.hashid)
    })
   
}


async function getShortLink(antwort) {
        
    await fetch('https://rel.ink/api/links/' + antwort)
    .then((response => {
        return response.json();
    }))
    .then(data => {
        console.log(data.url);
        var listItems = document.createElement('li');
        var shortUrl = 'https://rel.ink/' + data.hashid
        var dataUrl = data.url;
        listItems.innerText = 'https://rel.ink/nWvX3k';
        // mainContainer.appendChild(listItems);
        buildElement(dataUrl, shortUrl);
        storeShortLinkInLs(data);

        function storeShortLinkInLs(data) {
            let url;
            if(localStorage.getItem('shortUrl') === null) {
                url = [];
            } else {
                url = JSON.parse(localStorage.getItem('shortUrl'));
            }

            url.push(data);

            localStorage.setItem('shortUrl', JSON.stringify(url));
        }


        
    })
    

    
    
}


function buildElement(url, shortUrl) {


    // Create an LI as Node for UL
    var listItems = document.createElement('li');
    listItems.setAttribute('class', 'list-items');
    mainContainer.appendChild(listItems);


    // Anchor inside the Ddiv
    var longLinkAnchor = document.createElement('a');
    longLinkAnchor.setAttribute('href', url);
    longLinkAnchor.setAttribute('class', 'long-link');
    listItems.appendChild(longLinkAnchor);
    longLinkAnchor.innerText = url

    // Shorten Link
    var shortLink = document.createElement('div');
    shortLink.setAttribute('class', 'list-shorten');
    listItems.appendChild(shortLink);

    // Anchor
    var shortenLinkAnchor = document.createElement('a');
    shortenLinkAnchor.setAttribute('class', 'shorten-link');
    shortenLinkAnchor.setAttribute('href', shortUrl);
    shortLink.appendChild(shortenLinkAnchor);
    shortenLinkAnchor.innerText = shortUrl;

    // Buton
    var btn = document.createElement('button');
    btn.setAttribute('class', 'shorten-link_btn');
    btn.textContent = 'Copy';
    shortLink.appendChild(btn);


    const textAnchor = document.querySelectorAll('.shorten-link');
    const btnAnchor = document.querySelectorAll('.shorten-link_btn');

    // Remove first

   function removeClasses() {
       btnAnchor.forEach(function(btns) {
           btns.classList.remove('btn-violett');
           btns.textContent = 'Copy';
       })
   }

    // List all Button

    btnAnchor.forEach(function(btns, index) {
        btns.addEventListener('click',function(e){
            removeClasses();
            btns.classList.add('btn-violett');
            copyToClipboard(textAnchor[index].textContent);
            btns.textContent = 'Copied!'
        });
        
    })

    
}

// GetLinks from Localstorage

submitButton.addEventListener('submit', function(e){
    e.preventDefault();
    let input = inputField.value
    input.trim();

    if(input === '') {
        inputField.style.border = '3px solid red';
        shortenBtn.style.backgroundColor = 'red';

        setTimeout(function(){
            shortenBtn.style.backgroundColor = '';
            inputField.style.border = '';
            inputField.value = ''
        },3000)
    } else if(!isHttpComp(input)) {
        inputField.style.border = '3px solid red';
        shortenBtn.style.backgroundColor = 'red';
        inputField.placeholder = 'Write Correct address: http://';
        inputField.value = '';
        
        setTimeout(function(){
            
            inputField.style.border = '';
            shortenBtn.style.backgroundColor = '';
            inputField.placeholder = 'Shorten a link here...';
            inputField.value = '';

        },3000)

    } else {
        postLink(inputField.value);
        inputField.value = ''
        inputField.style.border = '3px solid red';
        shortenBtn.style.backgroundColor = 'red';

    }
    
    
})

function isHttpComp(input) {
    let re = new RegExp('^https?://');
    return re.test(String(input).toLowerCase());
}

function getLinks() {

    let url;
    if(localStorage.getItem('shortUrl') === null) {
        url = [];
    } else {
        url = JSON.parse(localStorage.getItem('shortUrl'));
    }

   url.forEach(function(urls) {
       let link = 'https://rel.ink/' + urls.hashid;
       buildElement(urls.url, link)
      
   })

   
}
getLinks();




