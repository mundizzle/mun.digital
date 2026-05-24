# shared-ui-vertical-slice Specification

## Purpose
Define the shared UI package contract and the first portfolio UI extraction slice.

## Requirements

### Requirement: Shared UI package boundary
The system SHALL keep reusable UI components in `packages/ui`.

#### Scenario: A shared UI component is authored
- **WHEN** a component is added to `packages/ui`
- **THEN** it is data-agnostic, does not fetch profile data, and does not import app-specific modules

#### Scenario: Typography assumptions are considered
- **WHEN** a shared UI component is authored
- **THEN** it avoids `prose` and Fumadocs-specific typography assumptions

### Requirement: Class composition utility
The system SHALL expose a `cn` utility from `packages/ui`.

#### Scenario: Classes are composed
- **WHEN** shared UI components merge caller-provided classes
- **THEN** they use `cn` backed by `clsx` and `tailwind-merge`

### Requirement: Variant API restraint
The system SHALL defer CVA until a component has real variant complexity.

#### Scenario: A static component is extracted
- **WHEN** the component has no meaningful variant axis
- **THEN** it does not introduce CVA or a variant abstraction

### Requirement: First vertical slice
The system SHALL refactor one existing resume slice through shared UI.

#### Scenario: Resume section headers render
- **WHEN** the web app renders resume sections
- **THEN** the section header UI comes from `@mun.digital/ui`
- **AND** the rendered visual structure remains equivalent to the previous implementation

### Requirement: Semantic token usage
The system SHALL keep semantic Tailwind utility names as the authoring model.

#### Scenario: The extracted slice styles color
- **WHEN** the shared component needs color styling
- **THEN** it uses semantic token-backed Tailwind classes instead of raw color literals where a token exists
