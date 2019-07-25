let fetchUrl;
let members;
// ----------------------------------------------------------
//decide la url del fetch dependiendo del html en el que esta.

function decidePage() {
  if (
    document.getElementById("senateLoyalty") ||
    document.getElementById("senateAttendance") ||
    document.getElementById("senateStarter")
  ) {
    fetchUrl = "https://api.propublica.org/congress/v1/113/senate/members.json";
    decideFetch(fetchUrl);
  } else if (
    document.getElementById("houseLoyalty") ||
    document.getElementById("houseAttendance") ||
    document.getElementById("houseStarter")
  ) {
    fetchUrl = "https://api.propublica.org/congress/v1/113/house/members.json";
    decideFetch(fetchUrl);
  } else if (document.getElementById("homeStarter")) {
    collapseText();
  }
}
decidePage();
// --------------------------------------------------------
// decide que functions llamar desde el fech
// en base a la id de cada html.
function decideFetch(fetchUrl) {
  fetch(fetchUrl, {
    method: "GET",
    headers: {
      "X-API-KEY": "6jSAgYIJ9bP1RDksAHCRgu2m0sY9QbOMRpFWU1D"
    }
  })
    .then(function(response) {
      return response.json();
    })

    .then(function(datos) {
      members = datos.results[0].members;
      hideLoader(); //funcion desaparece el loader

      if (document.getElementById("senateLoyalty")) {
        findNumberVotes(members);
        findTotalVotesPartyPct(members);
        findTotalVotesPct(statistics);
        findleastLoyal(members);
        findmostLoyal(members);
        createSenateGlace(statistics);
        createLeastLoyal(statistics.leastLoyal);
        createMostLoyal(statistics.mostLoyal);
      } else if (document.getElementById("senateAttendance")) {
        findNumberVotes(members);
        findTotalVotesPartyPct(members);
        findTotalVotesPct(statistics);
        createSenateGlace(statistics);
        findleastEngaged(members);
        findmostEngaged(members);
        createLeastEngaged(statistics.leastEngaged);
        createMostEngaged(statistics.mostEngaged);
      } else if (document.getElementById("senateStarter")) {
        dropDown();
        superFilter();
      } else if (document.getElementById("houseLoyalty")) {
        findNumberVotes(members);
        findTotalVotesPartyPct(members);
        findTotalVotesPct(statistics);
        findleastLoyal(members);
        findmostLoyal(members);
        createSenateGlace(statistics);
        createLeastLoyal(statistics.leastLoyal);
        createMostLoyal(statistics.mostLoyal);
      } else if (document.getElementById("houseAttendance")) {
        findNumberVotes(members);
        findTotalVotesPartyPct(members);
        findTotalVotesPct(statistics);
        createSenateGlace(statistics);
        findleastEngaged(members);
        findmostEngaged(members);
        createLeastEngaged(statistics.leastEngaged);
        createMostEngaged(statistics.mostEngaged);
      } else if (document.getElementById("houseStarter")) {
        dropDown();
        superFilter();
      }
    })

    .catch(function(error) {
      console.log(error);
    });
}

// ----------------------FUNCTIONS-------------------------------
//funcion desaparece el loader.
function hideLoader() {
  document.getElementById("loader").style.display = "none";
}
// --------------------DATE FOOTER--------------------------
// pinta la data actual en el footer de todas las paginas.
function printDate() {
  var d = new Date();
  document.getElementById("date").innerHTML = d.toDateString();
}
printDate();

// -----------------HOME-----------------------------------
// cambia el estado de los botones del collapse de home.
function collapseText() {
  let buttonMore = document.getElementById("buttonMore");
  let buttonLess = document.getElementById("buttonLess");

  buttonMore.addEventListener("click", hiddingButton, false);
  buttonLess.addEventListener("click", visibleButton, false);

  function hiddingButton() {
    buttonMore.style.visibility = "hidden";
  }

  function visibleButton() {
    buttonMore.style.visibility = "visible";
  }
}

