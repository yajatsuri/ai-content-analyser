from fastapi import FastAPI, File, UploadFile
from transformers import CLIPModel, CLIPProcessor
from PIL import Image
import torch
import joblib
import io

app = FastAPI(
    title="AI Content Analyser ML Service",
    version="1.0.0"
)

print("=" * 60)
print("Loading CLIP model...")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
clip_model.eval()
print("✓ CLIP loaded")

print("=" * 60)
print("Loading Logistic Regression model...")
classifier = joblib.load("models/logistic_regression.pkl")
print("✓ Logistic Regression loaded")

device = torch.device("cpu")
clip_model.to(device)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "ml-service",
        "model": "clip-logreg-v1"
    }


@app.post("/predict")
async def predict(image: UploadFile = File(...)):

    image_bytes = await image.read()

    pil_image = Image.open(
        io.BytesIO(image_bytes)
    ).convert("RGB")

    inputs = processor(
        images=pil_image,
        return_tensors="pt"
    )

    pixel_values = inputs["pixel_values"].to(device)

    with torch.no_grad():

        embedding = clip_model.get_image_features(
            pixel_values=pixel_values
        )
        print(type(embedding))
        print(embedding)

    # Transformers 5 compatibility
    if hasattr(embedding, "pooler_output"):
        embedding = embedding.pooler_output

    embedding = embedding.cpu().numpy()

    probabilities = classifier.predict_proba(embedding)[0]

    prediction_index = probabilities.argmax()

    confidence = float(probabilities[prediction_index])

    prediction = (
        "REAL"
        if prediction_index == 0
        else "AI"
    )

    return {
        "prediction": prediction,
        "confidence": confidence,
        "modelVersion": "clip-logreg-v1"
    }
