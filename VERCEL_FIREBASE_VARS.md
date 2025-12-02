# Firebase Environment Variables for Vercel

## ⚠️ IMPORTANT: Project Mismatch Detected

Your Firebase client config is for project: **bizdev3-b9f88**
But your Firebase Admin credentials are for project: **finishline-mvp**

**You need to generate NEW Firebase Admin credentials for the `bizdev3-b9f88` project.**

## How to Fix:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **bizdev3-b9f88**
3. Go to Project Settings → Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Extract the values from that NEW file

## Current Values (Client Config - Correct)

These are correct for your `bizdev3-b9f88` project:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDbaD62JILOdWhBUJ72YMBQ2WLOVy7Dqw4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bizdev3-b9f88.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bizdev3-b9f88
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bizdev3-b9f88.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=289663375388
NEXT_PUBLIC_FIREBASE_APP_ID=1:289663375388:web:b45f2b69ce99341fcee7d9
```

## Admin Credentials (WRONG PROJECT - Need to Regenerate)

These are from `finishline-mvp` project - **DO NOT USE THESE**:

```env
FIREBASE_ADMIN_PROJECT_ID=finishline-mvp  ❌ WRONG
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@finishline-mvp.iam.gserviceaccount.com  ❌ WRONG
FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCJeOk1TtgcnufM\nCQWz6Mqygt/cHiqQupUJw7VGFHK//JqkWMW8o20iA0f/0Eey0qHRPx1XAgfKgOhi\nzTU/Ljyh7RUDftZvvIFfzUunNbkm88Mr6I52QwEqggrxQyKM0FxP+x4EN9UjCE1T\napElrpkPH2x2Zz7+WS3CDWPQOVuHoGdAG5z0RX3CoEaSjy1R5ytg13PisI3NUPX4\nlsitfjqSfWibYkwBTIqpYiVSEQhO9/BNfBN+2WstpDXXVrgQyv6qt75eAF6nfPYK\nyO8g+2MsGrQuc2On1fgzxZbMNeGxwxsdmsYtw1Cm4TlroCXI6J1+gLttcG8g/P9l\nc3ByjsGZAgMBAAECggEAAirqR3VHrlTZnBOg18RCDPRIFhsSKf/NKY8g0LryD8Gq\niRCexpGPnxeM5zVYKhNM6qUbf/OX3psvft5UOnuuyFFaEVjqxe6Dnjh5Gsj7s0fo\n8gxr0aTPFAXiqQj5Vp3S9M5le+TK+y9Oc9Qkd4MEJhNFZS0N1toeYPbP1fjPjwkE\nKLHuzzpvEzdUrsYhRk+nZxGnRX8XvFV+k2bmPZSBCEwtu8N1fQi5NG/1e2w7r/pS\nf7mvi47mIk0uaY+4yW6qJMe8Gw81L/sHnASEkjTZm6UEqO54LcXhdbsilWafOwBl\nhkeX3vZUhnOkZq4J0LZAZs6DpmAKWSBkNTporr+wgQKBgQDAuFQspXQmVxpGl+yp\nx1aNpAR6lC5hMiOAmj9MOQbndk73iKYxYbBFVbNRN70g3Qg//Wh8AiyAfmS15NCn\n7x1EpWaU1DvHz/PFTrSIi9sQbLGwRvDf1+MBDuh/Jx45h68SLO9eKQqc5MD+kg8S\n3emDu7BgLPa9CDi4tBhao2XlGQKBgQC2nJDX+YmkDk6AhqZXdaY1cvxyUUxT86dd\nbRaDnQCqBS7WKYJptrCeWMB36fd5Bzktj3sralttYBzLma207ZLz6SrqervDukfc\nF24mjNjGUOP4Pg9ilk5CRaI1hMY+kakh0xE/r7MZsS09xhqQ+4QaxLlEJbRCi4f2\npU/V4uLQgQKBgC/vaVh1iu9iaPG4JjCQmXG/ozGOG/8nBnedZjMiWBpIbhnZzmSo\nBL0qNOD1uUAsWjn4YP2/WKxZQ9mOYWvz6NbDQUGxjHEFw3+HNRZlmwZ50rSi4JT8\n0MTZnXDLHRR4ME6YCK3mDXK631oyoDc0JToT/Cnf5TtdiSY//XLGA7k5AoGBAIuZ\nHNE+Hg6gMTrntHnfonPxtzLdG3CCL0uofTGX8E4JMEjf6qZN1q72Qgxpe5m1/+vo\nZ8xEvifa9ahfjv9lLpXvhbNCqA90dEK4Vqh5u62/YMcBClnfdWwMN3iaS8LBL36A\nEAuTkWLuoxs6OkzjOZYNFWQXProwWHwg2+sySxoBAoGAdq9Ie9Er03q0czpBE+a6\nrUG7BEWe6WSFnCV+r9po4tJfVSPcop/cnQLPOYN6a7sxy4zhHCpQmCQF8j6kte7V\nmIqT0W54nVKishL3XKcF+dUdB4YqixxFk/0fJgkpxeQGaqgznBdUXMz5XLrpxYF+\nsSzrq0DG5GFS0BzVmSGXc3w=\n-----END PRIVATE KEY-----\n  ❌ WRONG PROJECT
```

## Steps to Add to Vercel:

1. **First, get the correct Admin credentials:**
   - Go to Firebase Console → Select `bizdev3-b9f88` project
   - Project Settings → Service Accounts → Generate new private key
   - Download the JSON file

2. **Add to Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add each variable below for **Production**, **Preview**, and **Development**

3. **Copy these 6 Client variables (these are correct):**

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDbaD62JILOdWhBUJ72YMBQ2WLOVy7Dqw4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bizdev3-b9f88.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bizdev3-b9f88
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bizdev3-b9f88.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=289663375388
NEXT_PUBLIC_FIREBASE_APP_ID=1:289663375388:web:b45f2b69ce99341fcee7d9
```

4. **After you get the NEW admin credentials, add these 3 Admin variables:**

```
FIREBASE_ADMIN_PROJECT_ID=bizdev3-b9f88
FIREBASE_ADMIN_PRIVATE_KEY=[Full key from new JSON file]
FIREBASE_ADMIN_CLIENT_EMAIL=[Email from new JSON file]
```

**Important:** For `FIREBASE_ADMIN_PRIVATE_KEY`, copy the ENTIRE value from the JSON file's `private_key` field, including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`.

