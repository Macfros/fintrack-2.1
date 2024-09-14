
'use server'

import { signIn } from "@/auth"

export async function GoogleButton() {
   return await signIn('google')
  }