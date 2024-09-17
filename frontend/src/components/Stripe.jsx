import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useState } from "react";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
    "pk_test_51PkqJ401TMMiDul2hIOpt2HXOR7fm0jIrsngBHEzBdO1JEqe1yUKeZTysbNQCP1fmM3aRnJlNUXBYq7vsmZKvArb006mcpxaT0"
);

const Stripe = ({ price, orderId }) => {
    const [clientSecret, setClientSecret] = useState("");
    const apperance = {
        theme: "stripe",
    };
    const options = {
        apperance,
        clientSecret,
    };

    const create_payment = async () => {
        try {
            const { data } = await axios.post(
                "http://localhost:5000/api/order/create-payment",
                { price },
                { withCredentials: true }
            );

            setClientSecret(data.clientSecret);
        } catch (error) {
            console.log(error.response.data);
        }
    };

    return (
        <div className="mt-4">
            {clientSecret ? (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm orderId={orderId} />
                </Elements>
            ) : (
                <button
                    onClick={create_payment}
                    className="px-10 py-[6px] hover:shadow-green-700/30 hover:shadow-lg bg-green-700 text-white rounded-sm "
                >
                    Start Payment
                </button>
            )}
        </div>
    );
};

export default Stripe;
