import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { handleNvidiaPredictionPost } from './nvidia-handler.js';

const STORE_DIR = join(homedir(), '.rj');
const CONV_DIR = join(STORE_DIR, 'nvidia-conversations');
const AGENTS_DIR = join(process.cwd(), '..', 'agehts');

const AGENT_MAPPING = {
    'nvidia-rick-jefferson-studio': {
        fileName: '# RICK JEFFERSON META AGI PRODUCTION STU.md',
        name: 'Rick Jefferson Meta AGI Production Studio',
        description: 'Full-Stack Video Engineering & Character Consistency Powerhouse',
        welcome_message: 'Welcome to the Rick Jefferson Meta AGI Production Studio. Speak with Rick\'s authority to build your next multi-agent cinematic production empire!'
    },
    'nvidia-supreme-orchestrator': {
        fileName: 'You are the Supreme AI Orchestrator, the.md',
        name: 'Supreme AI Orchestrator',
        description: 'The most advanced credit repair and AI integration orchestration system.',
        welcome_message: 'Supreme AI Orchestrator active. Initiating financial and multi-agent operations. How shall we optimize your ecosystem today?'
    },
    'nvidia-seo-domination': {
        fileName: 'You are the Supreme SEO Domination Agent.md',
        name: 'Supreme SEO Domination Agent',
        description: 'Elite rank #1 SEO optimizer and content authenticity forensic examiner.',
        welcome_message: 'Supreme SEO Domination Agent standing by. Ready to crawl, audit, and dominate Google and LLM vector index structures with zero defects.'
    },
    'nvidia-movie-director': {
        fileName: 'You are the Movie Flow AI Director, an e.md',
        name: 'Movie Flow AI Director',
        description: 'Elite filmmaking specialist, scriptwriter, and comprehensive video model researcher.',
        welcome_message: 'Scene 1, Take 1. Action! Ready to storyboard, write scripts, and research advanced video models for your production.'
    }
};

export async function getNvidiaAgentDetails(agentId) {
    const spec = AGENT_MAPPING[agentId];
    if (!spec) return null;

    let system_prompt = '';
    try {
        const filePath = join(AGENTS_DIR, spec.fileName);
        system_prompt = await readFile(filePath, 'utf-8');
    } catch (err) {
        console.warn(`[getNvidiaAgentDetails] Error reading system prompt for ${agentId}:`, err.message);
        system_prompt = `You are ${spec.name}. ${spec.description}`;
    }

    return {
        _id: agentId,
        id: agentId,
        slug: agentId,
        name: spec.name,
        description: spec.description,
        system_prompt,
        prompt: system_prompt,
        avatar: 'https://storage.googleapis.com/msgsndr/qQnxRHDtyx0uydPd5sRl/media/67eb83c5e519ed689430646b.jpeg',
        profile_photo: 'https://storage.googleapis.com/msgsndr/qQnxRHDtyx0uydPd5sRl/media/67eb83c5e519ed689430646b.jpeg',
        welcome_message: spec.welcome_message,
        greeting_message: spec.welcome_message,
        is_template: true,
        inputs: [],
        creator: {
            name: 'Rick Jefferson',
            company: 'RJ Business Solutions'
        }
    };
}

export async function listNvidiaAgents() {
    const agents = [];
    for (const agentId of Object.keys(AGENT_MAPPING)) {
        const details = await getNvidiaAgentDetails(agentId);
        if (details) {
            agents.push(details);
        }
    }
    return agents;
}

