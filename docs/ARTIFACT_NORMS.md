# Artifact Norms

This file defines the lightweight documentation norms for Cognitive Atlas. It is the baseline for future planning, backlog cleanup, and readiness checks.

## Scope

These norms apply to project documentation under `docs/`, including project overview, requirements, architecture, design, backlog, calibration, guides, changelog, and generated content guidance.

## Directory Roles

| Path | Role | Lifecycle |
|---|---|---|
| `docs/project-overview/` | Mission, vision, North Star, strategic goals, and file map | Stable, updated at major direction changes |
| `docs/requirements-planning/` | Data contracts, classification standards, and requirement specs | Stable once accepted; version when behavior changes |
| `docs/designs/` | Product and experience design decisions | Living while active, then historical reference |
| `docs/architecture/` | Technical plans, architecture decisions, and implementation notes | Living during implementation, then historical reference |
| `docs/process-management/backlog.md` | Canonical high-level backlog and current priority | Living |
| `docs/process-management/project-board/` | Captured work items and task-level records | Living until closed, then retained for traceability |
| `docs/calibration/` | Planning loop outputs and governance snapshots | Snapshot history plus one current report |
| `docs/guides/` | User/operator guides and generated publishing guides | Living when product behavior changes |
| `docs/changelog/` | Append-only change records for model library updates | Append-only |

## Artifact Metadata

Project-board work items should use front matter with:

- `artifact_type`
- `type`
- `date`
- `status`
- `lifecycle`
- `source`
- `trace_id`

Use `status: captured` for accepted but incomplete work, `status: in-progress` for active work, and `status: done` only after acceptance criteria are satisfied. Use `lifecycle: closed` when the item is complete and retained only for traceability.

## Backlog Rules

- `docs/process-management/backlog.md` is the canonical summary for current priorities.
- Completed work remains visible in the Done section for traceability.
- Project-board files must not contradict the canonical backlog status.
- New work should trace to a goal, roadmap item, design decision, or explicit user request.

## Planning Rules

- Before starting a new milestone, confirm the current priority in `docs/process-management/backlog.md`.
- If a completed milestone changes the project direction, update `docs/project-overview/project-file-map.md` and the relevant design or architecture reference.
- Calibration reports should state the trigger, inspected sources, blocker status, and recommended next tasks.

## Cleanup Rules

- Remove local-only files such as `.DS_Store` and `.tmp-*.png`; they are ignored by git and should not be retained.
- Prefer archiving historical docs under `_archive/` only when they are no longer referenced by current backlog, roadmap, or README links.
- Do not rewrite git history for cleanup unless explicitly requested.
