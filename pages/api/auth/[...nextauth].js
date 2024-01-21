import NextAuth, { getServerSession } from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';
import { mongooseConnect } from '@/lib/mongoose';
import AdminUser from '@/models/AdminUser';

const adminEmails = ['illusion3306@gmail.com'];

mongooseConnect();
async function isAdminEmail(email) {
  // return true;
  return !!(await AdminUser.findOne({ email }));
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Sign in with Email',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null;
        // login
        const { email, password } = credentials;
        const user = await AdminUser.findOne({ email });
        if (!user) {
          throw new Error('Invalid credentials');
        }
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          throw new Error('Invalid credentials');
        }
        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user._id.toString(); // Convert ObjectID to string
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user = { id: token.id, name: token.name, email: token.email };
      }
      return session;
    },
  },
};

// {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_ID,
//       clientSecret: process.env.GOOGLE_SECRET,
//     }),
//   ],
//   adapter: MongoDBAdapter(clientPromise),
//   callbacks: {
//     session: async ({ session, token, user }) => {
//       if (await isAdminEmail(session?.user?.email)) {
//         return session;
//       } else {
//         return false;
//       }
//     },
//   },
// };

export default NextAuth(authOptions);

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!(await isAdminEmail(session?.user?.email))) {
    res.status(401);
    res.end();
    throw 'not an admin';
  }
}
