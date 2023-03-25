<template>
  <div class="container">
    <div class="left">
      left
    </div>
    <div class="center">
      center
    </div>
    <div class="right">
      right
    </div>
  </div>
</template>

<style>

html {
  height: 100%;
}

body{
  height: 100%;
  margin: 0;
}

.container {
  top: 0;
  display: flex;
}

.left {
  position: absolute;
  width: 25%;
  background-color: blue;
  top: 0;
  bottom: 0;
  left: 0;
}

.center {
  position: absolute;
  width: 45%;
  background-color: yellow;
  top: 0;
  bottom: 0;
  left: 25%;
}

.right {
  position: absolute;
  width: 30%;
  background-color: green;
  top: 0;
  bottom: 0;
  left: 70%;
}
</style>


<script>

export default {
  name: 'Assign',
  data() {
  },
  methods: {
  }
}
</script>