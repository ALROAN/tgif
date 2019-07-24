let fetchUrl;
let members;

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
      } else if (document.getElementById("senateAttendance")) {
      } else if (document.getElementById("senateStarter")) {
      } else if (document.getElementById("houseLoyalty")) {
      } else if (document.getElementById("houseAttendance")) {
      } else if (document.getElementById("houseStarter")) {
      }
    })

    .catch(function(error) {
      console.log(error);
    });
}

// ----------------------FUNCTIONS-------------------------------
//funcion desaparece el loader
function hideLoader() {
  document.getElementById("loader").style.display = "none";
}
// --------------------DATE FOOTER--------------------------
function printDate() {
  var d = new Date();
  document.getElementById("date").innerHTML = d.toDateString();
}
printDate();

// -----------------HOME-----------------------------------
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
dropDown();

let checkboxRepublicans = document.getElementById("defaultInline1");
let checkboxDemocrats = document.getElementById("defaultInline2");
let checkboxIndependents = document.getElementById("defaultInline3");
checkboxRepublicans.addEventListener("click", superFilter, false);
checkboxDemocrats.addEventListener("click", superFilter, false);
checkboxIndependents.addEventListener("click", superFilter, false);
uniqueStatesMenu.addEventListener("change", superFilter, false);

function superFilter() {
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
superFilter();

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

// ------------------------------attendance  loyal------------------------------

let uniqueStatesMenu = document.getElementById("uniqueStatesMenu");

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

findNumberVotes(members);

// ----------------------------------------------------------

function findTotalVotesPartyPct(array) {
  for (let i = 0; i < array.length; i++) {
    statistics.totalVotesPartyPct += array[i].votes_with_party_pct;
  }
}

findTotalVotesPartyPct(members);
// ---------------------------------------------------------

function findTotalVotesPct(array) {
  array.totalVotesPct = array.totalVotesPartyPct / array.totalVotesPolitics;
  array.totalVotesPct = Math.round(array.totalVotesPct);
}
findTotalVotesPct(statistics);

// -------------------------------------------------------------------

function compare(a, b) {
  if (a.votes_with_party_pct < b.votes_with_party_pct) {
    return -1;
  }
  if (a.votes_with_party_pct > b.votes_with_party_pct) {
    return 1;
  }
  return 0;
}

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
  console.log(statistics.leastLoyal);
}

findleastLoyal(members);

// ---------------------------------------------------------------------

function compareLeast(a, b) {
  if (a.missed_votes_pct < b.missed_votes_pct) {
    return -1;
  }
  if (a.missed_votes_pct > b.missed_votes_pct) {
    return 1;
  }
  return 0;
}

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

findleastEngaged(members);

//   ----------------------------------------------------------------

function compareTop(a, b) {
  if (a.votes_with_party_pct > b.votes_with_party_pct) {
    return -1;
  }
  if (a.votes_with_party_pct < b.votes_with_party_pct) {
    return 1;
  }
  return 0;
}

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

findmostLoyal(members);

//   -----------------------------------------------------------------------------

function compareTop(a, b) {
  if (a.votes_with_party_pct > b.votes_with_party_pct) {
    return -1;
  }
  if (a.votes_with_party_pct < b.votes_with_party_pct) {
    return 1;
  }
  return 0;
}

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
function compareTopEngaged(a, b) {
  if (a.missed_votes_pct > b.missed_votes_pct) {
    return -1;
  }
  if (a.missed_votes_pct < b.missed_votes_pct) {
    return 1;
  }
  return 0;
}

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

findmostEngaged(members);

//   -------------------------------------------------------------------------
//   -------------------------------------------------------------------------
//   -------------------------------------------------------------------------
//   -------------------------------------------------------------------------
//   -------------------------------------------------------------------------
//   -------------------------------------------------------------------------
//   -------------------------------------------------------------------------
//   -------------------------------------------------------------------------
//   -------------------------------------------------------------------------
//   -------------------------------------------------------------------------
//   -------------------------------------------------------------------------
//   -------------------------------------------------------------------------
