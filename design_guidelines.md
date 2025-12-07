# Design Guidelines: Parit Kansal Portfolio Website

## Design Approach
**Reference-Based Approach** drawing from modern tech portfolios and productivity tools: Linear's precise typography + Notion's content organization + GitHub's developer aesthetic. Focus on typography-driven design with clean layouts that emphasize technical credibility.

## Core Design Principles
1. **Typography-First**: Bold, confident type hierarchy as the primary visual element (no personal photo)
2. **Technical Precision**: Clean lines, consistent spacing, data-focused presentation
3. **Content Clarity**: Clear separation between resume content, Knowledge Vault (daily), and Blog (occasional)

## Typography System
- **Primary Font**: Inter or SF Pro Display (Google Fonts) for headings - weights: 700, 600
- **Body Font**: Inter or SF Pro Text for all body content - weights: 400, 500
- **Code/Technical**: JetBrains Mono for any technical snippets - weight: 400

**Hierarchy**:
- Hero Name: text-5xl md:text-7xl, font-bold, tracking-tight
- Section Titles: text-3xl md:text-4xl, font-semibold
- Subsection Headers: text-xl md:text-2xl, font-semibold
- Body Text: text-base md:text-lg, leading-relaxed
- Small Text/Meta: text-sm, font-medium

## Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 consistently
- Section padding: py-16 md:py-24
- Container max-width: max-w-6xl mx-auto
- Element spacing: gap-6, gap-8, gap-12 for different densities
- Card padding: p-6 md:p-8

## Component Library

### Navigation
- Fixed header with blur backdrop (backdrop-blur-xl)
- Links: Home, Experience, Skills, Projects, Knowledge Vault, Blog, Contact
- Download Resume button (primary CTA)
- Smooth scroll to sections

### Hero Section (No Image)
- Large typographic treatment with name
- Title: "Machine Learning Scientist"
- Contact links (email, phone) and social icons (GitHub, LinkedIn)
- Geometric accent elements (subtle grid patterns or tech-inspired shapes)
- CTA: "Download Resume" + "View Work"

### Professional Experience Cards
- Expandable/collapsible cards for each project
- Card structure: Company header → Project titles as sub-cards
- Each project: Title, date, bullet points with metrics highlighted
- Use subtle left border accent on expanded state

### Skills Section
- Four-column grid (responsive: 1 col mobile, 2 tablet, 4 desktop)
- Category cards: Programming Languages, Expertise, Tools, Frameworks
- Pills/tags for individual skills with subtle hover states

### Projects Grid
- Two-column layout (1 col mobile)
- Cards with: Project name, date, brief description, tech stack tags
- Hover: subtle elevation change

### Knowledge Vault Section
- Timeline/feed layout with date stamps prominently displayed
- Entry cards: Date (left), Title + Content (right) on desktop; stacked on mobile
- Search bar at top: "Search knowledge entries..."
- Filter chips: By month, by topic/tag
- Pagination or "Load More" at bottom
- Each entry: max-w-3xl for readability

### Blog Section
- Card grid layout (2 cols desktop, 1 col mobile)
- Each card: Title, excerpt, date, reading time estimate, "Read More" link
- Individual blog post view: max-w-prose centered, large title, meta info, content

### Certifications
- Simple list or small card layout
- Icon + Certification name + Issuer + Date

### Footer
- Simple, professional: Copyright, social links, "Back to top" link

## Images
**No Hero Image** (as requested - use typography + geometric elements instead)
**Decorative Elements Only**: Use subtle geometric patterns, gradient mesh backgrounds, or abstract tech-inspired graphics as section dividers or background accents

## Interaction Patterns
- Smooth scroll behavior for navigation
- Subtle card hover elevations (shadow-md to shadow-lg)
- Minimal animations: fade-in on scroll for content sections
- Expandable project cards with smooth height transitions
- Sticky navigation on scroll with backdrop blur

## Responsive Behavior
- Mobile: Single column, hamburger menu, stacked cards
- Tablet: 2-column grids where applicable
- Desktop: Full multi-column layouts, fixed navigation

## Accessibility
- Semantic HTML throughout (<nav>, <section>, <article>)
- ARIA labels for interactive elements
- Keyboard navigation support for expandable cards
- Focus states on all interactive elements
- Minimum contrast ratios maintained

This design creates a professional, technically credible portfolio that lets your work speak for itself through clean, confident typography and organized content presentation.