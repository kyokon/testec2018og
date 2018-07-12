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



// Make Card system for the test play on Thursday
function test(){
    /*var config = {
        apiKey: 'AIzaSyAmdoFky-SahLXzBTqNoCSactBz5omZ7NE',
        authDomain: ' path to your firebase domain',
        databaseURL: 'https://ec2018og.firebaseio.com/',
        storageBucket: ''
    };
    firebase.initializeApp(config);
*/
    this.database = firebase.database();

    firebase.database().ref('oralPresentationData/').once('value').then(function(snapshot) {
        snapshot.forEach(function(child){
            console.log(child.key);
            console.log(child.val()["whois"]);

            document.getElementById('id01').innerHTML = child.key;
        });
    });

    var dataRef = firebase.database().ref('oralPresentationData/s1/');
    dataRef.once("value")
        .then(function(snapshot) {
            document.getElementById("body").innerHTML = snapshot.child("body").val();
            document.getElementById("number").innerHTML = snapshot.child("number").val();
            document.getElementById("title").innerHTML = snapshot.child("title").val();
            document.getElementById("whois").innerHTML = snapshot.child("whois").val();
        });


    /*FirebaseDatabase database = FirebaseDatabase.getInstance();
    DatabaseReference myRef = database.getReference("something");
    myRef.addValueEventListener(new ValueEventListener() {
    @Override
        public void onDataChange(final DataSnapshot dataSnapshot) {
            String foo = dataSnapshot.getValue(String.class)
            // foo => "foo"
        }

    @Override
        public void onCancelled(final DatabaseError databaseError) {
        }
    });*/
    /*

    alert("abc");
    // Import Admin SDK
    var admin = require("firebase-admin");

// Get a database reference to our posts
    var db = admin.database();
    var testdata = db.ref("oralPresentationData");


    var testelement = document.getElementById('id01');]
    if(testelement == 'id01') {
        alert(testdata);
    }*/
}

window.addEventListener('load' , function() {
    window.test = new test();
    alert("abc");
});

var Card = function(kindOfCard, cardData){
    this.cnumber = cardData.cnumber;
    this.flagisOpen = cardData.flagisOpen;
    this.value = cardData.value;//value of the function of this card
    this.funcCard = cardData.funcCard;//this means how this card affects to user's Character
}

Card.prototype.listItem = function() {
    var el = document.createElement('li');
    el.innerText = this.name;
    return el;
}


