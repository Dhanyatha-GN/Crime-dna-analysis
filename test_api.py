import requests

# Preprocess
resp = requests.post("http://127.0.0.1:5000/api/preprocess",
                     json={"file_path": "sample.csv"})
print("Preprocess:", resp.json())

# Crime DNA
resp = requests.get("http://127.0.0.1:5000/api/crime-dna/101",
                    params={"file_path": "sample.csv"})
print("Crime DNA:", resp.json())

# Behavior Profile
resp = requests.get("http://127.0.0.1:5000/api/behavior-profile/101")
print("Behavior Profile:", resp.json())
import requests

# Preprocess
resp = requests.post("http://127.0.0.1:5000/api/preprocess",
                     json={"file_path": "sample.csv"})
print("Preprocess:", resp.json())

# Crime DNA
resp = requests.get("http://127.0.0.1:5000/api/crime-dna/101",
                    params={"file_path": "sample.csv"})
print("Crime DNA:", resp.json())

# Behavior Profile
resp = requests.get("http://127.0.0.1:5000/api/behavior-profile/101")
print("Behavior Profile:", resp.json())
