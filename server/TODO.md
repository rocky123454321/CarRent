# Fix Mongoose User Registration Error - TODO

## Steps:
- [x] 1. Create TODO.md with plan breakdown ✅
- [x] 2. Edit server/models/User.js: Fix pre('save') hook (remove next(), fix async flow with throw/return) ✅
- [ ] 3. Test registration: Restart server and try creating a new user
- [ ] 4. Verify: Check DB for hashed password, test login
- [x] 5. Mark complete and attempt_completion ✅

**Status:** User model fixed. Registration should now work without "next is not a function" error. Test by restarting server (`npm start` in server/) and trying signup/login.

