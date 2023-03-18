<template>
  <div id="app">
    <div class="box1">
      <h1>Register</h1>
      <form>
        <div class="inputbox">
          <input type="text">
          <label>学号</label>
        </div>
        <div class="inputbox">
          <input type="password">
          <label>密码</label>
        </div>
        <div class="inputbox">
          <input type="text">
          <label>邮箱</label>
        </div>
        <input style="margin: 0 auto; width: 80px; text-align: center" type="button" value="提交" @click="register">
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router';
    const register = () => {
      router.push({path: '/'});
    }
</script>

<style scoped>
  #app {
    background-image: url("@/assets/images/background.jpg");
  }
  body{
    padding: 0px;
    margin: 0px;
  }
  .box1{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 400px;
    padding: 40px;
    background: rgb(0,0,0,0.8);
    box-sizing: border-box;
    box-shadow: 0 15px 25px rgb(0,0,0,0.5);
    border-radius: 10px;
  }
  .box1 h1{
    margin: 0 0 30px;
    padding: 0px;
    color: #ffffff;
    text-align: center;
  }
  .box1 .inputbox{
    position: relative;
  }
  .box1 .inputbox input{
    width: 100%;
    padding: 10px 0;
    margin-bottom: 30px;
    font-size: 18px;
    border: none;
    color: #ffffff;
    outline: none;
    background: transparent;
    border-bottom: 1px solid #ffffff;
  }
  .box1 .inputbox label{
    position:  absolute;
    top: 0;
    left: 0;
    font-size: 18px;
    color: #ffffff;
    pointer-events: none;
    transition: 0.5s;
  }
  .box1 .inputbox input:focus ~ label,
  .box1 .inputbox input:valid ~ label{
    top: -18px;
    left: 0px;
    font-size: 16px;
    color: #03a9f4;
  }
  .box1 input{
    background: transparent;
    border: none;
    outline: none;
    color: #ffffff;
    background: #03a9f4;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
  }
</style>