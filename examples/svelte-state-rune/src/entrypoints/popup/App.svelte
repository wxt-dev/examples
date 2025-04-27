<script lang="ts">
  import svelteLogo from "../../assets/svelte.svg";
  import { counterState } from "@/lib/counter-state.svelte";
</script>

<main class="app">
  <div>
    <a href="https://wxt.dev" target="_blank" rel="noreferrer">
      <img src="/wxt.svg" class="logo" alt="WXT Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>WXT + Svelte</h1>

  <div class="card">
    <p>{counterState.state.counter}</p>
  </div>

  <p class="read-the-docs">Click on the WXT and Svelte logos to learn more</p>
</main>
