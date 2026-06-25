import { NextResponse } from 'next/server';

const MUAPI_BASE = 'https://api.muapi.ai';

function getApiKey(request) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    const headerKey = request.headers.get('x-api-key');
    if (headerKey) return headerKey;
    const cookieKey = request.cookies.get('muapi_key')?.value;
    return cookieKey;
}

function cleanHeaders(request) {
    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.delete('connection');
    headers.delete('cookie');
    headers.delete('Authorization');
    headers.delete('x-api-key');
    return headers;
}

export async function GET(request, { params }) {
    const slug = await params;
    const pathSegments = slug.path || [];
    const path = pathSegments.join('/');
    
    const { search } = new URL(request.url);
    const targetUrl = `${MUAPI_BASE}/api/v1/creative-agent/${path}${search}`;

    const headers = cleanHeaders(request);
    const apiKey = getApiKey(request);
    console.log(`[creative-agent proxy GET] ${targetUrl} | apiKey: ${apiKey ? apiKey.slice(0,8)+'...' : 'MISSING'}`);
    
    if (apiKey) headers.set('x-api-key', apiKey);

    if (path === 'agent-skills') {
        let upstreamSkills = [];
        try {
            const response = await fetch(targetUrl, { headers, method: 'GET' });
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) {
                    upstreamSkills = data;
                } else if (data && Array.isArray(data.skills)) {
                    upstreamSkills = data.skills;
                }
            } else {
                console.warn(`[creative-agent proxy GET agent-skills] Upstream responded with status ${response.status}`);
            }
        } catch (error) {
            console.warn(`[creative-agent proxy GET agent-skills] Upstream fetch failed:`, error.message);
        }

        // Load local skills from sibling rj-nemesis workspace
        let localSkills = [];
        try {
            const fs = await import('node:fs/promises');
            const pathLib = await import('node:path');
            const SKILLS_DIR = pathLib.join(process.cwd(), '..', 'rj-nemesis', '.agents', 'skills');
            
            try {
                const stat = await fs.stat(SKILLS_DIR);
                if (stat.isDirectory()) {
                    const entries = await fs.readdir(SKILLS_DIR, { withFileTypes: true });
                    for (const entry of entries) {
                        if (entry.isDirectory()) {
                            const folderName = entry.name;
                            const skillMdPath = pathLib.join(SKILLS_DIR, folderName, 'SKILL.md');
                            let name = folderName;
                            let description = 'Specialized NVIDIA sovereign workflow.';
                            
                            try {
                                const fileContent = await fs.readFile(skillMdPath, 'utf-8');
                                const lines = fileContent.split('\n');
                                if (lines[0] && lines[0].trim() === '---') {
                                    for (let i = 1; i < lines.length; i++) {
                                        const line = lines[i].trim();
                                        if (line === '---') break;
                                        if (line.startsWith('name:')) {
                                            name = line.substring(5).trim().replace(/^['"]|['"]$/g, '');
                                        } else if (line.startsWith('description:')) {
                                            description = line.substring(12).trim().replace(/^['"]|['"]$/g, '');
                                        }
                                    }
                                }
                            } catch (e) {
                                // Fallback to folder name and default description on parse error
                            }
                            localSkills.push({ name, description });
                        }
                    }
                }
            } catch (e) {
                console.warn(`[creative-agent proxy GET agent-skills] Local skills directory not found or unreadable:`, e.message);
            }
        } catch (error) {
            console.error(`[creative-agent proxy GET agent-skills] Error loading local skills:`, error.message);
        }

        // Merge skills: local ones override upstream duplicates, de-duplicate by name (case-insensitive)
        const skillMap = new Map();
        for (const s of upstreamSkills) {
            if (s && s.name) {
                skillMap.set(s.name.toLowerCase(), s);
            }
        }
        for (const s of localSkills) {
            if (s && s.name) {
                skillMap.set(s.name.toLowerCase(), s);
            }
        }

        const mergedSkills = Array.from(skillMap.values());
        console.log(`[creative-agent proxy GET agent-skills] Returning ${mergedSkills.length} merged skills (${upstreamSkills.length} upstream, ${localSkills.length} local).`);
        return NextResponse.json(mergedSkills);
    }

    try {
        const response = await fetch(targetUrl, { headers, method: 'GET' });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error(`[creative-agent proxy GET ERROR] ${targetUrl}:`, error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request, { params }) {
    const slug = await params;
    const pathSegments = slug.path || [];
    const path = pathSegments.join('/');
    
    const { search } = new URL(request.url);
    const targetUrl = `${MUAPI_BASE}/api/v1/creative-agent/${path}${search}`;

    const headers = cleanHeaders(request);
    const apiKey = getApiKey(request);
    console.log(`[creative-agent proxy POST] ${targetUrl} | apiKey: ${apiKey ? apiKey.slice(0,8)+'...' : 'MISSING'}`);

    if (apiKey) headers.set('x-api-key', apiKey);

    try {
        const body = await request.arrayBuffer();
        const response = await fetch(targetUrl, { method: 'POST', headers, body });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error(`[creative-agent proxy POST ERROR] ${targetUrl}:`, error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request, { params }) {
    const slug = await params;
    const pathSegments = slug.path || [];
    const path = pathSegments.join('/');
    
    const { search } = new URL(request.url);
    const targetUrl = `${MUAPI_BASE}/api/v1/creative-agent/${path}${search}`;

    const headers = cleanHeaders(request);
    const apiKey = getApiKey(request);
    console.log(`[creative-agent proxy PATCH] ${targetUrl} | apiKey: ${apiKey ? apiKey.slice(0,8)+'...' : 'MISSING'}`);

    if (apiKey) headers.set('x-api-key', apiKey);

    try {
        const body = await request.arrayBuffer();
        const response = await fetch(targetUrl, { method: 'PATCH', headers, body });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error(`[creative-agent proxy PATCH ERROR] ${targetUrl}:`, error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const slug = await params;
    const pathSegments = slug.path || [];
    const path = pathSegments.join('/');
    
    const { search } = new URL(request.url);
    const targetUrl = `${MUAPI_BASE}/api/v1/creative-agent/${path}${search}`;

    const headers = cleanHeaders(request);
    const apiKey = getApiKey(request);
    console.log(`[creative-agent proxy DELETE] ${targetUrl} | apiKey: ${apiKey ? apiKey.slice(0,8)+'...' : 'MISSING'}`);

    if (apiKey) headers.set('x-api-key', apiKey);

    try {
        const response = await fetch(targetUrl, { method: 'DELETE', headers });
        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error(`[creative-agent proxy DELETE ERROR] ${targetUrl}:`, error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
