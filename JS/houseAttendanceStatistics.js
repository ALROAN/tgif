let members;

fetch("https://api.propublica.org/congress/v1/113/house/members.json", {
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
