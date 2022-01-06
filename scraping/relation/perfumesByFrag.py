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

# html 소스 가져오기
html0 = driver.page_source
soup0 = BeautifulSoup(html0, 'html.parser')

result = []

# 향 종류 필터 선택 후 클릭
filters = soup0.select('#content > div > section > div.srchResultArea > section.srchFilterArea > ul.srchFilterAccordion > li:nth-child(5) > div > ul > li')
for i in range(1, len(filters) + 1):
    fragranceName = driver.find_element(By.CSS_SELECTOR, f'#content > div > section > div.srchResultArea > section.srchFilterArea > ul.srchFilterAccordion > li:nth-child(5) > div > ul > li:nth-child({i}) > label > span > span').text
    driver.find_element(By.CSS_SELECTOR,f'#content > div > section > div.srchResultArea > section.srchFilterArea > ul.srchFilterAccordion > li:nth-child(5) > div > ul > li:nth-child({i}) > label > input').click()
    time.sleep(2) # 페이지 로딩 대기
    if i != 1:
        driver.find_element(By.CSS_SELECTOR,
                            f'#content > div > section > div.srchResultArea > section.srchFilterArea > ul.srchFilterAccordion > li:nth-child(5) > div > ul > li:nth-child({i - 1}) > label > input').click()
        time.sleep(2)

    html1 = driver.page_source
    soup1 = BeautifulSoup(html1, 'html.parser')

    pages = soup1.select('#c201_goods > div > a') # 페이지 개수에 맞게 생김.(다음쪽 버튼 덕분)

    forCnt = 0
    pageCnt = 1

    today = datetime.date.today()
    m = str(today.month) + '월'

    # pagesCnt = len(pages)
    # if driver.find_element(By.XPATH, '//*[@id="c201_goods"]/div/a[7]') is not None:

    aList = soup1.select('#c201_goods > div > a')
    aListCnt = int(len(aList))

    pagesCnt = 1

    if aListCnt != 0:
        pagesCnt = int(driver.find_element(By.CSS_SELECTOR, '#c201_goods > div > a:nth-last-child(2)').text)

    for a in range(pagesCnt):
        print(f'페이지 : {pageCnt}, 페이지 수 : {pagesCnt}, a : {a}')
        time.sleep(2)
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')
        uls = soup.select('#c201_goods > ul > li')
        for li in uls:
            a = li.select_one('div > a > div > div:nth-child(1) > div.srchProductUnitTitle > strong')
            if a is not None:
                brand = a.text

                # 제목 가져오기
                title = li.select_one('div > a > div > div:nth-child(1) > div.srchProductUnitTitle').text.split("\n")[2].upper()
                originPrice = li.select_one('div')['data-ga-data']
                originPrice = int(originPrice[originPrice.find('price')+9:originPrice.find('price')+18].split(",")[0])

                # 해당 단어가 없는 경우에만 진행
                if title.find('세트') == -1 and title.find('SET') == -1 and title.find('컬렉션') == -1:

                    # 제목 정제 => [블라블라] 제거하기
                    title = title.split(']')
                    if len(title) > 1:
                        title = title[1]
                    else:
                        title = title[0]
                    print(title)

                    # ML 부터 내용 날려버리기
                    if title.find('ML') != -1:
                        a = title.index('ML') + 2
                        title = title[0:a]
                        print(title)

                    # 제목 정제 => 배열에 해당 문자 포함디면 해당 배열 제거
                    title = title.split(' ')
                    titleNum = 0
                    for i in title:
                        if i.find('NEW') != -1 or i.find('택') != -1 or i.find('공식') != -1 or \
                                i.find('단독') != -1 or i.find('종') != -1 or i.find('증정') != -1 or \
                                i.find(f'{m}') != -1:
                            del title[titleNum]
                        titleNum = titleNum + 1
                    title = " ".join(title) # 배열 다시 합치기(요소 사이에 띄어쓰기)

                    # 이상한 문자 제거하기
                    title = re.sub("[)([\]\+]","",title)
                    print(title)

                    # 해당 단어가 있어야 상품에 포함
                    if title.find('ML') != -1:

                        # ML 용량 검출
                        if 'ML' in title:
                            a = title.index('ML')
                            ml = title[a-4:a]
                            print(ml)
                            ml = re.sub("[a-z|A-Z|ㄱ-ㅎ|ㅏ-ㅣ|가-힣]","",ml)
                            print(ml)
                            ml = ml.split(' ')
                            print(ml)
                            if len(ml[0]) < 2:
                                del ml[0]
                            print(ml)
                            for index, value in enumerate(ml):
                                if value == "":
                                    del ml[index]
                            if ml[0].find('*') != -1:
                                continue
                            # cnt = 0
                            # for i in ml:
                            #     if i == "":
                            #         del ml[cnt]
                            #         cnt = 0
                            #     else:
                            #         cnt += 1
                            print(ml)
                            ml = "".join(ml)

                        # ML 용량 부터 내용 날려버리기
                        if title.find(f'{ml}') != -1:
                            a = title.index(f'{ml}') - 1
                            title = title[0:a]

                        # 10ml 당 가격 구하기
                        standardPrice = originPrice / float(ml) * 10

                        # 첫 글자 검증
                        def checkFirst():
                            global title
                            while title[0] == " ":
                                title = title.split(" ")
                                del title[0]
                                title = "".join(title)
                            while title[0] == "-":
                                title = title.split("-")
                                del title[0]
                                title = "".join(title)
                            if title[0] == " " or title[0] == "-":
                                checkFirst()

                        checkFirst()

                        row = {
                            #'brand' : brand,
                            'perfumeName' : title,
                            'price' : int(standardPrice),
                            'likeCnt' : 0,
                            'reviewCnt' : 0,
                            'fragranceName' : fragranceName
                        }
                        result.append(row)
                        print(row)
            forCnt += 1
            print('스크래핑!')

        # 마지막에는 버튼 누르지 않게
        if pageCnt != pagesCnt:
            driver.find_element(By.CSS_SELECTOR, '#c201_goods > div > a.srchPaginationNext').click()
            print('다음 쪽 버튼')

        pageCnt += 1

print(result)
print(len(result))

df = pd.DataFrame(result)
df.to_csv('./perfumesByFrag.cvs', index=False)

driver.quit()

# https://for-it-study.tistory.com/38 ===> img 다운