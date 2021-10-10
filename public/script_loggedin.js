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


var username = sessionStorage.getItem("username")
var password = sessionStorage.getItem("password");
var foglalasok = document.getElementById("foglalasok");

document.getElementById("h1").innerHTML += username.slice((username.indexOf(" "))) + "!";

    
fetch("/idopontok").then((res) => res.json()).then((data) => {                                              // a lefoglalt időpontok és azok részleteinek lekérdezése adatbázisból
    var barbers = data;
         
            for (let barber of barbers) {
                if (barber.neve == username) {
                    var appointments = barber.idopontfoglalas;
                    for (let appointment of appointments) {
                        foglalasok.innerHTML +=
                            `<div class="idopont">
                        <span class="canedit neve">${appointment.nev}</span>
                        <span class="canedit datum">${appointment.datum}</span>
                        <span class="canedit ora">${appointment.ora}</span>
                        <span class="canedit reserveid">${appointment.id}</span>
                        <span class="delete">&#128465</span>
                        <span class="save">&#128427;</span>
                        </div>`
                    }
                }
            
            }
        
        }).then( () =>
            (function ($) {                                                                                 // időpontok törölhetőségének kivitelezése
                $(".delete").click(function () {
                    var _this = $(this);
                    var spanBeforeThis = _this.prev("span");
        
                    fetch("/delreservation", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            fodrasz: username,
                            id: spanBeforeThis.html(),
                        })
                    })
                    _this.parent("div").remove();
                });
        
                $(".canedit").bind("dblclick", function () {                                                // időpontok szerkezthetőségének kivitelezése
                    var _that = $(this);
                    $(".save").show();
                    _that.attr("contenteditable", true);
                });
        
                $(".save").click(function () {                                                          // módosítások mentése
                    var _thiss = $(this);
                    var editedBin = _thiss.prev("span");
                    var editedId = editedBin.prev("span");
                    var editedOra = editedId.prev("span");
                    var editedDatum = editedOra.prev("span");
                    var editedNev = editedDatum.prev("span");
        
                    fetch("/savereservation", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            fodrasz: username,
                            nev: editedNev.html(),
                            datum: editedDatum.html(),
                            ora: editedOra.html(),
                            id: editedId.html()
                        })
                    }).
                    then($(".save").hide())
                });
        
        }(jQuery)));







