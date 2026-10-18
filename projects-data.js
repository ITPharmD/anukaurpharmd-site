/*
  PROJECTS LIST — edit this file to add, remove, or update projects.

  Copy one { ... } block, paste it into the list, and change the text.
  - icon:     icon name from icons.js (tree, brain, tag, chart, book, chip, doc...); tone: 'violet' or 'amber'
  - category: 'tools', 'ai', 'education', or 'events' (drives the filter buttons on the Projects page)
  - status:   short label above the title, e.g. 'Live', 'Early access', 'Prototype in development'
  - link:     public URL. Leave '' to show a request button that goes to the Connect page.
  - linkLabel / requestLabel: button text for the link or the request button.
  - links2:   extra buttons, [{ url, label }, ...]
  - Picture options (use one):
      timeline: live date list (see the first project)
      image:    'assets/your-file.jpg' (16:10, e.g. 1200 x 750) plus imageAlt
      mark:     large text panel, e.g. mark: 'Name', markSub: 'Short subtitle'
  - note:  small print shown at the bottom of that one project's card
  Picture options can be combined: a timeline and an image both render.
  The first project is also featured on the Home page.
*/

window.PROJECTS = [
  {
    title: 'CMS Interoperability Compliance Decision Tree',
    icon: 'tree',
    category: 'tools',
    status: 'Early access',
    summary: 'Choose a payer or pharmacy benefit entity and see which CMS interoperability rules apply, what each requires, and how far away each date is. Plain-language visual briefings from the tool are shared on LinkedIn.',
    points: [
      'Covers CMS-9115-F, CMS-4201-F, CMS-4205-F2, CMS-0053-F, CMS-0056-F, CMS-0057-F, and the CMS-0062-P proposed rule',
      'Health plans and pharmacy benefit entities (PBM/PBA) are scoped separately',
      'Countdowns update daily; regulatory detail opens on request',
      'Status snapshots checked against the Federal Register and CMS guidance',
      'Includes a pharmacy-benefit drug guide: payers, electronic prior authorization standards, and decision timeframes'
    ],
    tags: ['Prior authorization', 'Interoperability', 'Compliance', 'CMS-0062-P', 'Regulatory intelligence'],
    // Live preview: counts recalculate from today's date on every visit.
    // Update "reviewed" and the milestones when CMS publishes a final rule.
    timeline: {
      title: 'CMS-0062-P live timeline',
      reviewed: 'Oct 11, 2026',
      milestones: [
        { date: '2026-04-14', text: 'Proposed rule published in the Federal Register' },
        { date: '2026-06-15', text: 'Public comment period closed' },
        { pending: true, text: 'Final rule not yet published' },
        { date: '2027-10-01', text: 'Proposed compliance date for key drug prior authorization provisions' },
        { date: '2028-01-01', text: 'Proposed: FF-SHOP small group Patient Access, Provider Access, and Payer-to-Payer APIs' }
      ]
    },
    image: 'assets/cms0062p-status.jpg',
    imageAlt: 'CMS-0062-P status snapshot from the decision tree: the Federal Register notice and a still-waiting hourglass for the final rule',
    imageCaption: 'Snapshot from the tool, shared as a visual briefing on LinkedIn',
    link: '',
    requestLabel: 'Request early access',
    // Each entry becomes its own button under the project.
    links2: [
      { url: 'https://www.linkedin.com/search/results/content/?keywords=%23cms0062&origin=FACETED_SEARCH&fromMember=%5B%22ACoAAAJEYZIBaaXj0ZA5DTTITZToFwSHCFUEeQA%22%5D', label: 'CMS-0062-P briefings on LinkedIn' },
      { url: 'https://www.linkedin.com/search/results/content/?keywords=%23cms0057&origin=GLOBAL_SEARCH_HEADER&fromMember=%5B%22ACoAAAJEYZIBaaXj0ZA5DTTITZToFwSHCFUEeQA%22%5D', label: 'CMS-0057-F briefings on LinkedIn' }
    ],
    note: 'While every effort has been made to ensure the accuracy of this reference tool, it is not a legal document. Proposed provisions and dates are subject to change. Please refer to the Federal Register and current CMS guidance for full details.'
  },
  {
    id: 'cms-idea-challenge',
    title: 'CMS IDea Challenge: Strategies for Securing Member IDs',
    icon: 'shield',
    category: 'events',
    status: 'Selected participant',
    summary: 'Selected by CMS to take part in its in-person event in San Francisco, CA on December 5, 2025. Teams from mixed backgrounds worked on ideas to strengthen the security of health plan member IDs and reduce fraud.',
    points: [
      'Part of the CMS Crushing Fraud, Waste, and Abuse initiative',
      'The event summary (PDF) lists the ideas pitched at each event'
    ],
    tags: ['CMS', 'Member ID security', 'Fraud, waste, and abuse'],
    mark: 'CMS IDea Challenge',
    markSub: 'San Francisco, CA · Dec 5, 2025',
    link: 'https://www.cms.gov/files/document/idea-challenge-summary.pdf',
    linkLabel: 'Event summary (PDF)',
    link2: 'https://www.cms.gov/initiatives/crushing-fraud-waste-abuse/overview/cms-idea-challenge-strategies-securing-member-ids',
    link2Label: 'CMS event page'
  }
];
