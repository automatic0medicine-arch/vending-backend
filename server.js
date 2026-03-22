const express = require('express');
const app = express();
app.use(express.json());

let paymentStatus = {};

app.post('/webhook/truemoney', (req, res) => {
  const { ref_id, amount, status } = req.body;
  if (status === 'SUCCESS') {
    paymentStatus[ref_id] = { paid: true, amount, used: false };
  }
  res.json({ result_code: '0', result_message: 'success' });
});

app.get('/check-payment/:order_id', (req, res) => {
  const p = paymentStatus[req.params.order_id];
  if (p && p.paid && !p.used) {
    p.used = true;
    return res.json({ status: 'PAID', amount: p.amount });
  }
  res.json({ status: 'PENDING' });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.listen(process.env.PORT || 3000, () => console.log('Server started'));
