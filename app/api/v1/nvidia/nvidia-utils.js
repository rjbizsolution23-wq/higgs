import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

const STORE_DIR = join(homedir(), '.rj');
const STORE_FILE = join(STORE_DIR, 'nvidia-credits.json');
const HARD_CAP = 5000;
const SOFT_WARN = 0.8 * HARD_CAP;
const HALT_THRESHOLD = 0.95 * HARD_CAP;

// Ensure public output dir exists
const PUBLIC_OUTPUT_DIR = join(process.cwd(), 'public', 'nvidia-output');

export async function getCreditsStatus() {
    try {
        await mkdir(STORE_DIR, { recursive: true });
        const data = await readFile(STORE_FILE, 'utf-8');
        const state = JSON.parse(data);
        return {
            used: state.used || 0,
            remaining: Math.max(0, HARD_CAP - (state.used || 0)),
            cap: HARD_CAP,
            status: state.used >= HALT_THRESHOLD ? 'halt' : (state.used >= SOFT_WARN ? 'warn' : 'ok')
        };
    } catch {
        return { used: 0, remaining: HARD_CAP, cap: HARD_CAP, status: 'ok' };
    }
}

export async function recordCreditsCall(estimatedCredits = 1) {
    await mkdir(STORE_DIR, { recursive: true });
    let state = { used: 0, lastReset: new Date().toISOString() };
    try {
        const data = await readFile(STORE_FILE, 'utf-8');
        state = JSON.parse(data);
    } catch {
        // use default state
    }

    if (state.used >= HALT_THRESHOLD) {
        throw new Error(`[NVIDIA Credits Exhausted] Enforced limit reached: ${state.used}/${HARD_CAP}. Please contact Rick Jefferson.`);
    }

    state.used += estimatedCredits;
    await writeFile(STORE_FILE, JSON.stringify(state, null, 2));

    return {
        used: state.used,
        remaining: Math.max(0, HARD_CAP - state.used),
        status: state.used >= HALT_THRESHOLD ? 'halt' : (state.used >= SOFT_WARN ? 'warn' : 'ok')
    };
}

export async function saveBase64Asset(requestId, base64Data, extension) {
    await mkdir(PUBLIC_OUTPUT_DIR, { recursive: true });
    const fileName = `${requestId}.${extension}`;
    const filePath = join(PUBLIC_OUTPUT_DIR, fileName);
    const buffer = Buffer.from(base64Data, 'base64');
    await writeFile(filePath, buffer);
    return `/nvidia-output/${fileName}`;
}

export async function callNvidiaApi(path, body) {
    const apiKey = process.env.NVIDIA_API_KEY || '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';
    const url = `https://ai.api.nvidia.com/v1${path}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errText = await response.text();
        throw new Error(`[NVIDIA API Error ${response.status}] ${path} :: ${errText}`);
    }

    return await response.json();
}
