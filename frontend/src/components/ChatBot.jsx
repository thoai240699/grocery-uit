import React, { useState } from 'react'
import './ChatBot.css'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: '👋 Xin chào! Tôi là trợ lý AI của cửa hàng tạp hóa. Tôi có thể giúp gì cho bạn?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const sendMessage = async () => {
    if (inputMessage.trim() === '' || isLoading) return

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage('')
    setIsLoading(true)

    try {
      // Gọi API backend
      const response = await fetch('http://localhost:8000/api/v1/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Tạo tin nhắn bot response
      const botResponse = {
        id: Date.now() + 1,
        text: data.answer || 'Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.',
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botResponse])

    } catch (error) {
      console.error('Error calling chat API:', error)
      
      // Fallback response nếu API lỗi
      const errorResponse = {
        id: Date.now() + 1,
        text: getFallbackResponse(currentInput),
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      }

      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const getFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('xin chào') || lowerMessage.includes('hello')) {
      return '👋 Xin chào! Tôi là trợ lý của cửa hàng tạp hóa. Hiện tại hệ thống đang bận, nhưng tôi vẫn có thể hỗ trợ bạn cơ bản về sản phẩm và dịch vụ!'
    } else if (lowerMessage.includes('sản phẩm') || lowerMessage.includes('product')) {
      return '🛒 Chúng tôi có đầy đủ rau củ quả tươi, thịt cá sạch, và đồ gia dụng. Bạn muốn tìm hiểu về loại sản phẩm nào?'
    } else if (lowerMessage.includes('giá') || lowerMessage.includes('price')) {
      return '💰 Giá cả của chúng tôi rất cạnh tranh với nhiều ưu đãi hấp dẫn. Bạn có thể xem chi tiết trên website!'
    } else if (lowerMessage.includes('đặt hàng') || lowerMessage.includes('order')) {
      return '📦 Để đặt hàng: Chọn sản phẩm → Thêm giỏ hàng → Thanh toán. Hoặc gọi hotline để được hỗ trợ!'
    } else if (lowerMessage.includes('giao hàng') || lowerMessage.includes('delivery')) {
      return '🚚 Chúng tôi giao hàng miễn phí trong bán kính 5km, thời gian 1-2 giờ!'
    } else if (lowerMessage.includes('cảm ơn') || lowerMessage.includes('thank')) {
      return '😊 Cảm ơn bạn! Rất vui được hỗ trợ. Còn gì khác tôi có thể giúp không?'
    } else {
      return '⚠️ Xin lỗi, hệ thống AI đang bận. Tôi có thể hỗ trợ bạn về: sản phẩm, giá cả, đặt hàng, giao hàng. Bạn cần hỗ trợ gì?'
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    const messagesContainer = document.querySelector('.chat-messages')
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])
  return (
    <div className="chatbot-container">
      {/* Chat Icon với loading indicator */}
      <div className={`chat-icon ${isLoading ? 'loading' : ''}`} onClick={toggleChat}>
        {isLoading ? (
          <div className="loading-spinner"></div>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.38 14.99 3.06 16.28L2 22L7.72 20.94C9.01 21.62 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 13H6V11H8V13ZM13 13H11V11H13V13ZM18 13H16V11H18V13Z" fill="white"/>
          </svg>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="header-info">
              <h3>🛍️ Trợ lý AI</h3>
              <div className="status">
                {isLoading ? (
                  <span className="typing">Đang trả lời...</span>
                ) : (
                  <span className="online">🟢 Trực tuyến</span>
                )}
              </div>
            </div>
            <button className="close-btn" onClick={toggleChat}>×</button>
          </div>
          
          <div className="chat-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'} ${message.isError ? 'error-message' : ''}`}
              >
                <div className="message-content">
                  {/* Render message với line breaks */}
                  {message.text.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < message.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString('vi-VN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                  {message.isError && ' ⚠️'}
                </div>
              </div>
            ))}
            
            {/* Loading indicator khi bot đang trả lời */}
            {isLoading && (
              <div className="message bot-message typing-message">
                <div className="message-content">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isLoading ? "Đang xử lý..." : "Nhập tin nhắn..."}
              className="message-input"
              disabled={isLoading}
            />
            <button 
              onClick={sendMessage} 
              className={`send-btn ${isLoading || !inputMessage.trim() ? 'disabled' : ''}`}
              disabled={isLoading || !inputMessage.trim()}
            >
              {isLoading ? (
                <div className="loading-spinner small"></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
                </svg>
              )}
            </button>
          </div>

          {/* Quick actions */}
          <div className="quick-actions">
            <button 
              className="quick-btn" 
              onClick={() => setInputMessage('Tôi muốn xem sản phẩm')}
              disabled={isLoading}
            >
              🛒 Xem sản phẩm
            </button>
            <button 
              className="quick-btn" 
              onClick={() => setInputMessage('Giá cả như thế nào?')}
              disabled={isLoading}
            >
              💰 Hỏi giá
            </button>
            <button 
              className="quick-btn" 
              onClick={() => setInputMessage('Làm sao để đặt hàng?')}
              disabled={isLoading}
            >
              📦 Đặt hàng
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatBot