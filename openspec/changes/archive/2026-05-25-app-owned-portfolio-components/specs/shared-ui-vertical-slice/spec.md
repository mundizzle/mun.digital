## REMOVED Requirements

### Requirement: Shared UI package boundary

The system SHALL keep reusable UI components in `packages/ui`.

### Requirement: Class composition utility

The system SHALL expose a `cn` utility from `packages/ui`.

### Requirement: First vertical slice

The system SHALL refactor one existing resume slice through shared UI.

## ADDED Requirements

### Requirement: App-owned portfolio components

The system SHALL keep portfolio-specific components in `apps/web`.

#### Scenario: A portfolio component is authored
- **WHEN** a component exists only to render the portfolio app
- **THEN** it lives under `apps/web/src`
- **AND** it does not require a reusable workspace package API

### Requirement: App-local class composition utility

The system SHALL expose class composition from the web app.

#### Scenario: App classes are composed
- **WHEN** app components merge conditional or caller-provided classes
- **THEN** they use `apps/web/src/lib/cn.ts` backed by `clsx` and `tailwind-merge`

### Requirement: Token-backed app styling

The system SHALL keep shared design values in `@mun.digital/tokens`.

#### Scenario: App components style semantic surfaces
- **WHEN** a component needs color or shared layout styling
- **THEN** it uses token-backed Tailwind utilities or generated token CSS rather than a UI package stylesheet
