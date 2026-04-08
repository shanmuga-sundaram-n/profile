#!/usr/bin/env python3
"""
Simple HTTP server for serving the Jekyll site locally.
This bypasses the need for Jekyll's live reload server which requires eventmachine.
"""

import http.server
import socketserver
import os
import sys

PORT = 4000
DIRECTORY = "_site"

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Add CORS headers for local development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def main():
    # Check if _site directory exists
    if not os.path.exists(DIRECTORY):
        print(f"Error: {DIRECTORY} directory not found!")
        print("Please run 'jekyll build' first to generate the site.")
        sys.exit(1)
    
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"✓ Server running at http://localhost:{PORT}/")
        print(f"✓ Serving files from: {os.path.abspath(DIRECTORY)}")
        print("✓ Press Ctrl+C to stop the server")
        print()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n✓ Server stopped")
            sys.exit(0)

if __name__ == "__main__":
    main()
