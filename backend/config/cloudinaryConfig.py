import cloudinary 
from config.Env import ENVConfig

cloudinary.config(
      cloud_name = ENVConfig.CLOUDINARY_NAME, 
      api_key = ENVConfig.CLOUDINARY_API_KEY, 
      api_secret =ENVConfig.CLOUDINARY_API_SECRET
)

