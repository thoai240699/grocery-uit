from services.authServices import registerService

def registerController(data):
    register_object = registerService(data)
    return register_object