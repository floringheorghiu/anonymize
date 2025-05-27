# Changelog

## [1.25] - 2025-05-27

### Added
- **URL/Link Removal Feature**: Added new "Remove URLs/Links" checkbox option to automatically remove hyperlinks and URL text from text nodes during anonymization
  - Removes both Figma hyperlink formatting and plain text URLs (https://, www., domain patterns)
  - Integrates seamlessly with existing anonymization pipeline
  - Enabled by default for enhanced privacy protection

### Changed
- **Increased Plugin UI Height**: Expanded plugin window from 300px to 380px to eliminate scroll bar and improve user experience
- **Enhanced Text Processing**: URL removal occurs before price/product anonymization to prevent conflicts

### Technical
- Added `removeUrls` option to `AnonymizeOptions` interface
- Implemented `removeUrlsFromText()` function with comprehensive URL pattern matching
- Maintained compatibility with existing anonymization marker system
- Followed project best practices for simplified, reliable Figma plugin development

## [Unreleased] - 2025-04-16

### Added
- Added support for custom placeholder images in the Figma plugin.
    - Implemented the `customPlaceholderImage` property in the `AnonymizeOptions` interface to accept a base64-encoded image string.
    - Ensured backend and UI logic now support user-uploaded images as placeholders for anonymization.

### Changed
- Refactored the backend base64 decoder to use a pure JavaScript implementation, removing reliance on Node.js-specific APIs (such as `Buffer`).
- Enhanced logging for image processing and error tracking in the backend.

### Fixed
- Resolved TypeScript errors related to the missing `customPlaceholderImage` property in the `AnonymizeOptions` interface.

### Other
- Maintained a clean and type-safe codebase.
- Continued to follow defensive programming and robust error handling practices.
- Confirmed that the working code is under git version control and changes are committed on the `experiment/user-placeholder-image` branch.

---

*Generated automatically on 2025-04-16.*
