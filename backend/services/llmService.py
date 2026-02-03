import requests
import json
import logging

logger = logging.getLogger(__name__)

def call_qwen(prompt):
    url = "http://localhost:11434/api/generate"
    data = {
        "model": "qwen2.5:0.5b",
        "prompt": prompt,
        "stream": False
    }
    
    try:
        response = requests.post(url, json=data)
        response.raise_for_status()  # Raise exception for bad status codes
        
        # Log raw response for debugging
        logger.info(f"Raw response: {response.text[:200]}")
        
        # Try to parse JSON
        try:
            result = response.json()
            return result.get("response", "Xin lỗi, tôi không thể trả lời câu hỏi này.")
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode error: {e}")
            logger.error(f"Response text: {response.text}")
            
            # If JSON parsing fails, try to extract text response
            text = response.text.strip()
            if text:
                # Sometimes Ollama returns plain text or malformed JSON
                # Try to find the actual response content
                lines = text.split('\n')
                for line in lines:
                    if line.strip() and not line.startswith('{'):
                        return line.strip()
                return text
            else:
                return "Xin lỗi, tôi không nhận được phản hồi từ hệ thống."
                
    except requests.exceptions.ConnectionError:
        logger.error("Cannot connect to Ollama server")
        return "Xin lỗi, không thể kết nối đến server AI. Vui lòng thử lại sau."
    except requests.exceptions.RequestException as e:
        logger.error(f"Request error: {e}")
        return "Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn."
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return "Xin lỗi, có lỗi không mong muốn xảy ra."