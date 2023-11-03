import { mergeAnonymousCartWithUserCart } from "@/lib/db/carts";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';

export const authOptions:NextAuthOptions = {
   adapter: PrismaAdapter(prisma) as Adapter,
   providers:[
      GoogleProvider({
         clientId: env.GOOGLE_CLIENT_ID,
         clientSecret: env.GOOGLE_CLIENT_SECRET
      })
   ],
   callbacks:{
      //session is the returning session when signing, and user contains the user data
      session({session,user}){
         //when creating a cart with a defined session, we need to ad a user.id to session.
         session.user.id = user.id;
         return session;
      }
   },
   //events are actions that happen when a certain event is called, like default signIn
   events:{
      //signIn returns the user data, for the merge function to look for a cart with that id and merge with anonymous one
      async signIn({user}){
         await mergeAnonymousCartWithUserCart(user.id)
      }
   }
} 

const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};