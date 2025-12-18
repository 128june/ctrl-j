from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
import time

def scrape_diningcode(query):
    """
    Scrapes Dining Code for the given query.
    Returns a list of dictionaries containing restaurant details.
    """
    results = []
    
    with sync_playwright() as p:
        # Launch browser (headless for performance)
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        url = f"https://www.diningcode.com/list.dc?query={query}"
        print(f"Navigating to {url}")
        page.goto(url)
        
        # Initial wait for content
        # The user mentioned "Scroll__List__Section"
        # We need to find the scrolling container. 
        # Inspecting the user provided HTML snippet, the structure suggests a list.
        # Often DiningCode lists are infinite scroll on the main window or a specific div.
        # User said "Scroll__List__Section". Let's assume it's a class or ID.
        # If we can't find it exactly, we try scrolling the window.
        
        # Wait for at least one item to load
        try:
            page.wait_for_selector('a.PoiBlock', timeout=10000)
        except:
            browser.close()
            return {"error": "Timeout waiting for initial results"}

        # Scroll loop to get ~100 items
        # DiningCode loads more as you scroll.
        target_count = 100
        scroll_attempts = 0
        max_attempts = 20
        
        while len(results) < target_count and scroll_attempts < max_attempts:
            # Parse current content
            content = page.content()
            soup = BeautifulSoup(content, 'html.parser')
            items = soup.select('a.PoiBlock')
            
            current_count = len(items)
            print(f"Found {current_count} items so far...")
            
            if current_count >= target_count:
                break
                
            # Scroll down
            # Try scrolling the window
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            
            # Try scrolling the specific section if it exists (based on user hint)
            # User said "Scroll__List__Section". 
            # We'll try to find an element with that class/id pattern just in case
            page.evaluate("""
                const el = document.querySelector('.Scroll__List__Section');
                if (el) el.scrollTop = el.scrollHeight;
            """)
            
            time.sleep(1.5) # Wait for network load
            scroll_attempts += 1
            
        # Final parse
        content = page.content()
        soup = BeautifulSoup(content, 'html.parser')
        items = soup.select('a.PoiBlock')
        
        print(f"Final parse: {len(items)} items found.")
        
        for index, item in enumerate(items[:100]):
            try:
                # Extracting data based on user snippet
                # <span class="number-prefix">1. </span>
                # <span class="Info__Title__Place">Name</span>
                
                rank_tag = item.select_one('.number-prefix')
                rank = rank_tag.get_text(strip=True).replace('.', '') if rank_tag else str(index + 1)
                
                name_tag = item.select_one('.Info__Title__Place')
                # Name might contain span for region, need to handle
                if name_tag:
                     # Get text but exclude children if needed, or just get all text
                     # Example: 카페 유자 <span>남해</span> -> We want "카페 유자"
                     # The span inside is region.
                     region_span = name_tag.select_one('span')
                     if region_span:
                         # Temporarily remove it to get name only? or just take full text
                         # Let's clean it.
                         region_text = region_span.get_text(strip=True)
                         full_text = name_tag.get_text(strip=True)
                         # Simple hack: remove region text from full text if it ends with it
                         name = full_text.replace(region_text, '').strip()
                     else:
                         name = name_tag.get_text(strip=True)
                else:
                    name = "Unknown"
                
                score_tag = item.select_one('.Score span') # 83
                score = score_tag.get_text(strip=True) if score_tag else None
                
                # Category
                cat_tag = item.select_one('.Category span')
                category = cat_tag.get_text(strip=True) if cat_tag else ""
                
                # Hash/Tags
                hashes = [h.get_text(strip=True) for h in item.select('.Hash span')]
                hash_str = ", ".join(hashes)
                
                results.append({
                    "rank": rank,
                    "name": name,
                    "score": score,
                    "category": category,
                    "hash": hash_str,
                    "link": "https://www.diningcode.com" + item['href']
                })
                
            except Exception as e:
                print(f"Error parsing item {index}: {e}")
                continue
                
        browser.close()
        
    return {"items": results}

if __name__ == "__main__":
    # Test locally
    print(scrape_diningcode("강남역 맛집"))
