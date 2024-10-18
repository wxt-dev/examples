<script lang="ts">
  import { someProperty } from "@/lib/store";
</script>

<label>
  <span>Toggle someProperty</span>
  <input type="checkbox" bind:checked={$someProperty} />
</label>
