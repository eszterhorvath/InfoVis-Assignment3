import requests
import json

def queryWL():
    base_url = "http://www.wienerlinien.at/ogd_realtime/trafficInfoList"
    delayTypes = ["stoerungkurz", "stoerunglang", "aufzugsinfo"]
    data = {}
    for d in delayTypes:
        resp = requests.get(base_url + "?name=%s" % d)
        response_list = resp.json()
        data[d] = response_list["data"]["trafficInfos"]
    return data