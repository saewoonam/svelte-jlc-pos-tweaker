<script>
  import { onMount } from "svelte";
  let papa;
  let corrections;
  let count = 0;
  onMount(async () => {
    papa = await import('papaparse');
    papa.parse('corrections.csv',
      {
        download: true, 
        complete: function(results, file) {
          console.log("Parsing complete:", results, file);
          corrections = {}
          for (const row of results.data) {
            console.log('row', row)
            if (row.length>1) {
              corrections[row[0]] = row.slice(1).map(s=>s.trim())
            }
          }
          console.log('corrections', corrections)
        },
        // quoteChar: '',
      }
    );
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
  function rotate(data, angle) {
    // console.log('rotate', data, typeof(angle))
    data[5] = Number(data[5]) + Number(angle)
    data[5] %= 360;
    return data
  }
  function tweak(parsed) {
    let idx = 0;
    for(let name of parsed[0]) {
      // console.log(name)
      name = name.replace('PosX', 'Mid X')
      name = name.replace('PosY', 'Mid Y')
      name = name.replace('Ref', 'Designator')
      name = name.replace('Rot', 'Rotation')
      name = name.replace('Side', 'Layer')
      parsed[0][idx] = name;
      idx = idx + 1;
      // console.log(name);
    }
    console.log(parsed[0])
    for (let data of parsed) {
      if (data[1] in corrections) {
        let [footprint, angle] = corrections[data[1]]
        if (data[2]==footprint) {
          data = rotate(data, angle)
        }
      }
    }
  }
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
      console.log('contents\n', contents);
      let options = {quoteChar:'"'}
      let parsed = papa.parse(contents, options)
      console.log('parsed', parsed);
      tweak(parsed.data)
      console.log('tweaked', parsed);
      console.log('unparsed\n', papa.unparse(parsed));
      fileHandle = await getNewFileHandle()
      const writable = await fileHandle.createWritable();
      await writable.write(papa.unparse(parsed));
      await writable.close()
    } else {
      throw error;
    }
  }
  async function getNewFileHandle() {
    const options = {
      types: [
        {
          description: 'CSV position files',
          accept: {
            'text/csv': ['.csv'],
          },
          suggestedName: 'name.csv',
        },
      ],
    };
    const handle = await window.showSaveFilePicker(options);
    return handle;
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
<h1> Tweak KICAD pos file for JLC assembly </h1>
<p>
Click button below to select pos file to modify, 
it will then ask you to save the tweaked file
</p>
<br>
<button on:click={google_file_picker}> google file picker </button>
 <!--
<button on:click={google_directory_picker}> google directory picker </button>
<button on:click={update}> update console </button>
-->
<p></p>
<div class="App">
  <p>Page has been open for <code>{count}</code> seconds.</p>
</div>
<style>
  /* css will go here */
</style>
