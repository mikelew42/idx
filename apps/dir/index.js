import Dir from "/module/Dir/Dir.js";

window.dir = new Dir({ name: "test2" })
const file = await dir.dir("sub").file("test.ext").ready;
console.log(file.data);