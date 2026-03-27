Phase by phase building DEC Staff / Course Creator side step by step, using the two uploaded files as the source of truth: the staff-side strategy/build plan and the top navigation + staff access-control update. The phasing follows the recommended build order, simulated local-data approach, protected staff access model, and page inventory defined in those files.
How to use this prompt pack
Each phase assumes the previous one already exists and should be extended, not rebuilt. K
Remember this is a frontend-only, simulated workspace with no real backend, and that staff pages must remain hidden unless the simulated staff sign-in succeeds.

Phase 1 prompt — foundation, sign-in, access control, and protected staff shell
Build Phase 1 of the DEC Staff / Course Creator side inside the existing DEC e-learning app.

## Goal of this phase
Create the protected staff foundation only:
- top navigation sign-in dropdown
- simulated sign-in behavior
- protected staff routes
- common staff shell
- fake staff auth state
- fake role handling
- starter local data layer
- empty but working staff workspace entry

Use the uploaded documents as the source of truth for:
- staff-side build approach
- required access-control behavior
- frontend-only simulation rules
- role-based staff workspace visibility

## Critical constraints
Do NOT build:
- backend
- database
- API routes
- Supabase
- Firebase
- real auth
- server actions
- real file upload
- CMS integration

Everything must be frontend-only and simulated with:
- local state
- local JSON / TypeScript seed data
- optional localStorage/sessionStorage

## Required top nav update
Update the existing top navigation:
- add a dropdown arrow next to “Sign In”
- dropdown options:
  1. Staff Sign In
  2. Member Sign In
  3. Public Access

Behavior:
- Staff Sign In → route to /staff/sign-in
- Member Sign In → route to a simple learner/member sign-in page
- Public Access → browse landing, catalog, and course preview pages without signing in

## Required simulated staff credential
Create at least this valid simulated staff user:
- email: staff@dec.local
- password: admin123
- role: content_admin

Only this valid staff sign-in unlocks the DEC Staff / Course Creator workspace.

If invalid credentials:
- show inline error
- remain on sign-in page
- do not show staff pages

## Required protection behavior
All DEC Staff / Course Creator pages must remain hidden unless:
- login state is staff-authenticated
- simulated role is valid

If non-staff tries to access staff routes:
- redirect to landing page or /staff/sign-in

## Build in this phase
1. Staff sign-in page
2. fake member sign-in page
3. route protection logic
4. staff shell with:
   - fixed top bar
   - left sidebar
   - breadcrumbs
   - page header area
   - role badge
   - environment badge
5. starter workspace home route
6. starter local fake data layer for:
   - users
   - roles
   - modules
   - lessons
   - audit logs

## UI requirements
The staff side should feel:
- polished
- operational
- modern
- clean
- workspace-oriented
- aligned with DEC design
- not generic dashboard clutter

Use DEC colors:
- #3B99D4
- #91C852
- #FFFFFF
- #F9FAFB
- #111827
- #4B5563
- #E5E7EB
- #16A34A
- #F59E0B
- #DC2626

## Deliver only Phase 1
Do not build full authoring pages yet.
Do not build full modules list, lesson editor, assessment builder, or publish pages yet.
Just create the protected access foundation and working staff shell.

## Final check before finishing
Confirm that:
- staff pages are hidden unless valid staff login is used
- sign-in dropdown is added in the top nav
- frontend-only simulation is preserved
- no backend/auth/database was introduced


Phase 2 prompt — workspace home, modules list, and create module
Extend the existing app by building Phase 2 of the DEC Staff / Course Creator side. Do not rebuild Phase 1. Keep all previous staff access-control behavior intact.

## Goal of this phase
Build the first usable content operations layer:
- staff workspace home
- modules list
- create module
- module draft creation flow

Use the uploaded documents as the source of truth.

## Keep fixed
- frontend-only
- simulated local data
- protected staff access
- no backend
- no database
- no API
- no real auth