//   -----------------------house senate starter-----------------------------
// construye el dropdown de las paginas loyalty y attendance.
function dropDown() {
  let politicsMembers = Array.from(members);
  let states = [];
  for (let i = 0; i < politicsMembers.length; i++) {
    states.push(politicsMembers[i].state);
  }

  let uniqueStates = [...new Set(states)];
  // treu tots els repetits
  for (let j = 0; j < uniqueStates.length; j++) {
    let stateItem = document.createElement("option");
    let valueItem = document.createAttribute("value");
    valueItem.value = uniqueStates[j];
    stateItem.setAttributeNode(valueItem);
    stateItem.innerHTML = uniqueStates[j];
    uniqueStatesMenu.append(stateItem);
  }
}
// ------------------------------------------------------------------------
// pone filtro a las paginas congress 113.
function superFilter() {
  let uniqueStatesMenu = document.getElementById("uniqueStatesMenu");

  let checkboxRepublicans = document.getElementById("defaultInline1");
  let checkboxDemocrats = document.getElementById("defaultInline2");
  let checkboxIndependents = document.getElementById("defaultInline3");
  checkboxRepublicans.addEventListener("click", superFilter, false);
  checkboxDemocrats.addEventListener("click", superFilter, false);
  checkboxIndependents.addEventListener("click", superFilter, false);
  uniqueStatesMenu.addEventListener("change", superFilter, false);

  let checkboxes = document.querySelectorAll(".checkbox");
  let checkboxValue = [];

  for (let i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked == true) {
      checkboxValue.push(checkboxes[i].value);
    }
  }
  // primero he seleccionado todos los elementos con clase checkbox en un array,
  // después lo he pasado por un for y les he dicho que si alguno esta checked se pase
  // el value a un array vacío.

  let filterM = members.filter(member => {
    let partyFilter =
      checkboxValue.includes(member.party) || checkboxValue.length == 0;
    // .filter hace un for con el array que le pongas y te devuelve el
    // resultado true de la condición que le pongas.

    // definimos primera variable para la primera condición para el checkbox.

    // le decimos que si algún valor del checkboxValue coincide con algún member.party
    // devuelva true. Si no se cumple, pasamos a la segunda condición.
    // Si la longitud del array es 0 también devolvemos true.
    let state =
      member.state == uniqueStatesMenu.value || uniqueStatesMenu.value == "all";
    // Si el valor del dropdown es igual al estado devolvemos true o si es igual a
    // "all".
    return partyFilter && state;
    // devolvemos el resultado de las dos variables si estas son true, sino no se pinta nada
  });

  if (filterM.length != 0) {
    buildTable(filterM);
    document.getElementById("noPoliticsMessage").style.visibility = "hidden";
    document.getElementById("senateData").style.visibility = "visible";
  } else {
    document.getElementById("noPoliticsMessage").style.visibility = "visible";
    document.getElementById("senateData").style.visibility = "hidden";
  }
  buildTable(filterM);
  // aquí decimos que si la tabla esta vacia se muestre el
  //  mensaje de alerta, sino pinta la tabla normal
}
// --------------------------------------------------------------------------
// crea la tabla en base al resultado de superfilter()
function buildTable(filtrateMembers) {
  let tblBody = document.getElementById("tblbody");
  tblBody.innerHTML = "";
  for (let j = 0; j < filtrateMembers.length; j++) {
    let hilera = document.createElement("tr");
    let fullName = document.createElement("td");
    let stateZelda = document.createElement("td");
    let partyZelda = document.createElement("td");
    let seniorityZelda = document.createElement("td");
    let votes_with_party_pctZelda = document.createElement("td");
    let fullNameLink = document.createElement("a");

    fullNameLink.innerHTML =
      (filtrateMembers[j].first_name || "") +
      " " +
      (filtrateMembers[j].last_name || "") +
      " " +
      (filtrateMembers[j].middle_name || "");

    stateZelda.innerHTML = filtrateMembers[j].state;
    partyZelda.innerHTML = filtrateMembers[j].party;
    seniorityZelda.innerHTML = filtrateMembers[j].seniority;
    votes_with_party_pctZelda.innerHTML =
      filtrateMembers[j].votes_with_party_pct + "%";
    let ref = document.createAttribute("href");

    ref.value = filtrateMembers[j].url; // Set the value of the class attribute

    fullNameLink.setAttributeNode(ref);
    fullNameLink.setAttribute("target", "_blank");
    fullName.append(fullNameLink);

    hilera.append(
      fullName,
      partyZelda,
      stateZelda,
      seniorityZelda,
      votes_with_party_pctZelda
    );
    tblBody.append(hilera);
  }
}

