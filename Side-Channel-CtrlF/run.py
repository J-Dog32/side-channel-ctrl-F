from board import create_app
import gevent
from gevent.pywsgi import WSGIServer

app, app_measure = create_app()

if __name__ == '__main__':
    server1 = WSGIServer(("0.0.0.0", 5000), app)
    print("Running on http://localhost:5000/")
    server1.start()

    server2 = WSGIServer(("0.0.0.0", 5001), app_measure)
    server2.start()

    while True:
        gevent.sleep(60)