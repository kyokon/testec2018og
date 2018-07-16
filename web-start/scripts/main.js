/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';


window.addEventListener('load' , function() {
    window.friendlyChat = new Main();
});

Main.MESSAGE_TEMPLATE =
    '<div class="message-container">' +
    '<div class="row"><div class="number"></div><div class="title"></div><div class="body"></div><div class="whois"></div></div>' +
    '</div>';


function Main(){
    this.userName = document.getElementById('user-name');
    this.signInButton = document.getElementById('sign-in');
    this.signOutButton = document.getElementById('sign-out');

    var value = 3;
    // Saves
    this.signOutButton.addEventListener('click', this.signOut.bind(this));
    this.signInButton.addEventListener('click', this.signIn.bind(this));

    this.messageforms = document.getElementById('messages');

    this.init();
/*
    //test here
    var div = document.getElementById(key);
    // If an element for that message does not exists yet we create it.
    if (!div) {
        var container = document.createElement('div');
        container.innerHTML = FriendlyChat.MESSAGE_TEMPLATE;
        div = container.firstChild;
        div.setAttribute('id', key);
        this.messageList.appendChild(div);
    }
    div.querySelector('.name').textContent = name;
    var messageElement = div.querySelector('.message');
    if (text) { // If the message is text.
        messageElement.textContent = text;
        // Replace all line breaks by <br>.
        messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
    }
*/

    //test end


    this.database = firebase.database();

/*
        firebase.database().ref("oralPresentationData/").once("value").then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                // key will be "ada" the first time and "alan" the second time
                var key = childSnapshot.key;
                // childData will be the actual contents of the child
                var childData = childSnapshot.val();
            });
        });

*/
/*
    firebase.database().ref('oralPresentationData/').once('value').then(function(snapshot) {
        snapshot.forEach(function(child){
            console.log(child.key);
            console.log(child.val()["whois"]);
            document.getElementById("body").innerHTML = child.val()["body"];
            document.getElementById("number").innerHTML = child.val()["number"];
            document.getElementById("title").innerHTML = child.val()["title"];
            document.getElementById("whois").innerHTML = child.val()["whois"];
        });
    });*/

    firebase.database().ref('oralPresentationData/s1').once('value').then(function(snapshot) {
            document.getElementById("body").innerHTML = snapshot.val()["body"];
            document.getElementById("number").innerHTML = snapshot.val()["number"];
            document.getElementById("title").innerHTML = snapshot.val()["title"];
            document.getElementById("whois").innerHTML = snapshot.val()["whois"];
    });



/*
    var dataRef = firebase.database().ref('oralPresentationData/s1/');
    dataRef.once("value")
        .then(function(snapshot) {
            document.getElementById("body").innerHTML = snapshot.child("body").val();
            document.getElementById("number").innerHTML = snapshot.child("number").val();
            document.getElementById("title").innerHTML = snapshot.child("title").val();
            document.getElementById("whois").innerHTML = snapshot.child("whois").val();
        });
*/
}


Main.prototype.init = function(){
    this.auth = firebase.auth();

    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
    this.loadmessages();
}

Main.prototype.loadmessages = function() {
    // Sign in Firebase using popup auth and Google as the identity provider.

    this.database = firebase.database();
    var testvalue = "s1"

    $('.btn').on('click', function() {
        var testvalue = $('#').attr("value");
        //console.log(testvalue);



        var messageforms = document.getElementById('messages');

        firebase.database().ref('oralPresentationData/').once('value').then(function(snapshot) {
            snapshot.forEach(function (childSnapshot) {
                var key = childSnapshot.key;
                var childData = childSnapshot.val();
                var div = document.getElementById(key);
                if (!div) {
                    var container = document.createElement('div');
                    container.innerHTML = Main.MESSAGE_TEMPLATE;
                    div = container.firstChild;
                    div.setAttribute('id', key);

                    div.querySelector('.number').textContent = childSnapshot.val()["number"];
                    div.querySelector('.title').textContent = childSnapshot.val()["title"];
                    div.querySelector('.body').textContent = childSnapshot.val()["body"];
                    div.querySelector('.whois').textContent = childSnapshot.val()["whois"];
                    console.log(div);
                    messageforms.appendChild(div);
                }

                /*これだと上書きになる
                document.getElementById("body").innerHTML = childSnapshot.val()["body"];
                document.getElementById("number").innerHTML = childSnapshot.val()["number"];
                document.getElementById("title").innerHTML = childSnapshot.val()["title"];
                document.getElementById("whois").innerHTML = childSnapshot.val()["whois"];
                */
            });
        });
    });
};




// Signs-in Friendly Chat.
Main.prototype.signIn = function() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    var provider = new firebase.auth.GoogleAuthProvider();
    this.auth.signInWithPopup(provider);
};

// Signs-out of Friendly Chat.
Main.prototype.signOut = function() {
    // Sign out of Firebase.
    this.auth.signOut();
};



// Triggers when the auth state change for instance when the user signs-in or signs-out.
Main.prototype.onAuthStateChanged = function(user) {
    if (user) { // User is signed in!
        // Get profile pic and user's name from the Firebase user object.
        var userName = user.displayName;   // Only change these two lines!

        // Set the user's profile pic and name.
        this.userName.textContent = userName;

        // Show user's profile and sign-out button.
        this.userName.removeAttribute('hidden');

        // Hide sign-in button.
        this.signOutButton.removeAttribute('hidden');
        this.signInButton.setAttribute('hidden', 'true');

    } else { // User is signed out!
        // Hide user's profile and sign-out button.
        this.userName.setAttribute('hidden', 'true');
        this.signOutButton.setAttribute('hidden', 'true');

        // Show sign-in button.
        this.signInButton.removeAttribute('hidden');
    }
};