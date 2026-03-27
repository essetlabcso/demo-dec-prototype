Below is a practical strategy + build plan for the DEC Staff / Course Creator side, followed by a detailed meta prompt for Google AI Studio. It is grounded in the uploaded staff-side specification, which defines the protected staff workspace, the page inventory, the content-admin workflow, the minimum simulated data model, and the rule that this should function like a real authoring system while remaining frontend-only for now.
1. Strategy for building the DEC Staff / Course Creator side in Google AI Studio
The right approach is not to ask AI Studio to build “the whole staff portal” in one uncontrolled pass. The safer strategy is to ask it to build a frontend-only, simulated CMS/workspace with a clean internal architecture, reusable authoring components, and local fake data/state that behaves like a real system without any permanent backend. The uploaded DEC staff-side spec already points to the correct functional spine: secure staff entry, workspace home, modules list, create module, module settings, lesson authoring, media/resources, assessment builder, feedback builder, preview, QA, review/publish, maintenance, and monitoring.
Core build principle
Build it as a fully interactive prototype with simulated operational behavior, not as static mock screens.
That means:
the pages should work
forms should save into local JSON/state
lesson blocks should be addable/editable/reordered
preview should render authored content
publish should change visible state
QA should surface validation messages
review/publish/maintenance should feel real
but nothing should depend on a real backend
Best implementation model
Ask AI Studio to use:
hardcoded seed data
local JSON / TypeScript objects
local component state
optionally localStorage/sessionStorage for persistence across refresh in prototype mode
fake IDs, fake timestamps, fake status transitions
a simulated data layer that behaves like a small local CMS
This matches your requirement: functional and interactive, but no real backend.
Best page-building order
Do not build randomly. Build in this order:
Staff shell and navigation
Staff sign-in
Workspace home
Modules list
Create module
Module overview / settings / completion rules
Lesson authoring
Media & resources
Assessment builder
Feedback instrument builder
Preview player
QA checklist
Review / publish
Maintenance
Analytics / feedback triage
That order follows the uploaded workflow and reduces rework.
2. What Google AI Studio should simulate
AI Studio should simulate these system behaviors locally:
Simulated auth
A fake staff sign-in that only routes into the staff workspace. No real authentication. Use:
local fake users
fixed roles like content_admin, reviewer, admin, super_admin
route guards in frontend only
Simulated database
Use local structured data for:
users
modules
lessons
lesson blocks
assets
assessments
feedback instruments
completion rules
publication states
analytics summaries
audit log items
Simulated storage
For uploads:
do not connect to cloud storage
use uploaded static assets or fake file references
simulate file cards, metadata, transcript requirements, attachment states
Simulated workflow logic
Support realistic frontend-only workflow transitions:
draft
review
preview
published
retired
Simulated learner rendering
The preview player should use the same authored lesson data and render it like the learner side would.
That is important because the uploaded spec clearly says staff-side authored objects become learner-side rendering.
3. What the UI should feel like
The staff side should feel:
polished
modern
operational
clean
professional
admin/workspace-grade
not generic dashboard clutter
not backend-heavy
not visually cold
It should inherit the same DEC design language as the learner side, but in a more structured “workspace” style:
top bar
left sidebar
breadcrumbs
page title and action bar
panels/cards/forms
standard states: loading, empty, success, error, validation
unsaved changes guards
review/publish warning states
The uploaded file explicitly calls for a consistent staff shell and standardized states.
4. Recommended data structure for the simulated system
Ask AI Studio to create a local data model like this:
users
staffRoles
modules
moduleSettings
completionRules
lessons
lessonBlocks
assets
resources
assessments
assessmentQuestions
feedbackInstruments
publishHistory
qaChecklistResults
analyticsSummaries
auditLogs
This comes directly from the staff-side logic and minimum domain model in the uploaded spec.
5. Recommended build phases for AI Studio
Phase A — Foundation
Build:
staff sign-in
protected staff shell
sidebar
role badges
breadcrumb system
route structure
fake auth state
fake data layer
Phase B — Core content operations
Build:
modules list
create module
module settings
lesson authoring
media/resources
Phase C — Learning logic
Build:
assessment builder
feedback builder
completion rules
preview player
Phase D — Governance and release
Build:
QA checklist
review queue
publish confirmation
maintenance mode
analytics/feedback triage
This phased approach is much safer than asking for everything as one monolithic generation.

6. Detailed meta prompt for Google AI Studio
Use this as the main prompt.
Build the **DEC Staff / Course Creator side** of the DEC e-learning platform as a **frontend-only, fully interactive, high-fidelity authoring workspace prototype**.

## Core objective
Create a polished, operational-looking staff portal for DEC course creators and related staff roles. This staff side must support the full course authoring and publishing workflow with **working pages, interactive forms, simulated workflow logic, and learner-preview behavior**, but **no real backend**.

