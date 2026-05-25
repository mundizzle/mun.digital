## ADDED Requirements

### Requirement: SectionHeader Storybook acceptance
The system SHALL treat Storybook Docs, Controls, component tests, and accessibility checks as acceptance evidence for the existing `SectionHeader` slice.

#### Scenario: SectionHeader is reviewed in Storybook
- **WHEN** a reviewer opens the `SectionHeader` stories
- **THEN** Docs describes the component API and examples
- **AND** Controls are useful for primitive props
- **AND** noisy `ReactNode` and class-name props are not presented as broad freeform controls
- **AND** Storybook test and a11y scripts cover the checked story path
