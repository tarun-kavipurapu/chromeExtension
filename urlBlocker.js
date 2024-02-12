const blockerSec = document.getElementById("blockerSec");
const blockButton = document.getElementById("block");

const blockList = [];
let blockUrl = "";

blockerSec.addEventListener("input", (e) => {
  blockUrl = e.target.value;
});
