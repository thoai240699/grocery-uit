from fastapi import FastAPI
from routes.authRoute import router as AuthRouter
from routes.productRoute import router as ProductRouter
from routes.categoryRoute import router as CategoryRouter

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_headers=["*"],
    allow_methods=["GET","POST","PUT","DELETE","PATCH"],
    allow_origins=["http://localhost:5173"],
    allow_credentials=[True]
    )


app.include_router(AuthRouter)

app.include_router(ProductRouter, prefix="/products", tags=["products"])
app.include_router(CategoryRouter, prefix="/categories", tags=["categories"])

@app.get('/',tags=['health'])
def healthRoute():
    return {
        'msg': 'Server is working correctly'
    }