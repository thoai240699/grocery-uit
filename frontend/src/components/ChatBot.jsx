import React, { useState } from 'react'
import './ChatBot.css'

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Xin chào! Tôi có thể giúp gì cho bạn?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  const sendMessage = () => {
    if (inputMessage.trim() === '') return

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage('')

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    }, 1000)
  }

  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('sản phẩm') || lowerMessage.includes('product')) {
      return 'Chúng tôi có nhiều loại sản phẩm khác nhau. Bạn đang tìm kiếm sản phẩm gì cụ thể?'
    } else if (lowerMessage.includes('giá') || lowerMessage.includes('price')) {
      return 'Về giá cả, bạn có thể xem chi tiết trên trang sản phẩm. Chúng tôi luôn có những ưu đãi tốt nhất!'
    } else if (lowerMessage.includes('đặt hàng') || lowerMessage.includes('order')) {
      return 'Để đặt hàng, bạn có thể thêm sản phẩm vào giỏ hàng và tiến hành thanh toán nhé!'
    } else if (lowerMessage.includes('cảm ơn') || lowerMessage.includes('thank')) {
      return 'Rất vui được giúp đỡ bạn! Còn gì khác tôi có thể hỗ trợ không?'
    } else {
      return 'Cảm ơn bạn đã liên hệ! Tôi sẽ cố gắng hỗ trợ bạn tốt nhất. Bạn có thể hỏi về sản phẩm, giá cả hoặc cách đặt hàng.'
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className="chatbot-container">
      {/* Chat Icon */}
      <div className="chat-icon" onClick={toggleChat}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 13.54 2.38 14.99 3.06 16.28L2 22L7.72 20.94C9.01 21.62 10.46 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM8 13H6V11H8V13ZM13 13H11V11H13V13ZM18 13H16V11H18V13Z" fill="white"/>
        </svg>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Hỗ trợ khách hàng</h3>
            <button className="close-btn" onClick={toggleChat}>×</button>
          </div>
          
          <div className="chat-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  {message.text}
                </div>
                <div className="message-time">
                  {message.timestamp.toLocaleTimeString('vi-VN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="message-input"
            />
            <button onClick={sendMessage} className="send-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatBot