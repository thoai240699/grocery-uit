from fastapi import Request, FastAPI, status
from routes.authRoute import router as AuthRouter
from routes.productRoute import router as ProductRouter
from routes.categoryRoute import router as CategoryRouter
from routes.chatRoute import router as ChatRouter
from routes.admin.productRoute import router as AdminProductRouter
from routes.admin.userRoute import router as AdminUserRouter
from routes.wishListRoute import router as WishListRouter
from routes.cartRoute import router as CartRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

app = FastAPI()



@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    error_messages = []
    for error in exc.errors():
        field = ".".join(map(str, error["loc"]))
        message = error["msg"]
        error_messages.append(f"Error in '{field}': {message}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        content={"detail": error_messages[0]},
    )

app.add_middleware(
    CORSMiddleware,
    allow_headers=["*"],
    allow_methods=["GET","POST","PUT","DELETE","PATCH"],
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=[True]
    )

app.include_router(AdminProductRouter)
app.include_router(AdminUserRouter)

app.include_router(AuthRouter)
app.include_router(ProductRouter)
app.include_router(CategoryRouter)
app.include_router(ChatRouter)
app.include_router(WishListRouter)
app.include_router(CartRouter)

@app.get('/',tags=['health'])
def healthRoute():
    return {
        'msg': 'Server is working correctly'
    }