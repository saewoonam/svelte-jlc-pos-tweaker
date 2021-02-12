/* Add JavaScript code here! */
console.log('Hello World! You did! Welcome to Snowpack :D');
import App from "./App.svelte.js";

let app = new App({
  target: document.body,
});

export default app;
