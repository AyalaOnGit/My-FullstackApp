from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os
import numpy as np
import httpx
import certifi
import asyncio
import logging

load_dotenv()
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=['*'],
                   allow_methods=['*'], allow_headers=['*'])

# basic logging
logging.basicConfig(level=logging.INFO)

# Default to disabling TLS verification to maintain previous working behaviour
# Set DEV_INSECURE_TLS=0 to enforce certificate verification with certifi bundle
dev_insecure = os.getenv('DEV_INSECURE_TLS', '1') in ('1', 'true', 'True')
verify_target = False if dev_insecure else certifi.where()
http_client = httpx.Client(verify=verify_target)
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'), http_client=http_client)

SYSTEM_PROMPT = (
    'You are Maya, a personal gift consultant at "GIFT FOR U" (גיפט פור יו).\n'
    'Your passion is helping people create unforgettable moments and memories through personalized, premium, and handmade gifts.\n'
    '\n'
    'Your tone is exceptionally warm, gentle, empathetic, and creative. '
    'You sound like a sensitive, caring friend who listens deeply and wants to help the user express their love and appreciation through the perfect gift.\n'
    '\n'
    'RULES YOU MUST ALWAYS FOLLOW:\n'
    '1. LANGUAGE: Always respond in the exact language the user writes in. '
    'If they write in Hebrew — respond fully in Hebrew. If in English — respond fully in English. Never mix languages.\n'
    '2. PRODUCTS: You will receive a dynamic list of available products. '
    'Recommend ONLY products from that list — never invent names or prices. Use exact names and prices as given.\n'
    '3. NO MATCHES: If no product in the list fits the request, say so honestly and warmly, '
    'and ask a follow-up question to help find something better.\n'
    '4. EMOTIONAL VALUE: You do not just sell items — you help create personal stories. '
    'Weave in the handmade quality and personal touch naturally, without sounding salesy.\n'
    '5. SUGGESTIONS: Always offer exactly 2 options — no more, no less. Use the output format below.\n'
    '6. FOLLOW-UP: End every reply with ONE warm, curious question about the recipient\'s personality, '
    'the occasion, or the bond — to deepen the connection and refine the recommendation.\n'
    '7. BREVITY: No more than 2-3 sentences of intro before the product suggestions.\n'
    '9. NAVIGATION: If the user asks to go to a page or wants to see products/contact/about, '
    'first ask them warmly if they would like you to take them there. '
    'Only if they confirm (yes/sure/okay or similar) — add at the very end of your reply: [NAVIGATE:/route] '
    'Available routes: /products (store), /connect-us (contact us), /about (about us), /cart (shopping cart). '
    'IMPORTANT: Do not add any text after the tag.\n'
    '10. PRODUCT LINKS: After suggesting specific products, ask the user warmly if they want to see them. '
    'Only if they confirm — you MUST add at the very end of your reply EXACTLY this tag: [NAVIGATE:/products?q=PRODUCT_NAME] '
    'Replace PRODUCT_NAME with the exact Hebrew product name from the list. '
    'CRITICAL: NEVER navigate before the user confirms. NEVER add the tag in the same message as the question. '
    'Step 1 (suggest + ask): suggest products and ask "רוצה שאעביר אותך לראות את המוצר?" — NO tag here. '
    'Step 2 (after yes): short warm reply + [NAVIGATE:/products?q=ספל מאג קרמי] — tag goes here only, nothing after it.\n'
    '\n'
    'OUTPUT FORMAT FOR SUGGESTIONS (translate labels to the user\'s language):\n'
    '- אפשרות א\': [product name and price from the list] - [one sentence on how this gift will touch the recipient\'s heart]\n'
    '- אפשרות ב\': [product name and price from the list] - [one sentence on how this gift will touch the recipient\'s heart]\n'
    'הבחירה שלי: [which gift feels most meaningful and why — one sentence]\n'
    '\n'
    'FEW-SHOT EXAMPLE:\n'
    'User: אני מחפשת משהו קטן ומרגש לאמא שלי, סתם כדי להגיד לה תודה.\n'
    'Assistant: איזה קסם — להגיד תודה לאמא זו הדרך הכי יפה להעניק לה רגע של תשומת לב טהורה. '
    'כל פריט אצלנו נגע באהבה כדי להפוך למזכרת קטנה שתרגש אותה בכל יום מחדש.\n'
    '- אפשרות א\': ספל מאג קרמי עם כיתוב מוזהב (₪39) - כדי שבכל בוקר כשהיא שותה את הקפה, היא תיזכר באהבה שלך ותתחיל את היום עם חיוך.\n'
    '- אפשרות ב\': נר ריחני בכלי זכוכית עם הקדשה (₪49) - שימלא את הבית באור חם ובניחוח של רוגע, עם מילים אישיות ממך שיחממו לה את הלב.\n'
    'הבחירה שלי: הנר הריחני — כי הוא מביא איתו אווירה של שלווה ופינוק שמגיע לכל אמא בעולם.\n'
    'ספרי לי קצת על אמא — היא טיפוס שאוהב להתפנק בבית, או שהיא תמיד בתנועה?'
)

