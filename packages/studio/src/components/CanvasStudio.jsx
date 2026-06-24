"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  FaPlay, FaCloudUploadAlt, FaCode, FaSyncAlt, FaCopy, 
  FaDesktop, FaTabletAlt, FaMobileAlt, FaList, FaPalette, 
  FaDatabase, FaPaperPlane, FaTerminal, FaCheckCircle, 
  FaInfoCircle, FaChevronRight, FaTimes, FaUser, FaRobot 
} from 'react-icons/fa';

// Premium Curated RJ Business Solutions Templates
const TEMPLATES = {
  saas: {
    name: 'SaaS Dashboard Funnel',
    description: 'Corporate client dashboard with SVG graphs, credit repair tracking, and premium dark glassmorphism.',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NeuronEdge Labs | SaaS Operator Console</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            font-family: 'Outfit', sans-serif;
            background-color: #030303;
        }
        .glass-panel {
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .text-glow {
            text-shadow: 0 0 10px rgba(10, 102, 255, 0.5);
        }
    </style>
</head>
<body class="text-white min-h-screen flex flex-col">
    <!-- Header -->
    <header class="glass-panel border-b border-white/5 h-16 flex items-center justify-between px-8 sticky top-0 z-50">
        <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#003B8F] to-[#0A66FF] flex items-center justify-center shadow-lg shadow-[#0A66FF]/20">
                <i class="fa-solid fa-brain text-white text-sm"></i>
            </div>
            <div>
                <span class="font-extrabold tracking-tight text-white flex items-center gap-1.5 text-base">
                    NEURONEDGE <span class="text-[#0A66FF] text-glow">LABS</span>
                </span>
                <p class="text-[10px] text-white/40 tracking-wider uppercase font-semibold leading-none">Fleet Operator</p>
            </div>
        </div>
        <div class="flex items-center gap-4 text-xs font-semibold">
            <span class="text-[#0A66FF] flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Edge Live
            </span>
            <div class="h-4 w-px bg-white/10"></div>
            <span class="text-white/60">Rick Jefferson</span>
        </div>
    </header>

    <!-- App Shell Layout -->
    <div class="flex-1 flex min-h-0">
        <!-- Sidebar Navigation -->
        <aside class="w-64 border-r border-white/5 bg-black/40 p-6 flex flex-col gap-6 hidden md:flex">
            <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Core Modules</p>
                <nav class="space-y-1">
                    <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#003B8F]/30 to-transparent border-l-2 border-[#0A66FF] text-[#0A66FF] font-medium transition-all text-sm">
                        <i class="fa-solid fa-chart-pie"></i> Dashboard
                    </a>
                    <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.02] text-white/60 hover:text-white transition-all text-sm">
                        <i class="fa-solid fa-robot"></i> AI Orchestrator
                    </a>
                    <a href="#" class="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.02] text-white/60 hover:text-white transition-all text-sm">
                        <i class="fa-solid fa-server"></i> Cloudflare Nodes
                    </a>
                </nav>
            </div>
            
            <div class="mt-auto">
                <div class="glass-panel rounded-2xl p-4 flex flex-col gap-3">
                    <div class="flex items-center gap-2">
                        <i class="fa-solid fa-circle-info text-[#0A66FF]"></i>
                        <span class="text-[11px] font-bold text-white/80">Support Tier</span>
                    </div>
                    <p class="text-xs text-white/50 leading-relaxed">Enterprise automation managed by **RJ Business Solutions**.</p>
                </div>
            </div>
        </aside>

        <!-- Main Workspace -->
        <main class="flex-1 overflow-y-auto p-8 flex flex-col gap-8">
            <section class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 class="text-3xl font-extrabold tracking-tight">Active Fleet Operations</h1>
                    <p class="text-white/50 text-sm mt-1">Real-time compilation logs and multi-agent model credits telemetry.</p>
                </div>
                <button class="bg-[#0A66FF] hover:bg-[#003B8F] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-[#0A66FF]/20 transition-all flex items-center gap-2">
                    <i class="fa-solid fa-plus"></i> Launch New App
                </button>
            </section>

            <!-- Stats Grid -->
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="glass-panel rounded-2xl p-6 flex flex-col gap-2">
                    <span class="text-white/40 text-xs font-semibold uppercase tracking-wider">Cloudflare Deployments</span>
                    <span class="text-3xl font-bold tracking-tight text-white">41 <span class="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full ml-2">Active</span></span>
                </div>
                <div class="glass-panel rounded-2xl p-6 flex flex-col gap-2">
                    <span class="text-white/40 text-xs font-semibold uppercase tracking-wider">Model Queries (24h)</span>
                    <span class="text-3xl font-bold tracking-tight text-[#0A66FF] text-glow">9,482</span>
                </div>
                <div class="glass-panel rounded-2xl p-6 flex flex-col gap-2">
                    <span class="text-white/40 text-xs font-semibold uppercase tracking-wider">D1 SQLite Rows</span>
                    <span class="text-3xl font-bold tracking-tight text-white">2.1M</span>
                </div>
                <div class="glass-panel rounded-2xl p-6 flex flex-col gap-2">
                    <span class="text-white/40 text-xs font-semibold uppercase tracking-wider">Serverless Success Rate</span>
                    <span class="text-3xl font-bold tracking-tight text-white">99.98%</span>
                </div>
            </div>

            <!-- Chart / Table Area Split -->
            <div class="grid lg:grid-cols-3 gap-6">
                <!-- Data Table -->
                <div class="glass-panel rounded-2xl p-6 lg:col-span-2 flex flex-col gap-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-base font-bold">Recent Deployment Logs</h3>
                        <span class="text-xs text-[#0A66FF] hover:underline cursor-pointer font-semibold">View All</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs border-collapse">
                            <thead>
                                <tr class="border-b border-white/5 text-white/40 font-bold uppercase tracking-wider">
                                    <th class="py-3 px-4">Project Name</th>
                                    <th class="py-3 px-4">Engine Type</th>
                                    <th class="py-3 px-4">Latency</th>
                                    <th class="py-3 px-4">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/5 text-white/80 font-medium">
                                <tr>
                                    <td class="py-3.5 px-4 font-bold text-white">rj-consulting-funnel</td>
                                    <td class="py-3.5 px-4">Pages Edge</td>
                                    <td class="py-3.5 px-4">12ms</td>
                                    <td class="py-3.5 px-4"><span class="bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Success</span></td>
                                </tr>
                                <tr>
                                    <td class="py-3.5 px-4 font-bold text-white">lead-scoring-agent</td>
                                    <td class="py-3.5 px-4">Edge Worker</td>
                                    <td class="py-3.5 px-4">8ms</td>
                                    <td class="py-3.5 px-4"><span class="bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Success</span></td>
                                </tr>
                                <tr>
                                    <td class="py-3.5 px-4 font-bold text-white">tax-crm-router</td>
                                    <td class="py-3.5 px-4">Edge Worker</td>
                                    <td class="py-3.5 px-4">14ms</td>
                                    <td class="py-3.5 px-4"><span class="bg-[#0A66FF]/10 text-[#0A66FF] px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Active</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Live Metrics Widget -->
                <div class="glass-panel rounded-2xl p-6 flex flex-col gap-6 justify-between">
                    <div class="flex flex-col gap-1">
                        <h3 class="text-base font-bold">Edge Database Bindings</h3>
                        <p class="text-xs text-white/50 leading-relaxed">Integrated key-value storage and SQL indexes active on regional server farms.</p>
                    </div>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-white/70 flex items-center gap-2"><i class="fa-solid fa-database text-[#0A66FF]"></i> Primary D1</span>
                            <span class="text-xs font-bold font-mono">rj_d1_prod</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-white/70 flex items-center gap-2"><i class="fa-solid fa-cube text-[#0A66FF]"></i> Sessions KV</span>
                            <span class="text-xs font-bold font-mono">sessions_kv</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-xs text-white/70 flex items-center gap-2"><i class="fa-solid fa-bezier-curve text-[#0A66FF]"></i> RAG Vectors</span>
                            <span class="text-xs font-bold font-mono">vector_rag_index</span>
                        </div>
                    </div>
                    <div class="p-3 bg-white/5 rounded-xl border border-white/5 text-center text-[11px] text-white/40 font-semibold uppercase tracking-wider">
                        Power by RJ Business Solutions
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>`
  },
  funnel: {
    name: 'Lead-Gen Capture Page',
    description: 'High-converting consulting landing page with interactive questionnaires, glowing headers, and direct action triggers.',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RJ Business Solutions | AI Optimization Strategy</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            font-family: 'Outfit', sans-serif;
            background-color: #030303;
        }
        .glass-card {
            background: rgba(10, 102, 255, 0.01);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(10, 102, 255, 0.08);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .text-glow {
            text-shadow: 0 0 15px rgba(10, 102, 255, 0.4);
        }
        .button-glow {
            box-shadow: 0 0 20px rgba(10, 102, 255, 0.3);
        }
    </style>
</head>
<body class="text-white min-h-screen flex flex-col justify-between">
    <!-- Navbar -->
    <nav class="h-20 flex items-center justify-between px-8 md:px-16 border-b border-white/[0.03]">
        <div class="flex items-center gap-3">
            <img src="https://storage.googleapis.com/msgsndr/qQnxRHDtyx0uydPd5sRl/media/67eb83c5e519ed689430646b.jpeg" class="w-9 h-9 rounded-lg" alt="RJ Brand Logo">
            <span class="font-extrabold text-base tracking-tight">RJ BUSINESS <span class="text-[#0A66FF] text-glow">SOLUTIONS</span></span>
        </div>
        <div class="hidden sm:flex items-center gap-8 text-xs font-semibold text-white/60 uppercase tracking-wider">
            <a href="#" class="hover:text-white transition">Services</a>
            <a href="#" class="hover:text-white transition">Client Success</a>
            <a href="#" class="hover:text-white transition">Case Studies</a>
        </div>
        <div>
            <a href="#quote" class="bg-white/5 hover:bg-[#0A66FF] text-white hover:text-white px-5 py-2.5 rounded-lg border border-white/10 hover:border-[#0A66FF] font-bold text-xs uppercase tracking-wider transition-all duration-300">
                Book Strategy Case
            </a>
        </div>
    </nav>

    <!-- Hero Area -->
    <main class="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20 text-center gap-8 max-w-4xl mx-auto">
        <div class="bg-[#0A66FF]/10 text-[#0A66FF] px-4 py-1.5 rounded-full border border-[#0A66FF]/30 text-xs font-bold uppercase tracking-widest animate-pulse">
            Enterprise AI Automation 2026
        </div>
        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight text-white">
            Build cleaner systems.<br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#0A66FF] to-[#22d3ee]">Ship smarter business.</span>
        </h1>
        <p class="text-white/60 text-base md:text-lg max-w-2xl leading-relaxed">
            Rick Jefferson builds custom AI pipelines, website architectures, and automated customer acquisition systems that reduce business chaos and accelerate operational performance.
        </p>

        <!-- Form Card -->
        <section id="quote" class="glass-card rounded-3xl p-8 md:p-10 w-full max-w-lg mt-6 text-left">
            <h3 class="text-xl font-bold mb-2">Claim Your AI Diagnostics Blueprint</h3>
            <p class="text-xs text-white/40 leading-relaxed mb-6">Discover where automation cuts repetitive tasks. Free analysis provided for operators.</p>
            
            <form id="leadForm" class="space-y-4" onsubmit="event.preventDefault(); alert('Strategy analysis successfully compiled! Our team will reach out within 2 hours.');">
                <div>
                    <label class="block text-[11px] uppercase font-bold text-white/40 tracking-wider mb-2">Your Full Name</label>
                    <input type="text" required placeholder="Rick Jefferson" class="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-xs font-semibold focus:outline-none focus:border-[#0A66FF] transition-all">
                </div>
                <div>
                    <label class="block text-[11px] uppercase font-bold text-white/40 tracking-wider mb-2">Corporate Email Address</label>
                    <input type="email" required placeholder="rjbizsolution23@gmail.com" class="w-full h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-xs font-semibold focus:outline-none focus:border-[#0A66FF] transition-all">
                </div>
                <div>
                    <label class="block text-[11px] uppercase font-bold text-white/40 tracking-wider mb-2">Primary Bottleneck</label>
                    <select class="w-full h-11 bg-[#030303] border border-white/10 rounded-xl px-4 text-xs font-semibold focus:outline-none focus:border-[#0A66FF] transition-all text-white/70">
                        <option>Repetitive Employee Labor</option>
                        <option>Lead Leakage / CRM Inefficiencies</option>
                        <option>Stale Website & Non-converting Funnels</option>
                        <option>Cloudflare / DevOps Scaling Inquiries</option>
                    </select>
                </div>
                
                <button type="submit" class="w-full h-12 bg-[#0A66FF] hover:bg-[#003B8F] text-white text-xs uppercase tracking-widest font-extrabold rounded-xl transition-all duration-300 button-glow flex items-center justify-center gap-2 mt-2 cursor-pointer">
                    Submit Blueprint Inquiry <i class="fa-solid fa-arrow-right"></i>
                </button>
            </form>
        </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/5 py-8 px-8 text-center text-xs text-white/40">
        <p class="font-semibold text-white/60 mb-2">RJ BUSINESS SOLUTIONS — FOUNDER OPERATING SYSTEMS</p>
        <p>1342 NM 333, Tijeras, New Mexico 87059 | support@rjbusinesssolutions.org | +1 (414) 430-4277</p>
        <p class="mt-4 text-[11px] tracking-wide text-white/20">© 2026 Rick Jefferson. All Rights Reserved. Built on Cloudflare Edge.</p>
    </footer>
</body>
</html>`
  },
  lms: {
    name: 'Course LMS Portal Hub',
    description: 'High-fidelity educational dashboard with lesson navigation, curriculum lists, downloadable workbook checklists, and course progress.',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RJ Solutions Academy | Full Stack AI Operations</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            font-family: 'Outfit', sans-serif;
            background-color: #030303;
        }
        .glass-layout {
            background: rgba(255, 255, 255, 0.01);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.04);
        }
    </style>
</head>
<body class="text-white min-h-screen flex flex-col justify-between">
    <!-- Nav -->
    <header class="glass-layout border-b border-white/5 h-16 flex items-center justify-between px-6">
        <div class="flex items-center gap-3">
            <img src="https://storage.googleapis.com/msgsndr/qQnxRHDtyx0uydPd5sRl/media/67eb83c5e519ed689430646b.jpeg" class="w-8 h-8 rounded" alt="Logo">
            <span class="font-extrabold tracking-tight text-xs uppercase md:text-sm">RJ SOLUTIONS <span class="text-[#0A66FF]">ACADEMY</span></span>
        </div>
        <div class="flex items-center gap-3 text-xs">
            <span class="text-white/40">Student Progress:</span>
            <div class="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                <div class="w-[66%] h-full bg-[#0A66FF]"></div>
            </div>
            <span class="font-bold text-[#0A66FF]">66%</span>
        </div>
    </header>

    <!-- Course Content Split -->
    <div class="flex-1 grid md:grid-cols-4 gap-6 p-6 max-w-7xl mx-auto w-full">
        <!-- Lesson Syllabus Panel -->
        <aside class="glass-layout rounded-2xl p-4 md:col-span-1 flex flex-col gap-4">
            <h3 class="font-bold text-xs uppercase tracking-wider text-white/40 px-2">Course Syllabus</h3>
            
            <nav class="space-y-1">
                <div class="text-xs font-bold text-[#0A66FF] px-2 py-1 mt-2 flex items-center justify-between">
                    <span>MODULE 1: Foundation</span>
                    <i class="fa-solid fa-check text-green-500"></i>
                </div>
                <button onclick="changeLesson('Lesson 1: Business Operations Archetype', 'Build the core workflow structure of your pipeline first.')" class="w-full text-left px-3 py-2 text-xs rounded-lg bg-green-500/10 text-white flex items-center gap-2 font-medium">
                    <i class="fa-solid fa-circle-check text-green-500"></i> Business Operations Archetype
                </button>
                <button onclick="changeLesson('Lesson 2: Simple CRM & Lead routing', 'Configure direct pipelines with zero lead leakage.')" class="w-full text-left px-3 py-2 text-xs rounded-lg bg-green-500/10 text-white flex items-center gap-2 font-medium">
                    <i class="fa-solid fa-circle-check text-green-500"></i> Simple CRM & Lead Routing
                </button>

                <div class="text-xs font-bold text-[#0A66FF] px-2 py-1 mt-4">MODULE 2: AI Orchestrator</div>
                <button onclick="changeLesson('Lesson 3: Llama-3.1 System Prompts', 'Understand how context injection aligns the fleet nodes.')" class="w-full text-left px-3 py-2 text-xs rounded-lg bg-[#0A66FF]/10 text-[#0A66FF] flex items-center gap-2 font-bold">
                    <i class="fa-solid fa-play text-xs"></i> Llama-3.1 System Prompts
                </button>
                <button onclick="changeLesson('Lesson 4: Cloudflare Wrangler deploying', 'Deploy static web assets to regional edge nodes.')" class="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/[0.02] text-white/50 flex items-center gap-2 font-medium">
                    <i class="fa-solid fa-lock text-xs text-white/30"></i> Cloudflare Wrangler deploying
                </button>
            </nav>
        </aside>

        <!-- Lesson Viewer Main -->
        <main class="md:col-span-3 flex flex-col gap-6">
            <!-- Video Player Widget -->
            <div class="glass-layout rounded-3xl p-6 flex flex-col gap-4">
                <div class="aspect-video w-full bg-black/60 rounded-2xl flex items-center justify-center relative overflow-hidden border border-white/5 shadow-2xl">
                    <div class="absolute inset-0 bg-gradient-to-tr from-[#003B8F]/30 to-[#0A66FF]/20 animate-pulse"></div>
                    <i class="fa-solid fa-circle-play text-5xl text-[#0A66FF] cursor-pointer hover:scale-110 transition z-10"></i>
                    <span class="absolute bottom-4 left-4 text-xs font-semibold text-white/40 tracking-wider">Rick Jefferson Masterclass Player</span>
                </div>
                
                <div>
                    <span class="bg-[#0A66FF]/10 text-[#0A66FF] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">Module 2 • Lesson 3</span>
                    <h2 id="lessonTitle" class="text-xl font-bold mt-2">Lesson 3: Llama-3.1 System Prompts</h2>
                    <p id="lessonDesc" class="text-xs text-white/50 mt-1">Understand how context injection aligns the fleet nodes with client specifications.</p>
                </div>
            </div>

            <!-- Resource Downloads -->
            <div class="grid sm:grid-cols-2 gap-4">
                <div class="glass-layout rounded-2xl p-5 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#0A66FF]"><i class="fa-solid fa-file-pdf"></i></div>
                        <div>
                            <p class="text-xs font-bold">Implementation Workbook</p>
                            <span class="text-[10px] text-white/40">12 pages SOP guide</span>
                        </div>
                    </div>
                    <button class="bg-[#0A66FF] hover:bg-[#003B8F] text-white text-xs px-4 py-2 rounded-lg font-bold transition">Download</button>
                </div>
                <div class="glass-layout rounded-2xl p-5 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#0A66FF]"><i class="fa-solid fa-list-check"></i></div>
                        <div>
                            <p class="text-xs font-bold">Cloudflare Deploy Checklist</p>
                            <span class="text-[10px] text-white/40">Production checklist PDF</span>
                        </div>
                    </div>
                    <button class="bg-[#0A66FF] hover:bg-[#003B8F] text-white text-xs px-4 py-2 rounded-lg font-bold transition">Download</button>
                </div>
            </div>
        </main>
    </div>

    <!-- JS Helper -->
    <script>
        function changeLesson(title, description) {
            document.getElementById('lessonTitle').innerText = title;
            document.getElementById('lessonDesc').innerText = description;
        }
    </script>
</body>
</html>`
  },
  scheduler: {
    name: 'Appointment Scheduler',
    description: 'Booking landing page with interactive schedule calendar cards, service cards, and an edge checkout action mock.',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Book AI Audit Session | RJ Business Solutions</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body {
            font-family: 'Outfit', sans-serif;
            background-color: #030303;
        }
        .glass-panel {
            background: rgba(255, 255, 255, 0.01);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.04);
        }
    </style>
</head>
<body class="text-white min-h-screen flex flex-col justify-between">
    <main class="flex-1 max-w-4xl mx-auto w-full p-6 py-12 flex flex-col gap-8">
        <section class="text-center flex flex-col gap-3">
            <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">Schedule Your 1-on-1 AI Architecture Session</h1>
            <p class="text-white/60 text-sm max-w-lg mx-auto leading-relaxed">Choose a session slot below with Rick Jefferson to map out your custom automated edge structures.</p>
        </section>

        <!-- Services -->
        <div class="grid sm:grid-cols-2 gap-4">
            <div class="glass-panel rounded-2xl p-5 border-l-4 border-[#0A66FF] flex items-center justify-between">
                <div>
                    <h3 class="font-bold text-sm">AI Infrastructure Diagnostics</h3>
                    <p class="text-xs text-white/50 mt-1">Syllabus analysis and Cloudflare KV configuration reviews.</p>
                </div>
                <span class="text-[#0A66FF] font-bold text-xs">Free</span>
            </div>
            <div class="glass-panel rounded-2xl p-5 hover:border-l-4 hover:border-[#0A66FF] transition flex items-center justify-between">
                <div>
                    <h3 class="font-bold text-sm">Enterprise System Build Strategy</h3>
                    <p class="text-xs text-white/50 mt-1">Multi-agent conversational routing architecture.</p>
                </div>
                <span class="text-white/40 font-bold text-xs">Enterprise</span>
            </div>
        </div>

        <!-- Interactive Calendar UI -->
        <section class="glass-panel rounded-3xl p-6 flex flex-col gap-6">
            <h3 class="font-bold text-base flex items-center gap-2"><i class="fa-solid fa-calendar text-[#0A66FF]"></i> Select Booking Date</h3>
            <div class="grid grid-cols-3 sm:grid-cols-5 gap-3">
                <button onclick="selectDate(this, 'Mon, Jun 29')" class="glass-panel rounded-xl p-4 text-center cursor-pointer hover:border-[#0A66FF]/40 border border-white/5 transition flex flex-col gap-1">
                    <span class="text-[10px] text-white/40 uppercase font-bold">Jun 29</span>
                    <span class="text-sm font-bold text-white">Mon</span>
                </button>
                <button onclick="selectDate(this, 'Tue, Jun 30')" class="glass-panel rounded-xl p-4 text-center cursor-pointer hover:border-[#0A66FF]/40 border border-white/5 transition flex flex-col gap-1">
                    <span class="text-[10px] text-white/40 uppercase font-bold">Jun 30</span>
                    <span class="text-sm font-bold text-white">Tue</span>
                </button>
                <button onclick="selectDate(this, 'Wed, Jul 01')" class="glass-panel rounded-xl p-4 text-center cursor-pointer hover:border-[#0A66FF]/40 border border-white/5 transition flex flex-col gap-1 bg-[#0A66FF]/20 border-[#0A66FF] border-l-2">
                    <span class="text-[10px] text-[#0A66FF] uppercase font-bold">Jul 01</span>
                    <span class="text-sm font-bold text-white">Wed</span>
                </button>
                <button onclick="selectDate(this, 'Thu, Jul 02')" class="glass-panel rounded-xl p-4 text-center cursor-pointer hover:border-[#0A66FF]/40 border border-white/5 transition flex flex-col gap-1">
                    <span class="text-[10px] text-white/40 uppercase font-bold">Jul 02</span>
                    <span class="text-sm font-bold text-white">Thu</span>
                </button>
                <button onclick="selectDate(this, 'Fri, Jul 03')" class="glass-panel rounded-xl p-4 text-center cursor-pointer hover:border-[#0A66FF]/40 border border-white/5 transition flex flex-col gap-1">
                    <span class="text-[10px] text-white/40 uppercase font-bold">Jul 03</span>
                    <span class="text-sm font-bold text-white">Fri</span>
                </button>
            </div>

            <!-- Booking Submit form -->
            <form id="bookForm" class="space-y-4" onsubmit="event.preventDefault(); alert('Booking confirmed for ' + (selectedDateStr || 'Wed, Jul 01') + '! Check your email inbox for the Google Meet access token.');">
                <button type="submit" class="w-full h-12 bg-[#0A66FF] hover:bg-[#003B8F] text-white text-xs uppercase tracking-widest font-extrabold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-2 shadow-lg shadow-[#0A66FF]/15">
                    Schedule Chosen Slot <i class="fa-solid fa-arrow-right"></i>
                </button>
            </form>
        </section>
    </main>

    <script>
        let selectedDateStr = 'Wed, Jul 01';
        function selectDate(element, dateStr) {
            document.querySelectorAll('button').forEach(btn => {
                if (btn.onclick && btn.onclick.toString().includes('selectDate')) {
                    btn.className = 'glass-panel rounded-xl p-4 text-center cursor-pointer hover:border-[#0A66FF]/40 border border-white/5 transition flex flex-col gap-1';
                }
            });
            element.className = 'glass-panel rounded-xl p-4 text-center cursor-pointer hover:border-[#0A66FF]/40 border border-[#0A66FF] transition flex flex-col gap-1 bg-[#0A66FF]/20';
            selectedDateStr = dateStr;
        }
    </script>
</body>
</html>`
  }
};

const AGENTS = [
  { id: 'nvidia-supreme-orchestrator', name: 'Supreme AI Orchestrator', role: 'System Architect & Pipeline Optimizer' },
  { id: 'nvidia-rick-jefferson-studio', name: 'Rick Jefferson Meta AGI Studio', role: 'Brand & Full-Stack Video Expert' },
  { id: 'nvidia-seo-domination', name: 'Supreme SEO Domination Agent', role: 'Search Crawler & SEO Guard' },
  { id: 'nvidia-movie-director', name: 'Movie Flow AI Director', role: 'Creative Scripting & Motion Specialist' }
];

export default function CanvasStudio({ apiKey }) {
  const [projectName, setProjectName] = useState('rj-saas-dashboard');
  const [selectedModel, setSelectedModel] = useState('nvidia/nemotron-4-340b');
  const [selectedAgent, setSelectedAgent] = useState('nvidia-supreme-orchestrator');
  const [activeCode, setActiveCode] = useState(TEMPLATES.saas.code);
  const [prompt, setPrompt] = useState('');
  
  // Layout Controls
  const [deviceMode, setDeviceMode] = useState('desktop'); // desktop, tablet, mobile
  const [showCodePane, setShowCodePane] = useState(true);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState(null);

  // Chat/Orchestration History
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: "Welcome! I am the **Supreme AI Orchestrator**. I'm connected to the workspace system on your Cloudflare edge nodes. Tell me what application or dashboard you'd like to build under Rick Jefferson's corporate specs!" }
  ]);
  const [conversationId, setConversationId] = useState(`nvidia-conv-canvas-${Date.now()}`);

  // Build Telemetry Logs
  const [logs, setLogs] = useState([
    `[${new Date().toLocaleTimeString()}] Canvas Studio initialized on port 3000.`,
    `[${new Date().toLocaleTimeString()}] RJ Compiler active. Awaiting edge instructions...`
  ]);

  const previewFrameRef = useRef(null);
  const logTerminalRef = useRef(null);
  const chatBottomRef = useRef(null);

  // Scroll terminal logs to bottom automatically
  useEffect(() => {
    if (logTerminalRef.current) {
      logTerminalRef.current.scrollTop = logTerminalRef.current.scrollHeight;
    }
  }, [logs]);

  // Scroll chat logs to bottom automatically
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Update real-time iframe preview whenever activeCode changes
  useEffect(() => {
    const frame = previewFrameRef.current;
    if (frame) {
      const doc = frame.contentDocument || frame.contentWindow.document;
      doc.open();
      doc.write(activeCode);
      doc.close();
    }
  }, [activeCode]);

  // Handle Preset template selection
  const handleSelectTemplate = (templateKey) => {
    if (TEMPLATES[templateKey]) {
      setActiveCode(TEMPLATES[templateKey].code);
      setLogs(prev => [
        ...prev, 
        `[${new Date().toLocaleTimeString()}] Loaded Preset Template: "${TEMPLATES[templateKey].name}"`
      ]);
    }
  };

  // Submit Prompt to Nvidia Multi-Agent loop
  const handleSendPrompt = async () => {
    if (!prompt.trim()) return;
    
    const userMsg = prompt;
    setPrompt('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsCompiling(true);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Sending architectural prompt to Llama agent [${selectedAgent}]...`]);

    try {
      // 1. Send chat command to local proxy endpoint
      const response = await fetch(`/api/agents/conversations/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_id: selectedAgent,
          message: userMsg
        })
      });

      if (!response.ok) {
        throw new Error(`Agent loop failed: ${response.statusText}`);
      }

      const resData = await response.json();
      
      // 2. Format answer content and update chat feed
      const textAnswer = resData.content || "I have completed compiling your layout elements. Let me know what step to take next.";
      setChatMessages(prev => [...prev, { role: 'assistant', text: textAnswer }]);

      // 3. Scan response for compiled HTML codes to inject directly into preview
      // Check if code contains ```html ... ``` tags
      const htmlBlockMatch = textAnswer.match(/```html([\s\S]*?)```/i);
      if (htmlBlockMatch && htmlBlockMatch[1]) {
        const compiledHtml = htmlBlockMatch[1].trim();
        setActiveCode(compiledHtml);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Dynamic code updates compiled successfully! Reloading iframe preview.`]);
      } else if (textAnswer.includes('<!DOCTYPE html>') || textAnswer.includes('<html')) {
        // Fallback: If no backticks but contains raw html, extract HTML directly
        const startIdx = textAnswer.indexOf('<!DOCTYPE html>');
        const endIdx = textAnswer.lastIndexOf('</html>');
        if (startIdx !== -1 && endIdx !== -1) {
          const extractedHtml = textAnswer.substring(startIdx, endIdx + 7);
          setActiveCode(extractedHtml);
          setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Extracted code block successfully compiled.`]);
        }
      }

      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Orchestrator loop returned. Completed step iteration.`]);
    } catch (err) {
      console.error('[Send Prompt Error]', err);
      setChatMessages(prev => [...prev, { role: 'assistant', text: `⚠️ **AI Orchestrator Error**: ${err.message}` }]);
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Error: Prompt routing failed (${err.message})`]);
    } finally {
      setIsCompiling(false);
    }
  };

  // Trigger deploy to Cloudflare Edge
  const handleDeployToCloudflare = async () => {
    setIsDeploying(true);
    setDeployResult(null);
    setLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] packaging active canvas elements for project "${projectName}"...`,
      `[${new Date().toLocaleTimeString()}] Initiating edge compilation pipeline.`
    ]);

    try {
      const response = await fetch('/api/v1/cloudflare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          type: 'pages',
          code: activeCode
        })
      });

      if (!response.ok) {
        throw new Error(`Deployment engine failed: ${response.statusText}`);
      }

      const result = await response.json();
      setDeployResult(result);
      
      // Inject build telemetry logs returning from Cloudflare
      if (result.logs && Array.isArray(result.logs)) {
        setLogs(prev => [...prev, ...result.logs]);
      } else {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Cloudflare static pages deployed successfully.`]);
      }
      
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] LIVE URL: ${result.liveUrl}`]);
    } catch (err) {
      console.error('[Deploy Error]', err);
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Error during edge build: ${err.message}`]);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeCode);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Code copied to clipboard.`]);
  };

  return (
    <div className="flex h-full w-full bg-[#030303] overflow-hidden text-white font-sans">
      
      {/* LEFT SIDEBAR: AI Prompt Console & Presets */}
      <div className="w-[360px] flex-shrink-0 border-r border-white/[0.04] bg-black/40 flex flex-col min-h-0 relative z-10">
        
        {/* Panel Header */}
        <div className="p-4 border-b border-white/[0.04] flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0A66FF] flex items-center justify-center">
            <FaCode className="text-white text-xs" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight">Canvas &amp; App Builder</h2>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Multi-Agent AGI System</p>
          </div>
        </div>

        {/* Section Scroller */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 min-h-0 select-none">
          
          {/* Quick presets */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-extrabold text-white/40 tracking-wider flex items-center gap-1.5">
              <FaPalette className="text-[#0A66FF]" /> Premium RJ Brand Layouts
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleSelectTemplate('saas')}
                className="glass-panel text-left p-2.5 rounded-xl hover:bg-white/[0.03] hover:border-[#0A66FF]/30 border border-white/5 transition-all text-xs flex flex-col gap-1 cursor-pointer"
              >
                <span className="font-bold text-white/90">SaaS Console</span>
                <span className="text-[10px] text-white/40 leading-none">Dashboard</span>
              </button>
              <button 
                onClick={() => handleSelectTemplate('funnel')}
                className="glass-panel text-left p-2.5 rounded-xl hover:bg-white/[0.03] hover:border-[#0A66FF]/30 border border-white/5 transition-all text-xs flex flex-col gap-1 cursor-pointer"
              >
                <span className="font-bold text-white/90">Consulting Page</span>
                <span className="text-[10px] text-white/40 leading-none">Capture Form</span>
              </button>
              <button 
                onClick={() => handleSelectTemplate('lms')}
                className="glass-panel text-left p-2.5 rounded-xl hover:bg-white/[0.03] hover:border-[#0A66FF]/30 border border-white/5 transition-all text-xs flex flex-col gap-1 cursor-pointer"
              >
                <span className="font-bold text-white/90">Academy LMS</span>
                <span className="text-[10px] text-white/40 leading-none">Lesson Hub</span>
              </button>
              <button 
                onClick={() => handleSelectTemplate('scheduler')}
                className="glass-panel text-left p-2.5 rounded-xl hover:bg-white/[0.03] hover:border-[#0A66FF]/30 border border-white/5 transition-all text-xs flex flex-col gap-1 cursor-pointer"
              >
                <span className="font-bold text-white/90">Audit Booking</span>
                <span className="text-[10px] text-white/40 leading-none">Scheduler Calendar</span>
              </button>
            </div>
          </div>

          {/* AI Orchestrator Console */}
          <div className="space-y-3 glass-panel rounded-2xl p-4 border border-white/5 bg-white/[0.01]">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase font-extrabold text-white/40 tracking-wider flex items-center gap-1.5">
                <FaRobot className="text-[#0A66FF]" /> Conversational Agent
              </label>
              <span className="text-[9px] font-bold text-[#0A66FF] bg-[#0A66FF]/10 px-2 py-0.5 rounded-full uppercase leading-none">Llama-3.1</span>
            </div>

            {/* Agent Selector */}
            <div className="space-y-1">
              <span className="text-[10px] text-white/30 font-semibold uppercase">Target Agent spec:</span>
              <select 
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3 h-9 text-xs text-white/80 focus:outline-none focus:border-[#0A66FF] font-semibold cursor-pointer"
              >
                {AGENTS.map(agent => (
                  <option key={agent.id} value={agent.id}>{agent.name}</option>
                ))}
              </select>
            </div>

            {/* Model Selector */}
            <div className="space-y-1">
              <span className="text-[10px] text-white/30 font-semibold uppercase">Coding Brain model:</span>
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-[#080808] border border-white/10 rounded-xl px-3 h-9 text-xs text-white/80 focus:outline-none focus:border-[#0A66FF] font-semibold cursor-pointer"
              >
                <option value="nvidia/nemotron-4-340b">nvidia/nemotron-4-340b (Supreme Code)</option>
                <option value="meta/llama-3.1-70b-instruct">meta/llama-3.1-70b (High Logic)</option>
                <option value="meta/codellama-70b">meta/codellama-70b (Synthesizer)</option>
                <option value="mistralai/mixtral-8x22b-instruct">mixtral-8x22b-instruct (Fast Speed)</option>
              </select>
            </div>

            {/* Interactive Chat Stream collapsible */}
            <div className="border border-white/5 rounded-xl bg-black/50 overflow-hidden flex flex-col h-44">
              <div className="p-2 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-white/40">Active Chat Pipeline</span>
                <span className="text-[9px] font-mono text-[#0A66FF]">{chatMessages.length} Messages</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2.5 space-y-3 font-medium select-text">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1">
                      {msg.role === 'user' ? (
                        <>
                          <span className="text-[8px] font-bold text-white/30 uppercase">Operator</span>
                          <FaUser className="text-[8px] text-white/40" />
                        </>
                      ) : (
                        <>
                          <FaRobot className="text-[8px] text-[#0A66FF]" />
                          <span className="text-[8px] font-bold text-[#0A66FF] uppercase">AI Agent</span>
                        </>
                      )}
                    </div>
                    <p className={`text-[10px] p-2.5 rounded-xl max-w-[85%] leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-[#0A66FF] text-white rounded-tr-none' 
                        : 'bg-white/5 text-white/80 rounded-tl-none border border-white/5'
                    }`}>
                      {msg.text}
                    </p>
                  </div>
                ))}
                <div ref={chatBottomRef} />
              </div>
            </div>

            {/* Prompt Input & Send */}
            <div className="flex gap-2">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask agent to modify layout styles, add a pricing table or change copy..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendPrompt();
                  }
                }}
                className="flex-1 bg-black/60 border border-white/10 rounded-xl p-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#0A66FF] h-14 resize-none leading-relaxed font-semibold"
              />
              <button 
                onClick={handleSendPrompt}
                disabled={isCompiling}
                className="w-11 h-14 rounded-xl bg-[#0A66FF] hover:bg-[#003B8F] disabled:bg-white/5 text-white disabled:text-white/20 flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
              >
                {isCompiling ? <div className="animate-spin text-xs">◌</div> : <FaPaperPlane className="text-xs" />}
              </button>
            </div>
          </div>

          {/* Cloudflare Edge Deployer Section */}
          <div className="space-y-3 glass-panel rounded-2xl p-4 border border-white/5 bg-gradient-to-br from-[#003B8F]/10 to-transparent">
            <label className="text-[10px] uppercase font-extrabold text-white/40 tracking-wider flex items-center gap-1.5">
              <FaCloudUploadAlt className="text-[#0A66FF]" /> One-Click Cloudflare Publish
            </label>
            
            <div className="space-y-1">
              <span className="text-[10px] text-white/30 font-semibold uppercase">Project Directory Name:</span>
              <input 
                type="text" 
                value={projectName}
                onChange={(e) => setProjectName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                placeholder="rj-saas-dashboard"
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 h-9 text-xs font-semibold focus:outline-none focus:border-[#0A66FF]"
              />
            </div>

            <button 
              onClick={handleDeployToCloudflare}
              disabled={isDeploying}
              className="w-full h-11 bg-white hover:bg-[#0A66FF] text-black hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-lg shadow-white/5 flex items-center justify-center gap-2 cursor-pointer border border-transparent disabled:bg-white/5 disabled:text-white/20"
            >
              {isDeploying ? (
                <>
                  <div className="animate-spin text-sm">◌</div>
                  <span>Deploying to Edge...</span>
                </>
              ) : (
                <>
                  <FaCloudUploadAlt className="text-sm" />
                  <span>Deploy to Cloudflare</span>
                </>
              )}
            </button>

            {/* Live Link results modal inside list */}
            {deployResult && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-green-400">
                  <FaCheckCircle />
                  <span>Edge Deploy Successful</span>
                </div>
                <p class="text-[10px] text-white/50 leading-relaxed">Your page is immediately live with HTTPS routing.</p>
                <a 
                  href={deployResult.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-300 hover:text-white text-xs font-bold p-2 rounded-lg text-center transition flex items-center justify-center gap-2 border border-green-500/10"
                >
                  Visit Live Site <i class="fa-solid fa-external-link text-[10px]"></i>
                </a>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* CENTER & RIGHT SECTION: Split Preview & Code Workspace */}
      <div className="flex-1 flex flex-col min-h-0 bg-[#030303]">
        
        {/* Workspace Toolbar Controls */}
        <div className="h-14 border-b border-white/[0.04] bg-black/20 flex items-center justify-between px-6 flex-shrink-0 gap-4 select-none">
          {/* Left: Display toggles */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white/40 uppercase mr-2 tracking-wider">Device Mode:</span>
            <div className="flex bg-white/5 border border-white/5 p-0.5 rounded-lg">
              <button 
                onClick={() => setDeviceMode('desktop')}
                title="Desktop View (100% Width)"
                className={`w-8 h-8 rounded-md flex items-center justify-center text-xs transition ${deviceMode === 'desktop' ? 'bg-[#0A66FF] text-white shadow-md' : 'text-white/40 hover:text-white'}`}
              >
                <FaDesktop />
              </button>
              <button 
                onClick={() => setDeviceMode('tablet')}
                title="Tablet View (768px Width)"
                className={`w-8 h-8 rounded-md flex items-center justify-center text-xs transition ${deviceMode === 'tablet' ? 'bg-[#0A66FF] text-white shadow-md' : 'text-white/40 hover:text-white'}`}
              >
                <FaTabletAlt />
              </button>
              <button 
                onClick={() => setDeviceMode('mobile')}
                title="Mobile View (375px Width)"
                className={`w-8 h-8 rounded-md flex items-center justify-center text-xs transition ${deviceMode === 'mobile' ? 'bg-[#0A66FF] text-white shadow-md' : 'text-white/40 hover:text-white'}`}
              >
                <FaMobileAlt />
              </button>
            </div>
          </div>

          {/* Center: File bar info */}
          <div className="flex items-center gap-3 glass-panel rounded-full px-4 py-1.5 border border-white/5 text-[11px] font-bold font-mono text-white/50 bg-white/[0.01]">
            <span className="text-[#0A66FF]">●</span> index.html
          </div>

          {/* Right: Code editor toggles and copy */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowCodePane(!showCodePane)}
              className={`h-9 px-4 rounded-xl border border-white/10 text-xs font-bold transition flex items-center gap-2 cursor-pointer ${showCodePane ? 'bg-[#0A66FF] border-[#0A66FF] text-white shadow-md shadow-[#0A66FF]/15' : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'}`}
            >
              <FaCode />
              <span>{showCodePane ? 'Hide Editor' : 'Open Editor'}</span>
            </button>
            <button 
              onClick={handleCopyCode}
              className="h-9 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-xs font-bold text-white/70 hover:text-white hover:bg-white/10 transition flex items-center gap-2 cursor-pointer"
            >
              <FaCopy />
              <span>Copy</span>
            </button>
          </div>
        </div>

        {/* Dynamic Split Screen Body */}
        <div className="flex-1 flex min-h-0 relative overflow-hidden">
          
          {/* Left Split: Live Iframe Preview Area */}
          <div className="flex-1 bg-[#0a0a0a] flex items-center justify-center p-6 relative overflow-hidden min-w-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,102,255,0.02),transparent)] pointer-events-none"></div>
            
            {/* Device Wrapper */}
            <div 
              className="h-full rounded-2xl shadow-2xl border border-white/[0.04] bg-[#030303] overflow-hidden flex flex-col transition-all duration-300 relative"
              style={{
                width: deviceMode === 'desktop' ? '100%' : deviceMode === 'tablet' ? '768px' : '375px',
                maxWidth: '100%'
              }}
            >
              {/* Iframe top frame address bar */}
              <div className="h-8 border-b border-white/[0.04] bg-black/60 px-4 flex items-center gap-2 flex-shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                </div>
                <div className="flex-1 max-w-[280px] mx-auto bg-white/5 border border-white/5 rounded-md h-5 px-3 flex items-center text-[10px] font-bold font-mono text-white/30 truncate select-all justify-center">
                  /edge-sandbox/{projectName}/index.html
                </div>
              </div>

              {/* Sandbox preview frame */}
              <iframe 
                ref={previewFrameRef}
                title="Visual Site Canvas Live Sandbox"
                className="w-full flex-1 bg-black border-none select-text"
              />
            </div>
          </div>

          {/* Right Split: Code Sandbox Editor Panel */}
          {showCodePane && (
            <div className="w-[450px] border-l border-white/[0.04] bg-[#050505] flex flex-col flex-shrink-0 min-h-0">
              <div className="p-3 border-b border-white/[0.04] bg-black/40 flex items-center justify-between flex-shrink-0 px-5">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-white/30">Code Sandbox Workspace</span>
                <span className="text-[10px] font-mono text-white/30">{activeCode.length} chars</span>
              </div>
              <div className="flex-1 overflow-hidden relative">
                <textarea 
                  value={activeCode}
                  onChange={(e) => setActiveCode(e.target.value)}
                  className="w-full h-full bg-[#030303] text-white/90 p-6 font-mono text-[11.5px] leading-relaxed resize-none focus:outline-none scrollbar-thin select-text"
                  spellCheck={false}
                />
              </div>
            </div>
          )}

        </div>

        {/* BOTTOM TERMINAL LOGS: retro console */}
        <div className="h-44 border-t border-white/[0.04] bg-[#050505] flex flex-col flex-shrink-0 min-h-0">
          <div className="p-2 border-b border-white/[0.04] bg-black/40 flex items-center justify-between px-6 flex-shrink-0">
            <span className="text-[9px] uppercase font-extrabold tracking-wider text-white/40 flex items-center gap-1.5">
              <FaTerminal className="text-[#0A66FF]" /> Compilation &amp; Wrangler Build logs
            </span>
            <button 
              onClick={() => setLogs([`[${new Date().toLocaleTimeString()}] Telemetry console reset.`])}
              className="text-[9px] font-bold text-white/40 hover:text-white transition uppercase cursor-pointer"
            >
              Clear Logs
            </button>
          </div>
          <div 
            ref={logTerminalRef}
            className="flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed text-[#22d3ee]/80 bg-black/50 select-text"
          >
            {logs.map((log, idx) => {
              let textClass = 'text-[#22d3ee]/80';
              if (log.includes('Error') || log.includes('failed') || log.includes('⚠️')) {
                textClass = 'text-red-400 font-bold';
              } else if (log.includes('LIVE URL') || log.includes('published') || log.includes('Successful')) {
                textClass = 'text-green-400 font-bold';
              } else if (log.includes('Preset Template') || log.includes('initialized')) {
                textClass = 'text-white/50';
              }
              return (
                <div key={idx} className={textClass}>
                  {log}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
