import re
from bs4 import BeautifulSoup

def extract_restaurants(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        soup = BeautifulSoup(file, "html.parser")
    
    restaurants = soup.find_all("a", class_="PoiBlock")
    seen_titles = set()  # 중복 확인을 위한 집합
    
    for idx, restaurant in enumerate(restaurants, 1):
        # 제목(식당명) 추출
        title_tag = restaurant.find("h2")
        if not title_tag:
            continue
            
        # 번호와 식당명 분리
        title_text = title_tag.text.strip()
        title_parts = title_text.split(". ", 1)
        if len(title_parts) > 1:
            number = title_parts[0]
            name_parts = title_parts[1].split(" ", 1)
            name = name_parts[0]
            location = name_parts[1] if len(name_parts) > 1 else ""
        else:
            name = title_text
            number = str(idx)
            location = ""
        
        seen_titles.add(name)
        
        # 카테고리 추출
        category_tags = restaurant.find_all("span", class_="Category")
        categories = []
        for tag in category_tags:
            if tag.find("span"):
                categories.append(tag.find("span").text.strip())
        
        # 평점 추출
        score_tag = restaurant.find("p", class_="Score")
        score = score_tag.find("span").text if score_tag and score_tag.find("span") else "N/A"
        
        # 사용자 평점 추출
        user_score_tag = restaurant.find("span", class_="score-text")
        user_score = user_score_tag.text if user_score_tag else "N/A"
        
        # 리뷰 수 추출
        review_count_tag = restaurant.find("span", class_="count-text")
        review_count = review_count_tag.text.strip("()") if review_count_tag else "0"
        
        print(f"{idx}. {name} {location}")

if __name__ == "__main__":
    import os
    # 스크립트 파일이 있는 디렉토리의 경로를 구함
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # aa.html 파일의 절대 경로를 구성
    file_path = os.path.join(script_dir, "aa.html")
    extract_restaurants(file_path)
