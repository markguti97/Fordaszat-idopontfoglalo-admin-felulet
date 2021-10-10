function request(method, url, cbfn) {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {

        if (this.readyState == 4 && this.status == 200) {
            cbfn(this.responseText);
        }
    }
    xhttp.open(method, url);
    xhttp.send();
}


var reservationSite = document.getElementById("reserve");
var login = document.getElementById("login")
var valid;

login.onclick = () => {                                                                     
    var username = document.getElementById("username").value;                                   // bejelentkezési adatok elmentése.. később ebből tudjuk, kinek a foglalásait kell lekérni
    var password = document.getElementById("password").value;
    sessionStorage.setItem("username", username);
    sessionStorage.setItem("password", password);


    var invalid = document.getElementById("invalid");

    valid = false;

    request("GET", "/login", (res) => {                                                           // bejelentkezési adatok ellenőrzése                  
        var barbers = JSON.parse(res)
        var codedPass = CryptoJS.MD5(password).toString()
        console.log(codedPass);
        for (var barber of barbers) {
            if (barber.neve == username && barber.jelszo == codedPass) {
                valid = true;
            }
        }

        if (valid == false) {
            invalid.innerHTML = "Hibás bejelentkezési adatok!"
        } else {
            window.location.pathname = "loggedin_fodrasz.html";
        }
    })

};

var passwordInput = document.getElementById("password");                                            // entert nyomva is belép
passwordInput.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {  
        login.onclick()
    }
});