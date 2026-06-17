import cv2, numpy as np
from deepface import DeepFace

img = cv2.imread('test.jpg')
print('גודל תמונה:', img.shape)

result = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
print('רגש:', result[0]['dominant_emotion'])
print('ציונים:')
for k, v in sorted(result[0]['emotion'].items(), key=lambda x: -x[1]):
    print(f'  {k}: {v:.1f}%')
