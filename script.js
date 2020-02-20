let currentline = 0;
let scriptElement = null;
let outputElement = null;
let lines = null;

window.onload = function () {

    let resetbutton = document.getElementById('resetbutton');
    resetbutton.onclick = function() {
        reloadScript();
    }

    scriptElement = document.getElementById('script');
    outputElement = document.getElementById('output');
    scriptElement.addEventListener('change', reloadScript);

    this.reloadScript();
}

function reloadScript() {
    lines = scriptElement.value.split('\n');
    outputElement.textContent = "";
    seekEvent('start');
    runline();    
}

function seekEvent(eventName)
{
    let checkString = "!"+eventName;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith(checkString)) {
            currentline = i;
            return;
        }
    }
    console.log("Cannot find event: "+eventName);
}

function seekLabel(labelName)
{
    let checkString = ":"+labelName;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith(checkString)) {
            currentline = i;
            return;
        }
    }
    console.log("Cannot find label: "+labelName);
}

function runline()
{
    if (currentline >= lines.length) return;
    if (lines[currentline].length == 0) return;

    let control = lines[currentline][0];

    while (control == ':' || control == '!') {
        currentline += 1;
        control = lines[currentline][0];
    }

    let line = lines[currentline];


    // console.log(line);

    if (line.startsWith('[')) {

        // We have a button, so find all the consecutive buttons and load them all
        let line2 = lines[currentline+1];
        let line3 = lines[currentline+2];
        let line4 = lines[currentline+3];

        parseButton(line, 0);
        if (line2.startsWith('[')) {
            parseButton(line2, 1);
            currentline += 1;
            if (line3.startsWith('[')) {
                parseButton(line3, 2);
                currentline += 1;
                if (line4.startsWith('[')) {
                    parseButton(line4, 3);
                    currentline += 1;
                }
            }    
        }

    } else {
        
        outputElement.innerHTML += "<br>"+line;
    
    }

    currentline += 1;
    runline();
}

function clearButtons()
{
    for (let i = 0; i < 4; i++) {
        let buttonElement = document.getElementById('button_'+i);
        buttonElement.style.visibility = "hidden";
    }
}

function parseButton(buttonLine, index)
{
    let parts = buttonLine.substring(1).split(']');
    let buttonElement = document.getElementById('button_'+index);
    buttonElement.style.visibility = "visible";
    buttonElement.textContent = parts[0];
    buttonElement.onclick = function() {
        outputElement.textContent = "";
        clearButtons();
        seekLabel(parts[1]);
        runline();
    }
}