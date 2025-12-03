import { createMessageWithFallback } from '@/lib/anthropic/model-fallback';
import { ProjectOutline, ProjectContext, CoachMessage, QuickReply, CoachType, CoachingStyle, CoachingStage, BusinessPlan } from '@/types/coaching';
import { COACH_PROMPTS } from './coach-prompts';
import { STYLE_MODIFIERS } from './style-modifiers';
import { BusinessProfile } from '@/types/business';

export class CoachingAgent {
  private sessionId: string;
  private coachType: CoachType;
  private coachingStyle: CoachingStyle;
  private stage: CoachingStage;
  
  public messages: CoachMessage[] = [];
  public outline: ProjectOutline | null = null;
  public context: ProjectContext | null = null;
  public businessProfile: BusinessProfile | null = null;
  public plan: BusinessPlan | null = null;

  constructor(sessionId: string, coachType: CoachType = 'strategy', coachingStyle: CoachingStyle = 'mentor') {
    this.sessionId = sessionId;
    this.coachType = coachType;
    this.coachingStyle = coachingStyle;
    this.stage = 'discovery';
  }

  /**
   * Get the combined system prompt based on coach type, style, and current stage
   */
  private getSystemPrompt(): string {
    const basePrompt = COACH_PROMPTS[this.coachType];
    const styleModifier = STYLE_MODIFIERS[this.coachingStyle];
    
    let stageInstructions = '';
    if (this.stage === 'discovery') {
      stageInstructions = `
CURRENT STAGE: Discovery
- You are in the discovery phase
- Ask probing questions to gather information (2-3 questions at a time, max)
- Use mark_discovery_complete tool when you've gathered enough info about a specific discovery area
- Track your progress: you need comprehensive information across all discovery areas before moving forward
- When you have solid information across all discovery areas, use transition_to_stage('plan_generation') to move forward
- Don't rush - make sure you understand their situation deeply before generating a plan`;
    } else if (this.stage === 'plan_generation') {
      stageInstructions = `
CURRENT STAGE: Plan Generation
- You have completed discovery and gathered comprehensive information
- Generate a strategic business plan using the generate_business_plan tool
- The plan MUST include:
  * objectives: 2-4 clear, measurable objectives aligned with their goals
  * strategyOverview: 1-2 paragraphs summarizing the main approach
  * phases: 3 phases (Foundation 0-30 days, Build & Optimize 30-90 days, Scale & Refine 90+ days) with specific actions
  * metrics: What to track, targets, and when to review
  * risks: 3-5 likely obstacles with mitigation strategies
- Make it specific to THEIR business, not generic
- Base it on the information you gathered during discovery
- After generating the plan, automatically transition to support mode`;
    } else if (this.stage === 'support') {
      const planContext = this.plan 
        ? `\n\nCURRENT PLAN CONTEXT:
- Objectives: ${this.plan.objectives.map(o => o.description).join(', ')}
- Phases: ${this.plan.phases.map(p => p.name).join(', ')}
- Key Metrics: ${this.plan.metrics.map(m => m.metric).join(', ')}
Reference this plan when helping the user.`
        : '';
      
      stageInstructions = `
CURRENT STAGE: Support Mode
- A strategic plan has been generated${this.plan ? ' and is available' : ''}
- Help the user implement the plan
- Reference specific actions from the plan when relevant
- Help them overcome obstacles they encounter
- Adjust the plan if needed based on new information or changing circumstances
- Be practical and actionable
- Answer questions about implementation
- Provide guidance on executing specific actions from the plan${planContext}`;
    }
    
    return `${basePrompt}

${styleModifier}

${stageInstructions}`;
  }

  /**
   * Update coach type and style (for switching coaches mid-session)
   */
  updateCoach(coachType: CoachType, coachingStyle?: CoachingStyle): void {
    this.coachType = coachType;
    if (coachingStyle) {
      this.coachingStyle = coachingStyle;
    }
    console.log(`[CoachingAgent] Updated coach: ${coachType} (${this.coachingStyle} style)`);
  }

  /**
   * Get current stage
   */
  getStage(): CoachingStage {
    return this.stage;
  }

  /**
   * Get current coach type
   */
  getCoachType(): CoachType {
    return this.coachType;
  }

  /**
   * Get current coaching style
   */
  getCoachingStyle(): CoachingStyle {
    return this.coachingStyle;
  }

