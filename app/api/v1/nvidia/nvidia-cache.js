import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

const CACHE_DIR = join(homedir(), '.rj');
const CACHE_FILE = join(CACHE_DIR, 'nvidia-predictions.json');

// Local in-memory fallback
let memoryCache = {};

async function loadCache() {
    try {
        await mkdir(CACHE_DIR, { recursive: true });
        const data = await readFile(CACHE_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return memoryCache;
    }
}

async function saveCache(cache) {
    memoryCache = cache;
    try {
        await mkdir(CACHE_DIR, { recursive: true });
        await writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
    } catch (err) {
        console.error('[NVIDIA Cache Save Error] Failed to write cache file:', err.message);
    }
}

export async function getPrediction(id) {
    const cache = await loadCache();
    return cache[id] || null;
}

export async function savePrediction(id, result) {
    const cache = await loadCache();
    cache[id] = {
        ...result,
        updatedAt: new Date().toISOString()
    };
    await saveCache(cache);
}
