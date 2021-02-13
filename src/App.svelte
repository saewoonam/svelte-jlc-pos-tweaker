<script>
  import { onMount } from "svelte";
  let papa, corrections;
  let count = 0;
  onMount(async () => {
    papa = await import('papaparse');
    corrections = papa.parse('corrections.csv', {download: true})
    console.log(papa.parse('corrections.csv', {download:true}))
    console.log('corrections', corrections)
    const interval = setInterval(() => count++, 1000);
    return () => {
      clearInterval(interval);
    };
  });
  const handle = (promise) => {
    return promise
      .then(data => ([data, undefined]))
      .catch(error => Promise.resolve([undefined, error]));
  }
  /* component logic will go here */
  async function google_file_picker(event) {
    let fileHandle, error;
    let options = {
      types: [
        {
          description: 'Text Files',
          accept: {
            'text/csv': ['.csv'],
          }
        }]
    };
    console.log(options);
    [fileHandle, error] = await handle(window.showOpenFilePicker(options));
    if (fileHandle) {
      fileHandle = fileHandle[0]
      console.log('Got file', fileHandle)
      const file = await fileHandle.getFile();
      const contents = await file.text();
      console.log(contents);
      console.log(papa)
      console.log(papa.parse)
      console.log(papa.parse(contents, {quoteChar: ''}))
    } else {
      throw error;
    }
  }
  async function google_directory_picker(event) {
    let fileHandle;
    // [fileHandle] = await window.showOpenFilePicker();
    // console.log(fileHandle)
    const dirHandle = await window.showDirectoryPicker();
    for await (const entry of dirHandle.values()) {
      // console.log('entry', entry)
      if (entry.name.endsWith('-pos.csv')) {
        console.log(entry.kind, entry.name);
      }
    }
    console.log(dirHandle)
  }
  function update() {
    console.log('corrections', corrections);
  }
</script>

<div class="App">
  <p>Page has been open for <code>{count}</code> seconds.</p>
</div>
<button on:click={google_file_picker}> google file picker </button>
<button on:click={google_directory_picker}> google directory picker </button>
<button on:click={update}> update console </button>
<style>
  /* css will go here */
</style>
