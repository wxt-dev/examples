<script lang="ts" setup>
import useStoredValue from "@/composables/useStoredValue";

const { state: count, isLoading } = useStoredValue<number>("session:count", 0);
</script>

<template>
  <div>
    <p>Count: {{ isLoading ? "Loading..." : count }}</p>
    <button @click="count++">+1</button>
  </div>
</template>
