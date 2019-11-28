<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
      #app{
        position: absolute;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
      }
      .fade-enter-active,.fade-leave-active {
        transition: all 0.5s;
      }
      .fade-enter,.fade-leave-to {
        opacity: 0;
        transform: translateY(-100px);
      }

</style>
