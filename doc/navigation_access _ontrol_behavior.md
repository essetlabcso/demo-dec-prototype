Update the top navigation and access control behavior as follows:

## 1. Add dropdown to “Sign In”
- Add a small dropdown arrow next to the **“Sign In”** button in the top navigation bar.
- On click, open a dropdown menu with 3 options:
  1. Staff Sign In
  2. Member Sign In
  3. Public Access

## 2. Define behavior for each option

### Staff Sign In
- Route to: /staff/sign-in
- This opens the **DEC Staff / Course Creator sign-in page**
- Use **simulated credentials only** (frontend-only, no backend)

Define at least one valid simulated user:
- Email: staff@dec.local
- Password: admin123
- Role: content_admin

Only when this exact credential is used:
- Grant access to the full **Staff Workspace**
- Enable all staff routes:
  /staff/cms, /modules, /authoring, /preview, /publish, etc.

If incorrect credentials:
- Show inline error message
- Do not allow access

### Member Sign In
- Route to a simple member sign-in page (frontend only)
- After sign-in, allow access to learner-side features (courses, progress, etc.)
- Do not show any staff pages

### Public Access
- No sign-in required
- Allow browsing:
  - Landing page
  - Catalog page
  - Course preview pages
- Restrict deeper learner features if needed (optional UI-only)

## 3. Staff page protection (critical)
All **DEC Staff / Course Creator pages must be hidden and protected**:

- Do NOT show staff navigation links unless:
  - user is signed in as staff
  - AND simulated role is valid

- If a non-staff user tries to access a staff route:
  → redirect to landing page or staff sign-in page

## 4. Implementation rules
- Frontend only (no backend, no real auth)
- Use local state or localStorage to simulate session
- Store:
  - user role
  - login state
- Use route guards or conditional rendering to protect staff pages

## 5. UI/UX requirements
- Dropdown should be:
  - clean
  - aligned with DEC design
  - smooth open/close animation
  - keyboard accessible

- Show current user state in navbar:
  Example:
  - “Signed in as Staff”
  - or “Guest”

## 6. Final expected behavior
- User clicks “Sign In” → selects role
- Only staff login unlocks staff workspace
- Staff pages remain completely hidden otherwise
- No backend introduced
- All logic simulated locally


