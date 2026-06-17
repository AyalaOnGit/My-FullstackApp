import base64, requests

with open("test.jpg", "rb") as f:
    b64 = base64.b64encode(f.read()).decode()

res = requests.post("http://localhost:8000/analyze-emotion", json={"image": b64})
data = res.json()
print("רגש:", data["emotion"])
print("ציונים:")
for k, v in sorted(data["scores"].items(), key=lambda x: -x[1]):
    print(f"  {k}: {v:.1f}%")
