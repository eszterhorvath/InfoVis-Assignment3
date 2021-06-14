from flask import Flask, render_template
import json
import pandas
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from calculations import *
from apscheduler.schedulers.background import BackgroundScheduler

app = Flask(__name__)

# ensure that we can reload when we change the HTML / JS for debugging
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['TEMPLATES_AUTO_RELOAD'] = True

@app.route('/')
def data():

    return render_template("index.html")

sched = BackgroundScheduler(daemon=True)
sched.add_job(queryWL, "interval", minutes=1)
sched.start()


if __name__ == '__main__':
    app.run()
