const menu = document.querySelector('.menu-icon');
const mobileNav = document.querySelector('.mobile-nav_panel');
var submitButton = document.querySelector('#myForm');
var shortenBtn = document.querySelector('.btn-submit');
var clearBtn = document.querySelector('.btn-danger');
var inputField = document.querySelector('.input-field');
var mainContainer = document.getElementById("myData");

menu.addEventListener('click', function () {
    mobileNav
        .classList
        .toggle('show');

    if (mobileNav.classList.contains('show')) {
        menu.setAttribute('class', 'close-icon')
        menu.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>'
    } else {
        menu
            .classList
            .remove('show');
        menu.removeAttribute('class', 'close-icon')
        menu.innerHTML = '<i class="fa fa-bars menu-icon" aria-hidden="true"></i>'
    }

})

function postLink(input) {

    const encodedParams = new URLSearchParams();
    encodedParams.append("url", input);

    localStorage.setItem('oldUrl', JSON.stringify(input));

    fetch('https://url-shortener-service.p.rapidapi.com/shorten', {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Host': 'url-shortener-service.p.rapidapi.com',
            'X-RapidAPI-Key': '8e0ae555d4msh776103877605b39p1052dcjsn51d99b4d1768'
        },
        body: encodedParams

    })
        .then((res) => res.json())
        .then(data => {
            getShortLink(data.result_url);

        })

}

async function getShortLink(response) {

    let myObj = {
        baseUrl: localStorage.getItem('oldUrl'),
        shortUrl: response
    }

    document.createElement('li');
    var shortUrl = response
    var dataUrl = myObj.baseUrl
    buildElement(dataUrl, shortUrl);

    storeShortLinkInLs(myObj);

    function storeShortLinkInLs(data) {
        let url;
        if (localStorage.getItem('shortObj') === null) {
            url = [];
        } else {
            url = JSON.parse(localStorage.getItem('shortObj'));
        }

        url.push(data);

        localStorage.setItem('shortObj', JSON.stringify(url));
    }

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
        btnAnchor.forEach(function (btns) {
            btns
                .classList
                .remove('btn-violett');
            btns.textContent = 'Copy';
        })
    }

    // List all Button

    btnAnchor.forEach(function (btns, index) {
        btns.addEventListener('click', function (e) {
            removeClasses();
            btns
                .classList
                .add('btn-violett');
            btns.textContent = 'Copied!'
            btnText = textAnchor[index].textContent;
            btns.setAttribute('data-url', btnText)
            navigator
                .clipboard
                .writeText(btns.dataset.url)
                .then(function () {
                    this.dataset
                })
        });

    })

}



clearBtn.addEventListener('click', function(e) {
    localStorage.clear();
    while (mainContainer.firstChild) {
        mainContainer.removeChild(mainContainer.firstChild);
    }
    
})


submitButton.addEventListener('submit', function (e) {
    e.preventDefault();
    let input = inputField
        .value
        input
        .trim();

    if (input === '') {
        inputField.style.border = '3px solid red';
        shortenBtn.style.backgroundColor = 'red';

        setTimeout(function () {
            shortenBtn.style.backgroundColor = '';
            inputField.style.border = '';
            inputField.value = ''
        }, 3000)
    } else if (!isHttpComp(input)) {
        inputField.style.border = '3px solid red';
        shortenBtn.style.backgroundColor = 'red';
        inputField.placeholder = 'Write Correct address: http://';
        inputField.value = '';

        setTimeout(function () {

            inputField.style.border = '';
            shortenBtn.style.backgroundColor = '';
            inputField.placeholder = 'Shorten a link here...';
            inputField.value = '';

        }, 3000)

    } else {
        postLink(inputField.value);
        inputField.value = ''

    }

})

function isHttpComp(input) {
    let re = new RegExp('^https?://');
    return re.test(String(input).toLowerCase());
}

function getLinks() {

    let url;
    if (localStorage.getItem('shortObj') === null) {
        url = [];
    } else {
        url = JSON.parse(localStorage.getItem('shortObj'));
    }

    url.forEach(function (urls) {

        buildElement(urls.baseUrl, urls.shortUrl)

    })

}
getLinks();
