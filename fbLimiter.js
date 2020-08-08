    // ==UserScript==
    // @name         New Userscript
    // @namespace    http://tampermonkey.net/
    // @version      0.1
    // @description  try to take over the world!
    // @author       You
    // @match        https://www.facebook.com/
    // @match        https://pl-pl.facebook.com/
    // @grant        GM_addStyle
    // ==/UserScript==

    GM_addStyle ( `
        .overlay {
            color: white;
            font-size: 40px;
            position:absolute;
            padding:0;
            margin:0;
        
            top:0;
            left:0;
        
            width: 100%;
            height: 100%;
            background:rgb(96, 96, 96);
        }
    ` );

    let increased;
    const today = new Date().getDate();
    const fbVisits = JSON.parse(localStorage.getItem('fbVisits'));

    //Settings
    const limit = 3;
    const user = "Corny";

    (function() {
        'use strict';

        // if day in ls differ from current day, clear ls
        if(fbVisits && fbVisits.date !== today) {
            localStorage.clear();
        }

        // if no records in ls -> create new; 
        // if record exist check if limit crossed if not increase visits, if yes -> block page
        if(!localStorage.getItem('fbVisits')) {
            setInit();
            increased = 1;
        } else { 
            if(isAllowed(fbVisits, limit)) {
                increased = JSON.parse(localStorage.getItem('fbVisits')).visits + 1;
                localStorage.setItem('fbVisits', JSON.stringify({"visits": increased, "totd": getTimeOfTheDay(), "date": today}));
            } else {
                blockPage();
            }
        }
    })();

    function isAllowed(fbVisits, limit) {
        // console.log(fbVisits.visits, limit);
        // console.log(getTimeOfTheDay(), fbVisits.totd);
        if(fbVisits.visits >= limit && getTimeOfTheDay() === fbVisits.totd) {
            return false;
        } 
        return true;
    }

    function blockPage() {
        setTimeout(()=>{
            const e = document.getElementsByTagName('body')[0];
            e.innerHTML = "";
            let div = document.createElement('div');
            div.className = "overlay";
            div.innerHTML = `Come back later ${user} ;)`;
            // document.append(body);
            document.body.append(div);
        },1)
        // alert("Not allowed");
    }

    function setInit() {
        localStorage.setItem('fbVisits', JSON.stringify({"visits": 1, "totd": getTimeOfTheDay(), "date": today}));
    }

    function getTimeOfTheDay() {
        const hour = new Date().getHours();
        let time ="";
        if(0 <= hour && hour <= 12){
            time ="morning";
        } else if (12 < hour && hour <= 20) {
            time ="afternoon";
        } else if (20 < hour && hour <= 24) {
            time = "evening";
        }
        return time;
    }