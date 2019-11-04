<template>
  <tr>
    <td>
      <a
        target="_blank"
        href="(politic.url) || (politic.facebook_account)"
      >{{politic.first_name}} {{politic.middle_name}} {{politic.last_name}}</a>
    </td>
    <td>{{politic.state}}</td>
    <td>{{politic.party}}</td>
    <td>{{politic.seniority}}</td>
    <td>{{politic.votes_with_party_pct}}%</td>
  </tr>
</template>

<script>
export default {
  props: ["politic"]
};
</script>

<style>
td {
  width: 220px;
}
</style>
