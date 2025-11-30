// API 호출 함수 (재시도 로직 포함)
async function callCloudRunAPI(message, retryCount = 0) {
    const maxRetries = 3;
    
    try {
        const headers = {
            'Content-Type': 'application/json'
        };

        const response = await fetch('https://gemini-chatbot-service-601565177103.asia-northeast3.run.app', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ prompt: message })
        });

        if (response.ok) {
            const data = await response.json();
            return data.response || data.error || 'No response';
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error(`API 호출 실패 (시도 ${retryCount + 1}/${maxRetries + 1}):`, error);
        
        // 재시도 로직 (지수 백오프)
        if (retryCount < maxRetries) {
            const delay = Math.pow(2, retryCount) * 1000; // 1초, 2초, 4초
            await new Promise(resolve => setTimeout(resolve, delay));
            return callCloudRunAPI(message, retryCount + 1);
        } else {
            throw error;
        }
    }
}

// 메시지 전송 함수
let isSending = false;
async function sendMessage() {
    if (isSending) return;
    
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (!message) return;

    isSending = true;
    
    // 사용자 메시지 표시
    addMessage(message, 'user');
    input.value = '';
    input.focus();

    try {
        // 로딩 메시지 표시
        const loadingDiv = addMessage('답변을 생성하고 있습니다...', 'bot');
        
        // API 호출
        const result = await callCloudRunAPI(message);
        
        // 로딩 메시지 제거
        loadingDiv.remove();
        addMessage(result, 'bot');
    } catch (error) {
        // 실패 사유 간단히 안내
        let errorMessage = 'API 호출에 실패했습니다.';
        
        if (error.message.includes('401')) {
            errorMessage = '인증이 필요합니다. 로그인을 확인해주세요.';
        } else if (error.message.includes('403')) {
            errorMessage = '접근 권한이 없습니다.';
        } else if (error.message.includes('404')) {
            errorMessage = 'API 서비스를 찾을 수 없습니다.';
        } else if (error.message.includes('500')) {
            errorMessage = '서버 오류가 발생했습니다.';
        } else if (error.message.includes('NetworkError') || error.message.includes('fetch')) {
            errorMessage = '네트워크 연결을 확인해주세요.';
        }
        
        addMessage(errorMessage, 'bot');
    } finally {
        isSending = false;
    }
}

// 채팅 메시지를 화면에 추가하는 함수
function addMessage(text, sender) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<div class="message-bubble">${text}</div>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return messageDiv;
}

// Enter 키 입력 처리
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        sendMessage();
        return false;
    }
}

// 페이지 로드 시 입력창에 포커스
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('messageInput').focus();
});