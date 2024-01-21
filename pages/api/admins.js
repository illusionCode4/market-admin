import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from '@/pages/api/auth/[...nextauth]';
import AdminUser from '@/models/AdminUser';

export default async function handle(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  if (req.method === 'POST') {
    const { name, email, password } = req.body;
    if (await AdminUser.findOne({ email })) {
      res.status(400).json({ message: 'admin already exists!' });
    } else {
      res.json(await AdminUser.create({ name, email, password }));
    }
  }

  if (req.method === 'DELETE') {
    const { _id } = req.query;
    await AdminUser.findByIdAndDelete(_id);
    res.json(true);
  }

  if (req.method === 'GET') {
    res.json(await AdminUser.find());
  }
}