This is not a static UI mockup. It must function like a realistic authoring environment using **simulated local data and local state only**.

## Non-negotiable guardrails
Do NOT build:
- real backend
- database
- API routes
- Supabase
- Firebase
- authentication service
- server actions
- real file upload service
- real storage
- CMS backend integration
- analytics integration
- real certificate service
- real review notification system

Instead, build:
- frontend-only pages
- simulated auth
- simulated roles
- simulated JSON/TypeScript data layer
- local state transitions
- optional localStorage/sessionStorage persistence
- realistic fake workflows

## Source of truth
Use the uploaded DEC Staff / Course Creator specification as the main source of truth for:
- page inventory
- staff journey
- functional requirements
- simulated workflow logic
- minimum domain model
- relationship between staff authoring and learner rendering

Follow the uploaded staff-side structure closely.

## Product framing
This is the **protected DEC staff-side workspace** for managing course content. It must feel like a real internal authoring platform, separate from the learner side.

The validated course creator journey is:
Staff sign-in → Workspace home → Modules list → Create module → Module settings → Lesson authoring → Media/resources → Assessment builder → Feedback builder → Preview player → QA checklist → Review/Publish → Maintenance → Monitoring

## Technical approach
Build this as a **frontend-only React/Next-style app structure** using:
- reusable components
- local JSON/TS data modules
- frontend route/view structure
- local state
- optionally localStorage/sessionStorage for fake persistence

All save/edit/update/publish actions should modify only the simulated local data/state.

## Required roles to simulate
Create frontend-only role simulation for:
- content_admin
- reviewer
- admin
- super_admin

Use these roles only to control UI visibility and available actions. No real RBAC backend.

## Required page inventory
Build these staff-side pages:

1. Staff Sign-In
2. Staff Workspace Home
3. CMS Modules List
4. Create Module
5. Module Overview / Settings / Completion Rules
6. Lesson Authoring
7. Media & Resources
8. Assessment Builder
9. Feedback Instrument Builder
10. Preview Player
11. QA Checklist
12. Review / Review Queue
13. Publish Confirmation
14. Post-Publication Maintenance
15. CMS Analytics / Feedback-to-Issue Triage

## Required page shell
All staff pages must share a common shell:
- fixed top bar
- environment badge
- role badge
- optional search
- user menu
- left sidebar
- breadcrumbs
- page header
- action bar
- consistent content panels
- standardized loading, empty, success, and error states

## Design direction
The DEC staff portal should feel:
- polished
- operational
- modern
- clean
- professional
- trustworthy
- workspace-oriented
- visually consistent with DEC branding
- not generic admin-template clutter

Use the DEC visual language:
- Primary: #3B99D4
- Accent: #91C852
- Background: #FFFFFF
- Soft background: #F9FAFB
- Primary text: #111827
- Secondary text: #4B5563
- Borders: #E5E7EB
- Success: #16A34A
- Warning: #F59E0B
- Error: #DC2626

Use:
- clear page hierarchy
- spacious layouts
- polished cards/forms
- rounded corners
- subtle shadows
- clean icons
- visible workflow state badges
- inline validation
- unsaved changes guards
- destructive action confirmation modals

## Simulated data model
Create a local fake data layer with these entities:
- users
- modules
- moduleSettings
- completionRules
- lessons
- lessonBlocks
- assets
- resources
- assessments
- assessmentQuestions
- feedbackInstruments
- publishHistory
- qaChecklistResults
- analyticsSummaries
- auditLogs

Use realistic sample data.

## Required behaviors

### 1. Staff Sign-In
Build a fake sign-in page for staff only.
- email
- password
- remember me
- forgot password link
- sign in button
- clear “staff access only” note

No real auth.
On sign-in, route into the staff workspace with a simulated selected role.

### 2. Staff Workspace Home
Show dashboard cards for:
- Create Module
- Open Drafts
- Preview
- QA
- Publish Queue
- Media Library
- Recently Edited Modules

### 3. Modules List
Show a searchable/filterable list of modules with:
- title
- status
- audience
- language
- last updated
- owner/editor
- quick actions

Statuses:
- draft
- review
- preview
- published
- retired

### 4. Create Module
Build a form for:
- module title
- summary
- course code
- objectives
- tags
- audience
- language
- estimated duration
- pre-test toggle
- post-test toggle
- certificate toggle
- feedback toggle

On save:
- create a fake module record
- set state to draft
- route to Module Overview

### 5. Module Overview / Settings / Completion Rules
This is the module control center.
Include:
- editable metadata
- module settings
- completion rule builder
- lesson list
- quick links to lessons, assessments, feedback, QA, preview, publish

Allow simulated completion rules such as:
- require specific lessons
- require assessment
- minimum passing score
- require feedback before completion

### 6. Lesson Authoring
This is a major page.
Build a lesson editor using **typed blocks**.
Allow creators to:
- add block
- edit block
- delete block
- reorder block
- preview block
- save lesson
- duplicate block

