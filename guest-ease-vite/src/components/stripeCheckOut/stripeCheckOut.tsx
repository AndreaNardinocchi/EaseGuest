import { useState } from "react";
import { loadStripe, type PaymentIntent } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Alert,
  Button,
  Box,
  CircularProgress,
  TextField,
} from "@mui/material";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = ({
  amount,
  onSuccess,
}: {
  amount: number;
  onSuccess?: (paymentIntent: PaymentIntent) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postalCode, setPostalCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!postalCode.trim()) {
      setError("Please enter your postal / ZIP code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create PaymentIntent on backend
      const res = await fetch("http://localhost:3000/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const { clientSecret } = await res.json();
      const card = elements.getElement(CardElement);
      if (!card) return;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            address: {
              postal_code: postalCode.trim(),
            },
          },
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        if (onSuccess) onSuccess(result.paymentIntent);
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error during payment");
    }

    setLoading(false);
  };

  return (
    <Card
      sx={{
        maxWidth: 420,
        mx: "auto",
        mt: 4,
        p: 2,
        borderRadius: 3,
        boxShadow: 4,
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6" textAlign="center">
            Secure Payment
          </Typography>
        }
      />

      <CardContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2, mb: 2 }}>
            <CardElement
              options={{
                hidePostalCode: true,
                style: {
                  base: { fontSize: "16px", color: "#424770" },
                },
              }}
            />
          </Box>

          <TextField
            label="Postal / ZIP code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            fullWidth
            margin="normal"
            required
            helperText="Enter your full postal code."
          />

          {error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!stripe || loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              backgroundColor: "#472d30",
              color: "#fff",
              "&:hover": { backgroundColor: "#EFF5E0", color: "#472d30" },
            }}
          >
            {loading ? (
              <CircularProgress size={26} />
            ) : (
              `Pay € ${(amount / 100).toFixed(2)}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export const StripeCheckout = ({
  amount,
  onSuccess,
}: {
  amount: number;
  onSuccess?: (paymentIntent: PaymentIntent) => void;
}) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm amount={amount} onSuccess={onSuccess} />
  </Elements>
);
