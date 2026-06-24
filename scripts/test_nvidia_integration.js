const assert = require('assert');

async function runTests() {
    console.log('🚀 Starting NVIDIA integration and Meta AGI verification suite...\n');

    const BASE_URL = 'http://localhost:3000';

    // 1. Verify /api/v1/nvidia/credits
    console.log('📝 Test 1: Fetching local NVIDIA credit status...');
    try {
        const res = await fetch(`${BASE_URL}/api/v1/nvidia/credits`);
        assert.strictEqual(res.status, 200, `Expected 200 status, got ${res.status}`);
        const data = await res.json();
        console.log('✅ Credits retrieved:', JSON.stringify(data), '\n');
        assert.ok(data.hasOwnProperty('used'), 'Credits must have "used" field');
        assert.ok(data.hasOwnProperty('cap'), 'Credits must have "cap" field');
        assert.ok(data.hasOwnProperty('status'), 'Credits must have "status" field');
    } catch (err) {
        console.error('❌ Test 1 Failed:', err.message);
        process.exit(1);
    }

    // 2. Verify /api/agents/templates/agents lists the custom NVIDIA agents
    console.log('📝 Test 2: Verifying custom NVIDIA Agent listings in the catalog...');
    try {
        const res = await fetch(`${BASE_URL}/api/agents/templates/agents`);
        assert.strictEqual(res.status, 200, `Expected 200 status, got ${res.status}`);
        const list = await res.json();
        console.log(`✅ Loaded ${list.length} agents.`);
        const nvAgents = list.filter(a => a.id && a.id.startsWith('nvidia-'));
        console.log('Custom NVIDIA Agents found:', nvAgents.map(a => a.name));
        assert.ok(nvAgents.length > 0, 'Should find at least one nvidia agent in the list');
        const rjAgent = nvAgents.find(a => a.id === 'nvidia-rick-jefferson-studio');
        assert.ok(rjAgent, 'Rick Jefferson Meta AGI agent should be in the list');
        assert.strictEqual(rjAgent.creator.company, 'RJ Business Solutions');
    } catch (err) {
        console.error('❌ Test 2 Failed:', err.message);
        process.exit(1);
    }

    // 3. Create a conversation session with the Rick Jefferson Meta AGI Agent
    console.log('\n📝 Test 3: Creating conversation session with Rick Jefferson Meta AGI Agent...');
    let convId = '';
    try {
        const res = await fetch(`${BASE_URL}/api/agents/conversations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ agent_id: 'nvidia-rick-jefferson-studio' })
        });
        assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
        const conv = await res.json();
        console.log('✅ Conversation session created successfully:', conv.id);
        assert.ok(conv.id.startsWith('nvidia-conv-'), 'Should use custom nvidia session ID prefix');
        convId = conv.id;
    } catch (err) {
        console.error('❌ Test 3 Failed:', err.message);
        process.exit(1);
    }

    // 4. Test Chat Conversation and Orchestrator Logic
    console.log('\n📝 Test 4: Dispatching message to orchestrator to trigger cognitive reasoning...');
    try {
        const res = await fetch(`${BASE_URL}/api/agents/conversations/${convId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'Hello Rick! Can you tell me your operational focus and confirm if you are online?' })
        });
        assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);
        const message = await res.json();
        console.log('\n🤖 Agent Response:\n', message.content);
        assert.ok(message.content, 'Expected a non-empty agent response content');
        assert.strictEqual(message.role, 'assistant', 'Response must be from assistant role');
    } catch (err) {
        console.error('❌ Test 4 Failed:', err.message);
        process.exit(1);
    }

    console.log('\n🎉 ALL INTEGRATION TESTS PASSED SUCCESSFULLY! The Multi-Agent Meta AGI System is fully online and ready for production!');
}

runTests();
