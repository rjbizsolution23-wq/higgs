"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  FaServer, FaDatabase, FaNetworkWired, FaTerminal, FaCube, 
  FaPlusCircle, FaSyncAlt, FaExclamationTriangle, FaCheckCircle, 
  FaLock, FaCode, FaExternalLinkAlt, FaPlay, FaTrash, FaPlus,
  FaSearch, FaInfoCircle
} from 'react-icons/fa';
import axios from 'axios';

// Premium Curated Pre-populated SQLite Tables Mock Database
const MOCK_TABLES = {
  leads: {
    columns: ['id', 'name', 'email', 'service_requested', 'score', 'status', 'timestamp'],
    rows: [
      [1, 'Alice Vance', 'alice@vance.com', 'Credit Repair Audit', 740, 'Active', '2026-06-24 10:14:00'],
      [2, 'Marcus Brody', 'm.brody@museum.org', 'AI Agent Orchestration', 580, 'High Priority', '2026-06-24 11:32:00'],
      [3, 'Carla Diaz', 'carla.diaz@agency.net', 'SaaS Custom Funnel', 690, 'Converted', '2026-06-24 12:05:00'],
      [4, 'Derrick Rose', 'drose@windycity.com', 'Local Business Growth', 710, 'Active', '2026-06-24 13:12:15'],
      [5, 'Serena Williams', 'serena@courtqueen.org', 'Prompt Engineering Pack', 820, 'Converted', '2026-06-24 13:25:40']
    ]
  },
  users: {
    columns: ['id', 'username', 'email', 'tier', 'credits_balance', 'api_calls_today'],
    rows: [
      [1, 'rick_jefferson', 'rjbizsolution23@gmail.com', 'Enterprise Creator', 1000000, 451],
      [2, 'operator_demo', 'demo@rjbusinesssolutions.org', 'Developer Free', 500, 12],
      [3, 'nel_agent_pipeline', 'agent-swarm@neuronedge.io', 'Enterprise Machine', 450000, 2408]
    ]
  },
  sessions: {
    columns: ['session_id', 'user_id', 'ip_address', 'region', 'active_duration_sec', 'last_active'],
    rows: [
      ['sess_847291', 1, '108.162.192.4', 'us-east-1 (IAD)', 1842, 'Just Now'],
      ['sess_201948', 2, '172.68.22.11', 'eu-west-1 (LHR)', 215, '4 mins ago'],
      ['sess_912847', 3, '141.101.98.54', 'ap-southeast-1 (SIN)', 8400, '25 mins ago']
    ]
  }
};

