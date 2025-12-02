import { getAnthropicClient } from '@/lib/anthropic/client';
import { ProjectOutline, ProjectContext, CoachMessage, QuickReply } from '@/types/coaching';

const COACH_SYSTEM_PROMPT = `You are an expert business strategist and web consultant helping someone plan their web project. Your role is to guide them through a discovery process to understand their needs and create a strategic outline.

YOUR PERSONALITY:
- Friendly but professional
- Concise – don't overwhelm with too many questions at once (max 2-3)
- Insightful – pick up on what they're NOT saying
- Practical – focus on what will actually work, not just what sounds good

DISCOVERY PROCESS:
1. Understand the project type (landing page, portfolio, etc.)
2. Identify their business/product and target audience
3. Uncover their unique value proposition
4. Clarify the primary goal (what should visitors DO?)
5. Understand their brand/style preferences
6. Note any constraints or specific requirements

CONVERSATION GUIDELINES:
- Ask open-ended questions but offer examples to make it easy
- If they're vague, probe deeper with follow-ups
- Reflect back what you're hearing to confirm understanding
- Keep the conversation moving – don't drag it out unnecessarily
- When you have enough info (usually 4-6 exchanges), generate the outline

GENERATING THE OUTLINE:
When you have enough information, use the generate_outline tool to create a strategic project outline. This should include:
- All recommended sections with clear purposes
- Copy/messaging guidance based on their audience and value prop
- Style recommendations that match their brand
- Prioritization (must-have vs nice-to-have)

The outline should be specific to THEIR business, not generic.

OFFERING QUICK REPLIES:
When appropriate, use the offer_quick_replies tool to give the user easy response options. Use this for:
- Project type selection
- Yes/no questions
- Common choices (style preferences, goals, etc.)

Don't overuse it – sometimes open text is better.`;

export class CoachingAgent {
  private sessionId: string;
  public messages: CoachMessage[] = [];
  public outline: ProjectOutline | null = null;
  public context: ProjectContext | null = null;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  async startSession(): Promise<{ content: string; quickReplies?: QuickReply[] }> {
    const opening: QuickReply[] = [
      { label: 'Landing page', value: 'I want to build a landing page' },
      { label: 'Portfolio', value: 'I need a portfolio website' },
      { label: 'Product/SaaS', value: 'A website for my software product' },
      { label: 'E-commerce', value: 'An online store' },
      { label: 'Blog', value: 'A blog or content site' },
      { label: 'Something else', value: 'Something else' },
    ];

    return {
      content: "Hi! I'm here to help you create something that actually works for your business. Before we build anything, let's make sure we're building the RIGHT thing.\n\nWhat kind of project are you thinking about?",
      quickReplies: opening,
    };
  }

