import { mongooseConnect } from '@/lib/mongoose';
import { Review } from '@/models/Review';
import { ObjectId } from 'mongodb';

export default async function handle(req, res) {
  await mongooseConnect();

  if (req.method === 'GET') {
    res.json(await Review.find());
  }

  if (req.method === 'DELETE') {
    if (req.query?.id) {
      await Review.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