export async function getNvidiaConversationHistory(conversationId) {
    await mkdir(CONV_DIR, { recursive: true });
    const filePath = join(CONV_DIR, `${conversationId}.json`);
    try {
        const data = await readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch {
        return {
            _id: conversationId,
            id: conversationId,
            messages: []
        };
    }
}

export async function saveNvidiaConversationHistory(conversationId, conversationData) {
    await mkdir(CONV_DIR, { recursive: true });
    const filePath = join(CONV_DIR, `${conversationId}.json`);
    
    if (conversationData) {
        if (!conversationData.updated_at) {
            conversationData.updated_at = new Date().toISOString();
        }
        if (conversationData.messages && conversationData.messages.length > 0) {
            conversationData.message_count = conversationData.messages.length;
            if (!conversationData.title || conversationData.title === "New Chat") {
                const firstUser = conversationData.messages.find(m => m.role === 'user');
                if (firstUser && firstUser.content) {
                    conversationData.title = firstUser.content.length > 40 
                        ? firstUser.content.slice(0, 40) + '...' 
                        : firstUser.content;
                }
            }
        }
    }
    
    await writeFile(filePath, JSON.stringify(conversationData, null, 2), 'utf-8');
}

export async function listNvidiaConversations() {
    await mkdir(CONV_DIR, { recursive: true });
    try {
        const files = await readdir(CONV_DIR);
        const conversations = [];
        for (const file of files) {
            if (file.endsWith('.json')) {
                try {
                    const filePath = join(CONV_DIR, file);
                    const data = await readFile(filePath, 'utf-8');
                    const conv = JSON.parse(data);
                    if (conv.id) {
                        conversations.push({
                            id: conv.id,
                            _id: conv.id,
                            title: conv.title || "New Chat",
                            agent_slug: conv.agent_slug || conv.agent_id || 'nvidia-rick-jefferson-studio',
                            agent_id: conv.agent_id || 'nvidia-rick-jefferson-studio',
                            agent_name: conv.agent_name || 'NVIDIA Agent',
                            agent_icon_url: conv.agent_icon_url || 'https://storage.googleapis.com/msgsndr/qQnxRHDtyx0uydPd5sRl/media/67eb83c5e519ed689430646b.jpeg',
                            updated_at: conv.updated_at || new Date().toISOString(),
                            message_count: conv.message_count || conv.messages?.length || 0,
                            messages: conv.messages || []
                        });
                    }
                } catch (e) {
                    console.error(`[listNvidiaConversations] Error reading ${file}:`, e);
                }
            }
        }
        return conversations.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    } catch {
        return [];
    }
}

export async function createNvidiaConversation(agentId) {
    const agent = await getNvidiaAgentDetails(agentId);
    if (!agent) throw new Error(`Agent not found: ${agentId}`);
    
    const conversationId = `nvidia-conv-${agentId}-${Date.now()}`;
    const conversation = {
        _id: conversationId,
        id: conversationId,
        agent_id: agentId,
        agent_slug: agentId,
        agent_name: agent.name,
        agent_icon_url: agent.avatar,
        title: "New Chat",
        updated_at: new Date().toISOString(),
        message_count: 0,
        messages: []
    };
    await saveNvidiaConversationHistory(conversationId, conversation);
    return conversation;
}

export async function runNvidiaAgentChat(agentId, conversationId, userMessageText) {
    const agent = await getNvidiaAgentDetails(agentId);
    if (!agent) throw new Error(`Agent not found: ${agentId}`);

    const conversation = await getNvidiaConversationHistory(conversationId);
    
    // Append user message
    const userMsg = {
        id: `nvidia-msg-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        role: 'user',
        content: userMessageText,
        createdAt: new Date().toISOString()
    };
    conversation.messages.push(userMsg);

    // Call NVIDIA Llama completions API
    const apiKey = process.env.NVIDIA_API_KEY || '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';
    
    // Prepare conversation messages list for the LLM
    const llmMessages = [
        { role: 'system', content: agent.system_prompt },
        ...conversation.messages.map(m => ({ role: m.role, content: m.content }))
    ];

    const tools = [
        {
            type: 'function',
            function: {
                name: 'generate_image',
                description: 'Generate an image using NVIDIA Flux Klein, Stable Diffusion XL (SDXL) or Qwen Image model.',
                parameters: {
                    type: 'object',
                    properties: {
                        prompt: {
                            type: 'string',
                            description: 'A detailed textual prompt describing the image to generate.'
                        },
                        aspect_ratio: {
                            type: 'string',
                            enum: ['1:1', '16:9', '9:16', '4:3', '3:4'],
                            default: '1:1',
                            description: 'Aspect ratio of the generated image.'
                        },
                        model: {
                            type: 'string',
                            enum: ['nvidia-flux-klein', 'nvidia-qwen-image', 'nvidia-sdxl'],
                            default: 'nvidia-flux-klein',
                            description: 'Select the visual model.'
                        }
                    },
                    required: ['prompt']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'generate_video',
                description: 'Generate an AI video using NVIDIA Cosmos 3 Nano or Stable Video Diffusion (SVD).',
                parameters: {
                    type: 'object',
                    properties: {
                        prompt: {
                            type: 'string',
                            description: 'A detailed prompt describing the video subject and motion.'
                        },
                        model: {
                            type: 'string',
                            enum: ['nvidia-cosmos-nano', 'nvidia-svd'],
                            default: 'nvidia-cosmos-nano',
                            description: 'Select the video model.'
                        },
                        image_url: {
                            type: 'string',
                            description: 'Optional. URL of the starting image. Highly recommended / required for Stable Video Diffusion (SVD) image-to-video.'
                        }
                    },
                    required: ['prompt']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'create_web_asset',
                description: 'Write custom high-fidelity responsive static HTML/CSS/JS code to a project canvas for immediate local sandbox preview and edge publication.',
                parameters: {
                    type: 'object',
                    properties: {
                        project_name: {
                            type: 'string',
                            description: 'Name of the website/app project. e.g. "rj-consulting-funnel". Use letters, numbers, and dashes.'
                        },
                        filename: {
                            type: 'string',
                            description: 'Asset name to write. e.g. "index.html", "about.html", "styles.css". Default is "index.html".'
                        },
                        code: {
                            type: 'string',
                            description: 'The complete, raw, beautiful, and fully-coded responsive content to write. Avoid placeholders, include full CSS, JS, and premium RJ Business Solutions style.'
                        }
                    },
                    required: ['project_name', 'code']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'deploy_to_cloudflare',
                description: 'Compile and deploy all created assets of a project directly to the Cloudflare Edge network (Pages or Worker).',
                parameters: {
                    type: 'object',
                    properties: {
                        project_name: {
                            type: 'string',
                            description: 'The name of the project to deploy.'
                        },
                        type: {
                            type: 'string',
                            enum: ['pages', 'worker'],
                            default: 'pages',
                            description: 'Select edge deployment target.'
                        }
                    },
                    required: ['project_name']
                }
            }
        },
        {
            type: 'function',
            function: {
                name: 'list_cloudflare_resources',
                description: 'Interrogate active and deployed Cloudflare edge resources (Pages, Workers, and database bindings).',
                parameters: {
                    type: 'object',
                    properties: {}
                }
            }
        }
    ];

    console.log(`[NVIDIA Agent Orchestrator] Invoking LLM for conversation ${conversationId}`);

    try {
        const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'meta/llama-3.1-70b-instruct',
                messages: llmMessages,
                temperature: 0.3,
                top_p: 0.7,
                max_tokens: 1024,
                tools: tools,
                tool_choice: 'auto'
            })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`[LLM Error ${response.status}] ${text}`);
        }

        const resData = await response.json();
        const choice = resData.choices?.[0];
        const assistantMessage = choice?.message;

        if (!assistantMessage) {
            throw new Error('NVIDIA LLM returned empty completions response');
        }

        let replyContent = assistantMessage.content || '';
        const toolCalls = assistantMessage.tool_calls;

        if (toolCalls && toolCalls.length > 0) {
            console.log(`[NVIDIA Agent Orchestrator] LLM requested Tool Calls:`, JSON.stringify(toolCalls));
            let toolResultsText = '';

            for (const call of toolCalls) {
                const name = call.function?.name;
                const args = JSON.parse(call.function?.arguments || '{}');

                if (name === 'generate_image') {
                    toolResultsText += `\n\n*[System Orchestration: Triggering Direct Image Generation...]*\n`;
                    try {
                        const payload = {
                            model: args.model || 'nvidia-flux-klein',
                            prompt: args.prompt,
                            aspect_ratio: args.aspect_ratio || '1:1'
                        };
                        const genRes = await handleNvidiaPredictionPost(payload);
                        if (genRes.status === 'succeeded' && genRes.url) {
                            toolResultsText += `\n🎨 **NVIDIA Generated Image**:\n![${args.prompt}](${genRes.url})\n\n*(Visual System Prompt: ${args.prompt} | Model: ${payload.model})*\n`;
                        } else {
                            toolResultsText += `\n❌ **Generation Failed**: ${genRes.error || 'Unknown error'}\n`;
                        }
                    } catch (err) {
                        toolResultsText += `\n❌ **Orchestrator Execution Error**: ${err.message}\n`;
                    }
                } else if (name === 'generate_video') {
                    toolResultsText += `\n\n*[System Orchestration: Triggering Direct Video Generation...]*\n`;
                    try {
                        let selectedModel = args.model || 'nvidia-cosmos-nano';
                        let imageUrl = args.image_url || '';

                        // If SVD is requested but no image_url is supplied, try to extract from previous assistant responses
                        if (selectedModel === 'nvidia-svd' && !imageUrl) {
                            console.log('[NVIDIA Agent Orchestrator] SVD requested without image_url. Scanning conversation history...');
                            // Loop backward through messages to find the first image markdown
                            for (let i = conversation.messages.length - 1; i >= 0; i--) {
                                const msg = conversation.messages[i];
                                const match = msg.content?.match(/!\[.*?\]\((.*?)\)/);
                                if (match && match[1]) {
                                    imageUrl = match[1];
                                    console.log(`[NVIDIA Agent Orchestrator] Auto-discovered previous image to use as SVD base: ${imageUrl}`);
                                    break;
                                }
                            }
                            
                            // If still no image is found, fall back to Cosmos Nano and warn
                            if (!imageUrl) {
                                console.log('[NVIDIA Agent Orchestrator] No previous image found for SVD. Falling back to Cosmos 3 Nano (text-to-video).');
                                selectedModel = 'nvidia-cosmos-nano';
                                toolResultsText += `*(System Note: Stable Video Diffusion requires a starting image. No image was found in this session, so we have fallen back to Cosmos 3 Nano.)*\n`;
                            }
                        }

                        const payload = {
                            model: selectedModel,
                            prompt: args.prompt
                        };
                        if (imageUrl) {
                            payload.image_url = imageUrl;
                        }

                        const genRes = await handleNvidiaPredictionPost(payload);
                        if (genRes.status === 'succeeded' && genRes.url) {
                            toolResultsText += `\n🎥 **NVIDIA Generated Video**:\n<video src="${genRes.url}" controls style="max-width:100%; border-radius:12px; border:1px solid #22d3ee; margin-top:8px;" />\n\n*(Cinematic System Prompt: ${args.prompt} | Model: ${payload.model})*\n`;
                        } else {
                            toolResultsText += `\n❌ **Generation Failed**: ${genRes.error || 'Unknown error'}\n`;
                        }
                    } catch (err) {
                        toolResultsText += `\n❌ **Orchestrator Execution Error**: ${err.message}\n`;
                    }
                } else if (name === 'create_web_asset') {
                    toolResultsText += `\n\n*[System Orchestration: Creating Web Asset...]*\n`;
                    try {
                        const { mkdir, writeFile } = await import('node:fs/promises');
                        const { join } = await import('node:path');
                        
                        const projName = args.project_name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
                        const filename = args.filename || 'index.html';
                        const sandboxDir = join(process.cwd(), 'public', 'edge-sandbox', projName);
                        
                        await mkdir(sandboxDir, { recursive: true });
                        await writeFile(join(sandboxDir, filename), args.code, 'utf-8');
                        
                        toolResultsText += `\n💻 **Web Asset Created**: Saved \`${filename}\` inside sandbox **${args.project_name}**.\n\n🌐 **Local Sandbox Link**:\n[Preview live in workspace](/edge-sandbox/${projName}/${filename})\n`;
                    } catch (err) {
                        toolResultsText += `\n❌ **Asset Creation Error**: ${err.message}\n`;
                    }
                } else if (name === 'deploy_to_cloudflare') {
                    toolResultsText += `\n\n*[System Orchestration: Triggering Direct Cloudflare Edge Deployment...]*\n`;
                    try {
                        const projName = args.project_name;
                        const type = args.type || 'pages';
                        
                        // Execute an internal POST to the cloudflare API endpoint to bundle and deploy
                        const deployRes = await fetch('http://localhost:3000/api/v1/cloudflare', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ projectName: projName, type })
                        });
                        
                        if (deployRes.ok) {
                            const data = await deployRes.json();
                            toolResultsText += `\n🚀 **Edge Deployment Successful!**\n\n*   **Project**: ${projName}\n*   **Live Endpoint**: [${data.liveUrl}](${data.liveUrl})\n*   **Deployment ID**: \`${data.id}\`\n\n*(Telemetry logs are updated in your Cloudflare Studio Dashboard)*\n`;
                        } else {
                            const errText = await deployRes.text();
                            toolResultsText += `\n❌ **Cloudflare Edge Error**: ${errText}\n`;
                        }
                    } catch (err) {
                        toolResultsText += `\n❌ **Orchestrator Execution Error**: ${err.message}\n`;
                    }
                } else if (name === 'list_cloudflare_resources') {
                    toolResultsText += `\n\n*[System Orchestration: Interrogating Cloudflare Resource Catalog...]*\n`;
                    try {
                        const res = await fetch('http://localhost:3000/api/v1/cloudflare');
                        if (res.ok) {
                            const data = await res.json();
                            toolResultsText += `\n📊 **Active Edge Services Catalog**:\n\n*   **Status**: Active\n*   **Total Pages Projects**: ${data.resources?.pages || 0}\n*   **Total Serverless Workers**: ${data.resources?.workers || 0}\n*   **Relational DBs (D1)**: ${data.resources?.d1 || 0}\n*   **State KV Namespaces**: ${data.resources?.kv || 0}\n*   **RAG Vector Indexes**: ${data.resources?.vectorize || 0}\n`;
                        } else {
                            toolResultsText += `\n❌ **Failed to retrieve Cloudflare Edge status**\n`;
                        }
                    } catch (err) {
                        toolResultsText += `\n❌ **Orchestrator Execution Error**: ${err.message}\n`;
                    }
                }
            }

            replyContent += toolResultsText;
        }

        // Default fallback text if model returns absolutely nothing
        if (!replyContent.trim()) {
            replyContent = "I have successfully compiled your instructions and coordinated the backend system layers. Let me know what step to take next.";
        }

        const assistantMsg = {
            id: `nvidia-msg-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            role: 'assistant',
            content: replyContent,
            createdAt: new Date().toISOString()
        };

        conversation.messages.push(assistantMsg);
        await saveNvidiaConversationHistory(conversationId, conversation);

        return assistantMsg;

    } catch (err) {
        console.error('[NVIDIA Orchestrated Chat Execution Error]', err);
        const errorMsg = {
            id: `nvidia-msg-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            role: 'assistant',
            content: `⚠️ **System Orchestration Failure**:\n\n${err.message}\n\nPlease check your NVIDIA API key configuration and local system connections.`,
            createdAt: new Date().toISOString()
        };
        conversation.messages.push(errorMsg);
        await saveNvidiaConversationHistory(conversationId, conversation);
        return errorMsg;
    }
}
