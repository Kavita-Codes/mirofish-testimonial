# 🚀 ViralScope AI – Instagram Reel Virality Analyzer

ViralScope AI is a complete, functional AI-powered platform for predicting Instagram Reel virality, analyzing unpublished video content, and simulating audience behavioral emergence using the **MiroFish Multi-Agent Swarm Intelligence engine**.

---

## 🌟 Key Features

### 1. Dashboard
- Real-time statistics: Total campaigns, total Reels analysed, completed simulations, and the current highest-scoring Reel.
- Campaign history with instant audit report generation and side-by-side ranking.
- One-click **"Load 10-Reel Test Campaign"** button that pre-seeds and analyzes the complete 10-Reels suite.

### 2. Campaign Creation & Reel Management
- Organize batches of up to 10 unpublished Reels per campaign.
- Input topic, opening hook (0–3s), draft caption, hashtags, and content description.
- Upload video footage with live player preview, frame extraction, and upload progress.

### 3. Actual Computer Vision & AI Content Analysis
- **Actual Video Processing**: Extracts critical keyframes using OpenCV at key narrative timestamps:
  - Hook Window: `0.5s`, `1.5s`, `2.5s`
  - Mid-Body Narrative: `35%`, `65%`
  - Closing Call-to-Action: `95%`
- Measures actual video properties:
  - Total duration (sec)
  - 9:16 vertical aspect ratio compliance
  - Cuts per minute & editing pace
  - Visual luminance (lighting grade) and contrast
- Multimodal AI Analysis across all **10 Core Dimensions**:
  1. First 3-second hook (curiosity gap & pattern interrupt)
  2. Video structure & storytelling
  3. Visual quality & framing
  4. Editing pace & cut density
  5. Audio and subtitle synchronization
  6. Caption quality & readability
  7. CTA effectiveness
  8. Content originality vs cliches
  9. Emotional appeal
  10. Audience relevance to target demographics

### 4. Audience Simulation (MiroFish Swarm Intelligence)
- Integrates MiroFish multi-agent architecture with **7 distinct audience personas**:
  - **Gen Z (Maya Lin, 19)**: Fast scroll speed, ironic humor, heavy DM sharer.
  - **College Students (Rohan Patel, 21)**: Academic pressure, budget hacks, campus memes.
  - **Young Professionals (Priya Sharma, 27)**: Career productivity, high save rate for frameworks.
  - **Casual Viewers (Alex Miller, 24)**: Nighttime dopamine scroller, skips monologues.
  - **Entertainment Lovers (David Martinez, 23)**: Craves drama, punchlines, and comment debates.
  - **Educational Consumers (Sarah Connor, 29)**: Saves step-by-step guides, reads full captions.
  - **Content Creators (Leo Cruz, 25)**: Critiques lighting, safe zones, and cuts/sec.
- Simulates individual drop-off timestamps, engagement actions (`SHARE_DM`, `WATCH_LOOP`, `SAVE`, `COMMENT`, `SKIP_EARLY`), and genuine persona comments.
- Calculates full **Audience Retention Curves** (0s to 100% duration) to pinpoint drop-off friction points.
- Features multi-agent emergent group chat discussions.
- Clearly labeled: *"Simulated results powered by MiroFish Swarm Intelligence"*.

### 5. 100-Point Virality Scorecard (Configurable Weights)
- Interactive weight sliders:
  - Hook Strength: 20 pts
  - Retention Potential: 15 pts
  - Shareability (DM Velocity): 15 pts
  - Emotional Appeal: 10 pts
  - Originality: 10 pts
  - Caption Quality: 10 pts
  - Audience Relevance: 10 pts
  - CTA Effectiveness: 5 pts
  - Visual Storytelling: 5 pts
- Live recalculation of all 10 Reels upon weight adjustment.
- Transparent score rationale for every single metric.
- Categorizes Reels into clear Virality Tiers:
  - **Viral Breakout Candidate (100k – 1M+ views)**: 85–100 pts
  - **High Niche Reach (50k – 100k views)**: 75–84 pts
  - **Moderate Reach (15k – 50k views)**: 60–74 pts
  - **Low Discovery (<15k views)**: < 60 pts

### 6. Ranking & Side-by-Side Comparison
- Ranks all 10 Reels from #1 to #10.
- Top 3 Podium (Gold, Silver, Bronze candidates) highlighting why each candidate won.
- Side-by-side comparison modal allowing direct comparison of any 2 or 3 selected Reels.

### 7. AI Optimization Playbook
- 3 Improved Hook Variations per Reel (Negative Hook, Curiosity Gap, Identity Question).
- Loop-optimized captions with strategic line breaks and rewatch triggers.
- Stratified Hashtags categorized by Broad, Niche, and High-Intent Community.
- Pacing & editing cut adjustments with recommended target duration.
- High-conversion CTA recommendations optimized for DM shares and saves.

### 8. Final Report Generator
- One-click export in **Markdown (.md)** format.
- One-click export in professional **PDF (.pdf)** format.
- Contains complete rankings, score matrix, simulation insights, and methodological limitations.

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Python, Flask, CORS, OpenCV (`cv2`), ReportLab.
- **AI Engine**: Google Gemini API (`google-genai` / `google-generativeai` / DashScope OpenAI compatible).
- **Simulation**: MiroFish Swarm Intelligence Multi-Agent Engine.
- **Database**: MongoDB via `pymongo` with automatic resilient file-backed persistence fallback.

---

## 🏃 How to Run

### Quick Launch (Backend + Built Frontend)
To run the server on `http://localhost:5005`:
```powershell
& .\backend\.venv\Scripts\python.exe run_viralscope.py
```
Open your browser and navigate to:
👉 **`http://localhost:5005`**

### Running Frontend in Development Mode (Hot Reload)
To run the React development server on `http://localhost:3000`:
```powershell
cd viralscope-frontend
npm run dev
```
Proxy routes `/api/*` automatically forward to the backend on port 5005.
