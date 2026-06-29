# Current Status — Read This First

Branch: development
Last updated: June 2026

## What's Already Built and Working
- Next.js 16 + TypeScript + Tailwind scaffolded
- PostgreSQL running locally, Prisma 7 connected with PrismaPg adapter
- Auth.js with JWT, Credentials provider, bcrypt passwords
- Role-based route protection via proxy.ts
- Customer login (/login) and admin login (/admin/login)
- Customer registration (/register) with API route
- Customer portal (/portal) — reads session, displays jobs with status tracker
- Stripe payment flow working end to end
- Twilio SMS helper + job status update API route (PATCH /api/jobs/[id]/status)
- Job model in DB with test data seeded

## Critical Technical Notes
- Prisma 7 requires PrismaPg driver adapter — see lib/db.ts
- proxy.ts not middleware.ts (Next.js 16 convention)
- Generated Prisma client at app/generated/prisma/client
- Test credentials: test@autobody.com / password123
- DB: autobody_db, user: autobody_dev

## What Needs to Be Built Next
See full spec below — focus on:
1. Admin dashboard and job board
2. All remaining customer portal pages
3. All public facing pages
4. Email verification on registration
5. Webhook handler for Stripe
6. Wire Twilio SMS into admin job status updates
