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
    window.TestChat = new Main();
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

    this.messageForm = document.getElementById('message-form');
    this.messageInput = document.getElementById('message');

    this.submitButton = document.getElementById('submit');


    this.init();

    this.database = firebase.database();


    firebase.database().ref('oralPresentationData/s1').once('value').then(function(snapshot) {
            document.getElementById("body").innerHTML = snapshot.val()["body"];
            document.getElementById("number").innerHTML = snapshot.val()["number"];
            document.getElementById("title").innerHTML = snapshot.val()["title"];
            document.getElementById("whois").innerHTML = snapshot.val()["whois"];
    });

    // Toggle for the button.
    var buttonTogglingHandler = this.toggleButton.bind(this);
    this.messageInput.addEventListener('keyup', buttonTogglingHandler);
    this.messageInput.addEventListener('change', buttonTogglingHandler);
    this.messageForm.addEventListener('submit', this.saveMessage.bind(this));

}


Main.prototype.init = function(){
    this.auth = firebase.auth();

    this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
    this.loadmessages();
    this.clickMessageButton();
}


Main.prototype.loadmessages = function() {
    // Sign in Firebase using popup auth and Google as the identity provider.

    this.database = firebase.database();

    this.messagesRef = this.database.ref('oralPresentationData/');
    // Make sure we remove all previous listeners.
    this.messagesRef.off();

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
};


Main.prototype.clickMessageButton = function(){
    this.database = firebase.database();

    this.messagesRef = this.database.ref('oralPresentationData/');
    // Make sure we remove all previous listeners.
    this.messagesRef.off();

    var testvalue = "s1"
    $('.btn').on('click', function() {
        var testvalue = $('#').attr("value");

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
}

// Saves a new message on the Firebase DB.
Main.prototype.saveMessage = function(e) {
    e.preventDefault();

    var messagesRef = firebase.database().ref('oralPresentationData/');
    console.log(messagesRef);
    // Check that the user entered a message and is signed in.
    if (this.messageInput.value && this.checkSignedInWithMessage()) {
        var currentUser = this.auth.currentUser;
        // Add a new message entry to the Firebase Database.
        messagesRef.push().set({
            whois: currentUser.displayName,
            title: 'test',
            body: this.messageInput.value,
            number: '10',
        }).then(function () {
            Main.resetMaterialTextfield(this.messageInput);
            this.toggleButton();
            this.loadmessages();
        }.bind(this));

    }
};

// Resets the given MaterialTextField.
Main.resetMaterialTextfield = function(element) {
    element.value = '';
    element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
};




Main.prototype.toggleButton = function() {
    if (this.messageInput.value) {
        this.submitButton.removeAttribute('disabled');
    } else {
        this.submitButton.setAttribute('disabled', 'true');
    }
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


// Returns true if user is signed-in. Otherwise false and displays a message.
Main.prototype.checkSignedInWithMessage = function() {
    // Return true if the user is signed in Firebase
    if (this.auth.currentUser) {
        return true;
    }

    // Display a message to the user using a Toast.
    var data = {
        message: 'You must sign-in first',
        timeout: 2000
    };
    this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
    return false;
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


        // We save the Firebase Messaging Device token and enable notifications.
        this.saveMessagingDeviceToken();

    } else { // User is signed out!
        // Hide user's profile and sign-out button.
        this.userName.setAttribute('hidden', 'true');
        this.signOutButton.setAttribute('hidden', 'true');

        // Show sign-in button.
        this.signInButton.removeAttribute('hidden');
    }

};

// Saves the messaging device token to the datastore.
Main.prototype.saveMessagingDeviceToken = function() {
    firebase.messaging().getToken().then(function(currentToken) {
        if (currentToken) {
            console.log('Got FCM device token:', currentToken);
            // Saving the Device Token to the datastore.
            firebase.database().ref('/fcmTokens').child(currentToken)
                .set(firebase.auth().currentUser.uid);
        } else {
            // Need to request permissions to show notifications.
            this.requestNotificationsPermissions();
        }
    }.bind(this)).catch(function(error){
        console.error('Unable to get messaging token.', error);
    });
};