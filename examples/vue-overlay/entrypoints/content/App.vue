<script lang="ts" setup>
import vueLogo from "~/assets/vue.svg";
</script>

<template>
    <div class="container">
        <img :src="vueLogo" />
        <p>Hello World</p>
    </div>
</template>

<style scoped>
.container {
    position: fixed;
    right: 16px;
    top: 16px;
    width: 250px;
    height: 200px;
    pointer-events: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 8px;
    color: black;
}

img {
    width: 72px;
}
</style>
