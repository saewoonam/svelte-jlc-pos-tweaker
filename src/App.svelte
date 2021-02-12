<script>
  import { onMount } from "svelte";
  let count = 0;
  onMount(() => {
    const interval = setInterval(() => count++, 1000);
    return () => {
      clearInterval(interval);
    };
  });
  /* component logic will go here */
</script>

<div class="App">
  <p>Page has been open for <code>{count}</code> seconds.</p>
</div>

<style>
  /* css will go here */
</style>
