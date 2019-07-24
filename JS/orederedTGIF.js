function decidePage() {
  if (
    document.getElementById("senateLoyalty") ||
    document.getElementById("senateAttendance") ||
    document.getElementById("senateStarter")
  ) {
    allSenatePages();
  } else if (
    document.getElementById("houseLoyalty") ||
    document.getElementById("houseAttendance") ||
    document.getElementById("houseStarter")
  ) {
    allHousePages();
  } else {
    collapseText();
  }
}
document.getElementById("homeStarter");
decidePage();

function decideFetch(petchUrl) {
  if (condition) {
    petchUrl = "https://api.propublica.org/congress/v1/113/house/members.json";
  } else if (condition) {
    petchUrl = "https://api.propublica.org/congress/v1/113/senate/members.json";
  }

  fetch(petchUrl, {
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
      if (document.getElementById("houseStarterPage")) {
        houseAttendanceLoyalty();
      } else if (document.getElementById("houseStarter")) {
        HouseStarter();
      }
      hideLoader();
    })

    .catch(function(error) {
      console.log(error);
    });
}
