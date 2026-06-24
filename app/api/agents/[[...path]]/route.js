import { NextResponse } from 'next/server';

const MUAPI_BASE = 'https://api.muapi.ai';

function getApiKey(request) {
    // Priority 1: Direct x-api-key header
    const headerKey = request.headers.get('x-api-key');
    if (headerKey) return headerKey;

    // Priority 2: muapi_key cookie
    const cookieKey = request.cookies.get('muapi_key')?.value;
    return cookieKey;
}

function cleanHeaders(request) {
    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.delete('connection');
    headers.delete('cookie'); // CRITICAL: Stop forwarding browser cookies to MuAPI
    return headers;
}

// Build the target URL without a trailing slash when path is empty.
// e.g. GET /api/agents?is_template=true  → https://api.muapi.ai/agents?is_template=true
// e.g. GET /api/agents/by-slug/foo       → https://api.muapi.ai/agents/by-slug/foo
function buildTargetUrl(pathSegments, search) {
    const path = pathSegments.join('/');
    const base = `${MUAPI_BASE}/agents`;
    return path ? `${base}/${path}${search}` : `${base}${search}`;
}

export async function GET(request, { params }) {
    const slug = await params;
    const pathSegments = slug.path || [];
    const { search } = new URL(request.url);
    const targetUrl = buildTargetUrl(pathSegments, search);

    const headers = cleanHeaders(request);
    const apiKey = getApiKey(request);

    // --- INTERCEPT LOCAL NVIDIA AGENTS AND CONVERSATIONS ---
    const path = pathSegments.join('/');
    
    // 1. GET /api/agents or /api/agents/templates/agents or /api/agents/user/agents or /api/agents/featured/agents
    if (pathSegments.length === 0 || 
        (pathSegments[0] === 'templates' && pathSegments[1] === 'agents') || 
        (pathSegments[0] === 'user' && pathSegments[1] === 'agents') ||
        (pathSegments[0] === 'featured' && pathSegments[1] === 'agents')) {
        
        console.log(`[agents proxy GET] Intercepting agent list and injecting NVIDIA agents`);
        try {
            const { listNvidiaAgents } = await import('../../v1/nvidia/nvidia-agents-utils.js');
            const nvidiaAgents = await listNvidiaAgents();
            
            let muapiAgents = [];
            if (apiKey) {
                try {
                    headers.set('x-api-key', apiKey);
                    const response = await fetch(targetUrl, { headers, method: 'GET' });
                    if (response.ok) {
                        const data = await response.json();
                        muapiAgents = Array.isArray(data) ? data : (data.agents || data.items || []);
                    }
                } catch (err) {
                    console.warn('[agents proxy GET] Failed to fetch MuAPI agents:', err.message);
                }
            }
            return NextResponse.json([...nvidiaAgents, ...muapiAgents]);
        } catch (e) {
            console.error('[agents proxy GET] Error listing NVIDIA agents:', e);
        }
    }

    // 2. GET /api/agents/by-slug/[agentId]/[conversationId] or GET /api/agents/by-slug/[agentId]
    if (pathSegments[0] === 'by-slug' && pathSegments[1]?.startsWith('nvidia-')) {
        try {
            const { getNvidiaAgentDetails, getNvidiaConversationHistory } = await import('../../v1/nvidia/nvidia-agents-utils.js');
            if (pathSegments[2]) {
                console.log(`[agents proxy GET] Intercepting NVIDIA conversation history: ${pathSegments[2]}`);
                const history = await getNvidiaConversationHistory(pathSegments[2]);
                return NextResponse.json(history);
            } else {
                console.log(`[agents proxy GET] Intercepting NVIDIA agent details: ${pathSegments[1]}`);
                const details = await getNvidiaAgentDetails(pathSegments[1]);
                if (details) {
                    return NextResponse.json(details);
                } else {
                    return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
                }
            }
        } catch (e) {
            console.error('[agents proxy GET] Error fetching NVIDIA agent details/history:', e);
            return NextResponse.json({ error: e.message }, { status: 500 });
        }
    }

    // 3. GET /api/agents/conversations/[conversationId]
    if (pathSegments[0] === 'conversations' && pathSegments[1]?.startsWith('nvidia-conv-')) {
        console.log(`[agents proxy GET] Intercepting NVIDIA conversation history: ${pathSegments[1]}`);
        try {
            const { getNvidiaConversationHistory } = await import('../../v1/nvidia/nvidia-agents-utils.js');
            const history = await getNvidiaConversationHistory(pathSegments[1]);
            return NextResponse.json(history);
        } catch (e) {
            console.error('[agents proxy GET] Error fetching NVIDIA conversation:', e);
            return NextResponse.json({ error: e.message }, { status: 500 });
        }
    }

    // 4. GET /api/agents/user/conversations
    if (pathSegments[0] === 'user' && pathSegments[1] === 'conversations') {
        console.log(`[agents proxy GET] Intercepting user conversations and injecting NVIDIA conversations`);
        try {
            const { listNvidiaConversations } = await import('../../v1/nvidia/nvidia-agents-utils.js');
            const localConvs = await listNvidiaConversations();
            
            let muapiConvs = [];
            if (apiKey) {
                try {
                    headers.set('x-api-key', apiKey);
                    const response = await fetch(targetUrl, { headers, method: 'GET' });
                    if (response.ok) {
                        const data = await response.json();
                        muapiConvs = Array.isArray(data) ? data : [];
                    }
                } catch (err) {
                    console.warn('[agents proxy GET] Failed to fetch MuAPI conversations:', err.message);
                }
            }
            return NextResponse.json([...localConvs, ...muapiConvs]);
        } catch (e) {
            console.error('[agents proxy GET] Error listing NVIDIA conversations:', e);
            return NextResponse.json({ error: e.message }, { status: 500 });
        }
    }

    console.log(`[agents proxy GET] ${targetUrl} | apiKey: ${apiKey ? apiKey.slice(0,8)+'...' : 'MISSING'}`);
    if (apiKey) headers.set('x-api-key', apiKey);

    try {
        const response = await fetch(targetUrl, { headers, method: 'GET' });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    const slug = await params;
    const pathSegments = slug.path || [];
    const { search } = new URL(request.url);
    const targetUrl = buildTargetUrl(pathSegments, search);

    const headers = cleanHeaders(request);
    const apiKey = getApiKey(request);

    // --- INTERCEPT LOCAL NVIDIA AGENTS AND CONVERSATIONS ---
    const path = pathSegments.join('/');

    // 1. POST /api/agents/conversations (creating a conversation)
    if (pathSegments[0] === 'conversations' && pathSegments.length === 1) {
        try {
            const body = await request.clone().json();
            const agentId = body.agent_id || body.agent_slug;
            
            if (agentId && agentId.startsWith('nvidia-')) {
                console.log(`[agents proxy POST] Creating local NVIDIA conversation for agent: ${agentId}`);
                const { createNvidiaConversation } = await import('../../v1/nvidia/nvidia-agents-utils.js');
                const newConv = await createNvidiaConversation(agentId);
                return NextResponse.json(newConv);
            }
        } catch (err) {
            console.error('[agents proxy POST] Error intercepting conversation creation:', err.message);
        }
    }

    // 2. POST /api/agents/by-slug/[agentId]/[conversationId]/messages
    if (pathSegments[0] === 'by-slug' && pathSegments[1]?.startsWith('nvidia-') && pathSegments[2]) {
        console.log(`[agents proxy POST] Intercepting NVIDIA message post for: ${pathSegments[1]}/${pathSegments[2]}`);
        try {
            const body = await request.json();
            const text = body.text || body.content || body.message?.content || body.message || '';
            const { runNvidiaAgentChat } = await import('../../v1/nvidia/nvidia-agents-utils.js');
            const result = await runNvidiaAgentChat(pathSegments[1], pathSegments[2], text);
            return NextResponse.json(result);
        } catch (err) {
            console.error('[agents proxy POST] Error in runNvidiaAgentChat:', err);
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
    }

    // 3. POST /api/agents/conversations/[conversationId]/messages or POST /api/agents/conversations/[conversationId]
    if (pathSegments[0] === 'conversations' && pathSegments[1]?.startsWith('nvidia-conv-')) {
        console.log(`[agents proxy POST] Intercepting NVIDIA message post for conversation: ${pathSegments[1]}`);
        try {
            const body = await request.json();
            const text = body.text || body.content || body.message?.content || body.message || '';
            
            const { runNvidiaAgentChat, getNvidiaConversationHistory } = await import('../../v1/nvidia/nvidia-agents-utils.js');
            const convHistory = await getNvidiaConversationHistory(pathSegments[1]);
            const agentId = convHistory.agent_id || 'nvidia-rick-jefferson-studio';
            
            const result = await runNvidiaAgentChat(agentId, pathSegments[1], text);
            return NextResponse.json(result);
        } catch (err) {
            console.error('[agents proxy POST] Error in runNvidiaAgentChat by conversationId:', err);
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
    }

    console.log(`[agents proxy POST] ${targetUrl} | apiKey: ${apiKey ? apiKey.slice(0,8)+'...' : 'MISSING'}`);
    if (apiKey) headers.set('x-api-key', apiKey);

    try {
        const body = await request.arrayBuffer();
        const response = await fetch(targetUrl, { method: 'POST', headers, body });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const slug = await params;
    const pathSegments = slug.path || [];
    const { search } = new URL(request.url);
    const targetUrl = buildTargetUrl(pathSegments, search);

    const headers = cleanHeaders(request);
    const apiKey = getApiKey(request);
    if (apiKey) headers.set('x-api-key', apiKey);

    try {
        const response = await fetch(targetUrl, { method: 'DELETE', headers });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    const slug = await params;
    const pathSegments = slug.path || [];
    const { search } = new URL(request.url);
    const targetUrl = buildTargetUrl(pathSegments, search);

    const headers = cleanHeaders(request);
    const apiKey = getApiKey(request);
    if (apiKey) headers.set('x-api-key', apiKey);

    try {
        const body = await request.arrayBuffer();
        const response = await fetch(targetUrl, { method: 'PUT', headers, body });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
