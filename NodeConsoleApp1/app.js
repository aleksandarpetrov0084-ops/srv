const { getAllFiles } = require('./getAllFiles');

// Example usage
const folderPath = "C:/Users/User/Desktop";
const files = getAllFiles(folderPath);

console.log("Hello, world!");

// Wait 5 seconds before exiting
setTimeout(() => {
    console.log("Done waiting");
}, 50);

for (let i = 0; i < files.length; i++) {
  //  console.log(files[i]);
}
