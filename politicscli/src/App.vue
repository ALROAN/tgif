<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

 <style scoped>
.logo {
  height: 165px;
}

.logoHead {
  max-width: 100%;
  height: 15%;
}
.headerAll {
  height: 68px;
}
.firstLine {
  height: 93px;
}
</style>