## Build in this phase
1. Staff Workspace Home
2. CMS Modules List
3. Create Module page
4. draft module creation flow
5. module status badges and filters

## Staff Workspace Home requirements
Create a polished internal dashboard with action cards for:
- Create Module
- Open Drafts
- Preview
- QA
- Publish Queue
- Media Library
- Recently Edited Modules

This should feel like a real internal workspace, not a static menu.

## Modules List requirements
Build a searchable/filterable module list with:
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

Include:
- search input
- status filter
- language filter
- owner filter if useful
- empty state
- no results state

## Create Module requirements
Build a working creation form for:
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
- create a fake module record in local data/state
- assign draft status
- create fake ID and timestamp
- route to the module overview placeholder or modules list

## UI requirements
Use the common staff shell built in Phase 1.
Maintain:
- breadcrumbs
- action bar
- validation states
- success feedback
- cancel flow
- unsaved changes warning where relevant

## Important
Do not build lesson authoring yet.
Do not build media, assessments, preview, QA, or publish pages yet beyond basic placeholders/links if needed.

## Final check before finishing
Confirm that:
- new modules can be created in simulated local state
- modules list updates without backend
- staff routes remain protected
- the app still has no backend or external integrations


Phase 3 prompt — module overview, settings, and completion rules
Extend the existing DEC Staff / Course Creator app by building Phase 3. Do not rebuild earlier phases.

## Goal of this phase
Turn each module into a real editable control center.

## Keep fixed
- frontend-only
- simulated data/state only
- protected staff-only access
- no backend
- no API
- no database

## Build in this phase
1. Module Overview page
2. Module Settings section
3. Completion Rules builder
4. lesson list panel
5. quick links to upcoming authoring areas

## Module Overview page requirements
This page should be the main control center for a selected module.

Include:
- editable module metadata
- status badge
- language
- audience
- duration
- toggles summary
- update/save actions
- last updated info
- draft/review/published state display

## Completion Rules builder
Allow staff to set simulated rules such as:
- require specific lessons
- require final assessment
- minimum passing score
- require feedback before completion
- require all mandatory blocks

Use a polished rule-builder UI.
Changes should update local state only.

## Lesson list panel
Show:
- lesson title
- order
- lesson status
- edit button
- preview button
- duplicate button if useful
- add lesson button

If lesson authoring is not built yet, route edit to a placeholder page but structure the data correctly.

## Quick links area
Include clean links/cards for:
- Lessons
- Media & Resources
- Assessments
- Feedback
- Preview
- QA
- Review
- Publish
- Maintenance
- Analytics

These can lead to placeholders until built in later phases, but they must live inside the module control center.

## Important
Do not build the full lesson editor yet.
Do not build preview/QA/publish logic yet beyond placeholders and state-aware structure.

## Final check before finishing
Confirm that:
- module metadata can be edited
- completion rules can be created and saved in local state
- lesson list is visible and structurally ready
- no backend or real persistence was introduced


Phase 4 prompt — lesson authoring system and typed lesson blocks
Extend the existing DEC Staff / Course Creator app by building Phase 4. Do not rebuild earlier phases.

## Goal of this phase
Build the core lesson authoring experience using typed content blocks.

## Keep fixed
- frontend-only
- simulated local data/state
- protected staff access
- no backend
- no database
- no API

## This is the most important authoring page
Build a high-quality Lesson Authoring page that feels like a real course builder.

## Required lesson editor capabilities
Allow staff to:
- add block
- edit block
- delete block
- reorder block
- duplicate block
- preview block
- save lesson
- update lesson metadata

## Required block types
Support these lesson block types:
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

## Required editor layout
Build:
- lesson header
- lesson metadata panel
- main lesson canvas
- add block menu
- right-side block settings/configuration panel
- reorder controls
- inline validation
- unsaved changes alert
- save draft button
- lesson preview toggle if useful

