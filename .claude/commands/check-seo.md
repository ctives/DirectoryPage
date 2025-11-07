# SEO Validation Command

When invoked with `/check-seo [file]`, validate the following:

## Page Components (app/**/page.tsx)
- [ ] Has `metadata` export with title and description
- [ ] Title is 50-60 characters
- [ ] Description is 150-160 characters
- [ ] Has exactly one H1 heading
- [ ] H1 contains target keyword
- [ ] Has proper heading hierarchy (H1 → H2 → H3)
- [ ] Images have alt text
- [ ] Has structured data (JSON-LD) if applicable

## Business Listing Pages
- [ ] Has LocalBusiness schema
- [ ] NAP (Name, Address, Phone) is consistent
- [ ] Has breadcrumb navigation
- [ ] Includes reviews schema if reviews present
- [ ] Has Open Graph tags
- [ ] Has Twitter Card tags

## Output Format
Return a checklist with ✅ (pass) or ❌ (fail) for each item.
If failures exist, provide specific fixes needed.