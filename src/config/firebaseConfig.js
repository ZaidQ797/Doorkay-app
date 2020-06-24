import Firebase from 'firebase';  

var config = {
    apiKey: "AIzaSyDjKWIe8_rgDDqdamZoXD9c1hp3qLQarCc",
    authDomain: "doorkay-79534.firebaseapp.com",
    databaseURL: "https://doorkay-79534.firebaseio.com",
    projectId: "doorkay-79534",
    storageBucket: "",
    messagingSenderId: "926487324945",
    appId: "1:926487324945:web:460522b8c749d03a2144b0"
};

let app = Firebase.initializeApp(config);  
export const fb = app.database(); 