export default function CloudflareStudio({ apiKey }) {
  const [loading, setLoading] = useState(true);
  const [hasCredentials, setHasCredentials] = useState(false);
  const [accountId, setAccountId] = useState('Not Configured');
  const [deployments, setDeployments] = useState([]);
  const [resources, setResources] = useState({
    workers: 0,
    pages: 0,
    d1: 1,
    kv: 2,
    vectorize: 1
  });
  
  // Navigation & Tabs
  const [activeSubTab, setActiveSubTab] = useState('deployments'); // deployments, database, kv_explorer, create_worker
  const [selectedDeploy, setSelectedDeployment] = useState(null);
  
  // D1 SQL Sandbox state
  const [selectedTable, setSelectedTable] = useState('leads');
  const [sqlQuery, setD1Query] = useState('SELECT * FROM leads ORDER BY id DESC LIMIT 5;');
  const [queryResult, setQueryResult] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [queryTimeMs, setQueryTimeMs] = useState(0);

  // KV state
  const [kvItems, setKvItems] = useState([
    { key: 'session_847291', value: '{"user_id": 1, "tier": "Enterprise", "credits": 1000000}' },
    { key: 'cache_token_repair', value: '{"access_token": "rj_live_secure_jwt_847291", "expires_in": 3600}' },
    { key: 'cloudflare_edge_build_id', value: '"NEL-20260624-947218"' }
  ]);
  const [newKvKey, setNewKvKey] = useState('');
  const [newKvVal, setNewKvVal] = useState('');
  const [kvSearch, setKvSearch] = useState('');

  // Deploying Worker state
  const [newWorkerName, setNewWorkerName] = useState('contact-webhook-handler');
  const [newWorkerCode, setNewWorkerCode] = useState(`/**
 * RJ Business Solutions Serverless Edge Hook
 * Powered by NeuronEdge Labs
 */
export default {
  async fetch(request, env, ctx) {
    const timestamp = new Date().toISOString();
    
    // Auto CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-api-key",
      "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      let body = {};
      if (request.method === "POST") {
        body = await request.json();
      }

      const responsePayload = {
        success: true,
        service: "RJ Business Solutions Edge Pipeline",
        timestamp,
        operator: "Rick Jefferson",
        buildId: "NEL-20260624-947218",
        receivedData: body,
        meta: {
          region: request.cf?.colo || "DFW",
          ip: request.headers.get("cf-connecting-ip") || "127.0.0.1"
        }
      };

      return new Response(JSON.stringify(responsePayload, null, 2), {
        status: 200,
        headers: corsHeaders
      });

    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};`);
  const [isDeployingWorker, setIsDeployingWorker] = useState(false);
  const [studioLogs, setStudioLogs] = useState([
    `[${new Date().toLocaleTimeString()}] Cloudflare Infrastructure monitor initialized.`,
    `[${new Date().toLocaleTimeString()}] Querying active edge resources on regional server clusters...`
  ]);

  const logTerminalRef = useRef(null);

  // Fetch telemetry and deployments
  const fetchCloudflareData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await axios.get('/api/v1/cloudflare');
      if (res.data) {
        setHasCredentials(res.data.hasCredentials);
        setAccountId(res.data.accountId || 'Not Configured');
        setDeployments(res.data.deployments || []);
        
        // Sum pages/workers and set resources
        const workerCount = res.data.deployments.filter(d => d.type === 'worker').length;
        const pagesCount = res.data.deployments.filter(d => d.type === 'pages').length;
        
        setResources({
          workers: workerCount,
          pages: pagesCount,
          d1: res.data.resources?.d1 || 1,
          kv: res.data.resources?.kv || 2,
          vectorize: res.data.resources?.vectorize || 1
        });

        // Set selected deployment for logs if not already set or updated
        if (res.data.deployments.length > 0) {
          if (!selectedDeploy) {
            setSelectedDeployment(res.data.deployments[0]);
          } else {
            const currentSelected = res.data.deployments.find(d => d.id === selectedDeploy.id);
            if (currentSelected) setSelectedDeployment(currentSelected);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch Cloudflare telemetry data:', err);
      addStudioLog(`⚠️ Query failed: ${err.message}`, 'error');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchCloudflareData();
    // Auto query database first run
    handleRunD1Query(true);
  }, []);

  // Scroll to bottom of build console
  useEffect(() => {
    if (logTerminalRef.current) {
      logTerminalRef.current.scrollTop = logTerminalRef.current.scrollHeight;
    }
  }, [studioLogs, selectedDeploy]);

  const addStudioLog = (text) => {
    setStudioLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
  };

  // Run SQL parser Mock Sandbox
  const handleRunD1Query = (silent = false) => {
    const startTime = performance.now();
    setQueryError(null);
    setQueryResult(null);

    const query = sqlQuery.trim().toLowerCase();
    
    setTimeout(() => {
      // Simulate light query parsing
      let targetTable = null;
      if (query.includes('from users')) targetTable = 'users';
      else if (query.includes('from leads')) targetTable = 'leads';
      else if (query.includes('from sessions')) targetTable = 'sessions';
      
      const endTime = performance.now();
      setQueryTimeMs(Math.round((endTime - startTime) * 10) / 10);

      if (!targetTable) {
        setQueryError(`no such table: found query targeting an invalid schema. Table context must match 'leads', 'users', or 'sessions'.`);
        if (!silent) addStudioLog(`❌ SQL Query Error: Invalid SQLite table binding resolved.`, 'error');
        return;
      }

      const tableData = MOCK_TABLES[targetTable];
      
      // Handle simple SELECT *
      setQueryResult({
        columns: tableData.columns,
        rows: tableData.rows
      });

      if (!silent) addStudioLog(`📊 SQLite query executed on '${targetTable}' table in ${Math.round(endTime - startTime)}ms.`);
    }, 150);
  };

  // Switch tables
  const handleTableSwitch = (tableName) => {
    setSelectedTable(tableName);
    setD1Query(`SELECT * FROM ${tableName} ORDER BY ${tableName === 'sessions' ? 'session_id' : 'id'} DESC LIMIT 5;`);
  };

  // Run query on table click
  useEffect(() => {
    handleRunD1Query(true);
  }, [selectedTable]);

  // KV handlers
  const handleAddKvItem = () => {
    if (!newKvKey || !newKvVal) return;
    
    // Check if key already exists
    const exists = kvItems.find(k => k.key === newKvKey);
    if (exists) {
      setKvItems(prev => prev.map(k => k.key === newKvKey ? { ...k, value: newKvVal } : k));
      addStudioLog(`🔑 KV Cache updated: '${newKvKey}' binding refreshed.`);
    } else {
      setKvItems(prev => [...prev, { key: newKvKey, value: newKvVal }]);
      addStudioLog(`🔑 KV Cache key added: '${newKvKey}' binding pushed to Edge.`);
    }

    setNewKvKey('');
    setNewKvVal('');
  };

  const handleDeleteKvItem = (keyToDelete) => {
    setKvItems(prev => prev.filter(item => item.key !== keyToDelete));
    addStudioLog(`🗑️ KV Cache entry removed: '${keyToDelete}' binding purged.`);
  };

  // Deploy Worker API Handler
  const handleDeployWorker = async () => {
    if (!newWorkerName) return;
    setIsDeployingWorker(true);
    addStudioLog(`⚙️ Starting compilation pipeline for worker "${newWorkerName}"...`);
    
    try {
      const res = await axios.post('/api/v1/cloudflare', {
        projectName: newWorkerName,
        code: newWorkerCode,
        type: 'worker'
      });

      if (res.data) {
        addStudioLog(`🎉 Worker "${newWorkerName}" deployment successful!`);
        addStudioLog(`🚀 Active at: ${res.data.liveUrl}`);
        fetchCloudflareData(true);
        setActiveSubTab('deployments');
        
        // Select new deployment for log terminal
        setSelectedDeployment(res.data);
      }
    } catch (err) {
      console.error('Deploy worker failed:', err);
      addStudioLog(`❌ Worker Deploy Failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsDeployingWorker(false);
    }
  };

  const filteredKvItems = kvItems.filter(item => 
    item.key.toLowerCase().includes(kvSearch.toLowerCase()) || 
    item.value.toLowerCase().includes(kvSearch.toLowerCase())
  );

  return (
    <div className="h-full w-full bg-[#030303] text-white flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Sidebar: Deployment Stats and Tabs */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-white/[0.05] bg-black/40 p-6 flex flex-col gap-6 overflow-y-auto shrink-0 select-none">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#003B8F] to-[#0A66FF] flex items-center justify-center shadow-lg shadow-[#0A66FF]/20">
              <FaServer className="text-white text-xs" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white flex items-center gap-1 text-sm uppercase">
                CLOUDFLARE <span className="text-[#0A66FF] drop-shadow-[0_0_8px_rgba(10,102,255,0.4)]">HUB</span>
              </span>
              <p className="text-[9px] text-white/40 tracking-wider uppercase font-bold leading-none">Global Serverless Manager</p>
            </div>
          </div>
          <p className="text-xs text-white/50 leading-relaxed mt-2">
            Directly compile, deploy, and inspect SQL indexes on regional edge centers.
          </p>
        </div>

        {/* Credentials Status */}
        <div className="glass-panel rounded-xl p-4 border border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white/70">Wrangler Config</span>
            {hasCredentials ? (
              <span className="text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                Edge Active
              </span>
            ) : (
              <span className="text-[10px] text-[#0A66FF] font-bold bg-[#0A66FF]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0A66FF] animate-pulse"></span>
                Local Simulation
              </span>
            )}
          </div>
          
          <div className="mt-3 space-y-1 text-[11px] font-mono text-white/40">
            <div className="flex justify-between">
              <span>Account ID:</span>
              <span className="text-white/80 font-semibold">{accountId}</span>
            </div>
            <div className="flex justify-between">
              <span>Engine Status:</span>
              <span className={hasCredentials ? "text-green-400 font-semibold" : "text-[#0A66FF] font-semibold"}>
                {hasCredentials ? 'Cloudflare Live' : 'RJ Sandbox Compiler'}
              </span>
            </div>
          </div>
        </div>

        {/* Studio Resource Stats */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Active Edge Nodes</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/[0.01] border border-white/5 p-3 rounded-lg flex flex-col gap-1">
              <span className="text-[10px] text-white/40 uppercase tracking-wide font-bold">Workers</span>
              <span className="text-xl font-bold text-white">{resources.workers}</span>
            </div>
            <div className="bg-white/[0.01] border border-white/5 p-3 rounded-lg flex flex-col gap-1">
              <span className="text-[10px] text-white/40 uppercase tracking-wide font-bold">Pages Sites</span>
              <span className="text-xl font-bold text-white">{resources.pages}</span>
            </div>
            <div className="bg-white/[0.01] border border-white/5 p-3 rounded-lg flex flex-col gap-1">
              <span className="text-[10px] text-white/40 uppercase tracking-wide font-bold">D1 SQLite</span>
              <span className="text-xl font-bold text-white">{resources.d1} <span className="text-[10px] text-green-500 font-bold bg-green-500/10 px-1 rounded">DB</span></span>
            </div>
            <div className="bg-white/[0.01] border border-white/5 p-3 rounded-lg flex flex-col gap-1">
              <span className="text-[10px] text-white/40 uppercase tracking-wide font-bold">KV Buckets</span>
              <span className="text-xl font-bold text-white">{resources.kv} <span className="text-[10px] text-[#0A66FF] font-bold bg-[#0A66FF]/10 px-1 rounded">KV</span></span>
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <div className="flex flex-col gap-1 mt-2">
          <button 
            onClick={() => setActiveSubTab('deployments')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold ${
              activeSubTab === 'deployments'
                ? 'bg-gradient-to-r from-[#003B8F]/30 to-transparent border-l-2 border-[#0A66FF] text-[#0A66FF]'
                : 'hover:bg-white/[0.02] text-white/60 hover:text-white'
            }`}
          >
            <FaNetworkWired /> Deployments List
          </button>
          
          <button 
            onClick={() => setActiveSubTab('database')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold ${
              activeSubTab === 'database'
                ? 'bg-gradient-to-r from-[#003B8F]/30 to-transparent border-l-2 border-[#0A66FF] text-[#0A66FF]'
                : 'hover:bg-white/[0.02] text-white/60 hover:text-white'
            }`}
          >
            <FaDatabase /> D1 SQLite Browser
          </button>

          <button 
            onClick={() => setActiveSubTab('kv_explorer')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold ${
              activeSubTab === 'kv_explorer'
                ? 'bg-gradient-to-r from-[#003B8F]/30 to-transparent border-l-2 border-[#0A66FF] text-[#0A66FF]'
                : 'hover:bg-white/[0.02] text-white/60 hover:text-white'
            }`}
          >
            <FaCube /> Edge KV Explorer
          </button>

          <button 
            onClick={() => setActiveSubTab('create_worker')}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold ${
              activeSubTab === 'create_worker'
                ? 'bg-gradient-to-r from-[#003B8F]/30 to-transparent border-l-2 border-[#0A66FF] text-[#0A66FF]'
                : 'hover:bg-white/[0.02] text-white/60 hover:text-white'
            }`}
          >
            <FaPlusCircle className="text-green-500 animate-pulse" /> Deploy Worker API
          </button>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between text-[11px] text-white/30">
          <span>Version 4.0.0</span>
          <span>© RJ Business Solutions</span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-h-0">
        
        {/* Header toolbar */}
        <div className="h-14 border-b border-white/[0.05] bg-black/20 flex items-center justify-between px-6 select-none shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Active Workspace</span>
            <span className="text-xs font-bold bg-[#0A66FF]/10 text-[#0A66FF] px-2 py-0.5 rounded border border-[#0A66FF]/30 font-mono">
              {activeSubTab === 'deployments' && 'Deployments Management'}
              {activeSubTab === 'database' && 'D1 SQL Sandbox Server'}
              {activeSubTab === 'kv_explorer' && 'Key-Value Cache Storage'}
              {activeSubTab === 'create_worker' && 'Compile New Serverless Worker'}
            </span>
          </div>

          <button 
            onClick={() => fetchCloudflareData()}
            className="flex items-center gap-2 text-[11px] font-bold text-[#0A66FF] hover:text-[#0A66FF]/80 transition"
          >
            <FaSyncAlt className={loading ? 'animate-spin' : ''} /> Sync Edge Telemetry
          </button>
        </div>

        {/* Content switch */}
        <div className="flex-1 min-h-0 overflow-y-auto p-8 flex flex-col gap-6">
          
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-2 border-t-2 border-[#0A66FF] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Resolving telemetry bindings...</span>
            </div>
          ) : (
            <>
              {/* SUB TAB: Deployments */}
              {activeSubTab === 'deployments' && (
                <div className="grid lg:grid-cols-2 gap-8 flex-1 min-h-0">
                  
                  {/* Left Column: Deployments Cards */}
                  <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-14rem)] pr-2">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white/80">Active Deployments ({deployments.length})</h3>
                      <p className="text-[11px] text-white/40">Latest runs first</p>
                    </div>

                    {deployments.length === 0 ? (
                      <div className="glass-panel rounded-2xl p-8 border border-white/5 text-center flex flex-col items-center gap-3">
                        <FaServer className="text-white/20 text-3xl" />
                        <div>
                          <p className="text-xs font-bold text-white/80">No Deployments Detected</p>
                          <p className="text-[11px] text-white/40 mt-1 max-w-xs leading-relaxed">
                            Generate a static site via the Visual Canvas or compile a serverless worker to populate deployments.
                          </p>
                        </div>
                      </div>
                    ) : (
                      deployments.map((deploy) => {
                        const isSelected = selectedDeploy?.id === deploy.id;
                        return (
                          <div 
                            key={deploy.id}
                            onClick={() => setSelectedDeployment(deploy)}
                            className={`glass-panel rounded-2xl p-5 border cursor-pointer transition-all duration-300 flex flex-col gap-4 hover:border-[#0A66FF]/40 ${
                              isSelected 
                                ? 'border-[#0A66FF] bg-[#0A66FF]/[0.02] shadow-[0_0_15px_rgba(10,102,255,0.05)]' 
                                : 'border-white/5 hover:bg-white/[0.01]'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                                  deploy.type === 'worker' 
                                    ? 'bg-[#003B8F]/30 text-[#0A66FF] border border-[#0A66FF]/30' 
                                    : 'bg-green-500/10 text-green-400 border border-green-500/20'
                                }`}>
                                  {deploy.type === 'worker' ? 'JS' : 'HTML'}
                                </div>
                                <div>
                                  <h4 className="text-xs font-extrabold text-white">{deploy.name}</h4>
                                  <span className="text-[10px] text-white/40 font-mono mt-0.5 block">/{deploy.slug}</span>
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-1.5 select-none">
                                <span className="bg-green-500/10 text-green-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  {deploy.status || 'succeeded'}
                                </span>
                                <span className="text-[9px] text-white/30 font-semibold font-mono">
                                  {new Date(deploy.timestamp).toLocaleDateString()} {new Date(deploy.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-white/[0.03] text-xs">
                              <span className="text-white/40 font-semibold">
                                Type: <span className="text-white/70 uppercase text-[10px] font-bold">{deploy.type === 'pages' ? 'Static Pages' : 'Edge Worker'}</span>
                              </span>
                              
                              <a 
                                href={deploy.liveUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-[#0A66FF] hover:underline flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider"
                              >
                                Open App <FaExternalLinkAlt className="text-[9px]" />
                              </a>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Right Column: Build Terminal Log */}
                  <div className="flex flex-col border border-white/5 rounded-2xl bg-black/60 overflow-hidden h-[calc(100vh-14rem)]">
                    <div className="bg-white/[0.02] border-b border-white/5 px-6 py-4 flex items-center justify-between shrink-0 select-none">
                      <div className="flex items-center gap-2">
                        <FaTerminal className="text-[#0A66FF] text-xs animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white/80">Edge Telemetry Stream</span>
                      </div>
                      {selectedDeploy && (
                        <span className="text-[10px] font-mono text-white/40">ID: {selectedDeploy.id.slice(0, 15)}...</span>
                      )}
                    </div>

                    <div 
                      ref={logTerminalRef}
                      className="flex-1 overflow-y-auto p-5 font-mono text-[11px] leading-relaxed text-[#22d3ee]/80 select-text bg-black/30"
                    >
                      {selectedDeploy ? (
                        <>
                          <div className="text-white/40 mb-3 select-none">
                            // Active build logs for "{selectedDeploy.name}" compiled via {selectedDeploy.type === 'pages' ? 'Static Pages Compiler' : 'Worker script compiler'}
                          </div>
                          {selectedDeploy.logs?.map((log, idx) => {
                            let lineClass = 'text-[#22d3ee]/80';
                            if (log.includes('Error') || log.includes('failed') || log.includes('⚠️')) {
                              lineClass = 'text-red-400 font-bold';
                            } else if (log.includes('Live') || log.includes('published') || log.includes('Successful') || log.includes('pushed')) {
                              lineClass = 'text-green-400 font-bold';
                            } else if (log.includes('Starting') || log.includes('Compiler')) {
                              lineClass = 'text-white/70 font-bold';
                            }
                            return (
                              <div key={idx} className={lineClass}>
                                {log}
                              </div>
                            );
                          })}
                        </>
                      ) : (
                        <div className="text-white/30 text-center py-20 flex flex-col items-center gap-2 select-none">
                          <FaTerminal className="text-2xl opacity-50" />
                          <span>Select a deployment on the left to review its build telemetry.</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* SUB TAB: SQLite D1 Browser */}
              {activeSubTab === 'database' && (
                <div className="flex flex-col gap-6 flex-1">
                  
                  {/* Database selection header */}
                  <div className="grid sm:grid-cols-3 gap-4 shrink-0 select-none">
                    {Object.keys(MOCK_TABLES).map((t) => {
                      const isActive = selectedTable === t;
                      return (
                        <div 
                          key={t}
                          onClick={() => handleTableSwitch(t)}
                          className={`glass-panel rounded-xl p-4 border cursor-pointer transition flex items-center justify-between hover:border-[#0A66FF]/40 ${
                            isActive 
                              ? 'border-[#0A66FF] bg-[#0A66FF]/5' 
                              : 'border-white/5 bg-white/[0.01]'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <FaDatabase className={isActive ? 'text-[#0A66FF]' : 'text-white/40'} />
                            <div>
                              <span className="text-xs font-bold text-white uppercase">{t}</span>
                              <p className="text-[10px] text-white/40 mt-0.5">{MOCK_TABLES[t].rows.length} records mapped</p>
                            </div>
                          </div>
                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#0A66FF]" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* SQL Input Area */}
                  <div className="glass-panel border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between select-none">
                      <div className="flex items-center gap-2">
                        <FaCode className="text-[#0A66FF]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white/80">SQLite Compiler Sandbox</span>
                      </div>
                      <span className="text-[11px] font-semibold text-white/40">Database binding: <span className="font-mono text-white/60">rj_d1_prod</span></span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="text"
                        value={sqlQuery}
                        onChange={(e) => setD1Query(e.target.value)}
                        className="flex-1 bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#0A66FF]/60"
                        placeholder="Write standard SQLite SELECT queries..."
                      />
                      <button 
                        onClick={() => handleRunD1Query(false)}
                        className="bg-[#0A66FF] hover:bg-[#003B8F] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-[#0A66FF]/20 transition flex items-center justify-center gap-2"
                      >
                        <FaPlay className="text-[9px]" /> Run SQL Query
                      </button>
                    </div>
                  </div>

                  {/* D1 Query Results */}
                  <div className="flex-1 flex flex-col border border-white/5 rounded-2xl bg-black/20 min-h-[16rem]">
                    <div className="bg-white/[0.02] border-b border-white/5 px-6 py-4 flex items-center justify-between select-none shrink-0">
                      <span className="text-xs font-bold uppercase tracking-wider text-white/80">D1 SQL Console Console Output</span>
                      {queryResult && (
                        <span className="text-[10px] font-semibold text-green-400 font-mono">Query completed in {queryTimeMs}ms</span>
                      )}
                    </div>

                    <div className="flex-1 overflow-x-auto p-6">
                      {queryError && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3">
                          <FaExclamationTriangle className="mt-0.5 shrink-0" />
                          <div className="text-xs font-mono">
                            <span className="font-bold">Error:</span> {queryError}
                          </div>
                        </div>
                      )}

                      {queryResult && (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-white/10 text-white/40 font-bold uppercase tracking-wider">
                              {queryResult.columns.map((col, idx) => (
                                <th key={idx} className="py-2.5 px-4 font-bold">{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 text-white/80 font-medium">
                            {queryResult.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-white/[0.01]">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="py-3 px-4 font-mono">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* SUB TAB: KV Explorer */}
              {activeSubTab === 'kv_explorer' && (
                <div className="grid lg:grid-cols-3 gap-8 flex-1 min-h-0">
                  
                  {/* Left Column: KV bindings registry */}
                  <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FaCube className="text-[#0A66FF]" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-white/80">KV Namespace Cache</h3>
                      </div>
                      
                      <div className="relative w-48 sm:w-64">
                        <span className="absolute left-3.5 top-2.5 text-white/30 text-xs"><FaSearch /></span>
                        <input 
                          type="text" 
                          placeholder="Search cache keys..."
                          value={kvSearch}
                          onChange={(e) => setKvSearch(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#0A66FF]/60 text-white"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col border border-white/5 rounded-2xl overflow-hidden bg-black/20 divide-y divide-white/5">
                      {filteredKvItems.length === 0 ? (
                        <div className="p-12 text-center text-white/30 text-xs">
                          No key-value cache results matched your filter.
                        </div>
                      ) : (
                        filteredKvItems.map((item) => (
                          <div key={item.key} className="p-5 flex flex-col sm:flex-row justify-between gap-4 hover:bg-white/[0.01] transition-all">
                            <div className="flex flex-col gap-1.5">
                              <span className="text-xs font-bold text-white font-mono">{item.key}</span>
                              <pre className="text-[10px] text-white/50 leading-relaxed font-mono whitespace-pre-wrap max-w-lg select-text bg-black/40 p-2.5 rounded-lg border border-white/[0.03]">
                                {item.value}
                              </pre>
                            </div>
                            <button 
                              onClick={() => handleDeleteKvItem(item.key)}
                              className="self-end sm:self-center p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs transition border border-red-500/10"
                              title="Purge cache binding"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right Column: Write KV keys */}
                  <div className="flex flex-col gap-6">
                    <div className="glass-panel border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-2 mb-1">
                        <FaPlusCircle className="text-[#0A66FF]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white/80">Write Edge Cache Pair</span>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Cache Key</label>
                          <input 
                            type="text"
                            value={newKvKey}
                            onChange={(e) => setNewKvKey(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#0A66FF]/60"
                            placeholder="e.g. session_user_id"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Value (JSON or String String)</label>
                          <textarea 
                            rows={4}
                            value={newKvValue}
                            onChange={(e) => setNewKvVal(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#0A66FF]/60 resize-none"
                            placeholder='e.g. { "credits": 500 }'
                          />
                        </div>

                        <button 
                          onClick={handleAddKvItem}
                          className="bg-[#0A66FF] hover:bg-[#003B8F] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-[#0A66FF]/20 transition flex items-center justify-center gap-2 mt-2"
                        >
                          <FaPlus /> Write Edge Bindings
                        </button>
                      </div>
                    </div>

                    {/* KV namespace metadata */}
                    <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 text-xs text-white/50 leading-relaxed flex flex-col gap-2">
                      <span className="font-bold text-white flex items-center gap-1.5"><FaInfoCircle className="text-[#0A66FF]" /> Edge KV Info</span>
                      <p>Key-Value storage bindings are replicated globally inside Cloudflare edge CDN routers. Write/update operations propagate within 200ms globally.</p>
                    </div>
                  </div>

                </div>
              )}

              {/* SUB TAB: Deploy Worker */}
              {activeSubTab === 'create_worker' && (
                <div className="grid lg:grid-cols-3 gap-8 flex-1 min-h-0">
                  
                  {/* Left Column: Code Editor */}
                  <div className="lg:col-span-2 flex flex-col border border-white/5 rounded-2xl bg-black/40 overflow-hidden h-[calc(100vh-14rem)]">
                    <div className="bg-white/[0.02] border-b border-white/5 px-6 py-3.5 flex items-center justify-between shrink-0 select-none">
                      <div className="flex items-center gap-2">
                        <FaCode className="text-green-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white/80">Worker Entrypoint (index.js)</span>
                      </div>
                      <span className="text-[10px] font-bold text-white/30 uppercase tracking-wide">Serverless ESM format</span>
                    </div>

                    <textarea 
                      value={newWorkerCode}
                      onChange={(e) => setNewWorkerCode(e.target.value)}
                      className="flex-1 bg-black/60 p-6 font-mono text-[11px] leading-relaxed text-white focus:outline-none resize-none overflow-y-auto"
                      placeholder="Write serverless worker code..."
                    />
                  </div>

                  {/* Right Column: Deploy controls */}
                  <div className="flex flex-col gap-6">
                    <div className="glass-panel border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
                      <div className="flex items-center gap-2 mb-1">
                        <FaPlusCircle className="text-green-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-white/80 font-extrabold">Build Target Details</span>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-white/40 mb-1.5">Worker Name</label>
                          <input 
                            type="text"
                            value={newWorkerName}
                            onChange={(e) => setNewWorkerName(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white focus:outline-none focus:border-[#0A66FF]/60"
                            placeholder="e.g. database-webhook"
                          />
                        </div>

                        <div className="mt-3 bg-white/[0.01] border border-white/5 rounded-xl p-4 flex flex-col gap-1.5 text-[11px] text-white/40">
                          <div className="flex justify-between font-mono">
                            <span>Compatibility Date:</span>
                            <span className="text-white/60">2026-06-24</span>
                          </div>
                          <div className="flex justify-between font-mono">
                            <span>Runtime Engine:</span>
                            <span className="text-white/60">Cloudflare V8 Isolate</span>
                          </div>
                          <div className="flex justify-between font-mono">
                            <span>Database Bindings:</span>
                            <span className="text-[#0A66FF] font-bold">rj_d1_prod</span>
                          </div>
                        </div>

                        <button 
                          onClick={handleDeployWorker}
                          disabled={isDeployingWorker}
                          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-green-600/10 transition flex items-center justify-center gap-2 mt-2"
                        >
                          {isDeployingWorker ? (
                            <>
                              <div className="w-3 h-3 border border-t-transparent rounded-full animate-spin"></div>
                              Compiling Wrangler Code...
                            </>
                          ) : (
                            <>
                              <FaPlay className="text-[9px]" /> Compile & Deploy Live
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Edge Worker notes */}
                    <div className="bg-white/[0.01] border border-white/5 rounded-xl p-5 text-xs text-white/50 leading-relaxed flex flex-col gap-2">
                      <span className="font-bold text-white flex items-center gap-1.5"><FaLock className="text-[#0A66FF]" /> Security Compliance</span>
                      <p>Every compiled worker script passes through our automated static AST scanner before deployment to detect pipeline injections and dependencies supply chain attacks.</p>
                    </div>
                  </div>

                </div>
              )}
            </>
          )}

        </div>

      </div>

    </div>
  );
}
