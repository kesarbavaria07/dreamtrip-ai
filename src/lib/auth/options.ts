import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import fs from "fs";
import path from "path";

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  country: string;
  state: string;
  currency: string;
}

const usersFile = path.join(process.cwd(), "data", "users.json");

export function getUsers(): User[] {
  try {
    if (!fs.existsSync(path.dirname(usersFile))) {
      fs.mkdirSync(path.dirname(usersFile), { recursive: true });
    }
    if (!fs.existsSync(usersFile)) {
      fs.writeFileSync(usersFile, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(usersFile, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveUser(user: User): void {
  const users = getUsers();
  users.push(user);
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

export function findUserByEmail(email: string): User | undefined {
  const users = getUsers();
  return users.find((u) => u.email === email);
}

export function updateUser(email: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const index = users.findIndex((u) => u.email === email);
  if (index === -1) return null;
  users[index] = { ...users[index], ...updates };
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  return users[index];
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        country: { label: "Country", type: "text" },
        state: { label: "State", type: "text" },
        isSignUp: { label: "Is Sign Up", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const { email, password, name, country, state, isSignUp } = credentials;

        if (isSignUp === "true") {
          // Sign up flow
          const existingUser = findUserByEmail(email);
          if (existingUser) {
            throw new Error("User already exists");
          }

          const countryCurrency: Record<string, string> = {
            US: "USD",
            UK: "GBP",
            India: "INR",
            Germany: "EUR",
            France: "EUR",
            Japan: "JPY",
            Australia: "AUD",
            Canada: "CAD",
          };

          const newUser: User = {
            id: `user_${Date.now()}`,
            email,
            password, // In production, hash this!
            name: name || "User",
            country: country || "US",
            state: state || "",
            currency: countryCurrency[country || "US"] || "USD",
          };

          saveUser(newUser);

          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
          };
        } else {
          // Sign in flow
          const user = findUserByEmail(email);
          if (!user || user.password !== password) {
            throw new Error("Invalid email or password");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.userId;
        
        // Get user details for currency info
        const userEmail = (session.user as any).email;
        if (userEmail) {
          const userData = findUserByEmail(userEmail);
          if (userData) {
            (session.user as any).country = userData.country;
            (session.user as any).state = userData.state;
            (session.user as any).currency = userData.currency;
          }
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "dreamtrip-secret-key-change-in-production",
};