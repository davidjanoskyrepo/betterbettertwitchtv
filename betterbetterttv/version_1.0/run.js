(function betterbetterttv() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = chrome.runtime.getURL('betterbetterttv.js');
    var head = document.getElementsByTagName('head')[0];
    if (!head) return;
    head.appendChild(script);
})()