// ------------------------------attendance  loyalattendance  loyal------------------------------
// objeto con las propiedades necesarias para construir las tablas
// de attendance y loyalty.
let statistics = {
  numberOfDemocrats: 0,
  numberOfRepublicans: 0,
  numberOfIndependents: 0,
  votesDemocrats: 0,
  votesRepublicans: 0,
  votesIndependents: 0,
  leastEngaged: [],
  mostEngaged: [],
  leastLoyal: [],
  mostLoyal: [],
  totalVotesPartyPct: 0,
  totalVotesPolitics: 0,
  totalVotesPct: 0
};

// --------------------------------------------------------------
// obtenemos los valores de number de cada partido, votes de cada
// partido y totalVotesPolitics.
function findNumberVotes(array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i].party === "R") {
      statistics.numberOfRepublicans++;
      statistics.votesRepublicans += array[i].votes_with_party_pct;
    } else if (array[i].party === "D") {
      statistics.numberOfDemocrats++;
      statistics.votesDemocrats += array[i].votes_with_party_pct;
    }
    if (array[i].party === "I") {
      statistics.numberOfIndependents++;
      (statistics.votesIndependents += array[i].votes_with_party_pct) /
        statistics.numberOfIndependents;
    } else {
      statistics.votesIndependents = 0;
      statistics.numberOfIndependents = 0;
    }
  }
  statistics.votesRepublicans =
    statistics.votesRepublicans / statistics.numberOfRepublicans;
  statistics.votesDemocrats =
    statistics.votesDemocrats / statistics.numberOfDemocrats;

  statistics.totalVotesPolitics =
    statistics.numberOfDemocrats +
    statistics.numberOfRepublicans +
    statistics.numberOfIndependents;
  statistics.votesRepublicans = Math.round(statistics.votesRepublicans);
  statistics.votesDemocrats = Math.round(statistics.votesDemocrats);
  statistics.votesIndependents = Math.round(statistics.votesIndependents);
  //   console.log(votesDemocrats, votesRepublicans, votesIndependents);
}

// ----------------------------------------------------------
// obtenemos el valor de totalVotesPartyPct
function findTotalVotesPartyPct(array) {
  for (let i = 0; i < array.length; i++) {
    statistics.totalVotesPartyPct += array[i].votes_with_party_pct;
  }
}

// ---------------------------------------------------------
// obtenemos el valor de totalVotesPct

function findTotalVotesPct(array) {
  array.totalVotesPct = array.totalVotesPartyPct / array.totalVotesPolitics;
  array.totalVotesPct = Math.round(array.totalVotesPct);
}

// -------------------------------------------------------------------
// sirve para ordenar la funcion de forma numerica con un .sort
function compare(a, b) {
  if (a.votes_with_party_pct < b.votes_with_party_pct) {
    return -1;
  }
  if (a.votes_with_party_pct > b.votes_with_party_pct) {
    return 1;
  }
  return 0;
}
// obtenemos el valor de leastLoyal

function findleastLoyal(array) {
  let sorted = Array.from(array).sort(compare);
  for (let i = 0; i < sorted.length * 0.1; i++) {
    statistics.leastLoyal.push(sorted[i]);
  }
  for (let j = statistics.leastLoyal.length; j < sorted.length; j++) {
    if (
      statistics.leastLoyal[statistics.leastLoyal.length - 1]
        .votes_with_party_pct == sorted[j].votes_with_party_pct
    ) {
      statistics.leastLoyal.push(sorted[j]);
    }
  }
}

// ---------------------------------------------------------------------
// sirve para ordenar la funcion de forma numerica con un .sort

function compareLeast(a, b) {
  if (a.missed_votes_pct < b.missed_votes_pct) {
    return -1;
  }
  if (a.missed_votes_pct > b.missed_votes_pct) {
    return 1;
  }
  return 0;
}
// obtenemos el valor de leastEngaged

