import { NextResponse } from 'next/server';
import { handleNvidiaPredictionPost, handleNvidiaPredictionGet } from '../nvidia-handler.js';
import { getCreditsStatus } from '../nvidia-utils.js';

export async function GET(request, { params }) {
    const slug = await params;
    const pathSegments = slug.path || [];
    const path = pathSegments.join('/');

    if (path === 'credits') {
        const status = await getCreditsStatus();
        return NextResponse.json(status);
    }

    if (pathSegments[0] === 'predictions' && pathSegments[2] === 'result') {
        const id = pathSegments[1];
        const result = await handleNvidiaPredictionGet(id);
        return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}

export async function POST(request, { params }) {
    const slug = await params;
    const pathSegments = slug.path || [];
    const path = pathSegments.join('/');

    if (path === 'predictions') {
        try {
            const body = await request.json();
            const result = await handleNvidiaPredictionPost(body);
            return NextResponse.json(result);
        } catch (err) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        }
    }

    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}
