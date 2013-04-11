var msg = chrome.extension.getBackgroundPage().message;
document.getElementById('msg').innerHTML = (msg!='')? msg : 'nic';
document.getElementById('reload').onclick= function(){
	chrome.extension.getBackgroundPage().watch()
}