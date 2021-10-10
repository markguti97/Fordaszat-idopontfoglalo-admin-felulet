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



var selectFodraszok = document.getElementById("selectfodraszok");
var searchButton = document.getElementById("searchButton");

var makeReserv = document.getElementById("makereserve");
var appointments = [];


request("GET", "/fodraszat", (res) => {                                                    // fodrászok nevének lekérdezése adatbázisból

    var barbers = JSON.parse(res);
    for (let barber of barbers) {
        selectFodraszok.innerHTML += `<option>${barber.neve}</option>`
    }
})

var noColon = (time) => {                                                                  // időpont számmá alakítása
    let parsedTime = parseInt(time.replace(":", ""))
    return parsedTime
}

var addStr = (str, index, stringToAdd) => {
    return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
}

searchButton.onclick = () => {                                                                // kiválasztott fodrász szabad időpontjainak lekérdezése adatbázisból
    var dateInput = document.getElementById("datum").value
    var selectedDate = new Date(dateInput);
    var weekDay = selectedDate.getDay();
    let selectedBarber = document.getElementById("selectfodraszok").value;
    var selectAppoint = document.getElementById("selectidopontok");
    var appointments = [];
    selectAppoint.innerText = "";

    request("GET", "/idopontok", (res) => {

        var barbers = JSON.parse(res);

        for (var barber of barbers) {

            if (barber.neve == selectedBarber) {
                var openingDays = barber.nyitvatartas
                var reservations = barber.idopontfoglalas;

                for (let day of openingDays) {

                    if (day.napIndex == weekDay) {
                        let tol = noColon(day.tol);
                        let ig = noColon(day.ig);
                        let count = 0;

                        for (let i = tol; i < ig; i += 0) {

                            if (i % 100 == 0 && count != 0) {
                                i += 30
                            } else if (count != 0) {
                                i += 70;
                            }
                            count++;
                            appointments.push(i >= 1000 ? addStr(String(i), 2, ":") : addStr(addStr(String(i), 0, "0"), 2, ":"))
                        }
                        for (let reservation of reservations) {

                            if (reservation.datum == dateInput) {
                                appointments = appointments.filter((value) => {

                                    return value != reservation.ora
                                })
                            }
                        }
                    }
                }
            }
        }

        var i = 0;
        for (let appointment of appointments) {                                                     // szabad időpontok renderelése

            i += 30;
            setTimeout(() => {
                selectAppoint.innerHTML += `<div style="opacity: 0" class="ido">${appointment}</div>`;
                (function ($) {
                    $(".ido").animate({
                        opacity: 1
                    }, 150, "linear")


                }(jQuery));
            }, i);
        }

        if (appointments.length == 0)
            selectAppoint.innerHTML += `<div id="nincs">Nincs elérhető időpont ezen a napon!</div>`;

        (function ($) {
            setTimeout(function () {
                $(".ido").click(function () {
                    var _this = $(this)
                    $(".ido").removeClass("selectedtime")
                    $(_this).toggleClass("selectedtime")
                });
            }, i)
        }(jQuery));

        makeReserv.onclick = () => {                                                                            //időpont lefoglalása

            var customerName = document.getElementById("customer").value;
            var newTime = new Date().getTime() + "-" + Math.floor(Math.random() * 10000000);

            fetch("/newreservation", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fodrasz: selectedBarber,
                    id: newTime,
                    nev: customerName,
                    datum: dateInput,
                    ora: document.getElementsByClassName("selectedtime")[0].innerHTML
                })
            }).
            then(() => {
                selectAppoint.innerHTML = "";
                document.getElementById("success").innerHTML = "Sikeres foglalás! :)"
            })

        }
    })
}

var adminSite = document.getElementById("admin")

adminSite.onclick = () => {                                                             //adminfelületre ugrás

    window.location.href = "admin_fodrasz.html";
}