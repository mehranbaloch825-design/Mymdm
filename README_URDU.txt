=====================================================
CUSTOM TURNSTILE REMOTE ACCESS SYSTEM - MOBILE GUIDE
=====================================================

Yeh ZIP file aap ke poore system ke custom code par mushtamil hai. Is mein 2 main parts hain:

1. SERVER FOLDER (`/server`):
   - Is mein Node.js server aur Web Dashboard ka code hai (`server.js` aur `package.json`).
   - Is ko aap apne mobile phone se Render.com ya Replit.com par bilkul free deploy kar sakte hain.

2. ANDROID APP FOLDER (`/android-app`):
   - Is mein Android app ka Kotlin code aur GitHub Actions ki build file (`.github/workflows/build.yml`) hai.

-----------------------------------------------------
MOBILE SE APK AUR SERVER SET UP KARNE KA STEP-BY-STEP TARIQA:
-----------------------------------------------------

STEP 1: GITHUB PAR CODE UPLOAD KAREIN
1. Mobile ke Chrome browser par GitHub.com kholain aur free account banayein.
2. Naya Repository banayein (e.g. `turnstile-custom-app`).
3. Is ZIP file ke tamam files ko upload kar dein.

STEP 2: AUTOMATIC APK BUILD (WITHOUT LAPTOP)
1. GitHub par files upload hotay hi "Actions" tab par jayein.
2. GitHub Cloud Compiler khud hi Kotlin code ko `.apk` file mein convert kar dega (2-3 minute lagenge).
3. "Artifacts" section se `.apk` file download karke tablet par install kar lein.

STEP 3: BACKEND SERVER LIVE KAREIN
1. Render.com par free account banayein.
2. "New Web Service" par click karke apni GitHub repository link karein.
3. Root Directory: `server` select karein.
4. Deployment ke baad aap ko Server URL mil jayega (e.g., https://your-server.onrender.com).

STEP 4: TABLET SETTINGS & REMOTE CONTROL
1. Admin Dashboard kholne ke liye apne mobile browser par Render URL kholain.
2. Dashboard par "Restart Tablet Remotely" aur "Open Gate" ke buttons se poora control ghar baith kar milega.

=====================================================
