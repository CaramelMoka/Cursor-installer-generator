const { generateInf } = require("./core/infBuilder");

const config = {
  name: "MyCursor",
  files: {
    Arrow: "arrow.cur",
    Hand: "hand.cur",
    Help: "help.cur"
  }
};

const inf = generateInf(config);

console.log(inf);
