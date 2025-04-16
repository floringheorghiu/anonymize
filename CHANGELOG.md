# Changelog

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
