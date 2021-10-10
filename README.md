# Fordaszat-idopontfoglalo-admin-felulet
Ez egy fodrász szalon időpontfoglaló rendszere és admin felülete, melyet JavaScript képzésem végén készítettem vizsgamunkaként. 
A képzés a következőket foglalta magában: JavaScript, JQuery, NodeJS, ExpressJS, MongoDB

Telepítési útmutató

0. A telepítéshez és futtatáshoz szükségünk van NodeJS-re, így először ezt szükséges telepítenünk: https://nodejs.org/en/download/
1. Letöltjük a .zip fájlt, majd kicsomagoljuk, az így kapott könyvtárat pedig megnyitjuk egy IDE felületen. (pl.: VS Code)
2. Terminállal belépünk ebbe a könyvtárba, majd az 'npm install' paranccsal telepítjük a további szükséges fájlokat (node_modules).
3. Miután elkészült a telepítés, a 'node main_fodrasz.js' paranccsal indíthatjuk el a lokális szervert, ami a 2200-as portot figyeli.
4. Ezután a böngészőben a 'localhost:2200' URL-en érhetjük el a weblapot. 

                                                      Működés
Foglalófelület                                                    
- a foglalófelületen kiválaszhatjuk a kedvenc fodrászunkat, majd lekérhetjük az ő szabad időpontjait az adott napra egy felhőalapú adatbázisból
- a betöltött időpontok közül válaszhatunk egyet, amit le is tudunk foglalni a rendszerben.

Beléptetés az admin felületre
- itt a fodrászaink tudnak belépni a saját fiókjukba
- névvel és jelszóval lehet bejelentkezni:
            - név: 'Fodrász Frodó' jelszó: 'fodraszfrodo'
            - név: 'Borbély Béla' jelszó: 'borbelybela'
            - név: 'Frufru Fruzsi' jelszó: 'frufrufruzsi'

Admin felület
- alapból betöltődnek az éppen bejelentkezett fodrász lefoglalt időpontjai, minden részlettel együtt
- a betöltött időpontok részleteit a fodrásznak lehetősége van szerkeszteni, de törölni is 
