# Fix Infinite API Loop in RentalStore

## Plan Summary
Fix infinite `fetchAdminRentals` calls in ReportsPage.jsx caused by incorrect Zustand usage in useEffect deps.

## Steps
- [ ] 1. Edit client/src/components/admin/ReportsPage.jsx: Fix useRentalStore selectors and useEffect deps
- [ ] 2. Verify fix: Reload /admin/reports page, check no more infinite requests in Network tab
- [ ] 3. Test: Login as admin, confirm rentals load once without errors
- [ ] 4. Complete task

Current: Starting step 1.
