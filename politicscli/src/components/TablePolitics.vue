<template>
  <main class="container">
    <div id="loader" class="loaderContainer justify-content-center align-items-center">
      <div class="lds-default">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>

    <div class="col-8 pt-5 pb-3 pl-0">
      <h2>Congressmen</h2>
      <p>
        The major power of the House is to pass federal legislation that
        affects the entire country, although its bills must also be passed by
        the Senate and further agreed to by the U.S. President before becoming
        law (unless both the House and Senate re-pass the legislation with a
        two-thirds majority in each chamber). The House has some exclusive
        powers: the power to initiate revenue bills, to impeach officials
        (impeached officials are subsequently tried in the Senate), and to
        elect the U.S. President in case there is no majority in the Electoral
        College.
      </p>
      <p>
        Each U.S. state is represented in the House in proportion to its
        population as measured in the census, but every state is entitled to
        at least one representative.
      </p>
    </div>
    <div class="row container pr-0 mr-0">
      <div class="row col-6">
        <div>
          <p class="pr-2">Filter by Party:</p>
        </div>
        <div class="custom-control custom-checkbox custom-control-inline">
          <input
            v-on:click="superFilter()"
            type="checkbox"
            class="custom-control-input checkbox"
            id="defaultInline1"
            value="R"
          />
          <label class="custom-control-label" for="defaultInline1">Republican</label>
        </div>

        <div class="custom-control custom-checkbox custom-control-inline">
          <input
            v-on:click="superFilter()"
            type="checkbox"
            class="custom-control-input checkbox"
            id="defaultInline2"
            value="D"
          />
          <label class="custom-control-label" for="defaultInline2">Democrat</label>
        </div>

        <div class="custom-control custom-checkbox custom-control-inline">
          <input
            v-on:click="superFilter()"
            type="checkbox"
            class="custom-control-input checkbox"
            id="defaultInline3"
            value="I"
          />
          <label class="custom-control-label" for="defaultInline3">Independent</label>
        </div>
      </div>
      <div class="row col-6 d-flex justify-content-end">
        <div class="pr-2">
          <p>Filter by State:</p>
        </div>
        <div>
          <select v-on:change="superFilter()" id="uniqueStatesMenu">
            <option value="all">All</option>
            <option v-for="(state,index) in uniqueStates" :key="index" :value="state">{{state}}</option>
          </select>
        </div>
      </div>
    </div>
    <div class="justify-content-center fluid-width row container pr-0 mr-0">
      <table v-if="politicsFilter.length != 0" id="senateData" class="table-bordered col-12">
        <thead>
          <tr class>
            <th class="columnsTable">Name</th>
            <th class="columnsTable">Party</th>
            <th class="columnsTable">State</th>
            <th class="columnsTable">Years in Office</th>
            <th class="columnsTable">% votes w/Party</th>
          </tr>
        </thead>
        <tbody id="tblbody">
          <politic v-for="(politic,index) in politicsFilter" :key="index" :politic="politic"></politic>
        </tbody>
      </table>
      <div v-else class="noMembersMessage" id="noPoliticsMessage">
        <p>Ups.. There are no members with these characteristics</p>
      </div>
    </div>
  </main>
</template>

<script>
import politic from "./Politic.vue";
export default {
  created() {
    this.cargarPolitics();
  },

  components: { politic },

  data() {
    return {
      politics: [],
      politicsFilter: [],
      uniqueStates: []
    };
  },
  methods: {
    cargarPolitics() {
      fetch("https://api.propublica.org/congress/v1/113/house/members.json", {
        method: "GET",
        headers: {
          "X-API-KEY": "6jSAgYIJ9bP1RDksAHCRgu2m0sY9QbOMRpFWU1D"
        }
      })
        .then(response => response.json())

        .then(datos => {
          this.politics = datos.results[0].members;

          this.dropDown();
          this.superFilter();
          this.hideLoader();
        });
    },

    superFilter() {
      let checkboxes = document.querySelectorAll(".checkbox");
      let checkboxValue = [];

      for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked == true) {
          checkboxValue.push(checkboxes[i].value);
        }
      }

      this.politicsFilter = this.politics.filter(member => {
        let partyFilter =
          checkboxValue.includes(member.party) || checkboxValue.length == 0;
        let state =
          member.state == uniqueStatesMenu.value ||
          uniqueStatesMenu.value == "all";
        return partyFilter && state;
      });
    },
    dropDown() {
      let politicsMembers = Array.from(this.politics);
      let states = [];
      for (let i = 0; i < politicsMembers.length; i++) {
        states.push(politicsMembers[i].state);
      }

      this.uniqueStates = [...new Set(states)];
      console.log(this.uniqueStates);

      // treu tots els repetits
    },
    hideLoader() {
      document.getElementById("loader").style.display = "none";
    }
  }
};
</script>

<style scoped>
tr {
  width: 100%;
}

th {
  width: 20%;
}

/* ------------------loader------------ */

#noPoliticsMessage {
  margin-top: 30px;
  margin-bottom: 30px;
}

.loaderContainer {
  background-color: rgb(241, 241, 241);
  opacity: 0.9;
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 99;
  display: flex;
}

.lds-default {
  display: inline-block;
  position: relative;
  background-color: rgb(241, 241, 241);
  height: 71px;
  width: 71px;
}
.lds-default div {
  position: absolute;
  width: 5px;
  height: 5px;
  background: rgb(105, 182, 67);
  border-radius: 50%;
  animation: lds-default 1.2s linear infinite;
}
.lds-default div:nth-child(1) {
  animation-delay: 0s;
  top: 29px;
  left: 53px;
}
.lds-default div:nth-child(2) {
  animation-delay: -0.1s;
  top: 18px;
  left: 50px;
}
.lds-default div:nth-child(3) {
  animation-delay: -0.2s;
  top: 9px;
  left: 41px;
}
.lds-default div:nth-child(4) {
  animation-delay: -0.3s;
  top: 6px;
  left: 29px;
}
.lds-default div:nth-child(5) {
  animation-delay: -0.4s;
  top: 9px;
  left: 18px;
}
.lds-default div:nth-child(6) {
  animation-delay: -0.5s;
  top: 18px;
  left: 9px;
}
.lds-default div:nth-child(7) {
  animation-delay: -0.6s;
  top: 29px;
  left: 6px;
}
.lds-default div:nth-child(8) {
  animation-delay: -0.7s;
  top: 41px;
  left: 9px;
}
.lds-default div:nth-child(9) {
  animation-delay: -0.8s;
  top: 50px;
  left: 18px;
}
.lds-default div:nth-child(10) {
  animation-delay: -0.9s;
  top: 53px;
  left: 29px;
}
.lds-default div:nth-child(11) {
  animation-delay: -1s;
  top: 50px;
  left: 41px;
}
.lds-default div:nth-child(12) {
  animation-delay: -1.1s;
  top: 41px;
  left: 50px;
}
@keyframes lds-default {
  0%,
  20%,
  80%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
}
</style>