function findleastEngaged(array) {
  let sorted = Array.from(array).sort(compareLeast);
  for (let i = 0; i < sorted.length * 0.1; i++) {
    statistics.leastEngaged.push(sorted[i]);
  }
  for (let j = statistics.leastEngaged.length; j < sorted.length; j++) {
    if (
      statistics.leastEngaged[statistics.leastEngaged.length - 1]
        .missed_votes_pct === sorted[j].missed_votes_pct
    ) {
      statistics.leastEngaged.push(sorted[j]);
    }
  }
  console.log(statistics.leastEngaged);
}

//   ----------------------------------------------------------------
// sirve para ordenar la funcion de forma numerica con un .sort

function compareTop(a, b) {
  if (a.votes_with_party_pct > b.votes_with_party_pct) {
    return -1;
  }
  if (a.votes_with_party_pct < b.votes_with_party_pct) {
    return 1;
  }
  return 0;
}
// obtenemos el valor de mostLoyal

function findmostLoyal(array) {
  let sorted = Array.from(array).sort(compareTop);
  for (let i = 0; i < sorted.length * 0.1; i++) {
    statistics.mostLoyal.push(sorted[i]);
  }
  for (let j = statistics.mostLoyal.length; j < sorted.length; j++) {
    if (
      sorted[j].votes_with_party_pct ===
      statistics.mostLoyal[statistics.mostLoyal.length - 1].votes_with_party_pct
    ) {
      statistics.mostLoyal.push(sorted[j]);
    }
  }
  console.log(statistics.mostLoyal);
}

// -----------------------------------------------------------------------
// sirve para ordenar la funcion de forma numerica con un .sort

function compareTopEngaged(a, b) {
  if (a.missed_votes_pct > b.missed_votes_pct) {
    return -1;
  }
  if (a.missed_votes_pct < b.missed_votes_pct) {
    return 1;
  }
  return 0;
}
// obtenemos el valor de mostEngaged

function findmostEngaged(array) {
  let sorted = Array.from(array).sort(compareTopEngaged);
  for (let i = 0; i < sorted.length * 0.1; i++) {
    statistics.mostEngaged.push(sorted[i]);
  }
  for (let j = statistics.mostEngaged.length; j < sorted.length; j++) {
    if (
      statistics.mostEngaged[statistics.mostEngaged.length - 1]
        .missed_votes_pct === sorted[j].missed_votes_pct
    ) {
      statistics.mostEngaged.push(sorted[j]);
    }
  }
  console.log(statistics.mostEngaged);
}

//   -------------------------------------------------------------------------
// crea la tabla glance de attendance y loyalty
function createSenateGlace(array) {
  let tBodyId = document.getElementById("Glase");
  let hilera1 = document.createElement("tr");
  let hilera2 = document.createElement("tr");
  let hilera3 = document.createElement("tr");
  let hilera4 = document.createElement("tr");
  let cell1 = document.createElement("td");
  let cell2 = document.createElement("td");
  let cell3 = document.createElement("td");
  let cell4 = document.createElement("td");
  let cell5 = document.createElement("td");
  let cell6 = document.createElement("td");
  let cell7 = document.createElement("td");
  let cell8 = document.createElement("td");
  let cell9 = document.createElement("td");
  let cell10 = document.createElement("td");
  let cell11 = document.createElement("td");
  let cell12 = document.createElement("td");

  cell1.innerHTML = "Democrats";
  cell2.innerHTML = array.numberOfDemocrats;
  cell3.innerHTML = array.votesDemocrats + " %";
  cell4.innerHTML = "Republicans";
  cell5.innerHTML = array.numberOfRepublicans;
  cell6.innerHTML = array.votesRepublicans + " %";
  cell7.innerHTML = "Independents";
  cell8.innerHTML = array.numberOfIndependents;
  cell9.innerHTML = array.votesIndependents + " %";
  cell10.innerHTML = "Total";
  cell11.innerHTML = array.totalVotesPolitics;
  cell12.innerHTML = array.totalVotesPct + " %";
  tBodyId.append(hilera1, hilera2, hilera3, hilera4);
  hilera1.append(cell1, cell2, cell3);
  hilera2.append(cell4, cell5, cell6);
  hilera3.append(cell7, cell8, cell9);
  hilera4.append(cell10, cell11, cell12);
}

