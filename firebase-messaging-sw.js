importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

console.log('Init');
firebase.initializeApp({
    apiKey: "AIzaSyBzLNmPHNw0wqKU0Z2Cx6qLRPq6KP6mSzQ",
    projectId: "pushbank-b2893",
    authDomain: "pushbank-b2893.firebaseapp.com",
    databaseURL: "https://pushbank-b2893.firebaseio.com",
    storageBucket: "pushbank-b2893.appspot.com",
    messagingSenderId: "513999950945",
    appId: "1:513999950945:web:421726b73d204c5cb90620"
});

const messaging = firebase.messaging();

self.addEventListener('notificationclick', e => {
    let found = false;
    let f = clients.matchAll({
        includeUncontrolled: true,
        type: 'window'
    })
        .then(function (clientList) {
            for (let i = 0; i < clientList.length; i ++) {
                if (clientList[i].url === e.notification.data.click_action) {
                    found = true;
                    clientList[i].focus();
                    break;
                }
            }
            if (! found) {
                if (! e.action) {
                    clients.openWindow(e.notification.data.click_action).then(function (windowClient) {});
                } else {
                    switch (e.action) {
                        case '1':
                            clients.openWindow(e.notification.data.actions[0].link);
                        case '2':
                            clients.openWindow(e.notification.data.actions[1].link);
                    }
                }
            }
        });
    e.notification.close();
    e.waitUntil(f);
});

messaging.onBackgroundMessage(function(payload) {
    if (payload.data.id) {
        let id = payload.data.id;
        let ver = '0.2';
        fetch('https://pushbank.pushdom.co/subscriptions/web/update', {
            method: 'POST',
            body: JSON.stringify({id: id, ver: ver})
        }).then(response => console.log(response.status));
    }

    if (payload.data.actions) {
        let actionsObj = JSON.parse(payload.data.actions);
        payload.data.actions = actionsObj;
    }

    const notificationTitle = payload.data.title;

    return self.registration.showNotification(notificationTitle, Object.assign({data: payload.data}, payload.data));
});
