// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  download pictures!
// @author       Corny
// @match        https://mail.google.com/mail/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        GM_addStyle
// @grant       GM.xmlHttpRequest
// ==/UserScript==

GM_addStyle ( `
.download-btn {
    position: absolute;
    z-index: 999999999999;
    top: 50px;
    right: 50px;
    color: black;
    cursor: pointer;
}
`
);

picMinWidth = 250;

start();

function start(){
    const interval = window.setInterval(()=>{
        console.log('loading...')
        if(loaded()) {
            console.log('Loaded!');
            clearInterval(interval);
            setTimeout(addDownloadButton, 1000);
        }
    }, 1000);
};

function loaded() {
    return document.getElementById('loading').style.display == "none" ? true : false;
}

function addDownloadButton() {
    console.log('BTN added');
    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    var el = document.createElement('button');
    el.innerHTML = "DOWNLOAD ALL PICS";
    el.className = "download-btn";
    el.addEventListener("click", ()=>{download();});
    var div = document.querySelector("body");
    insertAfter(div, el);
}


async function download() {
    console.log("downloading ...");
    const parent = document.querySelector('.gs');
    const children = document.querySelectorAll('img');
    const pics = Array.from(children).filter(el => el.clientWidth > picMinWidth);
    
    for(let i = 0; i < pics.length; i++) {
        const url =  pics[i].currentSrc;
        const response = await new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "get",
                url: url,
                responseType: "blob",
                onload:  response => {resolve(response); console.log("onload");},
                onerror: response => {reject(response);  console.log("onerror");},
            });
        });
        console.log("response:", response);
    
        const {response: blob} = response;
        downloadBlob(blob, `${i}.jpg`);
    }
    console.log(`${pics.length} pics downloaded`);

};

function downloadBlob(blob, name) {
    const anchor = document.createElement("a");
    anchor.setAttribute("download", name || "");
    anchor.href = URL.createObjectURL(blob);
    anchor.click();
}
