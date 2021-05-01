var emotes = {
    "GambaPls": "https://i.imgur.com/2Ev1Ks5.png",
    "PinkCree": "https://i.imgur.com/ovEJGPc.png",
    "PinkAta": "https://i.imgur.com/dqW7htV.png",
    "PinkWow": "https://i.imgur.com/G4LwEWq.png",
    "PinkDColon": "https://i.imgur.com/XXofcxt.png",
    "WeebDance": "https://cdn.betterttv.net/emote/5d9585231df66f68c80c6f26/3x",
    "WeebWat": "https://i.imgur.com/suaoaA8.gif",
    "WeebNoted": "https://i.imgur.com/M5MbbRU.gif",
    "WeebCry": "https://i.imgur.com/pn4VloK.gif",
    "WeebBooba": "https://i.imgur.com/gCCer9w.gif"
};

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function processFilter(node) {
    if (node.hasAttribute("data-a-target")) {
        if (node.getAttribute("data-a-target") == "chat-line-message") {
            // Do things with a chat here
            for (const [key, value] of Object.entries(emotes)) {
                // Get all the descendants of type chat message text
                var divs_with_text = [...node.querySelectorAll("[data-a-target='chat-message-text']")];
                for (var chat of divs_with_text) {
                    // Go through all text fragments
                    // Split on this emote key
                    split = chat.innerText.split(key);
                    chat.innerText = split[0] + ' ';
                    for (var j = 1; j < split.length; j++) {
                        // Chat element
                        var chat_split = document.createElement("span");
                        chat_split.setAttribute("class", "text-fragment");
                        chat_split.setAttribute("data-a-target", "chat-message-text");
                        chat_split.innerText = ' ' + split[j] + ' ';
                        insertAfter(chat_split, chat);

                        // Emote element
                        var emote_split = document.createElement("img");
                        emote_split.setAttribute("alt", key);
                        emote_split.setAttribute("class", "chat-image chat-line__message--emote");
                        emote_split.setAttribute("height", "28px");
                        emote_split.setAttribute("width", "28px");
                        emote_split.setAttribute("src", value);
                        insertAfter(emote_split, chat);

                        // Prep for next split
                        chat = chat_split;
                    }
                }
            }
        } else {
            return;
        }
    } else {
        return;
    }
}

// Options for the observer (which mutations to observe)
const config = { childList: true };

// Callback function to execute when mutations are observed
const callback = function (mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
        const found = [];
        var added_nodes = mutation.addedNodes;
        for (const node of added_nodes) {
            if (!node.tagName) continue; // not an element
            if (node.className == "chat-line__message") {
                // Found a chat line
                found.push(node);
            }
        }
        found.forEach(processFilter);
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Call the below function
waitForElementToDisplay(1000, 9000);

function waitForElementToDisplay(checkFrequencyInMs, timeoutInMs) {
    var startTimeInMs = Date.now();
    (function loopSearch() {
        if (document.querySelector("[data-test-selector='chat-scrollable-area__message-container']") != null) {
            // Start observing the target node for configured mutations
            // Select the node that will be observed for mutations
            var targetNode = document.querySelector("[data-test-selector='chat-scrollable-area__message-container']");
            observer.observe(targetNode, config);
            return;
        }
        else {
            setTimeout(function () {
                if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
                    return;
                loopSearch();
            }, checkFrequencyInMs);
        }
    })();
}
