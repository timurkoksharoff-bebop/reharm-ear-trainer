"""Local game preview. Run from any directory; --background survives terminal closure."""
import argparse
import functools
import http.server
import pathlib
import subprocess
import sys
import tempfile

parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default=8127)
parser.add_argument('--background', action='store_true')
args = parser.parse_args()
root = pathlib.Path(__file__).resolve().parent.parent
if args.background:
    logfile = pathlib.Path(tempfile.gettempdir()) / 'ear-reharm-game-server.log'
    with logfile.open('a') as log:
        child = subprocess.Popen(
            [sys.executable, '-u', str(pathlib.Path(__file__).resolve()), '--port', str(args.port)],
            stdin=subprocess.DEVNULL, stdout=log, stderr=log, start_new_session=True,
        )
    print(f'Server PID: {child.pid}; log: {logfile}')
    print(f'http://localhost:{args.port}/game/')
else:
    class Handler(http.server.SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Cache-Control', 'no-store')
            super().end_headers()

    handler = functools.partial(Handler, directory=str(root))
    with http.server.ThreadingHTTPServer(('0.0.0.0', args.port), handler) as server:
        print(f'Ear Reharm Game: http://localhost:{args.port}/game/', flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
