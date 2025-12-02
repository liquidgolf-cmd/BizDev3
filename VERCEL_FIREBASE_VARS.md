# Firebase Environment Variables for Vercel

## ✅ All Values Ready - Copy and Paste to Vercel

Add these to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

**Important:** Add each variable to **Production**, **Preview**, and **Development** environments.

---

## Client Configuration (Public - 6 variables)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDbaD62JILOdWhBUJ72YMBQ2WLOVy7Dqw4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bizdev3-b9f88.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bizdev3-b9f88
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bizdev3-b9f88.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=289663375388
NEXT_PUBLIC_FIREBASE_APP_ID=1:289663375388:web:b45f2b69ce99341fcee7d9
```

---

## Admin Configuration (Server-side - 3 variables)

```env
FIREBASE_ADMIN_PROJECT_ID=bizdev3-b9f88
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-fbsvc@bizdev3-b9f88.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC6cf0/5My603mM\nuCTJsOJRPawfDF0HrUu+SyvPmSl9jNA2pW8dnPHIGHWOIcQrS2mLnkgiFmPoTe9S\neikgBlDxypBvftItrzPyUTzQ95CJS6ZRF1zHIJNnnsr+AG/JCIgjU/EDU+7uowvM\njthTkQLyVpgZ1vF6J0ZP+jUjDPHHBGjlQjGvNjfEKties2bMKFX+IWZCpoBpo4Cj\nYZRigOY3Ej95g7uzqdN3QhDzhxKaoncXyLh/4mqHpDkODWjEbSSPDB0q96BwXaO1\nWiWRIeoiYvpTnAA+458oIZKIPL51LhYJYf8siGa3GBIlRn5JyBN0sNjT5mRve44x\n8K5KmF5pAgMBAAECggEAEzTfbRfVlFBpNtsYZROc+NgE1Wz5X2tVgGyvfnMNgGLD\nZ0G7FN6gVKfaYlItqnUaEhkz3pkWYS24H/O4LVWhPItMvkOfBLhF/moqfO9n2xDp\nOPTSaKv9K2FDEY/7dAb2OUdyLlDU7g3rTv8PH2qylkLf59eJ6DbICkCg/TOd642m\nDG8J7mtpIN/GO6VuNZROR8VDBfxarmDIqSy0V7dZnpcMjZC3exqzOpQ3yPZ2DAOx\n+AtUUvx0DwreB1D/8SXSrOEWvlJJvg3zu2Vooq+yLE9fPmE3GDDC6LfS4jNZOMZh\nyCTgJWFBqwlZId74w0t7SPx8+oAUwuKoE4D5w5NswQKBgQD61bABE3ptDz1brHv1\nf9+b7NijvHF3iN7wWX5a4XcfBIhMUvQ7I1aFpwz8ONdJ8egfJjVWjQ2n/h2wmwhe\nRN38AUwmVLE7tYuAyp5ZAA0J8ztoWzwOnTDItzCNx6m6DgjtuC0zZDTLQo5cWV+7\nOomDxGuyRv/9WTonymbhsHWr4QKBgQC+SNz7BWGx1xFfzvlnOuqqMhBCT6Cm1HIM\n9URmkG95Lnmjpjkouz4kXemNOoo0sOPnPVX6WgRRaAR6Wv86yEvs6LnrxKHLaSBt\nlcLvpcg8ypn1w2J51wSdkEg3/T7GGPPSpd+IqnWs8ZWZzdTSPGfv7/uDbuT4hrKW\n4x0weBPDiQKBgBJwtzm9BtkRr78XlR1dQ0EhTmPrLKRPCaS9z4462RkMqkCCMLZQ\nSMIWn9vDCgDDqf7wPieYwxJAmkore5gClBc8uS5wN39eP10+iBme6VZ77TgkzOt+\nHuICpa0mqpGlCn7/dUM78K2ovPKJF4KaMRXg0NIQai1j6+SU+q9I273BAoGALs6L\nlS/gtTdbLb8i+HK0sML53uXpdcBCgc9/UN9snFmDUG8eFlfg1F9JiRUCVC3DEemz\nkY69Cy1UFKj3qYUFsDQbL9TBm+CzOmGhfwO/urx3nM3AFop+tyd7rFIeM+qFZ6an\n0t1jbvRKQXgxRrnXM11L+Cu6JSw1GAqr7nVLH0kCgYA3mfvTabn8umvKyRqwiAtS\np9LER6UWam1qyacpWXmCy+nq1O/+RgjeCqabSg6FwS05oXLUi3HktmFB+/u0syZH\nTQuJsz6QhYwxTM6LY/PpAeM6wTZ1r6uHONkmVh+2WYmRhgcwSEI1kael4C/d/idd\nG4ZoFDokxzynDIztEhFVrw==\n-----END PRIVATE KEY-----\n
```

**⚠️ Important for FIREBASE_ADMIN_PRIVATE_KEY:**
- Copy the ENTIRE value above (from `-----BEGIN PRIVATE KEY-----` to `-----END PRIVATE KEY-----`)
- Vercel will handle the `\n` newline characters automatically
- Make sure there are no extra spaces before or after

---

## Step-by-Step Instructions

1. **Go to Vercel Dashboard:**
   - Visit [vercel.com](https://vercel.com)
   - Select your **BizDev3** project

2. **Navigate to Environment Variables:**
   - Click **Settings** → **Environment Variables**

3. **Add Each Variable:**
   - Click **Add New**
   - Paste the variable name (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - Paste the value
   - Select **Production**, **Preview**, and **Development**
   - Click **Save**
   - Repeat for all 9 variables

4. **Verify:**
   - You should have 9 total Firebase variables
   - All should be enabled for all 3 environments

5. **Redeploy:**
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment
   - Click **"Redeploy"**

---

## Quick Checklist

- [ ] Added `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] Added `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] Added `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] Added `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] Added `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] Added `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] Added `FIREBASE_ADMIN_PROJECT_ID`
- [ ] Added `FIREBASE_ADMIN_CLIENT_EMAIL`
- [ ] Added `FIREBASE_ADMIN_PRIVATE_KEY` (full key with BEGIN/END)
- [ ] All variables added to Production, Preview, and Development
- [ ] Redeployed after adding variables

---

## After Adding Variables

1. Test email signup - should work now
2. Test Google sign-in - should work if OAuth is configured
3. Check Vercel function logs if there are any errors