  async chat(userMessage: string): Promise<{
    role: 'coach';
    content: string;
    quickReplies?: QuickReply[];
    outline?: ProjectOutline;
    context?: ProjectContext;
  }> {
    // Add user message to history
    this.messages.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    });

    // Format messages for Claude
    const formattedMessages = this.messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    // Call Claude with coaching prompt (using Claude Sonnet 4.5)
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022', // Claude Sonnet 4.5
      max_tokens: 2048,
      system: COACH_SYSTEM_PROMPT,
      tools: this.getTools(),
      messages: formattedMessages as any,
    });

    // Process response
    const result: {
      role: 'coach';
      content: string;
      quickReplies?: QuickReply[];
      outline?: ProjectOutline;
      context?: ProjectContext;
    } = {
      role: 'coach',
      content: '',
      quickReplies: undefined,
      outline: undefined,
      context: undefined,
    };

    // Extract text and tool use
    for (const block of response.content) {
      if (block.type === 'text') {
        result.content += block.text;
      } else if (block.type === 'tool_use') {
        if (block.name === 'offer_quick_replies') {
          const input = block.input as { options?: QuickReply[] };
          result.quickReplies = input.options || [];
        } else if (block.name === 'generate_outline') {
          const input = block.input as { outline: ProjectOutline; context: ProjectContext };
          this.outline = input.outline;
          this.context = input.context;
          result.outline = this.outline;
          result.context = this.context;
        }
      }
    }

    // Add assistant message to history
    this.messages.push({
      role: 'coach',
      content: result.content,
      quickReplies: result.quickReplies,
      timestamp: new Date(),
    });

    return result;
  }

  async reviseOutline(feedback: string): Promise<{
    role: 'coach';
    content: string;
    outline: ProjectOutline;
    context: ProjectContext;
  }> {
    if (!this.outline || !this.context) {
      throw new Error('No outline generated yet');
    }

    const revisionPrompt = `The user has feedback on the outline you generated:

"${feedback}"

Current outline:
${JSON.stringify(this.outline, null, 2)}

Please revise the outline based on their feedback and generate an updated version using the generate_outline tool.`;

    this.messages.push({
      role: 'user',
      content: revisionPrompt,
      timestamp: new Date(),
    });

    const formattedMessages = this.messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022', // Claude Sonnet 4.5
      max_tokens: 2048,
      system: COACH_SYSTEM_PROMPT,
      tools: this.getTools(),
      messages: formattedMessages as any,
    });

    // Extract updated outline
    for (const block of response.content) {
      if (block.type === 'tool_use' && block.name === 'generate_outline') {
        const input = block.input as { outline: ProjectOutline; context: ProjectContext };
        this.outline = input.outline;
        this.context = input.context;
      }
    }

    const textResponse = response.content
      .filter((b: any) => b.type === 'text')
      .map((b: any) => b.text)
      .join('');

    return {
      role: 'coach',
      content: textResponse,
      outline: this.outline,
      context: this.context,
    };
  }

  private getTools() {
    return [
      {
        name: 'offer_quick_replies',
        description: 'Offer the user quick reply buttons for common responses',
        input_schema: {
          type: 'object' as const,
          properties: {
            options: {
              type: 'array' as const,
              items: {
                type: 'object' as const,
                properties: {
                  label: { type: 'string' as const, description: 'Button text' },
                  value: { type: 'string' as const, description: 'Value sent when clicked' },
                },
                required: ['label', 'value'],
              },
              description: 'Quick reply options (max 6)',
            },
          },
          required: ['options'],
        },
      },
      {
        name: 'generate_outline',
        description: 'Generate the project outline when you have enough information. Call this when ready to present the strategic plan.',
        input_schema: {
          type: 'object' as const,
          properties: {
            context: {
              type: 'object' as const,
              description: 'Extracted context from the conversation',
              properties: {
                projectType: { type: 'string' as const },
                businessName: { type: 'string' as const },
                targetAudience: { type: 'string' as const },
                uniqueValue: { type: 'string' as const },
                primaryGoal: { type: 'string' as const },
                tone: { type: 'string' as const },
                additionalNotes: { type: 'string' as const },
              },
              required: ['projectType', 'targetAudience', 'uniqueValue', 'primaryGoal', 'tone'],
            },
            outline: {
              type: 'object' as const,
              description: 'The strategic project outline',
              properties: {
                summary: { type: 'string' as const, description: 'Brief summary of what we are building and why' },
                sections: {
                  type: 'array' as const,
                  items: {
                    type: 'object' as const,
                    properties: {
                      id: { type: 'string' as const },
                      name: { type: 'string' as const },
                      purpose: { type: 'string' as const },
                      keyElements: { type: 'array' as const, items: { type: 'string' as const } },
                      copyGuidance: { type: 'string' as const },
                      priority: { type: 'string' as const, enum: ['must-have', 'recommended', 'optional'] },
                    },
                    required: ['id', 'name', 'purpose', 'keyElements', 'priority'],
                  },
                },
                styleRecommendations: {
                  type: 'object' as const,
                  properties: {
                    tone: { type: 'string' as const },
                    colorSuggestions: { type: 'array' as const, items: { type: 'string' as const } },
                    layoutStyle: { type: 'string' as const },
                  },
                },
              },
              required: ['summary', 'sections', 'styleRecommendations'],
            },
          },
          required: ['context', 'outline'],
        },
      },
    ];
  }

  getBuildBrief(): string {
    if (!this.outline || !this.context) {
      throw new Error('No outline generated yet');
    }

    const sectionsText = this.outline.sections
      .map(section => {
        const priorityMarker = section.priority === 'must-have' ? '⭐' : '○';
        let text = `\n${priorityMarker} ${section.name} (${section.priority})\n`;
        text += `  Purpose: ${section.purpose}\n`;
        text += `  Elements: ${section.keyElements.join(', ')}\n`;
        if (section.copyGuidance) {
          text += `  Copy guidance: ${section.copyGuidance}\n`;
        }
        text += `  File Location: \`src/components/sections/${section.id}.tsx\`\n`;
        return text;
      })
      .join('\n---\n');

    return `# Project Build Brief

## Business Context

**Project Type:** ${this.context.projectType}
**Business Name:** ${this.context.businessName || 'Not specified'}
**Target Audience:** ${this.context.targetAudience}
**Unique Value Proposition:** ${this.context.uniqueValue}
**Primary Goal:** ${this.context.primaryGoal}
**Brand Tone:** ${this.context.tone}
**Additional Notes:** ${this.context.additionalNotes || 'None'}

## Project Summary

${this.outline.summary}

## Sections to Build
${sectionsText}

## Style Guidelines

**Design Tone:** ${this.outline.styleRecommendations.tone}

**Color Palette:**
${this.outline.styleRecommendations.colorSuggestions.map(c => `- ${c}`).join('\n')}

**Layout Style:** ${this.outline.styleRecommendations.layoutStyle}

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
}