  async startSession(): Promise<{ content: string; quickReplies?: QuickReply[] }> {
    const coachNames: Record<CoachType, string> = {
      strategy: 'Strategy & Clarity',
      brand: 'Brand & Positioning',
      marketing: 'Marketing & Sales',
      customer_experience: 'Customer Experience',
    };

    const styleNames: Record<CoachingStyle, string> = {
      mentor: 'Mentor',
      realist: 'Realist',
      strategist: 'Strategist',
      accountability_partner: 'Accountability Partner',
    };

    const openingMessages: Record<CoachType, string> = {
      strategy: "Thanks for choosing the Strategy & Clarity Coach. I'll start with a quick audit so I can build a tailored plan for you. I'll ask a series of questions about your business, goals, and current situation. Answer in as much detail as you can, even if things feel messy. Ready? Let's start with a quick snapshot of your business.",
      brand: "Thanks for choosing the Brand & Positioning Coach. I'll help you stand out in your market and create a compelling brand identity. Let's start by understanding your current brand and where you want to take it. Ready?",
      marketing: "Thanks for choosing the Marketing & Sales Coach. I'll help you grow your customer base and optimize your sales process. Let's start by understanding your current marketing and sales situation. Ready?",
      customer_experience: "Thanks for choosing the Customer Experience Coach. I'll help you design exceptional customer journeys and build systems for retention and referrals. Let's start by understanding your current customer experience. Ready?",
    };

    return {
      content: openingMessages[this.coachType],
      quickReplies: undefined, // No quick replies for business coaching - let AI ask probing questions
    };
  }

