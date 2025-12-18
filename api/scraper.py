import requests
from bs4 import BeautifulSoup

def scrape_diningcode(query):
    """
    Scrapes Dining Code for the given query using simple requests.
    This is much lighter than Playwright and works on Vercel Free Tier.
    """
    url = f"https://www.diningcode.com/list.dc?query={query}"
    print(f"Requesting {url}")
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Select items. The selector might need adjustment based on static HTML structure.
        # User provided snippet shows <a class="sc-eoVZPG kbaRYT PoiBlock" ...>
        # Let's try selecting by class "PoiBlock" which seems consistent.
        items = soup.select('a.PoiBlock')
        
        results = []
        
        # Note: Without JS scrolling, we might not get full 100 items if they are lazy loaded.
        # But we get the initial batch (usually 20-30). 
        # For Vercel optimization, this is a necessary trade-off unless we reverse-engineer the AJAX API.
        # However, many sites include a decent amount of initial data.
        
        for index, item in enumerate(items):
            try:
                # Rank
                rank_tag = item.select_one('.number-prefix')
                rank = rank_tag.get_text(strip=True).replace('.', '') if rank_tag else str(index + 1)
                
                # Name
                name_tag = item.select_one('.Info__Title__Place')
                if name_tag:
                     region_span = name_tag.select_one('span')
                     if region_span:
                         region_text = region_span.get_text(strip=True)
                         full_text = name_tag.get_text(strip=True)
                         name = full_text.replace(region_text, '').strip()
                     else:
                         name = name_tag.get_text(strip=True)
                else:
                    name = "Unknown"
                
                # Score
                score_tag = item.select_one('.Score span')
                score = score_tag.get_text(strip=True) if score_tag else None
                
                # Category
                cat_tag = item.select_one('.Category span')
                category = cat_tag.get_text(strip=True) if cat_tag else ""
                
                # Hash
                hashes = [h.get_text(strip=True) for h in item.select('.Hash span')]
                hash_str = ", ".join(hashes)
                
                results.append({
                    "rank": rank,
                    "name": name,
                    "score": score,
                    "category": category,
                    "hash": hash_str,
                    "link": "https://www.diningcode.com" + item.get('href', '')
                })
                
            except Exception as e:
                print(f"Error parsing item {index}: {e}")
                continue
        
        count = len(results)
        return {
            "items": results,
            "meta": {
                "count": count,
                "note": "Lite scraping mode (Vercel compatible). Showing initial results."
            }
        }

    except Exception as e:
        print(f"Scraping error: {e}")
        return {"error": str(e), "items": []}

if __name__ == "__main__":
    print(scrape_diningcode("강남역 맛집"))
