const chai = require("chai");
const expect = chai.expect;
// import about page function
 const aboutPage = require("../../routes/about.js");

describe("getAboutPage", function() {
  it("should return about page", function() {
    let req = {}
    // Have `res` have a send key with a function value coz we use `res.send()` in our func
    let res = {
       send: function() {}
     }
     aboutPage.getAboutPage(req, res)
  });
});
