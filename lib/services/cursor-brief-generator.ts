import { ProjectOutline, ProjectContext } from '@/types/coaching';

export class CursorBriefGenerator {
  generateMarkdownBrief(outline: ProjectOutline, context: ProjectContext, projectName: string): string {
    const sectionsText = outline.sections
      .map(section => {
        const priorityMarker = section.priority === 'must-have' ? '⭐' : '○';
        let text = `\n### ${priorityMarker} ${section.name} (${section.priority})\n`;
        text += `**Purpose:** ${section.purpose}\n`;
        text += `**Key Elements:**\n`;
        section.keyElements.forEach(element => {
          text += `- ${element}\n`;
        });
        if (section.copyGuidance) {
          text += `\n**Copy Guidance:** ${section.copyGuidance}\n`;
        }
        text += `\n**File Location:** \`src/components/sections/${section.id}.tsx\`\n`;
        return text;
      })
      .join('\n---\n');

    return `# Project Build Brief

## Business Context

**Project Type:** ${context.projectType}
**Business Name:** ${context.businessName || 'Not specified'}
**Target Audience:** ${context.targetAudience}
**Unique Value Proposition:** ${context.uniqueValue}
**Primary Goal:** ${context.primaryGoal}
**Brand Tone:** ${context.tone}
**Additional Notes:** ${context.additionalNotes || 'None'}

## Project Summary

${outline.summary}

## Sections to Build
${sectionsText}

## Style Guidelines

**Design Tone:** ${outline.styleRecommendations.tone}

**Color Palette:**
${outline.styleRecommendations.colorSuggestions.map(c => `- ${c}`).join('\n')}

**Layout Style:** ${outline.styleRecommendations.layoutStyle}

**Component Library:** Use Tailwind CSS for styling. Prefer functional components with TypeScript.

## Technical Requirements

**Framework:** Next.js 14+ (App Router)
**Styling:** Tailwind CSS
**Language:** TypeScript
**Deployment:** Vercel-ready
**Performance:** Lighthouse score > 90

## File Structure

\`\`\`
project-root/
├── src/
│   ├── app/
│   │   ├── page.tsx (main landing page)
│   │   └── layout.tsx
│   ├── components/
│   │   ├── sections/
│   │   └── ui/
│   └── lib/
├── public/
├── package.json
└── tailwind.config.js
\`\`\`

## Build Instructions

1. Initialize Next.js project with TypeScript and Tailwind CSS
2. Create the file structure as outlined above
3. Build sections in priority order (must-have first)
4. Implement responsive design (mobile, tablet, desktop)
5. Optimize images and assets
6. Test on multiple devices and browsers

## Success Criteria

- [ ] All must-have sections implemented
- [ ] Mobile-responsive design
- [ ] Fast page load (< 3 seconds)
- [ ] Accessible (WCAG 2.1 AA)
- [ ] SEO-optimized (meta tags, structured data)
`;
  }

  generateJsonMetadata(outline: ProjectOutline, context: ProjectContext): object {
    return {
      project: {
        type: context.projectType,
        businessName: context.businessName,
        targetAudience: context.targetAudience,
        uniqueValue: context.uniqueValue,
        primaryGoal: context.primaryGoal,
        tone: context.tone,
      },
      outline: {
        summary: outline.summary,
        sections: outline.sections,
        styleRecommendations: outline.styleRecommendations,
      },
      generatedAt: new Date().toISOString(),
      version: '1.0',
    };
  }
}


