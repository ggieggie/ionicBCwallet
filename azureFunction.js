module.exports = function (context, data) {
    context.log('Webhook was triggered!');

var stripe = require("stripe")("sk_test_YdMC1yOaoiJoMf7HwovJoo4h");
var token = data.source;

context.log(data);

stripe.charges.create({
    amount: data.amount,
    currency: "jpy",
    description: "Example charge",
    source: token,
}, function(err, charge) {
		if(err) {
            context.log("err");
			context.res = {
                status: 400,
                body: {error: err}
            };
		}else{
            context.log("yes");
            context.res = {
                body: {status: "success"}
            };
        }
		context.done();
  // asynchronously called
});
}
