let members;

fetch("https://api.propublica.org/congress/v1/113/senate/members.json", {
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
    allFinds();
  })

  .catch(function(error) {
    console.log(error);
  });

// ------------------------------------------------------------
// numberOfDemocrats: numberOfRepublicans: numberOfIndependents:
// votesDemocrats: votesRepublicans: votesIndependents:

function allFinds() {
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

  function findNumberVotes(array) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].party === "R") {
        statistics.numberOfRepublicans++;
        votesRepublicans =
          (statistics.votesRepublicans += array[i].votes_with_party_pct) /
          statistics.numberOfRepublicans;
      } else if (array[i].party === "D") {
        statistics.numberOfDemocrats++;
        votesDemocrats =
          (statistics.votesDemocrats += array[i].votes_with_party_pct) /
          statistics.numberOfDemocrats;
      }

      if (array[i].party === "I") {
        statistics.numberOfIndependents++;
        votesIndependents =
          (statistics.votesIndependents += array[i].votes_with_party_pct) /
          statistics.numberOfIndependents;
      }
    }
    statistics.totalVotesPolitics =
      statistics.numberOfDemocrats +
      statistics.numberOfRepublicans +
      statistics.numberOfIndependents;
    votesRepublicans = Math.round(votesRepublicans);
    votesDemocrats = Math.round(votesDemocrats);
    votesIndependents = Math.round(votesIndependents);

    console.log(
      statistics.numberOfRepublicans,
      statistics.numberOfDemocrats,
      statistics.numberOfIndependents,
      votesRepublicans,
      votesDemocrats,
      votesIndependents,
      statistics.totalVotesPolitics
    );
  }

  findNumberVotes(members);

  // ------------------------------------------------------------------
  function findTotalVotesPartyPct(array) {
    for (let i = 0; i < array.length; i++) {
      statistics.totalVotesPartyPct += array[i].votes_with_party_pct;
    }
    console.log(statistics.totalVotesPartyPct);
  }

  findTotalVotesPartyPct(members);
  // ---------------------------------------------------------

  function findTotalVotesPct(array) {
    array.totalVotesPct = array.totalVotesPartyPct / array.totalVotesPolitics;
    array.totalVotesPct = Math.round(array.totalVotesPct);
  }
  findTotalVotesPct(statistics);
  console.log(statistics.totalVotesPct);
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
          .votes_with_party_pct === sorted[j].votes_with_party_pct
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

  // ---------------------------------------------------------------------

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
        statistics.mostLoyal[statistics.mostLoyal.length - 1]
          .votes_with_party_pct
      ) {
        statistics.mostLoyal.push(sorted[j]);
      }
    }
    console.log(statistics.mostLoyal);
  }

  findmostLoyal(members);

  // -----------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------
  function chekUrl() {
    if (document.getElementById("mostLoyal")) {
      function createSenateGlace(array) {
        let tBodyId = document.getElementById("senateGlace");
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
        cell3.innerHTML = votesDemocrats;
        cell4.innerHTML = "Republicans";
        cell5.innerHTML = array.numberOfRepublicans;
        cell6.innerHTML = votesRepublicans;
        cell7.innerHTML = "Independents";
        cell8.innerHTML = array.numberOfIndependents;
        cell9.innerHTML = votesIndependents;
        cell10.innerHTML = "Total";
        cell11.innerHTML = array.totalVotesPolitics;
        cell12.innerHTML = array.totalVotesPct;
        tBodyId.append(hilera1, hilera2, hilera3, hilera4);
        hilera1.append(cell1, cell2, cell3);
        hilera2.append(cell4, cell5, cell6);
        hilera3.append(cell7, cell8, cell9);
        hilera4.append(cell10, cell11, cell12);
      }

      createSenateGlace(statistics);
      // -----------------------------------------------------
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

          numberPartyVotes.innerHTML =
            (array[i].total_votes / 100) * array[i].votes_with_party_pct;
          tpcVotesParty.innerHTML = array[i].votes_with_party_pct;

          let ref = document.createAttribute("href");
          ref.value = array[i].url;
          fullNameLink.setAttributeNode(ref);
          fullNameLink.setAttribute("target", "_blank");

          name.append(fullNameLink);
          hilera.append(name, numberPartyVotes, tpcVotesParty);
          tBody.append(hilera);
        }
      }

      createLeastLoyal(statistics.leastLoyal);
      // --------------------------------------------------
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

          numberPartyVotes.innerHTML =
            (array[i].total_votes / 100) * array[i].votes_with_party_pct;
          tpcMissed.innerHTML = array[i].votes_with_party_pct;

          hilera.append(name, numberPartyVotes, tpcMissed);
          tBodyId.append(hilera);
        }
      }

      createMostLoyal(statistics.mostLoyal);
      // -------------------------------------------------------------------
    } else if (document.getElementById("leastEngaged")) {
      function createSenateGlace(array) {
        let tBodyId = document.getElementById("senateGlace");
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
        cell3.innerHTML = votesDemocrats;
        cell4.innerHTML = "Republicans";
        cell5.innerHTML = array.numberOfRepublicans;
        cell6.innerHTML = votesRepublicans;
        cell7.innerHTML = "Independents";
        cell8.innerHTML = array.numberOfIndependents;
        cell9.innerHTML = votesIndependents;
        cell10.innerHTML = "Total";
        cell11.innerHTML = array.totalVotesPolitics;
        cell12.innerHTML = array.totalVotesPct;
        tBodyId.append(hilera1, hilera2, hilera3, hilera4);
        hilera1.append(cell1, cell2, cell3);
        hilera2.append(cell4, cell5, cell6);
        hilera3.append(cell7, cell8, cell9);
        hilera4.append(cell10, cell11, cell12);
      }

      createSenateGlace(statistics);
      // -----------------------------------------------------------
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

      createLeastEngaged(statistics.leastEngaged);
      // --------------------------------------------------------------
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

      createMostEngaged(statistics.mostEngaged);
    }
  }

  chekUrl();
}
