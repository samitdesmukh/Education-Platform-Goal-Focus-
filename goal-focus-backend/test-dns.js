const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.cluster0.9ppgv55.mongodb.net",
  (err, addresses) => {
    if (err) {
      console.error("SRV Error:");
      console.error(err);
    } else {
      console.log("SRV Records:");
      console.log(addresses);
    }
  }
);