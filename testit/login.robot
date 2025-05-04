*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${BROWSER}    chrome
${URL}        http://localhost:5173    # Your local development URL
${USERNAME}   
${PASSWORD}   test_password

*** Test Cases ***
Login test
    Open Browser    ${URL}    ${BROWSER}
    Title Should Be    OmaUni - Kirjaudu sisään
    Input text         id= username     ${USERNAME}
    Input text         id= password     ${PASSWORD}
    Click Button       id= submit-btn
    Close BROWSER