## Data architecture rule
Staff-authored lesson blocks must be saved into the simulated typed content model that can later render in preview exactly as learner content.

Do not duplicate “preview-only” content separately.
The same block data objects must power preview later.

## UX requirements
The authoring experience must feel:
- polished
- modern
- editable
- structured
- easy to scan
- operational
- not cluttered

## Important
Do not build the full learner preview player yet.
Do not build full QA/review/publish yet.
Focus on the authoring editor and typed block data.

## Final check before finishing
Confirm that:
- lessons can be authored with all required block types
- blocks can be added/edited/deleted/reordered
- state updates locally only
- the block model is preview-ready
- no backend was introduced


Phase 5 prompt — media/resources, assessment builder, and feedback instrument builder
Extend the existing DEC Staff / Course Creator app by building Phase 5. Do not rebuild earlier phases.

## Goal of this phase
Add the supporting authoring systems needed to make modules operational:
- media & resources
- assessment builder
- feedback instrument builder

## Keep fixed
- frontend-only
- simulated state and local data only
- no backend
- no real upload service
- no real storage
- no API

## Build in this phase
1. Media & Resources page
2. Assessment Builder page
3. Feedback Instrument Builder page

## Media & Resources page requirements
Build a realistic simulated media/resources manager with:
- fake upload area
- uploaded asset cards
- file metadata
- type badges
- transcript/caption requirement field
- lesson linking controls
- downloadable resource tagging
- empty and success states

No real file uploads.
Use mock assets and fake upload state.

## Assessment Builder requirements
Support:
- pre-test
- quiz
- post-test/final test

Allow staff to:
- set assessment title
- set pass score
- add/remove/reorder questions
- use question types:
  - single select
  - multi-select
  - short text
- save draft

## Feedback Instrument Builder requirements
Allow staff to create:
- rating scale items
- multiple choice items
- open-ended items
- required/optional settings
- instrument title
- save action

## Integration rule
Assessments and feedback instruments must attach to the selected module and preview later from the same simulated data model.

## Important
Do not build the final preview player yet.
Do not build review/publish/analytics yet.
Just make these authoring systems real and connected in local state.

## Final check before finishing
Confirm that:
- assets/resources behave like a simulated media layer
- assessments can be created and edited
- feedback forms can be created and edited
- all updates stay frontend-only


Phase 6 prompt — learner-like preview player and end-to-end rendering
Extend the existing DEC Staff / Course Creator app by building Phase 6. Do not rebuild earlier phases.

## Goal of this phase
Build a learner-like Preview Player that renders authored content from the same staff-side data model.

## Keep fixed
- frontend-only
- no backend
- no database
- no API
- protected staff access only

## Build in this phase
1. Preview Player page
2. desktop/mobile preview toggle
3. lesson navigation within preview
4. assessment preview
5. feedback preview

## Critical system rule
The preview player must render from the same simulated content objects authored in:
- module metadata
- lesson blocks
- assessments
- feedback instruments

Do not create duplicated preview-only hardcoded content.
Preview must consume the authored data model.

## Preview Player requirements
Include:
- preview banner clearly showing this is preview mode
- desktop/mobile toggle
- learner-style layout
- lesson switching
- block rendering for all supported block types
- assessment preview state
- feedback preview state
- completion-rule awareness if possible

## Visual requirement
The preview should look close to the learner-side DEC course experience, but clearly marked as preview.

## Important
Do not build QA/review/publish yet.
Focus on correct render fidelity from authored staff-side data.

## Final check before finishing
Confirm that:
- authored modules can be previewed end to end
- preview is fed by the same typed content objects
- lesson blocks, assessments, and feedback all render from local authoring data
- no backend was introduced


Phase 7 prompt — QA checklist, review queue, and publish confirmation
Extend the existing DEC Staff / Course Creator app by building Phase 7. Do not rebuild earlier phases.