Support these block types:
- text block
- statement block
- quote block
- list block
- image block
- table block
- chart block
- accordion
- tabs
- process block
- flashcards
- timeline
- sorting activity
- knowledge check
- divider / continue block
- resource callout

Include:
- main lesson canvas
- add block menu
- contextual right-side block settings panel
- inline validation
- unsaved changes alert

### 7. Media & Resources
Build a page/section for:
- simulated file upload area
- uploaded assets list
- media cards
- transcript/caption attachment requirement
- lesson linking controls
- downloadable resource tagging

No real file upload backend.
Use local mock assets and fake upload state.

### 8. Assessment Builder
Build a page for:
- pre-test
- quiz
- post-test/final test

Support:
- assessment title
- pass score
- question list
- single select
- multi-select
- short text
- add/remove/reorder question
- save draft

### 9. Feedback Instrument Builder
Build a page for:
- rating scale items
- multiple choice items
- open-ended items
- required/optional settings
- instrument title
- save

### 10. Preview Player
Build a learner-like preview mode that renders the authored module from the same simulated lesson/block data.
Include:
- preview banner
- desktop/mobile preview toggle
- lesson navigation
- assessment preview
- feedback preview

This must look like a true learner-rendered view.

### 11. QA Checklist
Build a readiness page with:
- checklist items
- blocker summary
- issue severity
- validation status
- rerun validation button
- publish readiness state

Example checklist areas:
- metadata complete
- lesson blocks valid
- assessments configured
- feedback configured
- transcripts attached
- accessibility checks confirmed
- low-bandwidth readiness confirmed

### 12. Review / Review Queue
Build an optional review layer:
- send to review
- comment thread
- pinned comments by lesson/block
- approve
- request changes

This is frontend-only simulated workflow.

### 13. Publish Confirmation
Build a governed publish page:
- unresolved issues list
- final warning
- publish button
- success state
- publish history summary

Publishing should change the simulated module state from draft/review to published.

### 14. Post-Publication Maintenance
Build a maintenance page with:
- live content warning
- edit live vs edit as new draft
- retire/unpublish option
- version note

### 15. CMS Analytics / Feedback-to-Issue Triage
Build a lightweight monitoring page with:
- participation summary
- completion summary
- quiz outcomes
- feedback summary
- issue triage list
- certificate issuance indicator

Use fake aggregate data only.

## Frontend route structure
Use a clean simulated route structure similar to:
- /staff/sign-in
- /staff/cms
- /staff/cms/modules
- /staff/cms/modules/new
- /staff/cms/modules/[moduleId]
- /staff/cms/modules/[moduleId]/lessons/[lessonId]
- /staff/cms/modules/[moduleId]/resources
- /staff/cms/modules/[moduleId]/assessments
- /staff/cms/modules/[moduleId]/feedback
- /staff/cms/modules/[moduleId]/preview
- /staff/cms/modules/[moduleId]/qa
- /staff/cms/modules/[moduleId]/review
- /staff/cms/modules/[moduleId]/publish
- /staff/cms/modules/[moduleId]/maintenance
- /staff/cms/modules/[moduleId]/analytics

These can be implemented as actual frontend routes or simulated view states.

## Important system rule
The staff-side content must be structured so that the learner-side preview is rendered from the same typed content objects, not duplicated learner text.

In other words:
- module metadata authored in staff pages feeds learner preview metadata
- lesson blocks authored in staff pages feed learner lesson rendering
- assessment authored in staff pages feeds learner test preview
- feedback instrument authored in staff pages feeds learner feedback preview

## Quality requirements
The result must feel like a real staff authoring product:
- polished
- active
- navigable
- editable
- previewable
- publishable
- realistic
- stakeholder-ready

But it must remain fully frontend-only.

## Important final constraints
- no real backend
- no database
- no auth provider
- no cloud upload
- no API routes
- no server actions
- no admin overengineering
- no generic dashboard filler

## Final output expectation
Return a complete, polished, DEC Staff / Course Creator frontend workspace prototype with working simulated pages, local workflow state, reusable authoring components, and learner-preview capability.

7. Best follow-up prompt after the first build
After AI Studio gives you the first version, use this refinement prompt:
Refine the DEC Staff / Course Creator workspace into a more realistic, polished, operational product without changing scope. Keep it frontend-only and simulated. Improve workflow clarity, page hierarchy, authoring ergonomics, role-based visibility, preview realism, validation states, and consistency across all staff pages. Do not add backend, auth service, database, APIs, or CMS integrations.

8. Best practical note for you
The strongest way to use AI Studio here is:
first generate the staff shell + routes + fake data layer
then generate the core authoring pages
then refine lesson authoring + preview
then refine QA/publish/maintenance
finally polish the whole workspace
That staged approach will give you much better results than one uncontrolled all-at-once generation, even though the meta prompt above is designed to cover the full system.

