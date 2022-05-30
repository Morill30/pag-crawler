const puppeteer = require('puppeteer');



const arr = [...new Array(50)];

let Homepage = 0;
let Qapage = 0;
let qaStatus = {
    _error: [],
    _200: 0
};

let homeStatus = {
    _error: [],
    _200: 0
};

(async () => {
    for (const i of arr ) {
        try{
            await crawl();
        }catch (e){
            console.log("wut")
        }
        
    }
    console.log("QA: ", Qapage, "QA status: ", qaStatus ," vs  Main: " ,Homepage, " Main status: ", homeStatus);
})();



async function crawl() {
    const url = "https://myslumberyard.com/sleep/can-a-full-moon-affect-your-sleep/";
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 800 })
    await page.goto(url);

    // Get cookies
    const ck = await page._client.send('Network.getAllCookies');

    const response = await page.waitForResponse(response=>response);

    if (ck) {
        const hpCookie = ck.cookies.find(i=> i.name === "Homepage");
        
        if(hpCookie) {
            if ( hpCookie.value === "Main-server" ) {
                Homepage++;
                getStatus(homeStatus);
            }else {
                Qapage++;
                getStatus(qaStatus);
            }
        }
    }


    // const result = await page.evaluate(() => {
    //     return document.querySelector('h1').innerHTML
    // });

    // if ( result === "The Pillow Cube Changed My Life: Why It’s Worth Trying" ){
    //     Qapage++;
    // }else {
    //     Homepage++;
    // }

    function getStatus( status ) {
        if ( response.status() == 200 || response.status() == 204 ) {
            status._200 = status._200 + 1;
        }else {
            status._error.push(response.status());
        }
    }

    

    await browser.close();

} 