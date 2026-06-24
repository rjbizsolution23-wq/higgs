import { NextResponse } from 'next/server';
import { handleNvidiaPredictionPost, handleNvidiaPredictionGet } from '../../v1/nvidia/nvidia-handler.js';
import { getCreditsStatus } from '../../v1/nvidia/nvidia-utils.js';

const MUAPI_BASE = 'https://api.muapi.ai';

function getApiKey(request) {
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
    return headers;
}

// Proxies /api/api/v1/* -> https://api.muapi.ai/api/v1/*
// Also intercepts NVIDIA local prediction and credit calls!
export async function GET(request, { params }) {
    const slug = await params;
    const pathSegments = slug.path || [];
    const path = pathSegments.join('/');
    
    // Intercept NVIDIA prediction polling
    if (pathSegments[0] === 'predictions' && pathSegments[1]?.startsWith('nvidia-') && pathSegments[2] === 'result') {
        const id = pathSegments[1];
        console.log(`[double-api NVIDIA Poll GET] Local prediction result request for: ${id}`);
        const result = await handleNvidiaPredictionGet(id);
        return NextResponse.json(result);
    }

    // Intercept NVIDIA credits
    if (pathSegments[0] === 'nvidia' && pathSegments[1] === 'credits') {
        console.log(`[double-api NVIDIA Credits GET] Local credits request`);
        const status = await getCreditsStatus();
        return NextResponse.json(status);
    }

    // Intercept double-api NVIDIA prediction polling if needed
    if (pathSegments[0] === 'nvidia' && pathSegments[1] === 'predictions' && pathSegments[3] === 'result') {
        const id = pathSegments[2];
        console.log(`[double-api NVIDIA Poll GET] Local prediction result request (prefixed path) for: ${id}`);
        const result = await handleNvidiaPredictionGet(id);
        return NextResponse.json(result);
    }

    const { search } = new URL(request.url);
    const targetUrl = `${MUAPI_BASE}/api/v1/${path}${search}`;

    const headers = cleanHeaders(request);
    const apiKey = getApiKey(request);
    
    console.log(`[double-api proxy GET] ${targetUrl} | apiKey: ${apiKey ? apiKey.slice(0,8)+'...' : 'MISSING'}`);
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
    const path = pathSegments.join('/');

    // Intercept NVIDIA prediction submit
    if (pathSegments[0] === 'nvidia' && pathSegments[1] === 'predictions') {
        console.log(`[double-api NVIDIA Submit POST] Local prediction submit`);
        try {
            const body = await request.json();
            const result = await handleNvidiaPredictionPost(body);
            return NextResponse.json(result);
        } catch (err) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
    }
    
    const { search } = new URL(request.url);
    const targetUrl = `${MUAPI_BASE}/api/v1/${path}${search}`;

    const headers = cleanHeaders(request);
    const apiKey = getApiKey(request);
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
