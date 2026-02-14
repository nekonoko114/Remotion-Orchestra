
import os
from dotenv import load_dotenv
import vertexai
from vertexai.preview.vision_models import ImageGenerationModel

load_dotenv()
vertexai.init(project=os.getenv("GOOGLE_CLOUD_PROJECT_ID"), location="us-central1")

# ユーザー様の最強プロンプト
nova_def = "Nova character, stunning heterochromia (viewer's left eye purple, viewer's right eye silver), exquisite hair with unique split color (viewer's left side vibrant purple, viewer's right side shimmering silver), individual hair strands detailed and soft, iridescent highlights"
action = "walking alone in the city crowd, looking down with a melancholic expression"
style = ", (Masterpiece Anime Illustration:1.2), high quality anime style, masterpiece, cinematic lighting, iridescent highlights, vibrant lighting, highly detailed, shimmering light, soft textures, detailed background"

full_prompt = f"Anime girl {nova_def}, {action}{style}"

print("Generating single test image with the magic prompt...")
model = ImageGenerationModel.from_pretrained("imagen-3.0-generate-001")
images = model.generate_images(
    prompt=full_prompt,
    number_of_images=1,
    aspect_ratio="16:9",
    safety_filter_level="block_some",
    person_generation="allow_adult"
)

if images:
    path = "public/assets/generated/soregayasashisa/test_nova_magic.png"
    images[0].save(location=path, include_generation_parameters=False)
    print(f"Success! Saved to: {path}")
else:
    print("Failed to generate image.")
