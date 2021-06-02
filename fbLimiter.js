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
            width: 100%;
            height: 100%;
            position:absolute;
            background-color: black;
            background-image:url(https://www.innerfreedomyoga.com/wp-content/uploads/2017/01/sitting-in-nature.jpg);
            background-repeat: no-repeat;
            background-position: center center;
        }
        .overlay > p {
            color: white;
            font-size: 40px;
            position:absolute;
            padding:0;
            margin:0;
            top:40%;
            left:35%;
        }
    ` );

    let increased;
    const today = new Date().getDate();
    const fbVisits = JSON.parse(localStorage.getItem('fbVisits'));

    //Settings
    // how many times user can visit site before it will be locked
    const limit = 1;
    const user = "Corny";
    // Multiple mode - means limit count is cleared not daily, but three times a day: at 0:00, 12:00 and 20:00
    const multiple = true;
    (function() {
        'use strict';

        // reseting records
        if(fbVisits) {
            if(multiple) {
                // if day in ls(local storage) differ from current day OR time of a day differ, reset ls
                if(fbVisits.date !== today || fbVisits.totd !== getTimeOfTheDay()) {
                    setInit();
                }
            } else {
                // if day in ls(local storage) differ from current day, reset ls
                if(fbVisits.date !== today) {
                    setInit();
                }
            }

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
        console.log(fbVisits.visits, limit);
        console.log(getTimeOfTheDay(), fbVisits.totd);
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
            let p = document.createElement('p');
            p.innerHTML = `Come back later <br> ${user} ;)`;

            div.append(p);
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
        if(0 <= hour && hour < 12){
            time ="morning";
        } else if (12 <= hour && hour <= 19) {
            time ="afternoon";
        } else if (20 <= hour && hour <= 23) {
            time = "evening";
        }
        return time;
    }
