# Stripe Checkout Integration Setup

## Environment Variables

Thêm các biến môi trường sau vào file `.env`:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
DOMAIN=nidas://
```

## API Endpoint

### Create Checkout Session

- **URL**: `POST /api/checkout/create-session`
- **Content-Type**: `application/json`

### Request Body

```json
{
  "items": [
    {
      "priceId": "price_H5ggYwtDq4fbrJ",
      "quantity": 2
    },
    {
      "priceId": "price_H5ggYwtDq4fbrK",
      "quantity": 1
    }
  ]
}
```

### Response

```json
{
  "success": true,
  "message": "Checkout session created successfully",
  "data": {
    "url": "https://checkout.stripe.com/pay/cs_test_..."
  }
}
```

## Error Handling

### Validation Errors (400)

```json
{
  "success": false,
  "message": "Items array is required and cannot be empty"
}
```

### Stripe Errors (400)

```json
{
  "success": false,
  "message": "Stripe error occurred",
  "error": "No such price: 'price_invalid'"
}
```

### Server Errors (500)

```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

## Usage Example

```javascript
// Frontend code
const createCheckoutSession = async (items) => {
  try {
    const response = await fetch('/api/checkout/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    const data = await response.json();

    if (data.success) {
      // Redirect to Stripe Checkout
      window.location.href = data.data.url;
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Usage
const items = [
  { priceId: 'price_H5ggYwtDq4fbrJ', quantity: 2 },
  { priceId: 'price_H5ggYwtDq4fbrK', quantity: 1 },
];

createCheckoutSession(items);
```

## Notes

1. Đảm bảo `STRIPE_SECRET_KEY` là test key khi development
2. `DOMAIN` sẽ được sử dụng cho success_url và cancel_url
3. Stripe sẽ redirect về `${DOMAIN}/success` hoặc `${DOMAIN}/cancel` sau khi thanh toán
4. Session ID sẽ được thêm vào success URL: `${DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`
