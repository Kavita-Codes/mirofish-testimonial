"""
ViralScope AI – Instagram Reel Virality Analyzer & MiroFish Swarm Platform
Start Script
"""

import os
import sys

# Ensure current directory is in sys.path
root_dir = os.path.dirname(os.path.abspath(__file__))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

from viralscope_backend.app import create_app
from viralscope_backend.config import Config

if __name__ == '__main__':
    print("=" * 65)
    print("🚀 ViralScope AI – Instagram Reel Virality Analyzer")
    print("   Audience Simulation Powered by MiroFish Swarm Intelligence")
    print(f"   Server listening at: http://localhost:{Config.PORT}")
    print(f"   Frontend UI active at: http://localhost:{Config.PORT}")
    print("=" * 65)
    app = create_app()
    app.run(host=Config.HOST, port=Config.PORT, debug=Config.DEBUG)
