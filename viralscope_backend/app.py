import os
import uuid
from datetime import datetime
from flask import Flask, request, jsonify, send_file, send_from_directory, Response
from flask_cors import CORS
from werkzeug.utils import secure_filename

from .config import Config
from .database import db
from .video_processor import VideoProcessor
from .gemini_analyzer import gemini_analyzer
from .mirofish_simulator import mirofish_simulator, AUDIENCE_PERSONAS
from .scorecard import virality_scorecard, DEFAULT_CRITERIA_WEIGHTS
from .optimizer import ai_optimizer
from .report_generator import report_generator
from .sample_data import SEED_REELS_DATA, ensure_seed_videos

def create_app():
    Config.ensure_directories()
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for React frontend (ports 5173, 3000, 5002, etc.)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    @app.route('/api/health')
    def health():
        mirofish_status = mirofish_simulator.check_mirofish_backend_health()
        return jsonify({
            "status": "online",
            "service": "ViralScope AI – Instagram Reel Virality Analyzer",
            "is_real_mongo": db.is_real_mongo,
            "gemini_analyzer_type": gemini_analyzer.client_type,
            "mirofish_engine": mirofish_status,
            "timestamp": datetime.utcnow().isoformat()
        })

    # ==================== 1. DASHBOARD OVERVIEW ====================
    @app.route('/api/stats', methods=['GET'])
    def get_dashboard_stats():
        campaigns = db.campaigns.find(sort=[('created_at', -1)])
        total_campaigns = len(campaigns)

        all_reels = db.reels.find()
        total_reels = len(all_reels)

        analysed_reels = [r for r in all_reels if r.get('status') in ['analysed', 'completed']]
        simulated_reels = [r for r in all_reels if r.get('simulation')]

        # Find highest scoring Reel
        highest_reel = None
        max_score = -1.0
        for r in all_reels:
            score = r.get('scorecard', {}).get('total_score', 0)
            if score > max_score:
                max_score = score
                highest_reel = {
                    "id": r.get('id'),
                    "topic": r.get('topic'),
                    "hook": r.get('hook'),
                    "score": score,
                    "viral_tier": r.get('scorecard', {}).get('viral_tier'),
                    "campaign_id": r.get('campaign_id')
                }

        # Recent 5 campaigns
        recent_campaigns = []
        for c in campaigns[:5]:
            c_reels = [r for r in all_reels if r.get('campaign_id') == c.get('id')]
            recent_campaigns.append({
                "id": c.get('id'),
                "name": c.get('name'),
                "niche": c.get('niche'),
                "target_audience": c.get('target_audience'),
                "reels_count": len(c_reels),
                "created_at": c.get('created_at'),
                "status": c.get('status', 'draft')
            })

        return jsonify({
            "total_campaigns": total_campaigns,
            "total_reels_analysed": len(analysed_reels),
            "completed_simulations": len(simulated_reels),
            "highest_scoring_reel": highest_reel,
            "recent_campaigns": recent_campaigns
        })

    # ==================== 2. CAMPAIGN CREATION & MANAGEMENT ====================
    @app.route('/api/campaigns', methods=['GET'])
    def list_campaigns():
        campaigns = db.campaigns.find(sort=[('created_at', -1)])
        all_reels = db.reels.find()
        result = []
        for c in campaigns:
            c_id = c.get('id')
            c_reels = [r for r in all_reels if r.get('campaign_id') == c_id]
            avg_score = 0.0
            scored = [r.get('scorecard', {}).get('total_score', 0) for r in c_reels if r.get('scorecard')]
            if scored:
                avg_score = round(sum(scored) / len(scored), 1)

            result.append({
                **c,
                "reels_count": len(c_reels),
                "average_virality_score": avg_score
            })
        return jsonify(result)

    @app.route('/api/campaigns', methods=['POST'])
    def create_campaign():
        data = request.get_json() or {}
        name = data.get('name', '').strip()
        niche = data.get('niche', '').strip()
        target_audience = data.get('target_audience', '').strip()

        if not name:
            return jsonify({"error": "Campaign name is required"}), 400

        campaign_id = f"camp_{uuid.uuid4().hex[:8]}"
        campaign_doc = {
            "id": campaign_id,
            "name": name,
            "niche": niche or "General",
            "target_audience": target_audience or "Broad Instagram Viewers",
            "status": "draft",
            "weights": DEFAULT_CRITERIA_WEIGHTS.copy()
        }
        db.campaigns.insert_one(campaign_doc)
        return jsonify(campaign_doc), 201

    @app.route('/api/campaigns/<campaign_id>', methods=['GET'])
    def get_campaign(campaign_id):
        campaign = db.campaigns.find_one({"id": campaign_id})
        if not campaign:
            return jsonify({"error": "Campaign not found"}), 404

        reels = db.reels.find({"campaign_id": campaign_id})
        return jsonify({
            **campaign,
            "reels": reels
        })

    @app.route('/api/campaigns/<campaign_id>', methods=['DELETE'])
    def delete_campaign(campaign_id):
        db.campaigns.delete_one({"id": campaign_id})
        # Delete associated reels
        reels = db.reels.find({"campaign_id": campaign_id})
        for r in reels:
            db.reels.delete_one({"id": r.get('id')})
        return jsonify({"success": True, "message": f"Campaign {campaign_id} deleted"})

    # ==================== 3. REEL UPLOADS & MANAGEMENT ====================
    @app.route('/api/campaigns/<campaign_id>/reels', methods=['POST'])
    def add_reel(campaign_id):
        campaign = db.campaigns.find_one({"id": campaign_id})
        if not campaign:
            return jsonify({"error": "Campaign not found"}), 404

        existing_reels = db.reels.find({"campaign_id": campaign_id})
        if len(existing_reels) >= 10:
            return jsonify({"error": "Campaign already has the maximum limit of 10 Reels"}), 400

        # Handle multipart form data or json
        topic = request.form.get('topic') or (request.json or {}).get('topic', 'Untitled Reel')
        hook = request.form.get('hook') or (request.json or {}).get('hook', '')
        caption = request.form.get('caption') or (request.json or {}).get('caption', '')
        hashtags = request.form.get('hashtags') or (request.json or {}).get('hashtags', '')
        description = request.form.get('description') or (request.json or {}).get('description', '')

        reel_id = f"reel_{uuid.uuid4().hex[:8]}"
        video_filename = None
        video_path = None

        # Check if video file is uploaded
        if 'video' in request.files:
            file = request.files['video']
            if file and file.filename:
                orig_filename = secure_filename(file.filename)
                ext = orig_filename.rsplit('.', 1)[-1].lower() if '.' in orig_filename else 'mp4'
                video_filename = f"{reel_id}.{ext}"
                video_path = os.path.join(Config.UPLOAD_FOLDER, video_filename)
                file.save(video_path)

        # If no video uploaded, assign or generate a synthetic video asset
        if not video_path or not os.path.exists(video_path):
            sample_paths = ensure_seed_videos()
            sample_key = list(sample_paths.keys())[len(existing_reels) % len(sample_paths)]
            video_path = sample_paths[sample_key]
            video_filename = os.path.basename(video_path)

        # Run actual video processing on the video file
        try:
            video_metrics = VideoProcessor.process_video(video_path, reel_id)
        except Exception as e:
            print(f"[App] Video processing warning for {reel_id}: {e}")
            video_metrics = {
                "duration": 12.0, "width": 1080, "height": 1920, "fps": 30.0,
                "is_vertical_9_16": True, "aspect_ratio": 0.562, "extracted_frames_count": 0,
                "extracted_frames": [], "avg_luminance": 120.0, "avg_contrast": 50.0,
                "lighting_grade": "Optimal", "cuts_per_minute": 14.0, "pacing_grade": "Fast / High Energy"
            }

        reel_doc = {
            "id": reel_id,
            "campaign_id": campaign_id,
            "topic": topic,
            "hook": hook,
            "caption": caption,
            "hashtags": hashtags,
            "description": description,
            "video_filename": video_filename,
            "video_path": video_path,
            "video_metrics": video_metrics,
            "status": "ready_for_analysis",
            "created_at": datetime.utcnow().isoformat()
        }

        db.reels.insert_one(reel_doc)
        return jsonify(reel_doc), 201

    # ==================== 4. ANALYSIS & SIMULATION PIPELINE ====================
    @app.route('/api/campaigns/<campaign_id>/analyze', methods=['POST'])
    def analyze_campaign_reels(campaign_id):
        campaign = db.campaigns.find_one({"id": campaign_id})
        if not campaign:
            return jsonify({"error": "Campaign not found"}), 404

        reels = db.reels.find({"campaign_id": campaign_id})
        if not reels:
            return jsonify({"error": "No Reels in campaign to analyze"}), 400

        campaign_context = {
            "niche": campaign.get('niche', 'General'),
            "target_audience": campaign.get('target_audience', 'General')
        }

        analyzed_count = 0
        for reel in reels:
            reel_id = reel.get('id')
            # 1. Real video processing if not already processed
            v_metrics = reel.get('video_metrics')
            if not v_metrics or not v_metrics.get('extracted_frames'):
                v_path = reel.get('video_path')
                if v_path and os.path.exists(v_path):
                    v_metrics = VideoProcessor.process_video(v_path, reel_id)
                else:
                    v_metrics = {"duration": 12.0, "is_vertical_9_16": True, "cuts_per_minute": 15.0}

            # 2. Gemini AI Content Analysis
            ai_result = gemini_analyzer.analyze_reel(reel, v_metrics, campaign_context)

            # 3. MiroFish Multi-Agent Audience Simulation
            sim_result = mirofish_simulator.simulate_reel_audience(reel, v_metrics, ai_result, campaign_context)

            # 4. 100-Point Scorecard
            weights = campaign.get('weights', DEFAULT_CRITERIA_WEIGHTS)
            scorecard_result = virality_scorecard.calculate_score(ai_result, sim_result, v_metrics, weights)

            # 5. Actionable Optimizations
            optimizations = ai_optimizer.generate_optimizations(reel, v_metrics, ai_result, campaign_context)

            db.reels.update_one(
                {"id": reel_id},
                {"$set": {
                    "video_metrics": v_metrics,
                    "ai_analysis": ai_result,
                    "simulation": sim_result,
                    "scorecard": scorecard_result,
                    "optimizations": optimizations,
                    "status": "completed",
                    "analyzed_at": datetime.utcnow().isoformat()
                }}
            )
            analyzed_count += 1

        db.campaigns.update_one({"id": campaign_id}, {"$set": {"status": "completed"}})
        updated_reels = db.reels.find({"campaign_id": campaign_id})

        return jsonify({
            "success": True,
            "campaign_id": campaign_id,
            "analyzed_count": analyzed_count,
            "reels": updated_reels
        })

    # ==================== 5. SCORECARD WEIGHT RECALCULATION ====================
    @app.route('/api/campaigns/<campaign_id>/scorecard/recalculate', methods=['POST'])
    def recalculate_scorecard(campaign_id):
        campaign = db.campaigns.find_one({"id": campaign_id})
        if not campaign:
            return jsonify({"error": "Campaign not found"}), 404

        data = request.get_json() or {}
        new_weights = data.get('weights', DEFAULT_CRITERIA_WEIGHTS)

        # Update campaign weights
        db.campaigns.update_one({"id": campaign_id}, {"$set": {"weights": new_weights}})

        reels = db.reels.find({"campaign_id": campaign_id})
        for reel in reels:
            if reel.get('ai_analysis') and reel.get('simulation'):
                sc = virality_scorecard.calculate_score(
                    reel['ai_analysis'],
                    reel['simulation'],
                    reel.get('video_metrics', {}),
                    new_weights
                )
                db.reels.update_one({"id": reel['id']}, {"$set": {"scorecard": sc}})

        updated_reels = db.reels.find({"campaign_id": campaign_id})
        return jsonify({
            "success": True,
            "weights": new_weights,
            "reels": updated_reels
        })

    # ==================== 6. RANKING & SIDE-BY-SIDE COMPARISON ====================
    @app.route('/api/campaigns/<campaign_id>/ranking', methods=['GET'])
    def get_campaign_ranking(campaign_id):
        campaign = db.campaigns.find_one({"id": campaign_id})
        if not campaign:
            return jsonify({"error": "Campaign not found"}), 404

        reels = db.reels.find({"campaign_id": campaign_id})
        # Sort by total virality score descending
        ranked = sorted(reels, key=lambda r: r.get('scorecard', {}).get('total_score', 0), reverse=True)

        top_3 = ranked[:3]
        rankings = []
        for rank_idx, r in enumerate(ranked, 1):
            sc = r.get('scorecard', {})
            sim = r.get('simulation', {})
            rankings.append({
                "rank": rank_idx,
                "id": r.get('id'),
                "topic": r.get('topic'),
                "hook": r.get('hook'),
                "score": sc.get('total_score', 0),
                "viral_tier": sc.get('viral_tier', 'Candidate'),
                "reach_prediction": sc.get('reach_prediction', 'N/A'),
                "retention_rate": sim.get('aggregate_retention_rate', 0),
                "share_rate": sim.get('simulated_shares_rate', 0),
                "strengths": [
                    r.get('ai_analysis', {}).get('primary_strength', 'Strong hook structure.'),
                    f"Predicted {sim.get('simulated_shares_rate', 0)}% DM share velocity among target personas."
                ],
                "weaknesses": [
                    r.get('ai_analysis', {}).get('primary_bottleneck', 'First 1.5s needs faster visual pattern interrupt.')
                ]
            })

        return jsonify({
            "campaign_id": campaign_id,
            "total_reels": len(ranked),
            "top_3": top_3,
            "rankings": rankings,
            "full_ranked_reels": ranked
        })

    # ==================== 7. REPORT DOWNLOAD ====================
    @app.route('/api/campaigns/<campaign_id>/report/markdown', methods=['GET'])
    def download_markdown_report(campaign_id):
        campaign = db.campaigns.find_one({"id": campaign_id})
        if not campaign:
            return jsonify({"error": "Campaign not found"}), 404

        reels = db.reels.find({"campaign_id": campaign_id})
        ranked = sorted(reels, key=lambda r: r.get('scorecard', {}).get('total_score', 0), reverse=True)
        md_content = report_generator.generate_markdown(campaign, ranked)

        return Response(
            md_content,
            mimetype="text/markdown",
            headers={"Content-Disposition": f"attachment;filename=ViralScope_{campaign_id}_Report.md"}
        )

    @app.route('/api/campaigns/<campaign_id>/report/pdf', methods=['GET'])
    def download_pdf_report(campaign_id):
        campaign = db.campaigns.find_one({"id": campaign_id})
        if not campaign:
            return jsonify({"error": "Campaign not found"}), 404

        reels = db.reels.find({"campaign_id": campaign_id})
        ranked = sorted(reels, key=lambda r: r.get('scorecard', {}).get('total_score', 0), reverse=True)
        pdf_bytes = report_generator.generate_pdf(campaign, ranked)

        return Response(
            pdf_bytes,
            mimetype="application/pdf",
            headers={"Content-Disposition": f"attachment;filename=ViralScope_{campaign_id}_Report.pdf"}
        )

    # ==================== 8. STATIC ASSETS & FRAMES ====================
    # Serve React frontend if built
    FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'viralscope-frontend', 'dist'))

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        if path.startswith('api/'):
            return jsonify({"error": "Endpoint not found"}), 404
        if os.path.exists(os.path.join(FRONTEND_DIST, path)) and path != '':
            return send_from_directory(FRONTEND_DIST, path)
        if os.path.exists(os.path.join(FRONTEND_DIST, 'index.html')):
            return send_from_directory(FRONTEND_DIST, 'index.html')
        return jsonify({
            "status": "online",
            "message": "ViralScope Backend API is running. Build frontend with 'npm run build' in viralscope-frontend or start Vite dev on port 3000."
        })

    @app.route('/api/frames/<reel_id>/<filename>')
    def serve_frame(reel_id, filename):
        folder = os.path.join(Config.FRAMES_FOLDER, reel_id)
        return send_from_directory(folder, filename)

    @app.route('/api/videos/<filename>')
    def serve_video(filename):
        for folder in [Config.UPLOAD_FOLDER, Config.SAMPLE_VIDEOS_FOLDER]:
            p = os.path.join(folder, filename)
            if os.path.exists(p):
                return send_file(p, mimetype="video/mp4")
        return jsonify({"error": "Video not found"}), 404

    @app.route('/api/personas')
    def get_personas():
        return jsonify(AUDIENCE_PERSONAS)

    # ==================== 9. SEED 10 REELS TEST CAMPAIGN ====================
    @app.route('/api/seed-campaign', methods=['POST'])
    def seed_test_campaign():
        """Creates the full 10-Reel test campaign from instagram_reels_test.md with pre-generated videos."""
        campaign_id = "camp_instagram_test_01"
        existing = db.campaigns.find_one({"id": campaign_id})

        campaign_doc = {
            "id": campaign_id,
            "name": "Instagram Reel Campaign – Test 01",
            "niche": "Student Life & Career Tech",
            "target_audience": "Indian Gen Z & Young Professionals",
            "status": "ready",
            "weights": DEFAULT_CRITERIA_WEIGHTS.copy(),
            "created_at": datetime.utcnow().isoformat()
        }

        if existing:
            db.campaigns.update_one({"id": campaign_id}, {"$set": campaign_doc})
        else:
            db.campaigns.insert_one(campaign_doc)

        # Ensure all 10 synthetic video files exist
        video_paths = ensure_seed_videos()

        campaign_context = {
            "niche": campaign_doc["niche"],
            "target_audience": campaign_doc["target_audience"]
        }

        seeded_reels = []
        for item in SEED_REELS_DATA:
            r_id = f"{campaign_id}_{item['id']}"
            v_path = video_paths.get(item['id'])

            # Real video processing
            v_metrics = VideoProcessor.process_video(v_path, r_id)

            reel_payload = {
                "id": r_id,
                "campaign_id": campaign_id,
                "topic": item["topic"],
                "hook": item["hook"],
                "caption": item["caption"],
                "hashtags": item["hashtags"],
                "description": item["description"],
                "video_filename": os.path.basename(v_path),
                "video_path": v_path,
                "video_metrics": v_metrics
            }

            # AI Analysis & MiroFish Simulation
            ai_result = gemini_analyzer.analyze_reel(reel_payload, v_metrics, campaign_context)
            sim_result = mirofish_simulator.simulate_reel_audience(reel_payload, v_metrics, ai_result, campaign_context)
            scorecard_result = virality_scorecard.calculate_score(ai_result, sim_result, v_metrics, DEFAULT_CRITERIA_WEIGHTS)
            optimizations = ai_optimizer.generate_optimizations(reel_payload, v_metrics, ai_result, campaign_context)

            full_reel_doc = {
                **reel_payload,
                "ai_analysis": ai_result,
                "simulation": sim_result,
                "scorecard": scorecard_result,
                "optimizations": optimizations,
                "status": "completed",
                "created_at": datetime.utcnow().isoformat()
            }

            existing_reel = db.reels.find_one({"id": r_id})
            if existing_reel:
                db.reels.update_one({"id": r_id}, {"$set": full_reel_doc})
            else:
                db.reels.insert_one(full_reel_doc)
            seeded_reels.append(full_reel_doc)

        db.campaigns.update_one({"id": campaign_id}, {"$set": {"status": "completed"}})

        return jsonify({
            "success": True,
            "campaign": campaign_doc,
            "reels_count": len(seeded_reels),
            "reels": seeded_reels
        })

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
