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
  <header class="App-header">
    <a
      class="App-link"
      href="https://svelte.dev"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn Svelte web page
    </a>
  </header>
  <p>Page has been open for <code>{count}</code> seconds.</p>
</div>

<style>
  /* css will go here */
</style>
