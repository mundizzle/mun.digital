## MODIFIED Requirements

### Requirement: Homepage link rail

The website SHALL render the homepage reading rail from the generated public Raindrop snapshot.

#### Scenario: Public links exist
- **WHEN** `raindrops.json` contains public links
- **THEN** the homepage reading rail renders those links instead of app-local bookmark fixtures

#### Scenario: Public links are empty
- **WHEN** `raindrops.json` contains no public links
- **THEN** the homepage reading rail is hidden
