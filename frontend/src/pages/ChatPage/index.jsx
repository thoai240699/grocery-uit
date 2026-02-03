import React from 'react'
import ChatBot from '@/components/ChatBot'
import './ChatPage.css'

const ChatPage = () => {
  return (
    <div className="chat-page">
      <div className="chat-page-header">
        <h1>Chat Bot Test Page</h1>
        <p>Đây là trang để test component Chat Bot. Chat bot sẽ xuất hiện ở góc phải màn hình.</p>
      </div>
      
      <div className="chat-page-content">
        <div className="feature-card">
          <h2>🤖 Tính năng Chat Bot</h2>
          <ul>
            <li>Biểu tượng chat ở góc phải màn hình</li>
            <li>Click vào để mở/đóng chat window</li>
            <li>Giao diện thân thiện và responsive</li>
            <li>Tự động phản hồi các câu hỏi cơ bản</li>
            <li>Hiệu ứng animation mượt mà</li>
          </ul>
        </div>
        
        <div className="feature-card">
          <h2>💬 Hướng dẫn sử dụng</h2>
          <ol>
            <li>Nhìn vào góc phải màn hình, bạn sẽ thấy biểu tượng chat</li>
            <li>Click vào biểu tượng để mở chat window</li>
            <li>Nhập tin nhắn và nhấn Enter hoặc click nút gửi</li>
            <li>Bot sẽ tự động phản hồi dựa trên nội dung tin nhắn</li>
            <li>Click nút X để đóng chat window</li>
          </ol>
        </div>
        
        <div className="feature-card">
          <h2>🎯 Tích hợp vào các trang khác</h2>
          <p>Để tích hợp chat bot vào các trang khác, chỉ cần import và sử dụng component:</p>
          <pre className="code-block">
{`import ChatBot from '@/components/ChatBot'

// Thêm vào cuối component
<ChatBot />`}
          </pre>
        </div>
        
        <div className="test-section">
          <h2>🧪 Khu vực Test</h2>
          <p>Hãy thử các câu hỏi sau với chat bot:</p>
          <div className="test-questions">
            <span className="test-question">"Tôi muốn xem sản phẩm"</span>
            <span className="test-question">"Giá cả như thế nào?"</span>
            <span className="test-question">"Làm sao để đặt hàng?"</span>
            <span className="test-question">"Cảm ơn bạn"</span>
          </div>
        </div>
      </div>
      
      {/* Chat Bot Component */}
      <ChatBot />
    </div>
  )
}

export default ChatPage