//   -------------------------------------------------------------------------
// crea la tabla Least Loyal de loyalty

function createLeastLoyal(array) {
  let tBody = document.getElementById("leastLoyal");
  for (let i = 0; i < array.length; i++) {
    let hilera = document.createElement("tr");
    let name = document.createElement("td");
    let numberPartyVotes = document.createElement("td");
    let tpcVotesParty = document.createElement("td");
    let fullNameLink = document.createElement("a");

    name.innerHTML =
      (array[i].first_name || "") +
      " " +
      (array[i].last_name || "") +
      " " +
      (array[i].middle_name || "");

    numberPartyVotes.innerHTML = Math.round(
      (array[i].total_votes / 100) * array[i].votes_with_party_pct
    );
    tpcVotesParty.innerHTML = array[i].votes_with_party_pct + " %";

    let ref = document.createAttribute("href");
    ref.value = array[i].url;
    fullNameLink.setAttributeNode(ref);
    fullNameLink.setAttribute("target", "_blank");

    name.append(fullNameLink);
    hilera.append(name, numberPartyVotes, tpcVotesParty);
    tBody.append(hilera);
  }
}
//   -------------------------------------------------------------------------
// crea la tabla Most Loyal de loyalty

function createMostLoyal(array) {
  let tBodyId = document.getElementById("mostLoyal");
  for (let i = 0; i < array.length; i++) {
    let hilera = document.createElement("tr");
    let name = document.createElement("td");
    let numberPartyVotes = document.createElement("td");
    let tpcMissed = document.createElement("td");

    name.innerHTML =
      (array[i].first_name || "") +
      " " +
      (array[i].last_name || "") +
      " " +
      (array[i].middle_name || "");

    numberPartyVotes.innerHTML = Math.round(
      (array[i].total_votes / 100) * array[i].votes_with_party_pct
    );

    tpcMissed.innerHTML = array[i].votes_with_party_pct + " %";
    hilera.append(name, numberPartyVotes, tpcMissed);
    tBodyId.append(hilera);
  }
}

//   -------------------------------------------------------------------------
// crea la tabla Least Engaged de attendance

function createLeastEngaged(array) {
  let tBodyId = document.getElementById("leastEngaged");
  for (let i = 0; i < array.length; i++) {
    let hilera = document.createElement("tr");
    let name = document.createElement("td");
    let missedVotes = document.createElement("td");
    let tpcMissed = document.createElement("td");
    let fullNameLink = document.createElement("a");

    name.innerHTML =
      (array[i].first_name || "") +
      " " +
      (array[i].last_name || "") +
      " " +
      (array[i].middle_name || "");

    missedVotes.innerHTML = array[i].missed_votes;
    tpcMissed.innerHTML = array[i].missed_votes_pct;

    let ref = document.createAttribute("href");
    ref.value = array[i].url;
    fullNameLink.setAttributeNode(ref);
    fullNameLink.setAttribute("target", "_blank");
    name.append(fullNameLink);

    tBodyId.append(hilera);
    hilera.append(name, missedVotes, tpcMissed);
  }
}

//   -------------------------------------------------------------------------
// crea la tabla Most Engaged de attendance

function createMostEngaged(array) {
  let tBodyId = document.getElementById("mostEngaged");
  for (let i = 0; i < array.length; i++) {
    let hilera = document.createElement("tr");
    let name = document.createElement("td");
    let missedVotes = document.createElement("td");
    let tpcMissed = document.createElement("td");
    let fullNameLink = document.createElement("a");

    name.innerHTML =
      (array[i].first_name || "") +
      " " +
      (array[i].last_name || "") +
      " " +
      (array[i].middle_name || "");

    missedVotes.innerHTML = array[i].missed_votes;
    tpcMissed.innerHTML = array[i].missed_votes_pct;

    let ref = document.createAttribute("href");
    ref.value = array[i].url;
    fullNameLink.setAttributeNode(ref);
    fullNameLink.setAttribute("target", "_blank");
    name.append(fullNameLink);

    tBodyId.append(hilera);
    hilera.append(name, missedVotes, tpcMissed);
  }
}
