# website-delivery Specification Delta

## Modified Requirements

### Requirement: Agent discovery artifact
The system SHALL keep the portfolio LLM surface separate from the design-system docs LLM surface.

#### Scenario: Portfolio LLM surface is read
- **WHEN** agents read `mun.digital/llms.txt`
- **THEN** they receive profile/resume-oriented public information
- **AND** they can discover the separate docs LLM surface without profile and design-system responsibilities being merged