## Goal of this phase
Build the governance and release workflow:
- QA checklist
- review queue
- publish confirmation

## Keep fixed
- frontend-only
- simulated workflow only
- no backend
- no notifications service
- no database
- no real permissions backend

## Build in this phase
1. QA Checklist page
2. Review / Review Queue page
3. Publish Confirmation page

## QA Checklist requirements
Include:
- checklist items
- issue severity
- blockers summary
- validation status
- rerun validation button
- publish readiness state

Checklist areas should include examples like:
- metadata complete
- lesson blocks valid
- assessment configured
- feedback configured
- transcript/caption info attached
- accessibility confirmed
- low-bandwidth readiness confirmed

Use simulated validation based on local data completeness.

## Review / Review Queue requirements
Build a frontend-only simulated review layer with:
- send to review
- comment thread
- pinned comments by lesson or block
- approve
- request changes
- review state badge

## Publish Confirmation requirements
Build a governed publish page with:
- unresolved issue list
- final warning
- publish button
- success state
- publish history summary

Publishing should change local module state:
- draft → review
- review → published
or equivalent simulated transitions

## Important
Do not build analytics/maintenance yet.
Focus on quality control and release workflow.

## Final check before finishing
Confirm that:
- QA status can be seen
- review actions work in simulated local state
- publish changes module status locally
- no backend or real workflow engine was introduced


Phase 8 prompt — maintenance, analytics, and final polish
Extend the existing DEC Staff / Course Creator app by building Phase 8. Do not rebuild earlier phases.

## Goal of this phase
Complete the staff-side system with:
- maintenance controls
- analytics / feedback-to-issue triage
- final product polish across all staff pages

## Keep fixed
- frontend-only
- simulated local state/data
- no backend
- no real analytics service
- no database
- no API

## Build in this phase
1. Post-Publication Maintenance page
2. CMS Analytics / Feedback-to-Issue Triage page
3. final consistency and UX polish across the entire staff workspace

## Maintenance page requirements
Include:
- live content warning
- edit live vs edit as new draft
- retire/unpublish option
- version note
- publish history context

## Analytics / Feedback-to-Issue Triage requirements
Use fake aggregate data only.
Show:
- participation summary
- completion summary
- quiz outcomes
- feedback summary
- issue triage list
- certificate issuance indicator
- status summaries by module

This page should look useful and operational without pretending to be backed by a real data service.

## Final polish requirements
Refine the whole staff workspace for:
- workflow clarity
- page hierarchy
- authoring ergonomics
- role-based visibility
- visual consistency
- validation states
- empty states
- success states
- mobile responsiveness where practical
- stakeholder-ready polish

## Important
Do not expand scope beyond the staff-side system defined in the uploaded files.
Do not introduce backend, APIs, or real integrations.

## Final check before finishing
Confirm that:
- the full protected staff workspace is operational in frontend-only mode
- all authoring and preview flows work with simulated local data
- staff pages remain hidden unless valid staff sign-in is used
- the workspace is polished and realistic


Final QA prompt — after all phases are built
Use this at the end.
Conduct a final QA walkthrough of the DEC Staff / Course Creator frontend workspace against the uploaded staff-side plan and access-control update.

Verify:
1. staff sign-in dropdown exists in top navigation
2. only valid simulated staff login unlocks staff pages
3. all staff pages remain hidden otherwise
4. the full page inventory exists
5. authoring pages are active and not static mockups
6. the same typed content objects power preview rendering
7. all workflow states are simulated locally
8. no backend, API, database, auth provider, or real storage was introduced

Return 3 sections only:
- Built correctly
- Missing or inconsistent
- Exact fixes required

Guide 
Best working method
Use each phase like this:
paste the phase prompt
let AI agent build/update
test visually
fix obvious issues
then move to the next phase
That will give you much better results than asking AI Studio to generate the full staff system in one pass.
