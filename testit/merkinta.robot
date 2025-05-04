*** Settings ***
Library    SeleniumLibrary


*** Variables ***
${BROWSER}    Chrome
${URL}        http://127.0.0.1:5500/public/src/pages/paivakirja.html


*** Test Cases ***
Fill Merkinta Form
    Open Browser    ${URL}    ${BROWSER}
    Input text      id= date    2025-02-02
    Input text      id= time    2025-02-02 20:00
    Input text      id= delay-hours     20
    Input text      id= delay-minutes   30 
    Input text      id= wakeups         10
    Input text      id= timeup-hours         10
    Input text      id= timeup-minutes         10
    Input text      id= wakeups         10
    Input text      id= lkm         2002-10-02
    Input text      id= sleeptime-hours         10
    Input text      id= sleeptime-minutes         10
    Input text      id= inbed-hours         10
    Input text      id= inbed-minutes         10
    Drag And Drop By Offset    id=quality    1    10
    Drag And Drop By Offset    id=alertness    1    5
    Click Button       id= preview-btn


    
