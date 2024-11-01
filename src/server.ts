import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Define interfaces for our types
interface Payment {
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

interface PaymentParams {
  paymentId: string;
}

interface OrderParams {
  orderId: string;
}

// In-memory storage for our mock data
const payments = new Map<string, Payment>();

// Initiate payment endpoint
app.post('/api/payments', (_req: Request, res: Response): void => {
  const paymentId = Math.random().toString(36).substring(7);
  payments.set(paymentId, {
    status: 'pending',
    createdAt: new Date()
  });

  // Simulate payment completion after random time
  setTimeout(() => {
    const payment = payments.get(paymentId);
    if (payment) {
      payment.status = Math.random() > 0.2 ? 'completed' : 'failed';
      console.log(`Payment ${paymentId} status updated to: ${payment.status}`);
    }
  }, Math.random() * 5000 + 2000); // 2-7 seconds

  console.log(`Payment ${paymentId} initiated`);
  res.status(201).json({
    paymentId,
    status: 'pending'
  });
});


// Check payment status endpoint
app.get('/api/payments/:paymentId', (req: Request, res: any) => {
  const payment = payments.get(req.params.paymentId);

  if (!payment) {
    console.log(`Payment ${req.params.paymentId} not found`);
    return res.status(404).json({
      error: 'Payment not found'
    });
  }

  console.log(`Payment ${req.params.paymentId} status checked: ${payment.status}`);
  res.json({
    paymentId: req.params.paymentId,
    status: payment.status
  });
});

// Update order status endpoint
app.post('/api/orders/:orderId/status', (req: Request<OrderParams>, res: Response): void => {
  console.log(`Order ${req.params.orderId} status update requested`);
  // Simulate order update
  res.status(200).json({
    orderId: req.params.orderId,
    status: 'updated',
    timestamp: new Date()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock Payment API server is running on http://localhost:${PORT}`);
});