# ── DATA MODELS ──────────────────────────────────────────────
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[Message] = []
    products: list = []

class SearchRequest(BaseModel):
    query: str
    products: list
    top_k: int = 5

class CacheRequest(BaseModel):
    products: list

# ── EMBEDDING HELPERS ────────────────────────────────────────
def get_embedding(text: str) -> list[float]:
    response = client.embeddings.create(
        model='text-embedding-3-large',
        input=text
    )
    return response.data[0].embedding

def cosine_similarity(a: list, b: list) -> float:
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))

# ── CHAT ENDPOINT ────────────────────────────────────────────
@app.post('/chat')
async def chat(req: ChatRequest):
    if req.products:
        catalog_lines = []
        for p in req.products:
            stock = 'in stock' if p.get('inStock') else 'out of stock'
            pid = p.get('productId', '')
            line = f"- [ID:{pid}] {p['name']} (₪{p['price']}) [{stock}]: {p.get('description', '')}"
            catalog_lines.append(line)
        catalog = '\n'.join(catalog_lines)
        full_prompt = SYSTEM_PROMPT + f'\n\nAvailable products:\n{catalog}\n\nOnly recommend products from this list.'
    else:
        full_prompt = SYSTEM_PROMPT

    messages = [{'role': 'system', 'content': full_prompt}]
    for m in req.history:
        messages.append({'role': m.role, 'content': m.content})
    messages.append({'role': 'user', 'content': req.message})

    response = client.chat.completions.create(
        model='gpt-4o-mini',
        messages=messages,
        max_tokens=500,
        temperature=0.7
    )
    return {'reply': response.choices[0].message.content}

# ── EMBEDDINGS CACHE ─────────────────────────────────────────
product_embeddings_cache: dict = {}

@app.post('/cache-products')
async def cache_products(req: CacheRequest):
    global product_embeddings_cache
    product_embeddings_cache = {}
    for p in req.products:
        key = p.get('name', '')
        text = f"{p.get('name', '')} {p.get('description', '')}"
        product_embeddings_cache[key] = get_embedding(text)
    return {'cached': len(product_embeddings_cache)}

# ── EMOTION ENDPOINT ────────────────────────────────────────
class EmotionRequest(BaseModel):
    image: str  # base64

@app.post('/analyze-emotion')
async def analyze_emotion(req: EmotionRequest):
    try:
        logging.info('analyze-emotion: received request')
        from deepface import DeepFace
        import base64, cv2
        b64 = req.image
        logging.info('analyze-emotion: image field type=%s', type(b64))
        # strip data URI prefix if present
        if isinstance(b64, str) and b64.startswith('data:'):
            comma = b64.find(',')
            if comma != -1:
                b64 = b64[comma+1:]

        logging.info('analyze-emotion: base64 length=%d', len(b64) if b64 else 0)

        img_data = base64.b64decode(b64)
        np_arr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        # run DeepFace in a thread to avoid blocking the event loop
        # pass actions and enforce_detection as kwargs (not as a single dict)
        result = await asyncio.to_thread(
            DeepFace.analyze, img, actions=['emotion'], enforce_detection=False
        )

        # DeepFace may return a dict or a list; normalize
        if isinstance(result, list):
            res = result[0]
        else:
            res = result

        emotion = str(res.get('dominant_emotion', 'neutral'))
        raw_scores = res.get('emotion', {}) or {}
        # convert numpy types to native Python types for JSON serialization
        scores: dict = {}
        for k, v in raw_scores.items():
            try:
                scores[k] = float(v)
            except Exception:
                try:
                    scores[k] = float(np.array(v).item())
                except Exception:
                    scores[k] = v
        return {'emotion': emotion, 'scores': scores}
    except Exception as e:
        logging.exception('analyze-emotion: exception')
        raise HTTPException(status_code=500, detail=str(e))

# ── SEARCH ENDPOINT ──────────────────────────────────────────
@app.post('/search')
async def search(req: SearchRequest):
    if not req.products:
        return {'results': []}

    # אם השאילתה קצרה מדי או נראית כג'יבריש (אין רווחים) — לא נחפש
    words = req.query.strip().split()
    if len(words) == 1 and len(req.query.strip()) < 3:
        return {'results': []}

    query_embedding = get_embedding(req.query)

    scored = []
    for p in req.products:
        key = p.get('name', '')
        if key in product_embeddings_cache:
            product_embedding = product_embeddings_cache[key]
        else:
            text = f"{p.get('name', '')} {p.get('description', '')}"
            product_embedding = get_embedding(text)
        score = cosine_similarity(query_embedding, product_embedding)
        scored.append({
            'productId': p.get('productId'),
            'name': p.get('name', ''),
            'price': p.get('price'),
            'description': p.get('description', ''),
            'category': p.get('category', ''),
            'imageUrl': p.get('imageUrl', ''),
            'colors': p.get('colors', []),
            'toptext': p.get('toptext', ''),
            'inStock': p.get('inStock', True),
            'score': round(score, 3)
        })

    results = sorted(scored, key=lambda x: x['score'], reverse=True)
    relevant = [r for r in results if r['score'] >= 0.32]
    return {'results': relevant[:req.top_k]}