  async chat(userMessage: string): Promise<{
    role: 'coach';
    content: string;
    quickReplies?: QuickReply[];
    outline?: ProjectOutline;
    context?: ProjectContext;
    plan?: BusinessPlan;
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

    // Call Claude with coaching prompt (using model fallback)
    let response;
    try {
      console.log('[CoachingAgent] Calling Anthropic API with model fallback...');
      console.log('[CoachingAgent] Message count:', formattedMessages.length);
      const result = await createMessageWithFallback(
        {
          max_tokens: 2048,
          system: this.getSystemPrompt(),
          tools: this.getTools(),
          messages: formattedMessages as any,
        },
        'PRIMARY_COACH'
      );
      response = result.response;
      console.log(`[CoachingAgent] Successfully got response from model: ${result.model}`);
      console.log(`[CoachingAgent] Response content blocks: ${response.content.length}`);
    } catch (error: any) {
      console.error('[CoachingAgent] Error calling Anthropic API:', {
        message: error?.message,
        stack: error?.stack,
        status: error?.status,
        statusCode: error?.statusCode,
        name: error?.name,
        error: error,
      });
      // Re-throw with more context
      const errorMsg = error?.message || 'Unknown error';
      throw new Error(`Failed to get AI response: ${errorMsg}`);
    }

    // Process response
    const result: {
      role: 'coach';
      content: string;
      quickReplies?: QuickReply[];
      outline?: ProjectOutline;
      context?: ProjectContext;
      plan?: BusinessPlan;
    } = {
      role: 'coach',
      content: '',
      quickReplies: undefined,
      outline: undefined,
      context: undefined,
      plan: undefined,
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
        } else if (block.name === 'transition_to_stage') {
          const input = block.input as { stage: CoachingStage; summary?: string };
          this.stage = input.stage;
          console.log(`[CoachingAgent] Transitioned to stage: ${input.stage}${input.summary ? ` - ${input.summary}` : ''}`);
          // Update result to include stage transition info in response
          if (input.summary) {
            result.content += `\n\n[Stage transition: ${input.stage}]`;
          }
        } else if (block.name === 'mark_discovery_complete') {
          const input = block.input as { area: string; keyFindings: string[] };
          // Store discovery findings in business profile
          if (!this.businessProfile) {
            this.businessProfile = {
              snapshot: '',
              goals: [],
              challenges: [],
              offers: [],
              constraints: '',
            };
          }
          this.businessProfile[input.area] = input.keyFindings;
          console.log(`[CoachingAgent] Marked discovery area complete: ${input.area}`, {
            keyFindings: input.keyFindings,
          });
        } else if (block.name === 'generate_business_plan') {
          const input = block.input as { plan: BusinessPlan; businessProfile?: BusinessProfile };
          this.plan = input.plan;
          if (input.businessProfile) {
            this.businessProfile = input.businessProfile;
          }
          result.plan = this.plan;
          // Transition to support mode after plan generation
          this.stage = 'support';
          console.log(`[CoachingAgent] Generated business plan with ${input.plan.objectives.length} objectives, ${input.plan.phases.length} phases`);
        }
      }
    }

    // Add assistant message to history
    this.messages.push({
      role: 'coach',
      content: result.content || 'No response generated',
      quickReplies: result.quickReplies,
      timestamp: new Date(),
    });

    // Ensure we always return some content
    if (!result.content) {
      result.content = 'I apologize, but I encountered an issue processing your message. Please try again.';
    }

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

    // Call Claude with model fallback for revision
    let response;
    try {
      const result = await createMessageWithFallback(
        {
          max_tokens: 2048,
          system: this.getSystemPrompt(),
          tools: this.getTools(),
          messages: formattedMessages as any,
        },
        'PRIMARY_COACH'
      );
      response = result.response;
      console.log(`[CoachingAgent] Successfully revised outline with model: ${result.model}`);
    } catch (error: any) {
      console.error('[CoachingAgent] Error revising outline:', error);
      throw new Error(`Failed to revise outline: ${error?.message || 'Unknown error'}`);
    }

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
        name: 'transition_to_stage',
        description: 'Mark that you are moving to a new stage in the coaching process',
        input_schema: {
          type: 'object' as const,
          properties: {
            stage: {
              type: 'string' as const,
              enum: ['discovery', 'plan_generation', 'support'],
              description: 'The stage you are transitioning to',
            },
            summary: {
              type: 'string' as const,
              description: 'Brief summary of progress made in the previous stage',
            },
          },
          required: ['stage'],
        },
      },
      {
        name: 'mark_discovery_complete',
        description: 'Mark that you have gathered sufficient information about a specific discovery area',
        input_schema: {
          type: 'object' as const,
          properties: {
            area: {
              type: 'string' as const,
              description: 'The discovery area (e.g., business_model, audience, revenue, bottlenecks, brand_perception, etc.)',
            },
            keyFindings: {
              type: 'array' as const,
              items: { type: 'string' as const },
              description: '2-3 key insights you learned about this area',
            },
          },
          required: ['area', 'keyFindings'],
        },
      },
      {
        name: 'generate_business_plan',
        description: 'Generate a strategic business plan based on the discovery information gathered. Use this when you have comprehensive information and are ready to create the plan.',
        input_schema: {
          type: 'object' as const,
          properties: {
            plan: {
              type: 'object' as const,
              description: 'The strategic business plan',
              properties: {
                objectives: {
                  type: 'array' as const,
                  items: {
                    type: 'object' as const,
                    properties: {
                      id: { type: 'string' as const },
                      description: { type: 'string' as const },
                      measurable: { type: 'string' as const, description: 'How success is measured' },
                    },
                    required: ['id', 'description', 'measurable'],
                  },
                  description: '2-4 clear, measurable objectives aligned with user goals',
                },
                strategyOverview: {
                  type: 'string' as const,
                  description: '1-2 paragraphs summarizing the main approach',
                },
                phases: {
                  type: 'array' as const,
                  items: {
                    type: 'object' as const,
                    properties: {
                      name: { type: 'string' as const },
                      timeframe: { type: 'string' as const, description: 'e.g., "0-30 days", "30-90 days", "90+ days"' },
                      actions: {
                        type: 'array' as const,
                        items: {
                          type: 'object' as const,
                          properties: {
                            id: { type: 'string' as const },
                            description: { type: 'string' as const },
                            priority: { type: 'string' as const, enum: ['high', 'medium', 'low'] },
                          },
                          required: ['id', 'description', 'priority'],
                        },
                      },
                    },
                    required: ['name', 'timeframe', 'actions'],
                  },
                  description: '3 phases: Foundation (0-30 days), Build & Optimize (30-90 days), Scale & Refine (90+ days)',
                },
                metrics: {
                  type: 'array' as const,
                  items: {
                    type: 'object' as const,
                    properties: {
                      metric: { type: 'string' as const },
                      target: { type: 'string' as const },
                      checkpoint: { type: 'string' as const, description: 'When to review' },
                    },
                    required: ['metric', 'target', 'checkpoint'],
                  },
                },
                risks: {
                  type: 'array' as const,
                  items: {
                    type: 'object' as const,
                    properties: {
                      risk: { type: 'string' as const },
                      mitigation: { type: 'string' as const },
                    },
                    required: ['risk', 'mitigation'],
                  },
                  description: '3-5 likely obstacles with suggestions to address them',
                },
              },
              required: ['objectives', 'strategyOverview', 'phases', 'metrics', 'risks'],
            },
            businessProfile: {
              type: 'object' as const,
              description: 'Summary of business information gathered during discovery',
              properties: {
                snapshot: { type: 'string' as const },
                goals: { type: 'array' as const, items: { type: 'string' as const } },
                challenges: { type: 'array' as const, items: { type: 'string' as const } },
                offers: { type: 'array' as const, items: { type: 'string' as const } },
                constraints: { type: 'string' as const },
              },
            },
          },
          required: ['plan'],
        },
      },
      {
        name: 'generate_outline',
        description: 'Generate the project outline when you have enough information. Call this when ready to present the strategic plan. (Legacy tool for web project coaching)',
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

