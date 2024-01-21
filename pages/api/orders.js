import { mongooseConnect } from '@/lib/mongoose';
import { Order } from '@/models/Order';

export default async function handler(req, res) {
  await mongooseConnect();

  if (req.method === 'GET') {
    res.json(await Order.find().sort({ createdAt: -1 }));
  }

  if (req.method === 'POST') {
    const { selectedOrderId, trackingNumber } = req.body;
    const data = await Order.findOneAndUpdate(
      { _id: selectedOrderId },
      { $set: { deliver: trackingNumber, delivered: true } },
      { new: true }
    );
    res.json(data);
  }
}
