// import packages
import React from "react";
import StripeCheckout from "react-stripe-checkout";

//payment component
export default function Payment({totalPrice}) {
  function Payment(token) {
    console.log(token);

  }
  return (
    <div>
      <StripeCheckout
        amount={totalPrice * 100} //amount will be converted to cents so convert to 100
        shippingAddress
        token={Payment}
        currency="INR"
        stripeKey="pk_test_51LqEUOSElQrpNwqzIMSByxqlUlJdWazKiEKAfJTfaZroUPOxz4O55tzBsfwJW3tZnRkrL42mxmUsj0o1PGR4LrGS00yysgdWKr"
      >
        <button className="add my-2 py-2 justify-content-center">
          PAY NOW
        </button>
      </StripeCheckout>
    </div>
  );
}
