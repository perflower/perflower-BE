from selenium import webdriver
from bs4 import BeautifulSoup
from selenium.webdriver.common.by import By

import time, re, datetime
import pandas as pd

#webdriver 객체 생성
driver = webdriver.Chrome(executable_path="/Users/isthis/Downloads/chromedriver")
url = 'https://www.lotteon.com/search/search/search.ecn?render=search&platform=pc&q=%ED%96%A5%EC%88%98&mallId=2'

#url에 접근
driver.get(url)

# 브랜드 목록 펼치기
driver.find_element(By.XPATH, '//*[@id="content"]/div/section/div[1]/section[1]/ul[2]/li[2]/div/button').click()
time.sleep(2)

# html 소스 가져오기
html0 = driver.page_source
soup0 = BeautifulSoup(html0, 'html.parser')

lists = soup0.select('#content > div > section > div.srchResultArea > section.srchFilterArea > ul.srchFilterAccordion > li:nth-child(2) > div > ul > li')

result = []

for a in lists:
    text = a.select_one('label > span > span').text
    row = {
        'brandName' : text
    }
    result.append(row)

print(result)

df = pd.DataFrame(result)
df.to_csv('./brand.cvs', index=False)

driver.quit()