// 메인 자바스크립트
document.addEventListener('DOMContentLoaded', function() {
    console.log('ctrl-j 웹페이지가 로드되었습니다.');
    
    // 햄버거 메뉴 토글
    const menuToggle = document.querySelector('.menu-toggle');
    const navContainer = document.querySelector('.nav-container');
    
    if (menuToggle && navContainer) {
        menuToggle.addEventListener('click', function() {
            navContainer.classList.toggle('active');
        });
    }
});