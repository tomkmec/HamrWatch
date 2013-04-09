var msg = chrome.extension.getBackgroundPage().message;
document.getElementById('msg').innerHTML = (msg!='')? msg : 'nic';
console.log(msg)
