import requests
import json

def queryWL():
    base_url = "http://www.wienerlinien.at/ogd_realtime/trafficInfoList"
    resp = requests.get(base_url + "?name=stoerunglang")
    response_list = resp.json()
    print(response_list)