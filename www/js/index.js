var point = 0;
var equipe = null;
var className = null;
// document.getElementById("myButton").addEventListener("click", addScore);

// Query all
//passe onclick a chacun each
//je recupere les datas 
//j'utilise addscore
var buttonTeam = document.querySelector('.submitTeam');

buttonTeam.addEventListener('click',function(){
    var inputTeam = document.querySelector('.inputTeam').value;
    if(inputTeam.length > 3){
        addTeam(inputTeam);
    }
    console.log(inputTeam);
});

var a = document.querySelectorAll(".addScore");
for (i = 0; i < a.length; i++) {
    a[i].addEventListener("click", function(e) {
        var e = this.getAttribute('data-team');
        var p = this.getAttribute('data-score');
        addScore(e, p);
    });
};

// var ts = new Date();
// console.log(Date.now().toLocaleString());
function convertDate(timeStamp){
    var date = new Date(timeStamp);
    var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    // Year
    var year = date.getFullYear();
    // Month
    var month = months_arr[date.getMonth()];
    // Day
    var day = date.getDate();
    // Hours
    var hours = date.getHours();
    // Minutes
    var minutes = "0" + date.getMinutes();
    // Seconds
    var seconds = "0" + date.getSeconds();
    // Display date time in MM-dd-yyyy h:m:s format
    var convdataTime = day+'-'+month+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    return convdataTime;
}

function addTeam(inputTeam){
    console.log(inputTeam);
    db.transaction(function(tx) {
        tx.executeSql('INSERT INTO team (name) VALUES(?)', [inputTeam]);
    });
}

function addScore(equipeId, point) {
    // document.querySelector(className).addEventListener('click', function() {
        db.transaction(function(tx) {
        tx.executeSql('INSERT INTO matchLog (datetime, teamId, score)VALUES (?,?,?)', [Date.now(), equipeId, point]);
        // tx.executeSql('SELECT score FROM matchLog WHERE teamId = 1', [], querySuccess);
        });
    // });
}
function querySuccess(tx, results) {
    // this will be empty since no rows were inserted.
    console.log("Insert ID = " + results.insertId);
    // this will be 0 since it is a select statement
    console.log("Rows Affected = " + results.rowAffected);
    // the number of rows returned by the select statement
    console.log("Insert ID = " + results.rows.length);
}

document.addEventListener('deviceready', function(event) {
    
    // console.log(Date.now());
    if (window.cordova.platformId === 'browser') {
        db = window.openDatabase('basketballcompanion', '1.0', 'Data', 2*1024*1024);
        console.log('Opening browser database');
    } 
    else {
        db = window.sqlitePlugin.openDatabase({name: 'basketballcompanion.db', location: 'default'});
        console.log('Opening mobile (plugin) database')
    }
    
    db.transaction(function(tx) {
        
        tx.executeSql('CREATE TABLE IF NOT EXISTS matchLog (id INTEGER PRIMARY KEY, datetime DATETIME, score NUMERIC, teamId INTEGER, FOREIGN KEY(teamId) REFERENCES team(id))');
        tx.executeSql('CREATE TABLE IF NOT EXISTS team (id INTEGER PRIMARY KEY autoincrement, name TEXT)');

        tx.executeSql('INSERT OR IGNORE INTO team (id, name)VALUES (?, ?)', [1, 'Equipe 1']);
        tx.executeSql('INSERT OR IGNORE INTO team (id, name)VALUES (?, ?)', [2, 'Equipe 2']);
      }, function(error) {
        console.log('Transaction ERROR: ' + error.message);
      }, function() {
        console.log('Populated database OK');
      });

    db.transaction(function(tx) {
    tx.executeSql('SELECT datetime, score, teamId, score FROM matchLog', [], function(tx, result) {

        var baseElement = document.querySelector('.historique');
        for(var i = 0; i < result.rows.length; i++) {
            var cloneElement = baseElement.cloneNode(true);
            document.querySelector('.app').appendChild(cloneElement);
            // console.log(result)
            // cloneElement.querySelector('.team').innerHTML = result.rows.item(i).teamId;
            cloneElement.querySelector('.score').innerHTML = result.rows.item(i).score;
            cloneElement.querySelector('.date').innerHTML = convertDate(result.rows.item(i).datetime);
        }
    });
    }, function(error) {
    console.log('Transaction ERROR: ' + error.message);
    }, function() {
    console.log('Select database OK');
    });
    db.transaction(function(tx) {

    tx.executeSql('SELECT name, name as teamName FROM team INNERJOIN matchLog ON matchLog.teamId = team.id', [], function(tx, result) {
        var baseElement = document.querySelector('.historique');
        for(var i = 0; i < result.rows.length; i++) {
            var cloneElement = baseElement.cloneNode(true);
            document.querySelector('.app').appendChild(cloneElement);
            console.log(result)
            cloneElement.querySelector('.team').innerHTML = result.rows.item(i).teamId;

        }

    });
    }, function(error) {
    console.log('Transaction ERROR: ' + error.message);
    }, function() {
    console.log('Select database OK');
    });
    
});